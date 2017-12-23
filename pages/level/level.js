//  level.js

const app = getApp();
const util = require("../../utils/util.js");
const api = require("../../utils/api.js");

Page({
  data: {
    clientInfo: null,
    levelIndex: 0,
    levelItems: null,
    levelCurrent: null
  },
  onLoad: function () {

    var self = this;
    this.setData({
      clientInfo: app.globalData.clientInfo || {}
    });
    wx.setNavigationBarTitle({
      title: '选择关卡'
    });
    api.level.all({}, function(data){

      self.setData({ 
        levelItems: data.data || [],
        levelCurrent: data.data && data.data.length ? (data.data[0] || {}) : {}
      });
      wx.navigateTo({ url: "../guess/guess?" + util.serialize(self.data.levelCurrent) });
    });
  },
  coutinue: function(){

    wx.navigateTo({ url: "../guess/guess?" + util.serialize(this.data.levelCurrent) });
  },
  unlock: function () {

    wx.showToast({
      title: '解锁成功',
    })
  },
  prev: function(){

    if (this.data.levelIndex > 0){
      this.setData({
        levelIndex: this.data.levelIndex - 1,
        levelCurrent: this.data.levelItems[this.data.levelIndex - 1]
      });
    }
  },
  next: function(){

    if (this.data.levelIndex < this.data.levelItems.length - 1) {
      this.setData({
        levelIndex: this.data.levelIndex + 1,
        levelCurrent: this.data.levelItems[this.data.levelIndex + 1]
      });
    }
  }
})
