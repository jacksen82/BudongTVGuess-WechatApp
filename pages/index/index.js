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
  onStart: function(){

    if (!this.data.isLoading){
      util.setNavigate('../level/level');
    }
  },
  _authorize: function(){

    var _this = this;

    api.wechat.authorize(function (data) {

      util.setData(_this, 'isLoading', false);
      util.setNavigate('../level/level');
    });
  }
})
