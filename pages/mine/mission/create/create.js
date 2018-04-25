// pages/mine/mission/create/create.js

const app = getApp()
const util = require('../../../../utils/util.js')
const store = require('../../../../utils/store.js')
const api = require('../../../../api/index.js')


Page({

  /*
    说明：页面的初始数据
  */
  data: {
    title: ''
  },

  /*
    说明：页面加载事件
  */
  onLoad: function () {

    util.pageShareMenu();
  },

  /*
    说明：分享回调事件
  */
  onTitleInput: function(e){

    this.setData({
      title: e.detail.value || ''
    })
  },

  /*
    说明：保存并录制题目
  */
  onCreateTap: function(){

    if (!this.data.title){
      util.pageToast('名称必须填');
    } else {
      api.mine.mission.create(this.data.title, function (data) {

        util.pageNavigate('/pages/mine/mission/detail/detail?missionId=' + (data.id || 0), true);
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
