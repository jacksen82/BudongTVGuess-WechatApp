//  guess.js

const app = getApp();
const api = require("../../utils/api.js");

Page({
  data: {
    playing: false,
    levelInfo: 0,
    clientInfo: null,
    programInfo: null,
    programCharIndex: -1,
    animation: null
  },
  onLoad: function (options) {

    options = options || {};

    var self = this;
    var blink = wx.createAnimation({
      duration: 360,
      timingFunction: "ease"
    });
    blink.scale(2, 2).step();
    blink.scale(1, 1).step();
    for ( let key in options ){
      options[key] = decodeURIComponent(options[key]);
    }
    this.setData({
      levelInfo: options || {},
      clientInfo: app.globalData.clientInfo || {}
    });
    wx.setNavigationBarTitle({
      title: options.title || '答题竞猜'
    });
    wx.onBackgroundAudioPlay(function() {

      self.setData({ playing: true });
    });
    wx.onBackgroundAudioStop(function () {

      self.setData({ playing: false });
    });
    api.program.next({
      levelId: options.id || 0
    }, function(data){

      data.charItems = [];

      let index = 0;
      let chars = (data.chars || []).split("");
      while (chars.length > 0){
        index = Math.round(Math.random() * (chars.length - 1));
        data.charItems.push({
          "text":chars[index],
          "animation":null
        });
        chars.splice(index,1);
      }
      data.titleItems = (data.title || "").split("");
      self.setData({
        programInfo: data,
        animation: blink.export()
      });
    });
  },
  audioplay: function(){

    if (this.data.playing){
      wx.stopBackgroundAudio();
    } else {
      wx.playBackgroundAudio({
        dataUrl: this.data.programInfo.mp3Url || "http://www.languangav.com/soft/media/vocal.mp3",
        title: '步咚猜剧',
        coverImgUrl: this.data.levelInfo.coverUrl || "http://imgsrc.baidu.com/imgad/pic/item/48540923dd54564e31b8271db9de9c82d1584f31.jpg"
      });
    }
  },
  chioce: function(event){

    this.setData({
      programCharIndex: event.currentTarget.dataset["index"]
    });
  }
})
