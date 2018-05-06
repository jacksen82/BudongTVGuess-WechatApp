//  client/mission/question.js

const consts = require('../../../utils/consts.js');
const util = require('../../../utils/util.js');
const store = require('../../../utils/store.js');
const ajax = require('../../ajax.js');

/*
  说明：获取题目详细信息
*/
const detail = function (subjectId, callback) {

  ajax.post('/client/mission/subject/detail.ashx', {
    subjectId: subjectId || 0
  }, function (data) {

    if (data.code == 0) {
      callback && callback(data.data)
    } else {
      util.pageToast(data.message || '发生未知错误');
    }
  })
}

/*
  说明：添加新题目
*/
const add = function(missionId, title, tip, categoryId, recordFileName, callback){

  ajax.upload('/client/mission/subject/add.ashx', {
    missionId: missionId || 0,
    title: title || '',
    tip: tip || '',
    categoryId: categoryId || 0
  }, 'mp3file', recordFileName, function (data) {

    if (data.code == 0) {
      callback && callback(data.data)
    } else {
      util.pageToast(data.message || '发生未知错误');
    }
  })
}

/*
  说明：修改题目信息
*/
const edit = function (missionId, subjectId, title, tip, categoryId, callback){

  ajax.post('/client/mission/subject/edit.ashx', {
    missionId: missionId || 0, 
    subjectId: subjectId || 0,
    title: title || '',
    tip: tip || '',
    categoryId: categoryId || 0
  }, function (data) {

    if (data.code == 0) {
      callback && callback(data.data)
    } else {
      util.pageToast(data.message || '发生未知错误');
      }
  }, true)
}

/*
  说明：删除题目
*/
const _delete = function (subjectId, callback){

  ajax.post('/client/mission/subject/delete.ashx', {
    subjectId: subjectId || 0
  }, function (data) {

    if (data.code == 0) {
      callback && callback(data.data)
    } else {
      util.pageToast(data.message || '发生未知错误');
      }
  }, true)
}

module.exports = {
  detail: detail,
  add: add,
  edit: edit,
  _delete: _delete
}
