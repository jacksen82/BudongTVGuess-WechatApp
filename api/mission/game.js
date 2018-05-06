//  mission/game.js

const consts = require('../../utils/consts.js');
const util = require('../../utils/util.js');
const store = require('../../utils/store.js');
const ajax = require('../ajax.js');

/*
  说明： 获取题目提示
*/
const tip = function (subjectId, callback) {

  ajax.post('/mission/game/tip.ashx', {
    subjectId: subjectId || 0
  }, function (data) {

    if (data.code == 0) {
      callback && callback(data.data)
    } else {
      util.pageToast(data.message || '发生未知错误');
    }
  })
}

/*
  说明： 跳过这一题
*/
const skip = function (subjectId, secondCount, callback) {

  ajax.post('/mission/game/skip.ashx', {
    subjectId: subjectId || 0,
    secondCount: secondCount || 0
  }, function (data) {

    if (data.code == 0) {
      callback && callback(data.data)
    } else {
      util.pageToast(data.message || '发生未知错误');
    }
  })
}

/*
  说明： 重听题目
*/
const replay = function (subjectId, callback) {

  ajax.post('/mission/game/replay.ashx', {
    subjectId: subjectId || 0
  }, function (data) {

    if (data.code == 0) {
      callback && callback(data.data)
    } else {
      util.pageToast(data.message || '发生未知错误');
    }
  })
}

/*
  说明： 求助好友
*/
const help = function (missionId, subjectId, fromClientId, callback) {

  ajax.post('/mission/game/help.ashx', {
    missionId: missionId || 0,
    subjectId: subjectId || 0,
    fromClientId: fromClientId || 0
  }, function (data) {

    if (data.code == 0) {
      callback && callback(data.data)
    } else {
      util.pageToast(data.message || '发生未知错误');
    }
  })
};

/*
  说明： 题目答题
*/
const answer = function (subjectId, secondCount, callback) {

  ajax.post('/mission/game/answer.ashx', {
    subjectId: subjectId || 0,
    secondCount: secondCount || 0
  }, function (data) {

    if (data.code == 0) {
      callback && callback(data.data)
    } else {
      util.pageToast(data.message || '发生未知错误');
    }
  })
}

/*
  说明：闯关成功
*/
const complete = function (missionId, callback) {

  ajax.post('/mission/game/complete.ashx', {
    missionId: missionId || 0
  }, function (data) {

    if (data.code == 0) {
      callback && callback(data.data)
    } else {
      util.pageToast(data.message || '发生未知错误');
    }
  })
}

/*
  说明：开始闯关
*/
const start = function (missionId, callback) {

  ajax.post('/mission/game/start.ashx', {
    missionId: missionId || 0
  }, function (data) {

    if (data.code == 0) {
      callback && callback(data.data)
    } else {
      util.pageToast(data.message || '发生未知错误');
    }
  })
}

/*
  说明：获取关卡排行榜
*/
const rank = function (missionId, callback) {

  ajax.post('/mission/game/rank.ashx', {
    missionId: missionId || 0
  }, function (data) {

    if (data.code == 0) {
      callback && callback(data.data)
    } else {
      util.pageToast(data.message || '发生未知错误');
    }
  })
}

module.exports = {
  tip: tip,
  skip: skip,
  replay: replay,
  help: help,
  answer: answer,
  complete: complete,
  start: start,
  rank: rank,
}
