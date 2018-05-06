//  client.js

const consts = require('../utils/consts.js');
const util = require('../utils/util.js');
const store = require('../utils/store.js');
const ajax = require('./ajax.js');

/*
  说明：获取用户 Token
*/
const token = function(callback){

  ajax.post('/client/token.ashx', { }, callback);
}

/*
  说明：用户登录
*/
const login = function(code, callback){

  ajax.post('/client/login.ashx', { 
    code: code || ''
  }, function (data) {

    if (data.code == 0) {
      callback(data.data)
    } else {
      util.pageToast(data.message || '发生未知错误');
    }
  })
}

/*
  说明：用户关系
*/
const relate = function (subjectId, missionId, fromClientId, encryptedData, iv, callback){
  
  ajax.post('/client/relate.ashx', {
    subjectId: subjectId || 0,
    missionId: missionId || 0,
    fromClientId: fromClientId || 0,
    encryptedData: encryptedData || '',
    iv: iv || ''
  }, function (data) {

    if (data.code == 0) {
      callback(data.data)
    } else {
      util.pageToast(data.message || '发生未知错误');
    }
  })
}

/*
  说明：分享
*/
const share = function (missionId, encryptedData, iv, callback){

  ajax.post('/client/share.ashx', {
    missionId: missionId || 0,
    encryptedData: encryptedData || '',
    iv: iv || ''
  }, function (data) {

    if (data.code == 0) {
      callback(data.data)
    } else {
      util.pageToast(data.message || '发生未知错误');
    }
  })
}

module.exports = {
  token: token,
  login: login,
  relate: relate,
  share: share
}
