// pages/live/index.js

const app = getApp()
const utils = require('../../utils/utils.js')
const constants = require('../../data/constants.js')
const store = require('../../data/store.js')
const client = require('../../services/client.js')

Page({

  /*
    说明：页面的初始数据
  */
  data: {
    liveItems: []
  },

  /*
    说明：页面加载事件
  */
  onLoad: function () {

    var wp = this;

    //  加载激活记录
    client.mine.lives(function (data) {

      wp.setData({
        liveItems: data.data || []
      });
    });

    //  允许分享至群
    wx.showShareMenu({
      withShareTicket: true
    });
  },

  /*
    说明：分享回调事件
  */
  onShareAppMessage: function (res) {

    return client.shareAppMessage(res, {}, function () { });
  }
})