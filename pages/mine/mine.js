//  pages/mine/mine.js

const app = getApp()
const consts = require('../../utils/consts.js')
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
    actived: 0,
    signined: 0,
    missionItems: []
  },

  /*
    说明：页面加载事件
  */
  onLoad: function () {

    util.pageShareMenu();
  },

  /*
    说明：页面显示事件
  */
  onShow: function () {
    
    this.onProfileLoad();
  },

  /*
    说明：更新用户资料事件
  */
  onProfileLoad: function(){

    var _this = this;

    api.mine.detail(function () {

      _this.setData({
        nick: store.client.nick,
        gender: store.client.gender,
        birthyear: store.client.birthyear,
        avatarUrl: store.client.avatarUrl,
        balance: store.client.balance,
        actived: store.client.actived,
        signined: store.client.signined,
        missionItems: store.client.missions
      });
    });
  },

  /*
    说明：设置出生年代点击事件
  */
  onProfileTap: function () {

    util.pageNavigate('/pages/mine/profile/profile');
  },

  /*
    说明：用户资料点击事件
  */
  onHeaderTap: function(){

    util.pageNavigate('/pages/mine/profile/profile');
  },

  /*
    说明： 每日签到事件
  */
  onSignInTap: function(){

    var _this = this;

    if (this.data.signined > 0) {
      util.pageToast('今日已签到');
    } else {
      api.mine.signIn(function(data){

        if (data.coins) {
          util.pageToast('+' + data.coins + ' 金币');
          store.client = null;  //  强制刷新用户信息
          _this.onProfileLoad();
        }
      });
    }
  },

  /*
    说明： 金币点击事件
  */
  onCoinsTap: function(){

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