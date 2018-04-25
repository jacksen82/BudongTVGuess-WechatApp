//  client.js

const ajax = require('./ajax.js');
const mission = require('./mine/mission.js');

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
  说明：更新用户资料
*/
const updateProfile = function (nick, gender, avatarUrl, callback) {

  ajax.post('/client/updateProfile.ashx', {
    nick: nick,
    gender: gender,
    avatarUrl: avatarUrl
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
  说明：更新出生年份
*/
const updateBirthyear = function (birthyear, callback) {

  ajax.post('/client/updateBirthyear.ashx', {
    birthyear: birthyear
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
  说明：获取金币明细
*/
const coins = function (pageId, callback) {

  ajax.post('/client/coin/list.ashx', {
    pageId: pageId
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
  detail: detail,
  updateProfile: updateProfile,
  updateBirthyear: updateBirthyear,
  mission: mission,
  coins: coins
}
