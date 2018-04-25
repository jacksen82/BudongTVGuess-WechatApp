// pages/mine/mission/detail/detail.js

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
    subjectItems: []
  },

  /*
    说明：页面加载事件
  */
  onLoad: function (options) {

    util.pageShareMenu();
    util.pageSetData(this, 'missionId', options.missionId);
  },

  /*
    说明：页面显示事件
  */
  onShow: function () {

    this.onLoadDetail();
  },

  /*
    说明：页面关卡详情加载事件
  */
  onLoadDetail: function () {

    var _this = this;

    api.mine.mission.detail(this.data.missionId, function (data) {

      _this.setData({
        title: data.title,
        subjectItems: data.subjects || []
      })
    });
  },

  /*
    说明：修改关卡标题事件
  */
  onEditTap: function(){

    util.pageNavigate('/pages/mine/mission/edit/edit?missionId=' + this.data.missionId + '&title=' + this.data.title);
  },

  /*
    说明：题目点击事件
  */
  onSubjectItemTap: function(e){

    util.pageNavigate('/pages/mine/mission/subject/edit/edit?subjectId=' + e.currentTarget.dataset.subjectId);
  },

  /*
    说明：添加新题目事件
  */
  onSubjectAddTap: function(){

    util.pageNavigate('/pages/mine/mission/subject/add/add?missionId=' + this.data.missionId);
  },

  /*
    说明：删除关卡事件
  */
  onMissionDeleteTap: function(){

    var _this = this;

    wx.showModal({
      title: '操作提示',
      content: '确定要删除这个关卡吗？',
      success: function (res) {

        if (res.confirm) {
          api.mine.mission._delete(_this.data.missionId, function (data) {

            util.pageNavigate('back');
          });
        }
      }
    })
  },

  /*
    说明：分享回调事件
  */
  onShareAppMessage: function (res) {

    return api.wechat.getShareMessage('我的关卡《' + this.data.title + '》，邀你来挑战！', this.data.missionId);
  }
})