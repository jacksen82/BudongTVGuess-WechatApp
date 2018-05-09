// pages/index/mission/help/help.js

const app = getApp()
const consts = require('../../../../utils/consts.js')
const util = require('../../../../utils/util.js')
const player = require('../../../../utils/player.js')
const store = require('../../../../utils/store.js')
const api = require('../../../../api/index.js')

Page({

  /*
    说明：页面的初始数据
  */
  data: {
    missionId: 0,
    missionTitle: '',
    subjectId: 0,
    subjectCategory: '',
    subjectMP3Url: '',
    fromClientId: 0,
    fromClientNick: '',
    fromClientAvatarUrl: ''
  },

  /*
    说明：页面加载事件
  */
  onLoad: function (options) {

    player.init(this);

    util.pageShareMenu();
    util.pageSetData(this, 'missionId', options.missionId || 0);
    util.pageSetData(this, 'subjectId', options.subjectId || 0);
    util.pageSetData(this, 'fromClientId', options.fromClientId || 0);
  },

  /*
    说明：页面显示事件
  */
  onShow: function () {

    this.onDetailLoad();
  },

  /*
    说明：页面卸载事件
  */
  onUnload: function () {

    player.stop();
  },

  /*
    说明：页面关卡详情加载事件
  */
  onDetailLoad: function () {

    var _this = this;

    api.mission.game.help(this.data.missionId, this.data.subjectId, this.data.fromClientId, function (data) {

      _this.setData({
        missionTitle: data.title || '',
        subjectCategory: util.getCategory((data.subject || {}).categoryId),
        subjectMP3Url: (data.subject || {}).mp3Url,
        fromClientNick: (data.fromClient || {}).nick,
        fromClientAvatarUrl: (data.fromClient || {}).avatarUrl
      })
      player.play(consts.HTTP_CDN + _this.data.subjectMP3Url);
    })
  },

  /*
    说明：题目重听音频事件
  */
  onSubjectReplayTap: function(){

    if (!this.data.playready && !this.data.playing) {
      player.play(consts.HTTP_CDN + this.data.subjectMP3Url);
    }
  },

  /*
    说明：我也要玩点击事件
  */
  onMissionStart: function(){

    util.pageNavigate('/pages/index/mission/start/start?missionId=' + this.data.missionId, true);
  },

  /*
    说明：分享回调事件
  */
  onShareAppMessage: function (res) {

    return api.wechat.getShareMessage();
  }
})