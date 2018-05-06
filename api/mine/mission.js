//  client/mission.js

const consts = require('../../utils/consts.js');
const util = require('../../utils/util.js');
const store = require('../../utils/store.js');
const ajax = require('../ajax.js');
const subject = require('./mission/subject.js');

/*
  说明：获取用户创建的所有关卡
*/
const list = function (callback) {

  ajax.post('/client/mission/list.ashx', { }, function(data){

    if (data.code == 0) {
      callback && callback(data.data)
    } else {
      util.pageToast(data.message || '发生未知错误');
    }
  })
}

/*
  说明：获取关卡详细信息
*/
const detail = function (missionId, callback){

  ajax.post('/client/mission/detail.ashx', {
    missionId: missionId || 0
  }, function (data) {

    if (data.code == 0) {
      callback && callback(data.data)
    } else {
      util.pageToast(data.message || '发生未知错误');
    }
  })
}

/*
  说明：创建新关卡
*/
const create = function (title, callback) {

  ajax.post('/client/mission/create.ashx', {
    title: title || ''
  }, function (data) {
    
    if (data.code == 0) {
      callback && callback(data.data)
    } else {
      util.pageToast(data.message || '发生未知错误');
    }
  }, true)
}

/*
  说明：修改关卡标题
*/
const edit = function (missionId, title, logoFileName, callback){

  if (logoFileName){
    ajax.upload('/client/mission/edit.ashx', {
      missionId: missionId || 0,
      title: title || ''
    }, 'logofile', logoFileName, function (data) {

      if (data.code == 0) {
        callback && callback(data.data)
      } else {
        util.pageToast(data.message || '发生未知错误');
      }
    })
  } else {
    ajax.post('/client/mission/edit.ashx', {
      missionId: missionId || 0,
      title: title || ''
    }, function (data) {

      if (data.code == 0) {
        callback && callback(data.data)
      } else {
        util.pageToast(data.message || '发生未知错误');
      }
    }, true)
  }
}

/*
  说明：删除关卡
*/
const _delete = function (missionId, callback) {

  ajax.post('/client/mission/delete.ashx', {
    missionId: missionId || 0
  }, function (data) {

    if (data.code == 0) {
      callback && callback(data.data)
    } else {
      util.pageToast(data.message || '发生未知错误');
    }
  }, true)
}

module.exports = {
  list: list,
  detail: detail,
  create: create,
  edit: edit,
  _delete: _delete,
  subject: subject
}
