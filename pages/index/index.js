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
    this._authorize();
  },
  onShareAppMessage: function (res) {

    var _this = this;

    return api.wechat.share('index', res, function (data) {
      _this.selectComponent('#toast').show(data.coins, 'add');
    });
  },
  onStart: function(){

    if (!this.data.isLoading){
      util.setNavigate('../level/level');
    }
  },
  _authorize: function(){

    var _this = this;

    api.wechat.authorize(function (data) {

      util.setData(_this, 'isLoading', false);
    });
  }
})
