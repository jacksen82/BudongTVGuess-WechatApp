// services/game.js

const constants = require('../data/constants.js')
const store = require('../data/store.js')
const ajax = require('../utils/ajax.js')

const game = {

  /*
    说明：获取下一题
  */
  next: function (callback) {

    ajax.postEx('/client/game/next.ashx', {

    }, function (data) {

      store.client = data || {};
      callback(data);
    });
  },

  /*
    说明：答题结束
  */
  answer: function (questionId, result, callback) {

    ajax.postEx('/client/game/answer.ashx', {
      questionId: questionId,
      result: result
    }, function (data) {

      store.client = data || {};
      callback(data);
    });
  },

  /*
    说明：跳过题目
  */
  skip: function (questionId, callback) {

    ajax.postEx('/client/game/skip.ashx', {
      questionId: questionId
    }, function (data) {

      store.client = data || {};
      callback(data);
    });
  },

  /*
    说明：重新开始
  */
  restart: function (callback) {

    ajax.postEx('/client/game/restart.ashx', {

    }, function (data) {

      store.client = data || {};
      callback(data);
    });
  },

  /*
    说明：继续游戏
  */
  revive: function (questionId, callback) {

    ajax.postEx('/client/game/revive.ashx', {
      questionId: questionId
    }, function (data) {

      store.client = data || {};
      callback(data);
    });
  },

  /*
    说明：获取排行榜
  */
  rank: function (callback) {

    ajax.postEx('/client/game/rank.ashx', {

    }, function (data) {

      callback(data);
    });
  },

  /*
    说明：赠送复活卡
  */
  activate: function(toClientId, openGId, callback){

    ajax.postEx('/client/game/activate.ashx', {
      toClientId: toClientId,
      openGId: openGId
    }, function (data) {

      callback(data);
    });
  }
};

module.exports = game;