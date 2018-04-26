// pages/index/index.js

const app = getApp()
const util = require('../../utils/util.js')
const store = require('../../utils/store.js')
const api = require('../../api/index.js')

Page({

  /*
    说明：页面的初始数据
  */
  data: {
    clientId: 0,
    missionPageId: 1,
    missionIsEnd: false,
    missionItems: []
  },

  /*
    说明：页面加载事件
  */
  onLoad: function (options) {
    
    util.pageShareMenu();
    util.pageSetData(this, 'clientId', store.client.id);
    (options.mid) && util.pageNavigate('/pages/index/mission/start/start?missionId=' + options.mid);
  },

  /*
    说明：页面显示事件
  */
  onShow: function (options) {

    util.timerStart('IndexLoad', this.onLoadDelay, 50)
  },
  /*
    说明：页面延迟加载事件
  */
  onLoadDelay: function(){

    if (store.launched == true) {
      util.timerClear('IndexLoad', this.onLoadMissions);
    }
  },

  /*
    说明：页面关卡加载事件
  */
  onLoadMissions: function () {

    var _this = this;

    api.mission.list(function (data) {

      _this.data.missionPageId == 1 && (_this.data.missionItems = [])
      _this.data.missionItems = (_this.data.missionItems || []).concat((data || {}).data || [])
      _this.setData({
        missionIsEnd: (data.pageCount <= _this.data.missionPageId),
        missionItems: _this.data.missionItems
      })
    })
  },
  
  /*
    说明：上拉刷新事件
  */
  onReachBottom: function () {

    if (!this.data.missionIsEnd) {
      this.setData({ missionPageId: this.data.missionPageId + 1 })
      this.onLoadMissions()
    }
  },

  /*
    说明：任务关卡点击事件
  */
  onMissionItemTap: function(obj){

    util.pageNavigate('/pages/index/mission/start/start?missionId=' + obj.currentTarget.dataset.missionId)
  },

  /*
    说明：更多关卡点击事件
  */
  onMissionCreate: function(){

    util.pageNavigate('/pages/mine/mission/create/create');
  },

  /*
    说明：分享回调事件
  */
  onShareAppMessage: function (res) {

    return api.wechat.getShareMessage()
  }
})
