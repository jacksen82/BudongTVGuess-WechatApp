//  mission.js

const ajax = require('./ajax.js');
const game = require('./mission/game.js');

/*
  说明：获取关卡列表
*/
const list = function (callback) {

  ajax.post('/mission/list.ashx', {
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
  说明：获取推荐关卡列表
*/
const recommend = function (callback) {

  ajax.post('/mission/recommend.ashx', {
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
  说明：获取关卡详情
*/
const detail = function(missionId, callback){

  ajax.post('/mission/detail.ashx', {
    missionId: missionId
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
  list: list,
  recommend: recommend,
  detail: detail,
  game: game
}
