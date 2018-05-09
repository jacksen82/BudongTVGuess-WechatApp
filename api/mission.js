//  mission.js

const consts = require('../utils/consts.js');
const util = require('../utils/util.js');
const store = require('../utils/store.js');
const ajax = require('./ajax.js');
const game = require('./mission/game.js');

/*
  说明：获取关卡列表
*/
const list = function (pageId, callback) {

  //  初始化关卡信息
  store.missions = store.missions || {};

  //  如果页码相同，并且上次请求在 60 秒内，则从本地获取
  if (pageId == store.missions.pageId && (new Date().getTime() - store.missions.lastTime < consts.AJAX_TIMESTAMP_NORMAL)) {
    callback && callback();
  } else {
    ajax.post('/mission/list.ashx', {
      pageId: pageId || 1
    }, function (data) {
      
      if (data.code == 0) {
        if (pageId == 1){
          store.missions.data = (data.data || {}).data || [];
        } else {
          store.missions.data = store.missions.data || [];
          store.missions.data = store.missions.data.concat((data.data || {}).data || []);
        }
        store.missions.pageId = pageId || 1;
        store.missions.pageCount = (data.data || {}).pageCount || 1;
        store.missions.lastTime = new Date().getTime();
        
        callback && callback();
      } else {
        util.pageToast(data.message || '发生未知错误');
      }
    })
  }
}

/*
  说明：获取待审核关卡详情
*/
const more = function (pageId, callback) {

  ajax.post('/mission/more.ashx', {
    pageId: pageId || 1
  }, function (data) {

    if (data.code == 0) {
      callback && callback(data.data);
    } else {
      util.pageToast(data.message || '发生未知错误');
    }
  })
}

/*
  说明：获取关卡详情
*/
const detail = function(missionId, callback){

  ajax.post('/mission/detail.ashx', {
    missionId: missionId || 1
  }, function (data) {

    if (data.code == 0) {
      callback && callback(data.data);
    } else {
      util.pageToast(data.message || '发生未知错误');
    }
  })
}

module.exports = {
  list: list,
  more: more,
  detail: detail,
  game: game
}
