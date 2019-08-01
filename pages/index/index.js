// pages/index/index.js

const app = getApp()
const utils = require('../../utils/utils.js')
const constants = require('../../data/constants.js')
const store = require('../../data/store.js')
const client = require('../../services/client.js')

Page({

  /* 
    说明：页面数据集合
  */
  data: {
    lives: 0,
    score: 0,
    actived: 0,
    disabled: 'disabled',
    tipQuestionTime: '',
    fromClientAvatar: '',
    fromClientNick: '',
    fromOpenGId: ''
  },

  /* 
    说明：页面加载事件
  */
  onLoad: function(){

    var wp = this;

    //  初始化菜单
    store.waitForAuthorize(function(){

      store.client = store.client || {};

      wp.setData({
        score: store.client.score || 0,
        lives: store.client.lives || 0,
        actived: store.client.actived || 0,
        disabled: '',
        questionTime: store.pageQuestionUpdate
      }); 
      
      if (store.shareSave == 1 && store.fromClientId!=store.clientId) {
        wp.setData({
          fromClientAvatar: store.fromClient.avatarUrl,
          fromClientNick: store.fromClient.nick || '',
          fromOpenGId: store.fromClient.fromOpenGId || ''
        }); 
        wp.selectComponent('#activate').show();
      }
    });

    //  允许分享至群
    wx.showShareMenu({
      withShareTicket: true
    });
  },

  /* 
    说明：开始游戏事件 [ 授权 ]
  */
  onGetUserInfo: function(res){

    var wp = this;

    client.mine.setUserInfo(res.detail.userInfo, function (data) {

      wp.setData({
        actived: store.client.actived
      });
      wp.onStart();
    });
  },

  /* 
    说明：开始游戏事件
  */
  onStart: function () {

    if (this.data.actived == 1) {
      wx.navigateTo({
        url: '/pages/game/index',
      });
    }
  },

  /* 
    说明：排行榜事件
  */
  onRank: function(){

    wx.navigateTo({
      url: '/pages/rank/index',
    });
  },

  /*
    说明：激活复活卡事件
  */
  onSave: function(){

    var wp = this;

    client.game.activate(store.fromClientId, store.fromOpenGId, function(data){

      wp.selectComponent('#activate').close();
      wx.showToast({
        title: '激活成功',
      })
    });
  },

  /*
    说明：放弃激活事件
  */
  onAbort: function(){

    this.selectComponent('#activate').close();
  },

  /*
    说明：放弃激活事件
  */
  onCapsule: function(){

    wx.navigateToMiniProgram({
      appId: 'wxf11687703fa32720',
      success: function(res) { },
      fail: function(res){ }
    })
  },

  /*
    说明：分享回调事件
  */
  onShareAppMessage: function (res) {
    
    return client.shareAppMessage(res, {}, function(){ });
  }
})
