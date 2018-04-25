// pages/mine/about/about.js

const app = getApp()
const util = require('../../../utils/util.js')
const store = require('../../../utils/store.js')
const api = require('../../../api/index.js')

Page({

  /*
    说明：页面加载事件
  */
  onLoad: function () {

    util.pageShareMenu();
  },

  /*
    说明：分享回调事件
  */
  onShareAppMessage: function (res) {

    return api.wechat.getShareMessage()
  }
})