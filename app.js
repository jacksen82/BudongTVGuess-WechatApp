//  app.js

const utils = require('utils/utils.js')
const constants = require('data/constants.js')
const store = require('data/store.js')
const client = require('services/client.js')

App ({

  /*
    说明：启动时发生
  */
  onLaunch: function(options){

    //  初始化三方标识
    store.client = null;
    store.clientId = 0;
    store.session3rd = wx.getStorageSync('session3rd') || '';

    //  允许分享至群
    wx.showShareMenu({
      withShareTicket: true
    });
  },
  
  /*
    说明：打开时发生
  */
  onShow: function (options) {

    //  初始化参数集合
    store.fromScene = options.scene || 0;
    store.fromClient = null;
    store.fromClientId = utils.getScene(options.query || {}, 'cid') || 0;
    store.shareSave = utils.getScene(options.query || {}, 'sm') || 0;
    store.shareTicket = options.shareTicket || '';
  
    //  请求授权
    client.authorize(function () {

      //  建立好友关系
      client.shareInfo();
    });
  },
})