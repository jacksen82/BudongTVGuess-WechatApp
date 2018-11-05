// services/client.js

const constants = require('../data/constants.js')
const store = require('../data/store.js')
const ajax = require('../utils/ajax.js')
const game = require('game.js')
const mine = require('mine.js')

const client = {

  /*
    说明：客户端授权
  */
  authorize: function (callback) {

    //  接口请求成功回调
    var _success = function(data){

      //  初始化变量
      store.client = data || {}
      store.clientId = data.clientId
      store.session3rd = data.session3rd

      //  写入三方标识
      wx.setStorageSync('session3rd', store.session3rd)

      //  执行回调
      callback(data);
    }

    //  客户端登录方法
    var _login = function(){

      wx.login({
        success: function (res) {

          ajax.postEx('/client/login.ashx', { code: res.code }, _success);
        },
        fail: function (res) {

          wx.showToast({
            icon: 'none',
            title: '登录失败'
          })
        }
      });
    }

    //  请求 token 接口
    var _token = function(){

      ajax.postEx('/client/token.ashx', {}, _success, _login);
    }
    
    //  当有三方标识时
    if (store.session3rd) {
      wx.checkSession({
        success: _token,
        fail: _login
      });
    } else {
      _login();
    }
  },

  /*
    说明：获取分享信息
  */
  shareInfo: function(){

    //  建立关联关系
    var _relate = function (res){

      ajax.postEx('/client/relation.ashx', {
        fromClientId: store.fromClientId || 0,
        encryptedData: (res || {}).encryptedData || '',
        iv: (res || {}).iv || ''
      }, function (data) {

        //  初始化来源客户端信息
        store.fromClient = data.fromClient || {};
        store.fromOpenGId = data.openGId;
      });
    }
    
    //  来源客户端不为空
    if (store.fromClientId) {
      
      if (store.shareTicket) {

        //  如果有群标识，获取群标识
        wx.getShareInfo({
          shareTicket: store.shareTicket,
          success: _relate,
          fail: _relate
        });
      } else {

        //  没有群标识，并且不等于当前客户端
        if (store.fromClientId != store.clientId){
          _relate();
        }
      }
    } else {
      store.fromClient = {};
    }
  },

  /*
    说明：分享回调
  */
  shareAppMessage: function (res, data, callback) {

    data = data || {};

    var title = '那些年全家人坐在一起看的经典电视，你还记得吗？';
    var imageUrl = 'https://wechat.duomijuan.com/guess/statics/share.jpg';
    var path = '/pages/index/index?scene=cid-' + (store.clientId || 0);
    var action = '';

    if (data.title && data.imageUrl){
      title = '你知道“' + data.title + '”吗';
      imageUrl = data.imageUrl;
      path = '/pages/index/index?scene=cid-' + (store.clientId || 0) + ',sm-1';
    }

    if (res.from == 'button' && res.target && res.target.dataset && res.target.dataset.action == 'saveme'){
      title = '求助！我正在玩儿【猜电视】游戏，请帮我激活一张复活卡';
      imageUrl = 'https://wechat.duomijuan.com/guess/statics/saveme.jpg';
      path = '/pages/index/index?scene=cid-' + (store.clientId || 0) + ',sm-1';
      action = 'saveme';
    }
    
    return {
      title: title,
      imageUrl: imageUrl,
      path: path,
      success: function (_res) {
        
        //  请求分享成功接口
        ajax.postEx('/client/share.ashx', {
          shareFrom: res.from,
          shareAction: action
        }, function (data) {

          callback(data);
        });
      },
      fail: function (res) {

        wx.showToast({
          icon: 'none',
          title: '邀请失败'
        })
      }
    }
  },

  /*
    说明：游戏接口
  */
  game: game,

  /*
    说明：个人中心接口
  */
  mine: mine
};

module.exports = client;