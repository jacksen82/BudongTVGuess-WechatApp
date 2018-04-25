//  client/mission.js

const ajax = require('../ajax.js');
const subject = require('./mission/subject.js');

/*
  说明：获取用户创建的所有关卡
*/
const list = function (callback) {

  ajax.post('/client/mission/list.ashx', {
  }, function(data){

    if (data.code == 0) {
      callback(data.data)
    } else {
      wx.showToast({
        title: data.message,
      })
    }
  }, null)
}

/*
  说明：获取关卡详细信息
*/
const detail = function (missionId, callback){

  ajax.post('/client/mission/detail.ashx', {
    missionId: missionId
  }, function (data) {

    if (data.code == 0) {
      callback(data.data)
    } else {
      wx.showToast({
        title: data.message,
      })
    }
  }, null)
}

/*
  说明：获取关卡详细信息
*/
const qrcode = function (missionId, callback) {

  ajax.post('/client/mission/qrcode.ashx', {
    missionId: missionId
  }, function (data) {

    if (data.code == 0) {
      callback(data.data)
    } else {
      wx.showToast({
        title: data.message,
      })
    }
  }, null)
}

/*
  说明：创建新关卡
*/
const create = function (title, callback) {

  ajax.post('/client/mission/create.ashx', {
    title: title
  }, function (data) {
    
    if (data.code == 0) {
      callback(data.data)
    } else {
      wx.showToast({
        title: data.message,
      })
    }
  }, null, true)
}

/*
  说明：修改关卡标题
*/
const edit = function(missionId, title, callback){

  ajax.post('/client/mission/edit.ashx', {
    missionId: missionId,
    title: title
  }, function (data) {

      if (data.code == 0) {
        callback(data.data)
      } else {
        wx.showToast({
          title: data.message,
        })
      }
    }, null, true)
}

/*
  说明：删除关卡
*/
const _delete = function (missionId, callback) {

  ajax.post('/client/mission/delete.ashx', {
    missionId: missionId
  }, function (data) {

      if (data.code == 0) {
        callback(data.data)
      } else {
        wx.showToast({
          title: data.message,
        })
      }
    }, null, true)
}

module.exports = {
  list: list,
  detail: detail,
  qrcode: qrcode,
  create: create,
  edit: edit,
  _delete: _delete,
  subject: subject
}
