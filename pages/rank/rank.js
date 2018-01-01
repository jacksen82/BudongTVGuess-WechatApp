//  index.js

const app = getApp();
const util = require('../../utils/util.js');
const bus = require('../../utils/bus.js');
const api = require('../../services/api.js');

Page({
  data: {
    friendItems: [
      {
        avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoKCDCechH5uxuWbUfdt7EMqbKXIU3ArrhXD2mKNzOQiaZzJlZ2SG8CE0GmCvnbos93rSic11RJoOEg/0',
        nick: '申栩',
        subjectCount: 31,
        time: '01:24:30',
        isSelf: false
      },
      {
        avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoKCDCechH5uxuWbUfdt7EMqbKXIU3ArrhXD2mKNzOQiaZzJlZ2SG8CE0GmCvnbos93rSic11RJoOEg/0',
        nick: '申兆淇',
        subjectCount: 28,
        time: '01:32:05',
        isSelf: false
      },
      {
        avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoKCDCechH5uxuWbUfdt7EMqbKXIU3ArrhXD2mKNzOQiaZzJlZ2SG8CE0GmCvnbos93rSic11RJoOEg/0',
        nick: '申兆淇',
        subjectCount: 28,
        time: '01:32:05',
        isSelf: false
      },
      {
        avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoKCDCechH5uxuWbUfdt7EMqbKXIU3ArrhXD2mKNzOQiaZzJlZ2SG8CE0GmCvnbos93rSic11RJoOEg/0',
        nick: '胡瓦爱',
        subjectCount: 28,
        time: '01:32:05',
        isSelf: false
      },
      {
        avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoKCDCechH5uxuWbUfdt7EMqbKXIU3ArrhXD2mKNzOQiaZzJlZ2SG8CE0GmCvnbos93rSic11RJoOEg/0',
        nick: '沈双庆',
        subjectCount: 28,
        time: '01:32:05',
        isSelf: true
      }
    ]
  },
  onLoad: function () {

  },
  onForward: function(){

    console.log(getCurrentPages());
    wx.navigateBack({
      delta: -2
    });
  },
  onShareAppMessage: function (res) {

    var _this = this;

    return api.wechat.share('rank', res, function (data) {
      _this.selectComponent('#toast').show('+100', 'add');
    });
  }
})
