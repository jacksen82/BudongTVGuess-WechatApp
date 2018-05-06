// pages/mine/mission/question/add/add.js

const app = getApp()
const consts = require('../../../../../utils/consts.js')
const util = require('../../../../../utils/util.js')
const player = require('../../../../../utils/player.js')
const recorder = require('../../../../../utils/recorder.js')
const store = require('../../../../../utils/store.js')
const api = require('../../../../../api/index.js')


Page({

  /*
    说明：页面的初始数据
  */
  data: {
    missionId: 0,
    playing: false,
    recorded: false,
    recording: false,
    recordlength: '00:00',
    recordFileName: '',
    recordUploading: false,
    title: '',
    titleFocus: false,
    tip: '',
    tipFocus: false,
    categoryIndex: -1,
    categoryItems: []
  },

  /*
    说明：页面加载事件
  */
  onLoad: function (options) {

    var _this = this;

    util.pageShareMenu();
    util.pageSetData(this, 'missionId', options.missionId || 0);
    util.pageSetData(this, 'categoryItems', consts.DATA_CATEGORYS);

    player.init(_this);
    recorder.init(_this);
  },

  /*
    说明：开始录音事件
  */
  onRecorderTap: function () {

    if (!this.data.playing) {
      if (this.data.recording) {
        recorder.stop();
      } else {
        recorder.start(15000);
      }
    }
  },

  /*
    说明：播放录音事件
  */
  onPlayerTap: function () {

    if (this.data.recorded && !this.data.recording) {
      player.playOrStop(this.data.recordFileName);
    }
  },

  /*
    说明： 选择题目分类事件
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
  onSubjectAddTap: function () {

    var _this = this;
    
    this.setData({
      titleFocus: false,
      tipFocus: false
    })

    if (this.data.categoryIndex == -1) {
      util.pageToast('请选择分类');
    } else if (!this.data.title) {
      util.pageSetData(this, 'titleFocus', true);
      util.pageToast('答案不能为空');
    } else if (!this.data.tip) {
      util.pageSetData(this, 'tipFocus', true);
      util.pageToast('提示不能为空');
    } else if (!this.data.recorded) {
      util.pageToast('音频不能为空');
    } else {
      api.mine.mission.subject.add(
        this.data.missionId,
        this.data.title,
        this.data.tip,
        (101 + parseInt(this.data.categoryIndex, 10)),
        this.data.recordFileName, function (data) {
          
          util.pageNavigate('back');
        })
    }
  },

  /*
    说明：分享回调事件
  */
  onShareAppMessage: function (res) {

    return api.wechat.getShareMessage()
  }

})