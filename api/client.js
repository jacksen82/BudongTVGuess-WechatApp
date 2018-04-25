//  client.js

const ajax = require('./ajax.js');

/*
  说明：获取用户 Token
*/
const token = function(scene, callback, fail){

  ajax.post('/client/token.ashx', {
    scene: scene 
  }, function (data) {

      if (data.code == 0) {
        callback(data.data)
      } else {
        fail(data)
      }
    }, fail)
}

/*
  说明：用户登录
*/
const login = function(code, callback){

  ajax.post('/client/login.ashx', { 
    code: code 
  }, function (data) {

    if (data.code == 0) {
      callback(data.data)
    } else {
      wx.showToast({
        title: data.message,
      })
    }
  }, null)
}

/*
  说明：获取用户资料
*/
const detail = function (callback) {

  ajax.post('/client/detail.ashx', {

  }, function (data) {

    if (data.code == 0) {
      callback(data.data)
    } else {
      wx.showToast({
        title: data.message,
      })
    }
  }, null)
}

/*
  说明：用户关系
*/
const relate = function (missionId, fromClientId, encryptedData, iv, callback){
  
  ajax.post('/client/relate.ashx', {
    missionId: missionId || 0,
    fromClientId: fromClientId || 0,
    encryptedData: encryptedData || '',
    iv: iv || ''
  }, function (data) {

    console.log('api.relate')
    console.log(data)
    if (data.code == 0) {
      callback(data.data)
    } else {
      wx.showToast({
        title: data.message,
      })
    }
  })
}

/*
  说明：分享
*/
const share = function (encryptedData, iv, callback){

  ajax.post('/client/share.ashx', {
    encryptedData: encryptedData,
    iv: iv
  }, function (data) {

    if (data.code == 0) {
      callback(data.data)
    } else {
      wx.showToast({
        title: data.message,
      })
    }
  }, null)
}

module.exports = {
  token: token,
  login: login,
  detail: detail,
  relate: relate,
  share: share
}
