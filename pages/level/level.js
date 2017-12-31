//  level.js

const app = getApp();
const util = require('../../utils/util.js');
const bus = require('../../utils/bus.js');
const api = require('../../services/api.js');

Page({
  data: {
    coins: 0,
    avatarUrl: '',
    thumbWidth: 0,
    thumbHeight: 0,
    levelIndex: 0,
    levelItems: [bus.level.none]
  },
  onLoad: function () {

    var _this = this;
    
    this.setData({
      thumbWidth: Math.floor(bus.system.windowWidth - 160),
      thumbHeight: Math.floor(bus.system.windowWidth - 160)
    });
    api.level.all({}, function(data){
      _this.setData({
        coins: bus.client.coins || 0,
        avatarUrl: bus.client.avatarUrl,
        levelItems: data.data || []
      });
      util.setNavigate('../guess/guess?' + util.serialize(data.data[0]));
    });
  },
  onShareAppMessage: function (res) {

    var _this = this;

    this.selectComponent('#coins').close();
    return api.wechat.share('coins', res, function (data) {
      _this.selectComponent('#toast').show('+100', 'add');
    });
  },
  onCoins: function(){

    this.selectComponent('#coins').show(this.data.coins);
  },
  onRank: function(){

  },
  onCoutinue: function(){

    var index = this.data.levelIndex || 0;
    var levelInfo = (index < this.data.levelItems.length ? (this.data.levelItems[index] || {}) : {});

    util.setNavigate('../guess/guess?' + util.serialize(levelInfo));
  },
  onUnlock: function () {

    var _this = this;
    var index = this.data.levelIndex || 0;
    var levelInfo = (index < this.data.levelItems.length ? (this.data.levelItems[index] || {}) : {});

    api.level.unlock({
      levelId: levelInfo.id || 0
    }, function(data){
      console.log(data);
      _this.selectComponent('#toast').show(data.coins, 'minus');
    });
  },
  onGoPrev: function(){

    if (this.data.levelIndex > 0){
      this.setData({
        levelIndex: this.data.levelIndex - 1
      });
    }
  },
  onGoNext: function(){

    if (this.data.levelIndex < this.data.levelItems.length - 1) {
      this.setData({
        levelIndex: this.data.levelIndex + 1
      });
    }
  }
})
