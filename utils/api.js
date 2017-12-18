
const api = {
  user: {
    auth: function(data, success){

      wx.request({
        url: 'http://api.shenxu.name/tvguess/api/user/auth.ashx',
        data: data,
        header: { 'content-type': 'application/json' },
        success: function(data){

          success(data.data || {});
        }
      });
    }
  }
};

module.exports = api
