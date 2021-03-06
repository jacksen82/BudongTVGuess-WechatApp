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
    previewPaddingTop: 0,
    questionId: 0,
    questionTitle: '',
    questionOptionValue: '',
    questionOptions: [],
    questionImageUrl: '',
    questionAnswered: 0,
    questionCorrect: 0,
    questionAmount: 0,
    clientRankIndex: 0,
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

    //  允许分享至群
    wx.showShareMenu({
      withShareTicket: true
    });
    
    this.onNext();

  },

  /*
    说明：更新数据
  */
  onReset: function(data){

    this.setData({
      clientRankPosition: Math.floor(data.rankPosition),
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
        questionOptionItems: utils.getOptions((data.question.optionItems || '').split(';')),
        questionImageUrl: constants.HTTP_CDN + data.question.imageUrl,
      });
    }
  },

  /*
    说明：下一题事件
  */
  onNext: function (skip) {

    var wp = this;

    client.game.next(function (data) {

      wp.onReset(data);
      if (wp.data.clientStatus == 200) {
        if (wp.data.questionCorrect < 1) {
          client.game.restart(wp.onNext);
        } else {
          wp.selectComponent('#incorrect').show();
        }
      } else {
        if (data.question){

        } else {
          if (skip == true){
            wx.showToast({
              icon: 'none',
              title: '已经是最后一题了，不能跳过',
            })
          } else {
            wp.selectComponent('#complete').show();
          }
        }
      }
    });
  },

  /*
    说明：预览图片事件
  */
  onPreview: function (e) {

    wx.previewImage({
      urls: [e.currentTarget.dataset.imageUrl],
    })
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
    说明：跳过这一题事件
  */
  onSkip: function(){

    var wp = this;

    client.game.skip(this.data.questionId, function (data) {

      wp.onNext(true);
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

    if (this.data.questionCorrect < 1) {
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
      client.game.revive(this.data.questionId, function (data) {

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

    var wp = this;
    var data = {};

    if (this.data.clientStatus == 0 && this.data.questionId) {
      data = {
        questionId: this.data.questionId,
        title: this.data.questionTitle,
        imageUrl: this.data.questionImageUrl
      };
    }

    return client.shareAppMessage(res, data, function (_data) {
      
      if (res.from == 'button' && res.target && res.target.dataset) {
        if (res.target.dataset.action == 'skip'){
          wp.selectComponent('#incorrect') && wp.selectComponent('#incorrect').close();
          wp.onSkip();
        }
      }
    });
  }
})