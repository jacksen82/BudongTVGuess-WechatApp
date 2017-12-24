const app = getApp();
const host = "http://api.shenxu.name/tvguess/api";
const header = { "content-type": "application/json" };
const extend = function(data){

  data.sessionCode = (app.globalData.clientInfo || {}).sessionCode || "";
  return data;
};
const api = {
  user: {
    login: function (data, success) {

      wx.request({
        url: host + "/client/login.ashx",
        data: data,
        header: header,
        success: function (data) {

          data = data.data || {};
          if (data.code == 0) {
            success && success(data.data || {});
          } else {
            wx.showToast({
              title: data.message,
            })
          }
        },
        fail: function (res) {

          wx.showToast({
            title: res,
          })
        }
      });
    },
    ticket: function(data, success){

      wx.request({
        url: host + "/client/ticket.ashx",
        data: data,
        header: header,
        success: function (data) {

          data = data.data || {};
          if (data.code == 0){
            success && success(data.data || {});
          } else {
            wx.showToast({
              title: data.message,
            })
          }
        },
        fail: function (res) {

          wx.showToast({
            title: res,
          })
        }
      });
    },
    share: function(data, success){

      wx.request({
        url: host + "/client/share.ashx",
        data: extend(data),
        header: header,
        success: function (data) {

          data = data.data || {};
          if (data.code == 0) {
            success && success(data.data || {});
          } else {
            wx.showToast({
              title: data.message,
            })
          }
        },
        fail: function (res) {

          wx.showToast({
            title: res,
          })
        }
      });
    }
  },
  level: {
    all: function(data, success){

      wx.request({
        url: host + "/level/all.ashx",
        data: extend(data),
        header: header,
        success: function (data) {

          data = data.data || {};
          if (data.code == 0) {
            success && success(data.data || {});
          }
        }
      });
    },
    unlock: function(data, success){

      success && success({
        
      });
    }
  },
  program: {
    next: function (data, success) {

      success && success({
        id: 222,
        title: "新白娘子传奇",
        chars: "新白娘子传奇渴望封神榜西游记家有仙妻包青天粉红女郎孽债莲花争霸水",
        mp3Url: "http://zhangmenshiting.qianqian.com/data2/music/aafe004ff910d14c330408952aefe23a/542051034/542051034.mp3?xcode=fd3a27cec285b2f9b4504f1dc3711450"
      });
    }
  }
};

module.exports = api
