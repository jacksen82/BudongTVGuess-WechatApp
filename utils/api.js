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
    }
  }
};

module.exports = api
