//  index.js

const app = getApp();
const api = require("../../utils/api.js");

Page({
  data: {
    setting: false
  },
  onLoad: function () {

    this.authorize();
  },
  onShow: function(){

    wx.showShareMenu({
      withShareTicket: true
    });
  },
  onShareAppMessage: function(res){

    //  获取分享群信息回调
    var getShareInfoSuccess = function(res){

      api.user.share({
        "shareTicketData": (res || {}).encryptedData || "",
        "shareTicketIV": (res || {}).iv || ""
      }, function(data){

      });
    };

    //  分享成功回调
    var shareSuccess = function(res){

      if (res.shareTickets && res.shareTickets.length) {
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: getShareInfoSuccess
        });
      } else {
        getShareInfoSuccess(null);
      }
    };

    return {
      title: "这么多年才发现，原来这段音乐是这个电视剧的",
      imageUrl: "",
      path: "/pages/index/index?fromClientId=" + (app.globalData.clientInfo || {}).id || 0,
      success: shareSuccess,
      fail: function (res) {
        
        wx.showToast({
          title: '分享失败',
        })
      }
    }
  },
  start: function(){
  
    wx.navigateTo({ url: "../level/level" });
  },
  rank: function(){

    wx.navigateTo({ url: "../rank/rank" });
  },
  authorize: function(){

    var self = this;
    var queries = { };

    //  获取用户资料失败回调
    var getUserInfoFail = function(res){

      if (self.data.setting) {
        wx.showToast({
          title: "授权失败",
        });
      } else {
        self.setData({
          "setting": true
        });
        wx.openSetting({
          success: getUserInfo,
          fail: getUserInfo
        });
      }
    };

    //  获取用户资料成功回调
    var getUserInfoSuccess = function(res){

      queries.encryptedData = res.encryptedData || "";
      queries.iv = res.iv || "";
      queries.fromClientId = app.globalData.launchInfo.fromClientId || 0;
      queries.scene = app.globalData.launchInfo.scene || 0;
      queries.shareTicketData = app.globalData.launchInfo.shareTicketData || "";
      queries.shareTicketIV = app.globalData.launchInfo.shareTicketIV || "";

      api.user.login(queries, function (data) {

        wx.setStorage({
          key: "sessionCode",
          data: data.sessionCode
        });
        app.globalData.clientInfo = data;
        wx.navigateTo({ url: "../level/level" });
      });
    };

    //  登录成功回调
    var loginSuccess = function(res){

      queries.code = res.code || "";
      
      wx.getUserInfo({
        withCredentials: true,
        success: getUserInfoSuccess,
        fail: getUserInfoFail
      });
    };

    //  本地存储成功回调
    var storageSuccess = function (res){

      //  获取验证票
      api.user.ticket({
        "sessionCode": res.data,
        "fromClientId": app.globalData.launchInfo.fromClientId || 0,
        "scene": app.globalData.launchInfo.scene || 0,
        "shareTicketData": app.globalData.launchInfo.shareTicketData || "",
        "shareTicketIV": app.globalData.launchInfo.shareTicketIV || ""
      }, function (data) {

        app.globalData.clientInfo = data;
        wx.navigateTo({ url: "../level/level" });
      });
    };

    //  session 无效回调方法
    var checkSessionFail = function () {
      
      wx.login({
        success: loginSuccess,
        fail: function (res) { }
      });
    };

    //  session 有效回调方法
    var checkSessionSuccess = function(){

      wx.getStorage({
        key: 'sessionCode',
        success: storageSuccess,
        fail: checkSessionFail
      });
    };

    //  检查 session 有效性
    wx.checkSession({
      success: checkSessionSuccess,
      fail: checkSessionFail
    });
  }
})
