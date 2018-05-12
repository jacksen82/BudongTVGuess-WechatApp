// pages/index/mission/more/more.js

const app = getApp()
const consts = require('../../../../utils/consts.js')
const util = require('../../../../utils/util.js')
const store = require('../../../../utils/store.js')
const api = require('../../../../api/index.js')

Page({

  /*
    说明：页面的初始数据
  */
  data: {
    clientId: 0,
    loading: true,
    missionPageId: 1,
    missionIsEnd: false,
    missionItems: []
  },

  /*
    说明：页面加载事件
  */
  onLoad: function (options) {

    util.pageShareMenu();
    util.pageSetData(this, 'clientId', store.client.id || 0);
    util.pageSetData(this, 'loading', true);

    this.onMissionLoad();
  },

  /*
    说明：页面显示事件
  */
  onShow: function (options) {

  },

  /*
    说明：上拉刷新事件
  */
  onReachBottom: function () {

    if (!this.data.missionIsEnd) {
      this.setData({ missionPageId: this.data.missionPageId + 1 })
      this.onMissionLoad()
    }
  },

  /*
    说明：页面关卡加载事件
  */
  onMissionLoad: function () {

    var _this = this;

    util.pageSetData(this, 'clientId', store.client.id || 0);
    util.pageSetData(this, 'loading', true);
    api.mission.more(this.data.missionPageId || 1, function (data) {
      
      if (_this.data.missionPageId == 1) {
        _this.data.missionItems = data.data || [];
      } else {
        _this.data.missionItems = _this.data.missionItems || [];
        _this.data.missionItems = _this.data.missionItems.concat(data.data || []);
      }
      _this.setData({
        loading: false,
        missionPageId: _this.data.missionPageId || 1,
        missionIsEnd: data.pageCount <= _this.data.missionPageId,
        missionItems: _this.data.missionItems
      });
    });
  },

  /*
    说明：任务关卡点击事件
  */
  onMissionItemTap: function (obj) {

    util.pageNavigate('/pages/index/mission/start/start?missionId=' + obj.currentTarget.dataset.missionId)
  },

  /*
    说明：分享回调事件
  */
  onShareAppMessage: function (res) {

    return api.wechat.getShareMessage()
  }
})