//  level.js

const app = getApp();
const util = require('../../utils/util.js');
const bus = require('../../utils/bus.js');
const api = require('../../services/api.js');

Page({
  data: {
    coins: 0,
    avatarUrl: '',
    thumbEncourage: 'https://shenxu.name/tvguess/statics/images/level_encourage.png',
    thumbLoaded: 'https://shenxu.name/tvguess/statics/images/level_locked.png',
    thumbWidth: 0,
    thumbHeight: 0,
    levelIndex: 0,
    levelItems: [bus.level.none]
  },
  onLoad: function () {

    this.setData({
      coins: bus.client.coins || 0,
      avatarUrl: bus.client.avatarUrl,
      thumbWidth: Math.floor(bus.system.windowWidth - 160),
      thumbHeight: Math.floor(bus.system.windowWidth - 160)
    });
  },
  onShow: function(){

    var _this = this;

    api.level.all({}, function (data) {

      _this.setData({
        levelItems: data.data || []
      });
    });
  },
  onShareAppMessage: function (res) {

    var _this = this;

    this.selectComponent('#coins').close();
    return api.wechat.share('level', res, function (data) {
      _this.selectComponent('#toast').show(data.coins, 'add');
    });
  },
  onCoins: function(){

    this.selectComponent('#coins').show(this.data.coins);
  },
  onRank: function(){

    var _this = this, levelInfo = this._currentLevel();
    if (levelInfo.locked){
      util.showToast('尚未解锁');
    } else {
      util.setNavigate('../rank/rank?' + util.serialize(this._currentLevel()));
    }
  },
  onCoutinue: function(){

    var _this = this, levelInfo = this._currentLevel();

    if (levelInfo.subjectAnswerCount >= levelInfo.subjectCount){
      api.level.restart({
        levelId: levelInfo.id || 0
      }, function(data){

        util.setNavigate('../guess/guess?' + util.serialize(_this._currentLevel()));
      });
    } else {
      util.setNavigate('../guess/guess?' + util.serialize(_this._currentLevel()));
    }
  },
  onUnlock: function () {

    var _this = this, levelInfo = this._currentLevel();

    if (this.data.coins >= levelInfo.coins){
      api.level.unlock({
        levelId: levelInfo.id || 0
      }, function (data) {

        bus.client.coins = (bus.client.coins || 0) + (data.coins || 0);
        _this.selectComponent('#toast').show(data.coins, 'minus');
        _this.setData({
          coins: bus.client.coins
        });
        util.setNavigate('../guess/guess?' + util.serialize(levelInfo));
      });
    } else {
      util.showToast('咚豆不足');
    }
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
  },
  _currentLevel: function(){

    var index = this.data.levelIndex || 0;
    return (index < this.data.levelItems.length ? (this.data.levelItems[index] || {}) : {});
  }
})
