//  index.js

const app = getApp();
const util = require('../../utils/util.js');
const bus = require('../../utils/bus.js');
const api = require('../../services/api.js');

Page({
  data: {
    isLoading: true,
    lineHeight: 0
  },
  onLoad: function () {

    this.setData({ lineHeight: Math.floor(bus.system.windowWidth * .5 * .6 - 4) });
    this.selectComponent('#television').show(.5);
    this._setWX();
    this._authorize();
  },
  onShareAppMessage: function (res) {

    var _this = this;

    return api.wechat.share('index', res, function (data) {

      bus.client.coins = (bus.client.coins || 0) + (data.coins || 0);
      _this.selectComponent('#toast').show(data.coins, 'add');
    });
  },
  onStart: function(){

    if (!this.data.isLoading){
      util.setNavigate('../level/level');
    }
  },
  onContact: function(){

    util.setNavigate('../about/about');
  },
  onBannerTap: function(){

    util.setNavigate('../store/store?url=' + this.data.bannerUrl);
  },
  _authorize: function(){

    var _this = this;

    api.wechat.authorize(function (data) {

      util.setData(_this, 'isLoading', false);
    });
  },
  _setWX: function () {

    wx.showShareMenu({
      withShareTicket: true
    });
  }
})
