// pages/game/index.js

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
    dinosaurId: 0,
    name: '',
    descirbe: '',
    imageUrl: '',
    options: [],
    present: 0,
    position: 0,
    duration: 0,
    length: 0,
    cards: 0,
    score: 0
  },

  /*
    说明：页面加载事件
  */
  onLoad: function(){

    this.onAssign();
  },

  /*
    说明：查看激活卡记录事件
  */
  onCardRecord: function () {

    wx.navigateTo({
      url: '/pages/card/index',
    })
  },

  /*
    说明：下一题事件
  */
  onAssign: function () {

    var wp = this;

    client.game.assign(function (data) {

      wp.setData({
        present: Math.floor((data.duration + 1) / data.length * 100),
        duration: data.duration,
        length: data.length,
        cards: data.cards,
        score: data.score,
        position: data.position,
        status: data.status
      });

      if (data.dinosaurId) {
        wp.setData({
          dinosaurId: data.dinosaurId,
          name: data.name,
          describe: data.describe,
          imageUrl: data.imageUrl,
          options: data.options
        });
      } else {
        wp.selectComponent('#dialogDone').show();
      }
    });
  },

  /*
    说明：选择选项事件
  */
  onSelect: function(e){

    var wp = this;
    var result = 2;
    if (this.data.name == e.currentTarget.dataset.item) {
      result = 1;
    }
    client.game.answer(this.data.dinosaurId, result, function(data){

      store.client = data || {};
      
      wp.setData({
        score: data.score,
        position: data.position,
        status: data.status
      });

      if (result == 1){
        if (wp.data.duration >= wp.data.length - 1) {
          wp.selectComponent('#dialogDone').show();
        } else {
          wp.selectComponent('#dialogRight').show();
        }
      } else {
        wp.selectComponent('#dialogWrong').show();
      }
    });
  },

  /*
    说明：使用复活卡事件
  */
  onContinue: function () {

    var wp = this;

    if (this.data.cards) {
      client.game._continue(function (data) {

        store.client = data || {};

        wp.selectComponent('#dialogWrong') && wp.selectComponent('#dialogWrong').close();
        wp.onAssign();
      });
    } else {
      wx.showToast({
        title: '没有复活卡',
      })
    }
  },

  /*
    说明：重新开始事件
  */
  onRestart: function(){

    var wp = this;
    var callback = function (data){

      store.client = data || {};

      wp.selectComponent('#dialogWrong') && wp.selectComponent('#dialogWrong').close();
      wp.selectComponent('#dialogDone') && wp.selectComponent('#dialogDone').close();
      wp.onAssign();
    }

    if (this.data.duration < 2) {
      client.game.restart(callback);
    } else {
      wx.showModal({
        title: '操作提示',
        content: '重新开始会清除之前的成绩，确定要重新开始吗？',
        success: function(res){

          if (res.confirm){
            client.game.restart(callback);
          }
        }
      })
    }
  },

  /*
    说明：继续下一题
  */
  onNext: function(){

    this.selectComponent('#dialogRight') && this.selectComponent('#dialogRight').close();
    this.onAssign();
  },

  /*
    说明：分享回调事件
  */
  onShareAppMessage: function (res) {

    return client.shareAppMessage(res, {}, function () { });
  }
})