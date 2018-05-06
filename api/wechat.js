//  wechat.js

const consts = require('../utils/consts.js');
const util = require('../utils/util.js');
const store = require('../utils/store.js');
const ajax = require('./ajax.js')
const client = require('./client.js');
const mine = require('./mine.js');

//  请求登录授权
var __login = function (missionId, fromClientId, shareTicket, callback) {

  wx.login({
    success: function (res) {

      client.login(res.code, callback);

      //  记录启动来源
      trace(missionId, fromClientId, shareTicket);
    },
    fail: function () {

      util.pageToast('登录失败');
    }
  })
}

/*
  说明：获取群信息
*/
const __getShareInfo = function (shareTicket, callback)    {

  if (shareTicket) {
    wx.getShareInfo({
      shareTicket: shareTicket,
      success: callback,
      fail: callback
    })
  } else {
    callback && callback({ encryptedData: '', iv: ''});
  }
}

/*
  说明：获取指定权限
*/
const getSettings = function (item, callback) {

  wx.getSetting({
    success: function (res) {

      if (res.authSetting['scope.' + item]) {
        callback && callback(true);
      } else {
        wx.openSetting({
          success: function (res) {

            if (res.authSetting['scope.' + item] == true) {
              callback && callback(true);
            }
          },
          fail: function () {
            callback && callback(false);
          }
        })
      }
    },
    fail: function (res) {

      util.pageToast(res || '发生未知错误');
    }
  })
}

/*
  说明：获取分享结构
*/
const getShareMessage = function(title, missionId, subjectId){

  var shareTicket = {};

  return {
    title: (title ? title : '你能猜出这段声音出自哪里吗？' ),
    path: '/pages/index/index?cid=' + (store.client.id || 0) + (missionId ? '&mid=' + missionId : '') + (subjectId ? '&sid=' + subjectId : ''),
    imageUrl: consts.HTTP_CDN + '/wechat_app/static/images/share_cover.png',
    success: function(res){

      if (res.shareTickets && res.shareTickets.length){
        shareTicket = res.shareTickets[0]
      }
      
      if (consts.APP_3RD_SESSION) {
        __getShareInfo(shareTicket, function(__res){

          client.share(missionId, __res.encryptedData, __res.iv, function (data) {

            (data.coins > 0) && util.pageToast('+' + data.coins + ' 金币');
            (data.coins < 0) && util.pageToast('-' + data.coins + ' 金币');
            store.client.balance = (store.client.balance || 0) + (data.coins || 0);
          })
        })
      }
    },
    fail: function (res) {

      util.pageToast('放弃分享');
    }
  }
}

/*
  说明：启动场景
*/
const trace = function (subjectId, missionId, fromClientId, shareTicket, callback){

  if (consts.APP_LAUNCHED) {
    __getShareInfo(shareTicket, function(res){

      if (missionId || fromClientId || (res.encryptedData && res.iv)) {
        client.relate(subjectId, missionId, fromClientId, res.encryptedData, res.iv, function(data){ });
      }
      callback && callback();
    });
  } else {
    setTimeout(function () {
      
      trace(subjectId, missionId, fromClientId, shareTicket, callback);
    }, 100);
  }
};

/*
  说明：启动登录
*/
const authorize = function (missionId, fromClientId, shareTicket, callback) {

  let beginTime = new Date().getTime();

  //  如果有本地会话标识，则检查会话标识有效性
  if (consts.APP_3RD_SESSION) {
    wx.checkSession({
      success: function (res) {
        
        client.token(function(data){

          if (data.code == 0 && data.data.session3rd){
            callback && callback(data.data);
          } else {
            __login(missionId, fromClientId, shareTicket, callback);
          }
        });
      },
      fail: function (res) {

        __login(missionId, fromClientId, shareTicket, callback);
      }
    });
  } else {
    __login(missionId, fromClientId, shareTicket, callback);
  }
}

module.exports = {
  getSettings: getSettings,
  getShareMessage: getShareMessage,
  trace: trace,
  authorize: authorize
}
