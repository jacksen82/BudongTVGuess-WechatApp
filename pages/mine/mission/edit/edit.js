// pages/mine/mission/edit/edit.js

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
    title: ''
  },

  /*
    说明：页面加载事件
  */
  onLoad: function (options) {

    util.pageShareMenu();
    util.pageSetData(this, 'missionId', options.missionId);
    util.pageSetData(this, 'title', options.title);
  },

  /*
    说明：分享回调事件
  */
  onTitleInput: function (e) {

    this.setData({
      title: e.detail.value || ''
    })
  },

  /*
    说明：保存并返回详情
  */
  onEditTap: function () {

    if (!this.data.title) {
      util.pageToast('名称不能为空');
    } else {
      api.mine.mission.edit(this.data.missionId, this.data.title, function (data) {

        util.pageNavigate('back');
      });
    }
  },

  /*
    说明：分享回调事件
  */
  onShareAppMessage: function (res) {

    return api.wechat.getShareMessage()
  }
})
