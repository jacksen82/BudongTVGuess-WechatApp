// pages/mine/mission/question/add/add.js

const app = getApp()
const consts = require('../../../../../utils/consts.js')
const util = require('../../../../../utils/util.js')
const player = require('../../../../../utils/player.js')
const store = require('../../../../../utils/store.js')
const api = require('../../../../../api/index.js')

Page({

  /*
    说明：页面的初始数据
  */
  data: {
    missionId: 0,
    subjectId: 0,
    playing: false,
    playlength: '00:00',
    mp3Url: '',
    title: '',
    titleFocus: false,
    tip: '',
    tipFocus: false,
    categoryId: 0,
    categoryIndex: 0,
    categoryItems: []
  },

  /*
    说明：页面加载事件
  */
  onLoad: function (options) {

    util.pageShareMenu();
    this.setData({
      subjectId: options.subjectId,
      categoryItems: consts.DATA_CATEGORYS
    });
  },

  /*
    说明：页面显示事件
  */
  onShow: function(){

    this.onLoadDetail();
  },

  /*
    说明：页面卸载事件
  */
  onUnload: function () {

    player.stop();
  },

  /*
    说明：页面题目详情加载事件
  */
  onLoadDetail: function () {

    var _this = this;

    api.mine.mission.subject.detail(this.data.subjectId, function (data) {

      _this.setData({
        missionId: data.missionId || 0,
        title: data.title,
        tip: data.tip,
        categoryId: data.categoryId,
        categoryIndex: (parseInt(data.categoryId, 10) - 101),
        mp3Url: data.mp3Url
      })
      player.init(_this);
    });
  },

  /*
    说明：播放音频事件
  */
  onPlayerTap: function(){

    player.playOrStop(consts.HTTP_CDN + this.data.mp3Url);
  },

  /*
    说明：选择题目分类事件
  */
  onCategoryChange: function (e) {

    var changeIndex = e.detail.value || -1;

    this.data.categoryItems = this.data.categoryItems || [];

    if (changeIndex > -1 && changeIndex < this.data.categoryItems.length) {
      this.setData({
        categoryIndex: changeIndex
      });
    }
  },

  /*
    说明： 题目答案输入事件
  */
  onTitleInput: function (e) {

    this.setData({
      title: e.detail.value || ''
    })
  },

  /*
    说明： 点击键盘下一项事件
  */
  onTitleNext: function () {

    this.setData({
      titleFocus: false,
      tipFocus: true
    })
  },

  /*
    说明： 答案提示输入事件
  */
  onTipInput: function (e) {

    this.setData({
      tip: e.detail.value || ''
    })
  },

  /*
    说明： 保存题目事件
  */
  onSubjectEditTap: function () {

    var _this = this;

    this.setData({
      titleFocus: false,
      tipFocus: false
    })

    if (!this.data.title) {

      util.pageSetData(this, 'titleFocus', true);
      util.pageToast('答案不能为空');
    } else if (!this.data.tip) {
      util.pageSetData(this, 'tipFocus', true);
      util.pageToast('提示不能为空');
    } else {
      api.mine.mission.subject.edit(
        this.data.missionId,
        this.data.subjectId,
        this.data.title,
        this.data.tip,
        (101 + parseInt(this.data.categoryIndex)), function (data) {

          util.pageNavigate('back');
        })
    }
  },

  /*
    说明：删除题目事件
  */
  onSubjectDeleteTap: function(){

    var _this = this;

    wx.showModal({
      title: '操作提示',
      content: '确定要删除这个题目吗？',
      success: function (res) {

        if (res.confirm) {
          api.mine.mission.subject._delete(_this.data.subjectId, function (data) {

            wx.navigateBack({});
          });
        }
      }
    })
  },

  /*
    说明：分享回调事件
  */
  onShareAppMessage: function (res) {

    return api.wechat.getShareMessage()
  }

})