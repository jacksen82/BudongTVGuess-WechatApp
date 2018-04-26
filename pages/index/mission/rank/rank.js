// pages/index/mission/rank/rank.js

const app = getApp()
const util = require('../../../../utils/util.js')
const store = require('../../../../utils/store.js')
const api = require('../../../../api/index.js')

Page({

  /*
    说明：页面的初始数据
  */
  data: {
    clientId: 0,
    missionId: 0,
    avatarUrl: '',
    title: '关卡名称',
    score: 0,
    timespan: '00:00',
    subjectIndex: 0,
    subjectCount: 0,
    playerItems: []
  },

  /*
    说明：页面加载事件
  */
  onLoad: function (options) {

    util.pageShareMenu();
    util.pageSetData(this, 'clientId', store.client.id);
    util.pageSetData(this, 'missionId', options.missionId);
  },

  /*
    说明：页面显示事件
  */
  onShow: function(){

    this.onLoadRanks()
  },

  /*
    说明：获取关卡排行榜方法 
  */
  onLoadRanks: function () {

    var _this = this;

    api.mission.game.rank(this.data.missionId, function (data) {

      _this.setData({
        avatarUrl: data.author.avatarUrl,
        title: data.title,
        score: data.score || 0,
        timespan: util.durationToTimeSpan(data.secondCount),
        subjectIndex: data.subjectIndex || 0,
        subjectCount: data.subjectCount || 0,
        playerItems: data.players || []
      })
      if (data.coins > 0){
        util.pageToast('+' + data.coins + ' 金币');
      }
    })
  },

  /*
    说明：分享回调事件
  */
  onShareAppMessage: function (res) {

    return api.wechat.getShareMessage('我正在闯关《' + this.data.title + '》，你敢来挑战吗？', this.data.missionId);
  }
})