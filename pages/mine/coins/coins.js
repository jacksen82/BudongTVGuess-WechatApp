// pages/mine/coins/coins.js

const app = getApp()
const util = require('../../../utils/util.js')
const store = require('../../../utils/store.js')
const api = require('../../../api/index.js')

Page({

  /*
    说明：页面的初始数据
  */
  data: {
    coinsPageId: 1,
    coinsIsEnd: false,
    coinsItems: []
  },

  /*
    说明：页面加载事件
  */
  onLoad: function () {

    util.pageShareMenu();
  },

  /*
    说明：页面显示事件
  */
  onShow: function () {

    this.onCoinsLoad()
  },

  /*
    说明：上拉刷新事件
  */
  onReachBottom: function () {

    if (!this.data.coinsIsEnd) {
      this.setData({ coinsPageId: this.data.coinsPageId + 1 })
      this.onCoinsLoad()
    }
  },

  /*
    说明：页面金币明细加载事件
  */
  onCoinsLoad: function(){

    var _this = this;

    api.mine.coins(this.data.coinsPageId, function (data) {

      _this.data.coinsPageId == 1 && (_this.data.coinsItems = [])
      _this.data.coinsItems = (_this.data.coinsItems || []).concat(data.data || [])
      _this.setData({
        coinsIsEnd: (data.pageCount <= _this.data.coinsPageId),
        coinsItems: _this.data.coinsItems
      })
    })
  },

  /*
    说明：分享回调事件
  */
  onShareAppMessage: function (res) {

    return api.wechat.getShareMessage()
  }
})