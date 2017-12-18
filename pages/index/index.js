//  index.js

const app = getApp();

Page({
  data: {
    leave: false
  },
  onLoad: function () {

  },
  onShow: function(){

    this.leave = false;
  },
  start: function(){
    
    if (!this.leave){
      wx.navigateTo({
        url: '../grade/grade'
      });
      this.leave = true;
    }
  }
})
