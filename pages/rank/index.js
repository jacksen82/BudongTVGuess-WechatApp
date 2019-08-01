// pages/rank/index.js

const app = getApp()
const utils = require('../../utils/utils.js')
const constants = require('../../data/constants.js')
const store = require('../../data/store.js')
const client = require('../../services/client.js')

Page({

  /*
    说明：页面的初始数据
  */
  data: {
    globalExpand: false,
    globalItems: [ ],
    friendItems: [ ]
  },

  /*
    说明：页面加载事件
  */
  onLoad: function(){

    var wp = this;

    //  加载排行榜
    client.game.rank(function(data){

      wp.setData({
        globalItems: data.global,
        friendItems: data.friend
      });
    });

    //  允许分享至群
    wx.showShareMenu({
      withShareTicket: true
    });
  },

  /*
    说明：展开更多事件
  */
  onMore: function(){

    this.setData({
      globalExpand: true
    });
  },

  /*
    说明：放弃激活事件
  */
  onCapsule: function () {

    wx.navigateToMiniProgram({
      appId: 'wxf11687703fa32720',
      success: function (res) { },
      fail: function (res) { }
    })
  },
  
  /*
    说明：分享回调事件
  */
  onShareAppMessage: function (res) {

    return client.shareAppMessage(res, {}, function () { });
  }
})