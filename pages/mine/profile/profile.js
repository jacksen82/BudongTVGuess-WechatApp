// pages/mine/profile/profile.js

const app = getApp()
const util = require('../../../utils/util.js')
const store = require('../../../utils/store.js')
const api = require('../../../api/index.js')

Page({

  /*
    说明：页面的初始数据
  */
  data: {
    birthyear: 0,
    birthyearMax: 2010,
    birthyearMin: 1949,
    birthyearDefault: 1980,
    birthyearIndex: 0,
    birthyearItems: []
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

    this.onLoadBirthyear();
  },

  /*
    说明：页面出生年份加载事件
  */
  onLoadBirthyear: function(){

    for (let i = this.data.birthyearMax; i > this.data.birthyearMin; i--) {
      this.data.birthyearItems.push(i + '年');
      i == store.client.birthyear && (this.data.birthyearIndex = this.data.birthyearMax - i);
    }
    if (!store.client.birthyear) {
      this.data.birthyearIndex = this.data.birthyearMax - this.data.birthyearDefault
    }
    this.setData({
      birthyear: store.client.birthyear,
      birthyearItems: this.data.birthyearItems,
      birthyearIndex: this.data.birthyearIndex
    });
  },

  /*
    说明：选择出生年份事件
  */
  onBirthyearChange: function(e){

    var changeIndex = e.detail.value || -1;

    this.data.birthyearItems = this.data.birthyearItems || [];

    if (changeIndex > -1 && changeIndex < this.data.birthyearItems.length){
      this.setData({
        birthyear: parseInt(this.data.birthyearItems[changeIndex]),
        birthyearIndex: changeIndex
      });
    }
  },

  /*
    说明：保存个人资料事件
  */
  onProfileChange: function(){

    api.mine.updateBirthyear(this.data.birthyear, function(data){

      store.client = data || {};
      util.pageToast('修改成功');
      util.pageNavigate('back');
    });
  },

  /*
    说明：分享回调事件
  */
  onShareAppMessage: function (res) {

    return api.wechat.getShareMessage()
  }
})