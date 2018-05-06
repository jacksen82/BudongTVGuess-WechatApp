// pages/index/mission/start/start.js

const app = getApp()
const util = require('../../../../utils/util.js')
const store = require('../../../../utils/store.js')
const api = require('../../../../api/index.js')

Page({

  /*
    说明：页面的初始数据
  */
  data: {
    missionId: 0,
    title: '',
    nick: '',
    gender: 0,
    birthyear: 1980,
    logoUrl: '',
    avatarUrl: '',
    actived: 0,
    tags: [],
    subjectIndex: 0,
    subjectCount: 0,
    playerCount: 0
  },
  
  /*
    说明：页面加载事件
  */
  onLoad: function (options) {

    util.pageShareMenu();
    util.pageSetData(this, 'missionId', options.missionId || 0);
  },

  /*
    说明：页面显示事件
  */
  onShow: function(){

    this.onLoadDetail()
  },

  /*
    说明：页面关卡详情加载事件
  */
  onLoadDetail: function(){

    var _this = this;

    api.mission.detail(this.data.missionId, function (data) {

      util.pageSetTitle(data.title)
      _this.setData({
        title: data.title,
        nick: (data.author || {}).nick,
        gender: (data.author || {}).gender,
        birthyear: (data.author || {}).birthyear,
        logoUrl: util.getLogo(data.logoUrl),
        avatarUrl: (data.author || {}).avatarUrl,
        actived: store.client.actived,
        tags: (data.tags ? data.tags.split(',') : []),
        subjectIndex: data.subjectIndex,
        subjectCount: data.subjectCount,
        playerCount: data.playerCount
      })
    })
  },

  /*
    说明：授权访问，并开始答题点击事件
  */
  onMissionActive: function(res){

    var _this = this;

    if (res.detail.userInfo) {
      api.mine.update(res.detail.userInfo.nickName, res.detail.userInfo.gender, res.detail.userInfo.avatarUrl, store.client.birthyear || 0,
        function (data) {

          //  更新客户端数据
          store.client = data || {};
          store.client.lastTime = new Date().getTime();

          //  开始闯关答题
          _this.onMissionStart();
        });
    } else {
      api.wechat.getSettings('userInfo', function (authSetting){

        if (authSetting) {
          util.pageToast('授权成功');
        } else {
          util.pageToast('授权失败');
        }
      });
    }
  },

  /*
    说明：开始答题点击事件
  */
  onMissionStart: function () {

    var _this = this;

    if (this.data.subjectIndex >= this.data.subjectCount){
      wx.showModal({
        title: '操作提示',
        content: '重新开始会清除之前的成绩，确定要重新开始吗？',
        confirmText: '确定',
        cancelText: '取消',
        success: function (res) {

          if (res.confirm) { util.pageNavigate('/pages/index/mission/guess/guess?missionId=' + _this.data.missionId) }
          if (res.cancel) { util.pageNavigate('back') }
        }
      })
    } else {
      util.pageNavigate('/pages/index/mission/guess/guess?missionId=' + _this.data.missionId)
    }
  },

  /*
    说明：谁还玩过点击事件
  */
  onMissionRank: function () {

    util.pageNavigate('/pages/index/mission/rank/rank?missionId=' + this.data.missionId)
  },

  /*
    说明：分享回调事件
  */
  onShareAppMessage: function (res) {

    return api.wechat.getShareMessage('我正在闯关《' + this.data.title + '》，你敢来挑战吗？', this.data.missionId);
  }
})