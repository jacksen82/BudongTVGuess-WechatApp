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

        if (res.tempFilePaths && res.tempFilePaths.length > 0){
          _this.onLogoRepaint(res.tempFilePaths[0]);
        }else {
          util.pageToast('图片无效');
        }
      },
    })
  },

  /*
    说明：重新绘制封面事件
  */
  onLogoRepaint: function(path){

    var _this = this; 
    var _zoom = 1, _offset = 0;

    wx.getImageInfo({
      src: path,
      success: function (res) {

        if (res.width > res.height) {
          _zoom = 288 / res.height;
          _offset = Math.floor((res.width - res.height) / 2 * _zoom);
          ctx.drawImage(res.path, -_offset, 0, res.width * _zoom, 288);
        } else {
          _zoom = 288 / res.width;
          _offset = Math.floor((res.height - res.width) / 2 * _zoom);
          ctx.drawImage(res.path, 0, -_offset, 288, res.height * _zoom);
        }
        ctx.draw();
        setTimeout(function(){

          _this.onLogoPreview();
        }, 100);
      }
    })
  },

  /*
    说明：预览封面事件
  */
  onLogoPreview: function(){

    var _this = this; 
    
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 288,
      height: 288,
      destWidth: 288,
      destHeight: 288,
      quality: 0.8,
      canvasId: 'logoCanvas',
      success: function (res) {

        _this.setData({
          'logoUrl': res.tempFilePath,
          'logoFileName': res.tempFilePath
        });
      },
      fail: function (res) {

        util.pageToast('图片无效');
      }
    });
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
        api.mine.mission.edit(_this.data.missionId, _this.data.title, this.data.logoFileName, function (data) {

          store.client = null;  //  强制刷新用户信息
          util.pageNavigate('back');
        });
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
