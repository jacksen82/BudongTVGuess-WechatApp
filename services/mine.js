// services/mine.js

const constants = require('../data/constants.js')
const store = require('../data/store.js')
const ajax = require('../utils/ajax.js')

const mine = {

  /*
    说明：更新用户信息
  */
  setUserInfo: function (userInfo, callback) {

    ajax.postEx('/client/mine/setUserInfo.ashx', {
      nick: userInfo.nickName || '',
      gender: userInfo.gender || 0,
      avatarUrl: userInfo.avatarUrl || ''
    }, function (data) {

      store.client = data || {};

      callback(data);
    });
  },

  /*
    说明：赠送复活卡
  */
  lives: function (callback) {

    ajax.postEx('/client/mine/lives.ashx', {
      
    }, function (data) {

      callback(data);
    });
  }
};

module.exports = mine;