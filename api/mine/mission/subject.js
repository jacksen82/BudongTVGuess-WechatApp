//  client/mission/question.js

const ajax = require('../../ajax.js');


/*
  说明：获取题目详细信息
*/
const detail = function (subjectId, callback) {

  ajax.post('/client/mission/subject/detail.ashx', {
    subjectId: subjectId
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
  说明：添加新题目
*/
const add = function(missionId, title, tip, categoryId, recordFileName, callback, fail){

  ajax.upload('/client/mission/subject/add.ashx', {
    missionId: missionId,
    title: title,
    tip: tip,
    categoryId: categoryId
  }, 'mp3file', recordFileName, function (data) {

    if (data.code == 0) {
      callback(data.data)
    } else {
      wx.showToast({
        title: data.message,
      })
      fail && fail();
    }
  }, fail)
}

/*
  说明：修改题目信息
*/
const edit = function (missionId, subjectId, title, tip, categoryId, callback){

  ajax.post('/client/mission/subject/edit.ashx', {
    missionId: missionId, 
    subjectId: subjectId,
    title: title,
    tip: tip,
    categoryId: categoryId
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
  说明：删除题目
*/
const _delete = function (subjectId, callback){

  ajax.post('/client/mission/subject/delete.ashx', {
    subjectId: subjectId
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
  detail: detail,
  add: add,
  edit: edit,
  _delete: _delete
}
