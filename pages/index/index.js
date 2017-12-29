//  index.js

const app = getApp();
const util = require('../../utils/util.js');
const bus = require('../../utils/bus.js');
const api = require('../../services/api.js');

Page({
  data: {
    setting: false,
    startLoading: true,
    startText: '正在启动..'
  },
  onLoad: function () {

    var _this = this;
    
    api.wechat.authorize(function(data){

      _this.setData({ 
        startText: '开 始 游 戏',
        startLoading: false
      });
      util.setNavigate('../level/level');
    });
  },
  onShow: function(){
    
    // wx.showShareMenu({
    //   withShareTicket: true
    // });
  },
  onShareAppMessage: function(res){

    var _this = this;

    if (!this.data.startLoading) {
      return api.wechat.share('这么多年才发现，原来这段音乐是这个电视剧的', '', res, function(data){
        _this.selectComponent('#toast').show('+100', 'add');
      });
    }
    return {};
  },
  start: function(){

    !this.data.startLoading && util.setNavigate('../level/level');
  },
  rank: function(){

    !this.data.startLoading && util.setNavigate('../rank/rank');
  }
})
