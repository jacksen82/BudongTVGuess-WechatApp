//  mission/game.js

const ajax = require('../ajax.js');

/*
  说明： 获取题目提示
*/
const tip = function (subjectId, callback) {

  ajax.post('/mission/game/tip.ashx', {
    subjectId: subjectId
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
  说明： 跳过这一题
*/
const skip = function (subjectId, secondCount, callback) {

  ajax.post('/mission/game/skip.ashx', {
    subjectId: subjectId,
    secondCount: secondCount
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
  说明： 重听题目
*/
const replay = function (subjectId, callback) {

  ajax.post('/mission/game/replay.ashx', {
    subjectId: subjectId
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
  说明： 题目答题
*/
const answer = function (subjectId, secondCount, callback) {

  ajax.post('/mission/game/answer.ashx', {
    subjectId: subjectId,
    secondCount: secondCount
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
  说明：开始闯关
*/
const start = function (missionId, callback) {

  ajax.post('/mission/game/start.ashx', {
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

/*
  说明：获取关卡排行榜
*/
const rank = function (missionId, callback) {

  ajax.post('/mission/game/rank.ashx', {
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
  tip: tip,
  skip: skip,
  replay: replay,
  answer: answer,
  start: start,
  rank: rank,
}
