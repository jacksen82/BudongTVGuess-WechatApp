// pages/pdd/index.js
Page({

  /* 
    说明：页面数据集合
  */
  data: {

  },

  /*
    说明：预览海报事件
  */
  onPreview: function(){

    wx.previewImage({
      urls: ['https://wechat.duomijuan.com/guess/statics/qrcode_pdd.jpg'],
    })
  },

  /*
    说明：分享回调事件
  */
  onShareAppMessage: function (res) {

    return client.shareAppMessage(res, {}, function () { });
  }
})