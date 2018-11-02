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
    fromClientAvatar: '',
    fromClientNick: '',
    fromOpenGId: ''
  },

  /* 
    说明：页面加载事件
  */
  onLoad: function(){

    var wp = this;

    store.waitForAuthorize(function(){

      wx.navigateTo({
        url: '/pages/game/index',
      })
      wp.setData({
        score: store.client.score,
        lives: store.client.lives,
        actived: store.client.actived,
        disabled: ''
      }); 
      
      if (store.shareSave == 1) {
        wp.setData({
          fromClientAvatar: store.fromClient.avatarUrl,
          fromClientNick: store.fromClient.nick || '',
          fromOpenGId: store.fromClient.fromOpenGId || ''
        }); 
        wp.selectComponent('#saveme').show();
      }
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

    client.game.saved(store.fromClientId, store.fromOpenGId, function(data){

      wp.selectComponent('#saveme').close();
      wx.showToast({
        title: '激活成功',
      })
    });
  },

  /*
    说明：放弃激活事件
  */
  onAbort: function(){

    this.selectComponent('#saveme').close();
  },

  /*
    说明：分享回调事件
  */
  onShareAppMessage: function (res) {
    
    return client.shareAppMessage(res, {}, function(){ });
  }
})
