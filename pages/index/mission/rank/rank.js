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
    logoUrl: '',
    title: '',
    score: 0,
    timespan: '00:00',
    subjectIndex: 0,
    subjectCount: 0,
    playerTop10Items: [],
    playerInFriendItems: []
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
        logoUrl: util.getLogo(data.logoUrl),
        title: data.title,
        score: data.score || 0,
        timespan: util.getTimeSpan(data.secondCount),
        subjectIndex: data.subjectIndex || 0,
        subjectCount: data.subjectCount || 0,
        playerTop10Items: data.playersTop10 || [],
        playerInFriendItems: data.playersInFriend || []
      })
    })
  },

  /*
    说明：分享回调事件
  */
  onShareAppMessage: function (res) {

    return api.wechat.getShareMessage('我正在闯关《' + this.data.title + '》，你敢来挑战吗？', this.data.missionId);
  }
})