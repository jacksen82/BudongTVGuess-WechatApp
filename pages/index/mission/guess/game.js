// pages/index/mission/guess/game.js

const util = require('../../../../utils/util.js')
const store = require('../../../../utils/store.js')
const api = require('../../../../api/index.js')

/*
  说明：启动定时器
*/
var timer;
var seconds = 0;
var subject;
var interval = function(game){

  timer && clearInterval(timer);
  timer = setInterval(function () {

    seconds += 1;
    game.page.setData({
      timeSpan: util.durationToTimeSpan(seconds) 
    })
  }, 1000);
};

/*
  说明：清除定时器
*/
var intervalClear = function(){

  timer && clearInterval(timer);
};

/*
  说明：显示提示
*/
var showtip = function(game, tip){

  wx.showModal({
    title: '答案提示',
    showCancel: false,
    content: tip || '没有提供任何提示',
    confirmText: '知道了',
    success: function () {

      game.page.setData({ balance: game.page.data.balance - 30 })
      interval(game);
      store.client.balance = game.page.data.balance;
      util.pageToast(' -30 金币')
    }
  })
};

/*
  说明：获取题目
*/
var getSubject = function (subjects, index) {

  subjects = subjects || [];
  if (index >= 0 && index < subjects.length) {
    return subjects[index];
  }
  return {};
};

/*
  说明：回答正确
*/
var correct = function (game){

  wx.showModal({
    title: '答题结果',
    showCancel: false,
    content: '恭喜！答对了',
    confirmText: '下一题',
    success: function (res) {

      if (res.confirm) {
        game.page.setData({ subjectIndex: game.subjectIndex + 1 });
        game.subjectIndex++;
        game.next();
      }
    }
  });
};

/*
  说明：回答错误
*/
var wrong = function(game){

  wx.showModal({
    title: '答题结果',
    content: '很遗憾！答错了',
    confirmText: '再试试',
    cancelText: '放弃',
    success: function (res) {

      interval(game);
      util.pageSetData(game.page, 'subjectAnswer', '');
      (res.cancel) && util.pageNavigate('back');
    }
  })
};

module.exports = {
  page: null,
  player: null,
  seconds: 0,
  subject: null,
  subjectIndex: 0,
  subjectItems: [],
  init: function (page, player, data) {

    this.page = page;
    this.player = player;
    this.subjectIndex = (page.data.subjectIndex || 1) - 1;
    this.subjectItems = data.subjects || [];

    util.pageSetTitle(data.title);
  }, 
  next: function(){

    seconds = 0;
    subject = getSubject(this.subjectItems, this.subjectIndex);
    interval(this);

    this.page.setData({
      timeSpan: '00:00',
      subjectTitle: subject.title,
      subjectCategory: util.categoryIdToName(subject.categoryId),
      subjectTiped: false,
      subjectAnswer: ''
    });
    this.player.play(store.domain + subject.mp3Url);
  },
  tip: function () {

    var _this = this;

    intervalClear();
    api.mission.game.tip(subject.id, function(data){

      showtip(_this, subject.tip);
    })
  },
  skip: function(){

    var _this = this;

    if (this.subjectIndex >= this.subjectItems.length - 1){
      util.pageToast('已到最后一题')
    } else if (this.subjectIndex < 0){
      util.pageToast('题目不存在')
    } else {
      api.mission.game.skip(subject.id, seconds, function (data) {

        _this.subjectIndex++;
        _this.page.setData({ balance: _this.page.data.balance - 30 });
        _this.page.setData({ subjectIndex: _this.subjectIndex + 1 });
        _this.next();
        util.pageToast(' -30 金币')
        store.client.balance = _this.page.data.balance;
      });
    }
  },
  replay: function(){

    var _this = this;

    api.mission.game.replay(subject.id, function (data) {

      _this.player.play(store.domain + subject.mp3Url);
      _this.page.setData({ balance: _this.page.data.balance - 10 })
      util.pageToast(' -10 金币');
      store.client.balance = _this.page.data.balance;
    });
  },
  answer: function(){

    var _this = this;

    intervalClear();

    this.player.stop();
    this.page.data.subjectAnswer = (this.page.data.subjectAnswer || '').trim()
    if (this.page.data.subjectAnswer) {
      if (this.page.data.subjectAnswer == subject.title) {
        api.mission.game.answer(subject.id, seconds, function(data){

          if (_this.subjectIndex >= _this.subjectItems.length - 1) {
            util.pageNavigate('/pages/index/mission/rank/rank?missionId=' + _this.page.data.missionId, true)
          } else {
            correct(_this);
          }
        });
      } else {
        wrong(_this);
      }
    } else {
      util.pageToast('答案不能为空')
    }
  }
}