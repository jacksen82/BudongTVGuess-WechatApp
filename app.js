//  app.js

import API from 'utils/api.js';

App({
  onLaunch: function () {

    var self = this;
    
    wx.getSystemInfo({
      success: function(res) {

        self.wxInfo = res;
      }
    });
    API.user.auth({ 'openId': 'cccc22ccc' }, function (res) {

      self.userInfo = res.data;
      console.log(self.userInfo);
    });
  },
  globalData: {
    wxInfo: null,
    userInfo: null
  }
})