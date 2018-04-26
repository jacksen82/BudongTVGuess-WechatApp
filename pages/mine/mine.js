//  pages/mine/mine.js

const app = getApp()
const util = require('../../utils/util.js')
const store = require('../../utils/store.js')
const api = require('../../api/index.js')

Page({

  /*
    说明：页面的初始数据
  */
  data: {
    nick: '',
    gender: 0,
    birthyear: 1982,
    avatarUrl: '',
    balance: 0,
    missionItems: []
  },

  /*
    说明：页面加载事件
  */
  onLoad: function () {

    var _this = this;

    util.pageShareMenu();
  },

  /*
    说明：页面显示事件
  */
  onShow: function () {

    store.tabs = 'mine';
    this.onLoadProfile();
  },

  onHide: function(){

    store.tabs = '';
  },

  /*
    说明：用户资料加载事件
  */
  onLoadProfile: function(){

    var _this = this;

    api.wechat.getUserInfo()
      .then(function (data) {

        store.client = data || {};
        _this.setData({
          nick: store.client.nick,
          gender: store.client.gender,
          birthyear: store.client.birthyear,
          avatarUrl: store.client.avatarUrl,
          balance: store.client.balance
        });
        _this.onLoadMissions();
      });
  },

  /*
    说明：用户关卡加载事件
  */
  onLoadMissions: function(){

    var _this = this;

    api.mine.mission.list(function (data) {

      util.pageSetData(_this, 'missionItems', data.data || []);
    });
  },

  /*
    说明：用户资料点击事件
  */
  onHeaderTap: function(){

    util.pageNavigate('/pages/mine/profile/profile');
  },

  /*
    说明： 金币点击事件
  */
  onCoinsDetailTap: function(){

    util.pageNavigate('/pages/mine/coins/coins');
  },

  /*
    说明：任务关卡点击事件
  */
  onMissionItemTap: function(e){

    util.pageNavigate('/pages/mine/mission/detail/detail?missionId=' + e.currentTarget.dataset.missionId);
  },

  /*
    说明：创建新关卡点击事件
  */
  onMissionCreateTap: function () {

    util.pageNavigate('/pages/mine/mission/create/create');
  },

  /*
    说明：关于我们点击事件
  */
  onAboutTap: function(){

    util.pageNavigate('/pages/mine/about/about');
  },

  /*
    说明：分享回调事件
  */
  onShareAppMessage: function (res) {

    return api.wechat.getShareMessage()
  }
})