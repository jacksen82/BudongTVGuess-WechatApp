//  wechat.js

const store = require('../utils/store.js');
const ajax = require('./ajax.js')
const client = require('./client.js');
const mine = require('./mine.js');

/*
  说明：获取用户资料
*/
const getUserInfo = function (withCredentials) {

  //  打开用户资料授权方法
  var resetting = function (resolve, reject) {
    
    wx.openSetting({
      success: function(res){

        if (res.authSetting['scope.userInfo'] == true){

          getUserInfo(resolve, reject)
        }
      },
      fail: function(){

        wx.showToast({
          title: '授权失败'
        })
      }
    })
  }
  
  //  获取用户资料
  var getUserInfo = function (resolve, reject){
    
    if (store.client.actived == 1) {
      client.detail(resolve)
    } else {
      wx.getUserInfo({
        withCredentials: withCredentials,
        success: function (res) {

          mine.updateProfile(res.userInfo.nickName, res.userInfo.gender, res.userInfo.avatarUrl, resolve)
        },
        fail: function (res) {

          resetting(resolve, reject)
        }
      })
    }
  }

  //  获取用户资料
  return new Promise(function(resolve, reject){

    getUserInfo(resolve, reject)
  })
}

/*
  说明：获取群信息
*/
const getShareInfo = function (shareTicket) {

  return new Promise(function (resolve, reject) {

    if (shareTicket) {
      wx.getShareInfo({
        shareTicket: shareTicket,
        success: resolve,
        fail: resolve
      })
    } else {
      resolve({})
    }
  });
}

/*
  说明：获取分享结构
*/
const getShareMessage = function(title, missionId){

  var shareTicket;

  return {
    title: (title ? title : '你能猜出这段声音出自哪里吗？' ),
    path: (missionId > 0 ? 
      '/pages/index/index?mid=' + missionId + '&cid=' + store.client.id 
      : 
      '/pages/index/index?cid=' + store.client.id),
    imageUrl: 'https://cdn.shenxu.name/wechat_app/static/images/share_cover.png',
    success: function(res){

      shareTicket = {}

      if (res.shareTickets && res.shareTickets.length){
        shareTicket = res.shareTickets[0]
      }
      
      if (store.session3rd) {
        getShareInfo(shareTicket)
          .then(function(res){
            
            client.share(missionId || 0, res.encryptedData || '', res.iv || '', function(data){

              if (data.coins > 0){
                wx.showToast({
                  title: '+' + data.coins + ' 金币', 
                })
              } 
              if (data.coins < 0) {
                wx.showToast({
                  title: '-' + data.coins + ' 金币',
                })
              }
            })
          });
      }
    },
    fail: function (res) {

      wx.showToast({
        title: '放弃分享'
      })
    }
  }
}

/*
  说明：检查登录态有效性
*/
const checkSession = function (scene) {

  //  获取本地缓存三方标识
  store.session3rd = wx.getStorageSync('session3rd') || ''

  //  登录方法
  var relogin = function (resolve, reject) {

    wx.login({
      success: function (res) {

        client.login(res.code, resolve)
      },
      fail: function () {
        
        reject(ajax.result(ajax.CODE_TYPE.LOGIN_FAIL, '登录失败'))
      }
    })
  }

  //  检查会话登陆态
  return new Promise(function (resolve, reject) {
    
    if (store.session3rd) {
      wx.checkSession({
        success: function (res) {
          
          client.token(scene, resolve, function(data){
            
            relogin(resolve, reject)
          })
        },
        fail: function () {
          
          relogin(resolve, reject)
        }
      })
    } else {
      
      relogin(resolve, reject)
    }
  })
}

/*
  说明：检查访问来源
*/
const checkSource = function (missionId, fromClientId, shareTicket){
  
  return new Promise(function(resolve, reject){

      getShareInfo(shareTicket)
        .then(function (res) {
          
          if (missionId || fromClientId || (res.encryptedData && res.iv)) {
            client.relate(missionId, fromClientId, res.encryptedData, res.iv, resolve);
          }
        });
  })
}

module.exports = {
  getUserInfo: getUserInfo,
  getShareMessage: getShareMessage,
  getShareInfo: getShareInfo,
  checkSession: checkSession,
  checkSource: checkSource
}
