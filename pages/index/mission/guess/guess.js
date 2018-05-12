// pages/index/mission/guess/guess.js

const app = getApp()
const consts = require('../../../../utils/consts.js')
const util = require('../../../../utils/util.js')
const player = require('../../../../utils/player.js')
const store = require('../../../../utils/store.js')
const api = require('../../../../api/index.js')
const game = require('game.js')

Page({

  /*
    说明：页面的初始数据
  */
  data: {
    missionId: 0,
    title: '',
    balance: 0,
    logoUrl: '',
    timeSpan: '00:00',
    wordMarginLeft: 0,
    optionMarginLeft: 0,
    subjectWordIndex: -1,
    subjectWordText: '',
    subjectWords: [],
    subjectOptions: [],
    subjectOptionsVisible: false,
    subjectAnswer: '',
    subjectTiped: false,
    subjectHelped: false,
    subjectIndex: 0,
    subjectCount: 0
  },

  /*
    说明：页面加载事件
  */
  onLoad: function (options) {

    player.init(this);

    util.pageShareMenu();
    util.pageSetData(this, 'missionId', options.missionId || 0);
    util.pageSetData(this, 'balance', store.client.balance);
  },

  /*
    说明：页面显示事件
  */
  onShow: function(){

    var _this = this;

    if (!wx.getStorageSync('gameFirstDone')) {
      wx.showModal({
        title: '游戏提示',
        showCancel: false,
        content: '开始后，小程序会自动播放一段音频，猜一猜这段音频出自哪个电视、电影或动画，然后在下面的输入框中输入正确答案',
        confirmText: '知道了',
        success: function () {

          _this.onDetailLoad();
          wx.setStorageSync('gameFirstDone', 'true');
        }
      })
    } else {
      this.onDetailLoad();
    }
  },

  /*
    说明：页面卸载事件
  */
  onUnload: function(){

    player.stop();
  },

  /*
    说明：页面关卡详情加载事件
  */
  onDetailLoad: function () {

    var _this = this;

    api.mission.game.start(this.data.missionId, function (data) {

      _this.setData({
        title: data.title || '',
        logoUrl: util.getLogo(data.logoUrl),
        subjectIndex: data.subjectIndex + 1,
        subjectCount: data.subjectCount
      })
      _this.game = game;
      _this.game.init(_this, player, data);
      _this.game.next(_this);
    })
  },

  onCoinsTipTap: function(){

    wx.showModal({
      title: '操作提示',
      showCancel: false,
      content: '通过以下途径可获得金币：\r\n ' + 
        '1. 分享到群可获得金币 \r\n ' + 
        '2. 闯关成功可获取金币\r\n' + 
        '3. 每日签到可获得金币',
      confirmText: '知道了'
    })
  },

  /*
    说明：题目提示事件
  */
  onSubjectTipTap: function () {

    var _this = this;

    if (!this.data.subjectTiped) {
      if (this.data.balance >= 30) {
        this.game.tip(this);
      } else {
        util.pageToast('金币不足')
      }
    }
  },

  /*
    说明：题目跳过事件
  */
  onSubjectSkipTap: function(){

    var _this = this;

    if (this.data.balance >= 30) {
      this.game.skip(this);
    } else {
      util.pageToast('金币不足')
    }
  },

  /*
    说明：题目重听音频事件
  */
  onSubjectReplayTap: function(){

    var _this = this;

    if (!this.data.playready && !this.data.playing){
      this.game.replay();
    }
  },

  /*
    说明：选字事件
  */
  onSubjectSelectTap: function(e){

    this.data.subjectWords = this.data.subjectWords || [];

    if (this.data.subjectWordIndex > -1 && this.data.subjectWordIndex < this.data.subjectWords.length)
    {
      var word = this.data.subjectWords[this.data.subjectWordIndex];
      word.text = e.target.dataset.value;
      this.data.subjectWords[this.data.subjectWordIndex] = word;
      this.setData({
        subjectWordText: word.text,
        subjectWords: this.data.subjectWords
      });
    }

    if (this.data.subjectWordIndex < this.data.subjectWords.length - 1){
      this.data.subjectWordIndex ++;
      this.setData({
        subjectWordText: '',
        subjectWordIndex: this.data.subjectWordIndex,
        subjectOptions: this.data.subjectWords[this.data.subjectWordIndex].options || [],
        subjectOptionsVisible:  true
      });
    } else {
      this.data.subjectAnswer = '';
      for (var i = 0; i < this.data.subjectWords.length; i++) {
        this.data.subjectAnswer += this.data.subjectWords[i].text || '';
      }
      this.setData({
        subjectWordText: '',
        subjectWordIndex: -1,
        subjectOptionsVisible: false,
        subjectAnswer: this.data.subjectAnswer
      });
      this.game.answer();
    }
  },

  /*
    说明：选字事件
  */
  onSubjectWordTap: function(e){

    this.setData({
      subjectWordIndex: ((e.target.dataset.index == this.data.subjectWordIndex) ? -1 : e.target.dataset.index),
      subjectWordText: e.target.dataset.value.text || '',
      subjectOptions: e.target.dataset.value.options || [],
      subjectOptionsVisible: ((e.target.dataset.index == this.data.subjectWordIndex) ? !this.data.subjectOptionsVisible : true)
    });
  },

  /*
    说明：分享回调事件
  */
  onShareAppMessage: function (res) {

    util.pageSetData(this, 'subjectHelped', true)

    return api.wechat.getShareMessage('我正在【猜电视】闯关，快帮我听听看，这段声音出自哪个' + this.data.subjectCategory + '？', this.data.missionId, this.data.subjectId);
  }
})