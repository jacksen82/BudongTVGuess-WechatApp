// pages/index/mission/guess/guess.js

const app = getApp()
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
    balance: 0,
    avatarUrl: '',
    timeSpan: '00:00',
    subjectAnswer: '',
    subjectTiped: false,
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

    if (!store.gameFirstDone) {
      wx.showModal({
        title: '游戏提示',
        showCancel: false,
        content: '开始后，小程序会自动播放一段音频，猜一猜这段音频出自哪个电视、电影或动画，然后在下面的输入框中输入正确答案',
        confirmText: '知道了',
        success: function () {

          _this.onLoadDetail();
          store.gameFirstDone = 'true';
          wx.setStorageSync('gameFirstDone', 'true');
        }
      })
    } else {
      this.onLoadDetail();
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
  onLoadDetail: function () {

    var _this = this;

    api.mission.game.start(this.data.missionId, function (data) {

      _this.setData({
        avatarUrl: (data.author || {}).avatarUrl,
        subjectIndex: data.subjectIndex + 1,
        subjectCount: data.subjectCount
      })
      _this.game = game;
      _this.game.init(_this, player, data);
      _this.game.next(_this);
    })
  },

  /*
    说明：题目提示事件
  */
  onSubjectTipTap: function () {

    var _this = this;

    if (!this.data.subjectTiped) {
      if (this.data.balance >= 30) {
        util.pageSetData(this, 'subjectTiped', true)
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
      if (this.data.balance >= 10) {
        this.game.replay();
      } else {
        util.pageToast('金币不足')
      }
    }
  },

  /*
    说明：输入答案事件
  */
  onSubjectInput: function(e){

    util.pageSetData(this, 'subjectAnswer', e.detail.value || '')
  },

  /*
    说明：确认答题事件
  */
  onSubjectAnswer: function(){

    this.game.answer();
  },

  /*
    说明：分享回调事件
  */
  onShareAppMessage: function (res) {

    return api.wechat.getShareMessage('我正在闯关《' + this.data.title + '》，你敢来挑战吗？', this.data.missionId);
  }
})