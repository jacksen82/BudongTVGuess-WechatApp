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
    questionId: 0,
    questionTitle: '',
    questionOptionValue: '',
    questionOptions: [],
    questionImageUrl: '',
    questionAnswered: 0,
    questionAmount: 0,
    clientRankPosition: 0,
    clientDurationPresent: 0,
    clientScore: 0,
    clientLives: 0,
    clientStatus: 0,
  },

  /*
    说明：页面加载事件
  */
  onLoad: function(){

    this.onNext();
  },

  /*
    说明：更新数据
  */
  onReset: function(data){

    this.setData({
      clientRankPosition: data.rankPosition,
      clientRankIndex: data.rankIndex,
      clientDurationPresent: Math.floor((data.questionAnswered + 1) / data.questionAmount * 100),
      clientScore: data.score,
      clientLives: data.lives,
      clientStatus: data.status,
      questionCorrect: data.questionCorrect,
      questionAnswered: data.questionAnswered,
      questionAmount: data.questionAmount
    });
    if (data.question){
      this.setData({
        questionId: data.question.questionId,
        questionTitle: data.question.title,
        questionOptionValue: data.question.optionValue,
        questionOptionItems: (data.question.optionItems || '').split(';'),
        questionImageUrl: data.question.imageUrl,
      });
    }
  },

  /*
    说明：下一题事件
  */
  onNext: function () {

    var wp = this;

    client.game.next(function (data) {

      wp.onReset(data);

      if (wp.data.clientStatus == 200) {
        wp.selectComponent('#incorrect').show();
      } else {
        if (!wp.data.questionId) {
          //  wp.selectComponent('#complete').show();
        }
      }
    });
  },

  /*
    说明：选择选项事件
  */
  onSelect: function(e){

    var wp = this;
    var result = ( this.data.questionOptionValue == e.currentTarget.dataset.item ? 1 : 2 );

    client.game.answer(this.data.questionId, result, function(data){

      wp.onReset(data);

      if (result == 1){
        if (wp.data.questionAnswered >= wp.data.questionAmount) {
          wp.selectComponent('#complete').show();
        } else {
          wp.selectComponent('#correct').show();
        }
      } else {
        wp.selectComponent('#incorrect').show();
      }
    });
  },

  /*
    说明：重新开始事件
  */
  onRestart: function () {

    var wp = this;
    var callback = function (data) {

      wp.selectComponent('#incorrect') && wp.selectComponent('#incorrect').close();
      wp.selectComponent('#complete') && wp.selectComponent('#complete').close();
      wp.onNext();
    }

    if (this.data.questionAnswered < 2) {
      client.game.restart(callback);
    } else {
      wx.showModal({
        title: '操作提示',
        content: '重新开始会清除之前的成绩，确定要重新开始吗？',
        success: function (res) {

          if (res.confirm) {
            client.game.restart(callback);
          }
        }
      })
    }
  },

  /*
    说明：继续下一题
  */
  onContinue: function(){
    
    this.selectComponent('#correct') && this.selectComponent('#correct').close();
    this.onNext();
  },

  /*
    说明：使用复活卡事件
  */
  onRevive: function () {

    var wp = this;

    if (this.data.clientLives) {
      client.game.revive(function (data) {

        wp.selectComponent('#incorrect') && wp.selectComponent('#incorrect').close();
        wp.onNext();
      });
    } else {
      wx.showToast({
        title: '没有复活卡',
      })
    }
  },

  /*
    说明：查看激活卡记录事件
  */
  onLiveRecord: function () {

    wx.navigateTo({
      url: '/pages/live/index',
    })
  },

  /*
    说明：分享回调事件
  */
  onShareAppMessage: function (res) {

    return client.shareAppMessage(res, {}, function () { });
  }
})