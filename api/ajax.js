//  client.js

const store = require('../utils/store.js');

/*
  说明：操作结果代码常量
*/
const CODE_TYPE = {
  SESSION_NULL: 101,
  SESSION_EXPIRE: 102,
  LOGIN_FAIL:111
}

/*
  说明：操作结果
*/
const result = function (code, message) {

  return {
    code: code,
    message: message
  }
}

/*
  说明：请求失败方法
*/
const error = function (callback, data) {

  wx.hideLoading();
  if (callback) {
    callback(data);
  } else {
    wx.showToast({
      title: data.message || '请求失败'
    })
  }
}

/*
  说明：POST 请求方法
*/
const post = function (url, data, callback, fail, loading) {
  
  if (!store[url]){
    store[url] = true;
    (loading == true) && wx.showLoading();
    wx.request({
      url: 'https://shenxu.name/wechat_app/api' + url,
      data: Object.assign({ app3rdId: 2, session3rd: store.session3rd }, data),
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (data) {

        wx.hideLoading();
        store[url] = false;
        data.data.url = url;
        callback && callback(data.data || {})
      },
      fail: function (res) {

        store[url] = false;
        error(fail, { message: '请求失败' })
      }
    });
  }
}

/*
  说明：UPLOAD 请求方法
*/
const upload = function (url, data, fileName, tempFilePath, callback, fail) {

  if (!store[url]) {
    store[url] = true;
    wx.uploadFile({
      url: 'https://shenxu.name/wechat_app/api' + url,
      filePath: tempFilePath,
      name: fileName,
      formData: Object.assign({ app3rdId: 2, session3rd: store.session3rd }, data),
      success: function (data) {
        
        wx.hideLoading();
        store[url] = false;
        data = JSON.parse(data.data) || {};
        data.url = url;
        callback && callback(data || {})
      },
      fail: function (res) {

        store[url] = false;
        error(fail, { message: '上传失败' })
      }
    }).onProgressUpdate(function (res) {

      wx.showLoading({
        title: '已上传' + res.progress
      });
    })
  }
}

module.exports = {
  CODE_TYPE: CODE_TYPE,
  result: result,
  post: post,
  upload: upload
}
