// pages/mine/mission/edit/edit.js

const app = getApp()
const util = require('../../../../utils/util.js')
const store = require('../../../../utils/store.js')
const api = require('../../../../api/index.js')
const ctx = wx.createCanvasContext('logoCanvas')

Page({

  /*
    说明：页面的初始数据
  */
  data: {
    missionId: 0,
    title: '',
    logoUrl: '',
    logoFileName: ''
  },

  /*
    说明：页面加载事件
  */
  onLoad: function (options) {

    util.pageShareMenu();
    util.pageSetData(this, 'missionId', options.missionId);
    util.pageSetData(this, 'title', options.title);
    util.pageSetData(this, 'logoUrl', options.logoUrl);
  },

  /*
    说明：更换封面图片事件
  */
  onLogoTap: function(){

    var _this = this;
    var _zoom = 1;
    var _offset = 0;

    wx.chooseImage({
      count: 1,
      success: function(res) {

        _this.setData({
          'logoUrl': res.tempFilePaths[0],
          'logoFileName': res.tempFilePaths[0]
        });
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success: function(__res){

            if (__res.width > __res.height){
              _zoom = 480 / __res.height;
              _offset = Math.floor((__res.width - __res.height) / 2 * _zoom);
              ctx.drawImage(res.tempFilePaths[0], -_offset, 0, __res.width * _zoom, 480);
            } else {
              _zoom = 480 / __res.width;
              _offset = Math.floor((__res.height - __res.width) / 2 * _zoom);
              ctx.drawImage(res.tempFilePaths[0], 0, -_offset, 480, __res.height * _zoom);
            }
            ctx.draw();
          }
        })
      },
    })
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

    var _this = this;

    if (!this.data.title) {
      util.pageToast('名称不能为空');
    } else {
      if (this.data.logoFileName){
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 480,
          height: 480,
          destWidth: 480,
          destHeight: 480,
          canvasId: 'logoCanvas',
          success: function (res) {

            api.mine.mission.edit(_this.data.missionId, _this.data.title, res.tempFilePath, function (data) {

              store.client = null;  //  强制刷新用户信息
              util.pageNavigate('back');
            });
          }
        })
      } else {
        api.mine.mission.edit(this.data.missionId, this.data.title, '', function (data) {

          store.client = null;  //  强制刷新用户信息
          util.pageNavigate('back');
        });
      }
    }
  },

  /*
    说明：分享回调事件
  */
  onShareAppMessage: function (res) {

    return api.wechat.getShareMessage()
  }
})
