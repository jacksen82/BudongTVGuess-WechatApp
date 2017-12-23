//  guess.js

const app = getApp();
const api = require("../../utils/api.js");

Page({
  data: {
    levelInfo: 0,
    clientInfo: null,
    programInfo: null
  },
  onLoad: function (options) {

    options = options || {};

    var self = this;
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
    api.program.next({
      levelId: options.id || 0
    }, function(data){

      data.charItems = [];

      let index = 0;
      let chars = (data.chars || []).split("");
      while (chars.length > 0){
        index = Math.round(Math.random() * (chars.length - 1));
        data.charItems.push(chars[index]);
        chars.splice(index,1);
      }
      data.titleItems = (data.title || "").split("");
      console.log(data);
      
      self.setData({
        programInfo: data
      });
    });
  },
  chioce: function(event){

    console.log(event.currentTarget.dataset);
  }
})
