// pages/index/mission/guess/game.js

const consts = require('../../../../utils/consts.js')
const util = require('../../../../utils/util.js')
const store = require('../../../../utils/store.js')
const api = require('../../../../api/index.js')

/*
  说明：启动定时器
*/
var timer;
var seconds = 0;
var interval = function(game){

  timer && clearInterval(timer);
  timer = setInterval(function () {

    seconds += 1;
    game.page.setData({
      timeSpan: util.getTimeSpan(seconds) 
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
  说明：获取可选字
*/
var getWords = function (subjects, title, index){

  title = title || '猜';
  subjects = subjects || [];

  var temp = '一天神奇多传侠雨飞侣世家恩怨情仇乐书笑豪江湖争途星';
  var words = [];
  var allwords = [];
  var getOptions = function(word){

    var _options = [];
    var _index = Math.floor(Math.random() * 24);
    var _char = '';
    var _count = 0;

    while (_options.length < 24 && _count < 100){

      _char = allwords[Math.floor(Math.random() * allwords.length)];
      if (_index == _options.length ){
        _options.push(word);
      } else {
        (_options.indexOf(_char) == -1) && (_char != word)&& _options.push(_char);
      }
      _count ++ ;
    }
    return _options;
  };

  //  获取所有可选字集合
  for (var i = 0; i < subjects.length; i++) {
    if (subjects[i].title) {
      for (var j = 0; j < subjects[i].title.length; j++) {
        (allwords.indexOf(subjects[i].title.charAt(j)) == -1) && allwords.push(subjects[i].title.charAt(j));
      }
    }
  }
  for (var i = 0; i < temp.length ; i ++){
    allwords.push(temp.charAt(i));
  }

  //  初始化可选字列表
  for (var i = 0; i < title.length; i++){
    words.push({
      text: '',
      word: title.charAt(i),
      options: getOptions(title.charAt(i))
    });
  }

  return words;
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
        game.subjectIndex++;
        game.page.setData({ subjectIndex: game.subjectIndex + 1 });
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
      console.log(game);
      util.pageSetData(game.page, 'subjectWordIndex', -1);
      util.pageSetData(game.page, 'subjectWords', getWords(game.subjectItems, (game.subject || {}).title));
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
    this.width = wx.getSystemInfoSync().windowWidth;
    this.subjectIndex = (page.data.subjectIndex || 1) - 1;
    this.subjectItems = data.subjects || [];

    util.pageSetTitle(data.title);
  }, 
  next: function(){

    this.subject = getSubject(this.subjectItems, this.subjectIndex);
    this.player.play(consts.HTTP_CDN + this.subject.mp3Url);
    this.page.setData({
      timeSpan: '00:00',
      wordMarginLeft: Math.floor((this.width - (this.subject.title.length * 28) - ((this.subject.title.length + 1) * 2)) / 2),
      optionMarginLeft: Math.floor((this.width - (36 * 6) - (3 * 7)) / 2),
      subjectId: this.subject.id,
      subjectTitle: this.subject.title,
      subjectWordIndex: -1,
      subjectWords: getWords(this.subjectItems, this.subject.title),
      subjectCategory: util.getCategory(this.subject.categoryId),
      subjectTiped: false,
      subjectHelped: false,
      subjectAnswer: ''
    });
    seconds = 0;
    interval(this);
  },
  tip: function () {

    var _this = this;

    api.mission.game.tip(this.subject.id, function(data){

      var _words = _this.page.data.subjectWords || [];

      for (var i = 0; i<_words.length; i++){
        if (_words[i].text != _words[i].word){
          _words[i].text = _words[i].word;
          break;
        }
      }

      util.pageSetData(_this.page, 'balance', _this.page.data.balance - 30);
      util.pageSetData(_this.page, 'subjectWords', _words);
      util.pageToast(' -30 金币');
      store.client.balance = _this.page.data.balance;
      store.missions = null;  //  强制刷新关卡
    })
  },
  skip: function(){

    var _this = this;

    if (this.subjectIndex >= this.subjectItems.length - 1){
      util.pageToast('已到最后一题')
    } else if (this.subjectIndex < 0){
      util.pageToast('题目不存在')
    } else {
      api.mission.game.skip(this.subject.id, seconds, function (data) {

        _this.subjectIndex++;
        _this.page.setData({ balance: _this.page.data.balance - 30 });
        _this.page.setData({ subjectIndex: _this.subjectIndex + 1 });
        _this.next();
        util.pageToast(' -30 金币')
        store.client.balance = _this.page.data.balance;
        store.missions = null;  //  强制刷新关卡
      });
    }
  },
  replay: function(){

    var _this = this;
    
    _this.player.play(consts.HTTP_CDN + this.subject.mp3Url);
  },
  answer: function(){

    var _this = this;

    intervalClear();

    this.player.stop();
    if (this.page.data.subjectAnswer) {
      if (this.page.data.subjectAnswer == (this.subject || {}).title) {
        api.mission.game.answer(this.subject.id, seconds, function(data){

          if (_this.subjectIndex >= _this.subjectItems.length - 1) {
            api.mission.game.complete(_this.page.data.missionId, function(__data){

              util.pageNavigate('/pages/index/mission/rank/rank?missionId=' + _this.page.data.missionId, true);
              (__data.coins > 0) && _this.page.setData({ balance: _this.page.data.balance + __data.coins });
              (__data.coins > 0) && util.pageToast('+' + __data.coins + ' 金币');
            });
          } else {
            correct(_this);
          }
          store.client.balance = _this.page.data.balance;
          store.missions = null;  //  强制刷新关卡
        });
      } else {
        wrong(_this);
      }
    } else {
      util.pageToast('答案不能为空')
    }
  }
}