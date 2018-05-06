//  client.js

const consts = require('../utils/consts.js');
const store = require('../utils/store.js');

/*
  说明：POST 请求方法
*/
const post = function (url, data, callback, loading) {
  
  //  如果正在请求，则跳出
  if (consts.AJAX_URL_STATE[url] == true) return;

  //  设置正在请求中..
  consts.AJAX_URL_STATE[url] = true;

  //  如果需要则显示正在加载
  (loading == true) && wx.showLoading();

  let beginTime =  new Date().getTime();

  //  发起请求
  wx.request({
    url: consts.HTTP_API + url,
    data: Object.assign({
      scene: consts.APP_SCENE,
      app3rdId: consts.APP_3RD_ID, 
      session3rd: consts.APP_3RD_SESSION
    }, data),
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded' 
    },
    success: function (data) {
      
      callback && callback(data.data || { code: consts.AJAX_CODE_TYPE.UNKONOW, message: '发生未知错误'});
    },
    fail: function (res) {

      callback && callback({ code: consts.AJAX_CODE_TYPE.UNKONOW, message: res || '发生未知错误' });
    },
    complete: function(res){

      (loading == true) && wx.hideLoading();
      consts.AJAX_URL_STATE[url] = false;
    }
  });
}

/*
  说明：UPLOAD 请求方法
*/
const upload = function (url, data, fileName, tempFilePath, callback) {

  //  如果正在请求，则跳出
  if (consts.AJAX_URL_STATE[url] == true) return;

  //  设置正在请求中..
  consts.AJAX_URL_STATE[url] = true;

  //  开始上传
  wx.uploadFile({
    url: consts.HTTP_API + url,
    filePath: tempFilePath,
    name: fileName,
    formData: Object.assign({
      scene: consts.APP_SCENE,
      app3rdId: consts.APP_3RD_ID,
      session3rd: consts.APP_3RD_SESSION
    }, data),
    success: function (data) {
      
      callback && callback((JSON.parse(data.data) || {}) || { code: consts.AJAX_CODE_TYPE.UNKONOW, message: '发生未知错误' });
    },
    fail: function (res) {

      callback && callback({ code: consts.AJAX_CODE_TYPE.UNKONOW, message: res || '上传失败' });
    },
    complete: function(){

      wx.hideLoading();
      consts.AJAX_URL_STATE[url] = false;
    }
  }).onProgressUpdate(function (res) {

    wx.showLoading({
      title: '已上传' + res.progress
    });
  })
}

module.exports = {
  post: post,
  upload: upload
}
