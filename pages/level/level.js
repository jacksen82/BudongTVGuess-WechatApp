//  level.js

const app = getApp();
const util = require('../../utils/util.js');
const bus = require('../../utils/bus.js');
const api = require('../../services/api.js');

Page({
  data: {
    clientCoins: 0,
    levelIndex: 0,
    levelItems: [bus.level.none]
  },
  onLoad: function () {

    var _this = this;
    
    api.level.all({}, function(data){
      _this.setData({
        clientCoins: bus.client.coins || 0,
        levelItems: data.data || []
      });
      util.setNavigate('../guess/guess?' + util.serialize(data.data[0]));
    });
  },
  coutinue: function(){

    var index = this.data.levelIndex || 0;
    var levelInfo = (index < this.data.levelItems.length ? (this.data.levelItems[index] || {}) : {});

    util.setNavigate('../guess/guess?' + util.serialize(levelInfo));
  },
  unlock: function () {

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
  prev: function(){

    if (this.data.levelIndex > 0){
      this.setData({
        levelIndex: this.data.levelIndex - 1
      });
    }
  },
  next: function(){

    if (this.data.levelIndex < this.data.levelItems.length - 1) {
      this.setData({
        levelIndex: this.data.levelIndex + 1
      });
    }
  }
})
