//  client.js

const consts = require('../utils/consts.js');
const util = require('../utils/util.js');
const store = require('../utils/store.js');
const ajax = require('./ajax.js');
const mission = require('./mine/mission.js');

/*
  说明：获取用户资料
*/
const detail = function (callback) {

  //  初始化客户端信息
  store.client = store.client || {};

  //  如果客户端已激活，并且上次请求在 60 秒内，则从本地获取
  if (store.client.actived == 1 && (new Date().getTime() - store.client.lastTime < consts.AJAX_TIMESTAMP_NORMAL)) {
    callback && callback();
  } else {
    ajax.post('/client/detail.ashx', { }, function (data) {

      if (data.code == 0) {
        store.client = data.data || {};
        store.client.lastTime = new Date().getTime();

        callback && callback();
      } else {
        util.pageToast(data.message || '发生未知错误');
      }
    });
  }
}

/*
  说明：更新用户资料
*/
const update = function (nick, gender, avatarUrl, birthyear, callback) {

  ajax.post('/client/update.ashx', {
    nick: nick || '',
    gender: gender || 0,
    avatarUrl: avatarUrl || '',
    birthyear: birthyear || 0
  }, function (data) {

    if (data.code == 0) {
      callback && callback(data.data)
    } else {
      util.pageToast(data.message || '发生未知错误');
    }
  })
}

/*
  说明：每日签到
*/
const signIn = function (callback) {

  ajax.post('/client/signin.ashx', { }, function (data) {

    if (data.code == 0) {
      callback(data.data)
    } else {
      util.pageToast(data.message || '发生未知错误');
    }
  })
}

/* 
  说明：获取金币明细
*/
const coins = function (pageId, callback) {

  ajax.post('/client/coin/list.ashx', {
    pageId: pageId || 1
  }, function (data) {

    if (data.code == 0) {
      callback(data.data)
    } else {
      util.pageToast(data.message || '发生未知错误');
    }
  })
}

module.exports = {
  detail: detail,
  update: update,
  signIn: signIn,
  coins: coins,
  mission: mission
}
