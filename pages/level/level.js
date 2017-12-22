//  level.js

const app = getApp();
const api = require("../../utils/api.js");

Page({
  data: {
    clientInfo: null,
    levelIndex: 0,
    levelItems: null
  },
  onLoad: function () {

    var self = this;

    this.clientInfo = app.globalData.clientInfo || {};
    
    api.level.all({}, function(data){

      self.setData({ levelItems: data.data || [] });
    });
  },
  coutinue: function(){

    wx.navigateTo({ url: "../index/index?fromClientId=222" });
  },
  unlock: function () {

    //  判断金币是否充足
    //  yes - API.level.unlock();
    //  no - alert();
  },
  prev: function(){

    if (this.data.levelIndex > 0){
      this.setData({
        levelIndex: this.data.levelIndex - 1 
      });
      console.log(2222);
    }
  },
  next: function(){

    if (this.data.levelIndex < this.data.levelItems.length - 1) {
      this.setData({
        levelIndex: this.data.levelIndex + 1
      });
      console.log(2222);
    }
  }
})
