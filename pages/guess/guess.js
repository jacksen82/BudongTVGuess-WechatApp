//  guess.js

const app = getApp();
const util = require('../../utils/util.js');
const bus = require('../../utils/bus.js');
const api = require('../../services/api.js');
const words = require('./parts/words.js');;

Page({
  data: {
    coins: 0,
    timer: null,
    timeSecond: 0,
    timeText: '00:00',
    levelInfo: null,
    subjectId: 0,
    subjectTitle: '',
    subjectThumbUrl: '',
    subjectWords: '',
    titleIndex: 0,
    titleWords: [],
    allWords: []
  },
  onLoad: function (options) {

    this.setData({
      coins: bus.client.coins || 0,
      levelInfo: util.decodeParams(options)
    });
    this._next();
    this._clock();
  },
  onUnload: function(){

    this.timer && clearInterval(this.timer);
  },
  onContinue: function(){

    this._next({
      subjectId: this.data.subjectId,
      subjectTime: this.data.timeSecond,
      subjectResult: 1
    });
    this.setData({
      timeSecond: 0
    });
  },
  onReload: function(){

    this.setData({
      titleIndex: 0,
      titleWords: words.getTitleWord(this.data.subjectTitle),
      allWords: words.getAllWord(this.data.subjectWords)
    });
    this._clock();
  },
  onShareAppMessage: function (res) {

    var _this = this;

    this.selectComponent('#coins').close();
    return api.wechat.share('coins', res, function (data) {
      _this.selectComponent('#toast').show('+100', 'add');
    });
  },
  onCoins: function () {

    this.selectComponent('#coins').show(this.data.coins);
  },
  onSkip: function(){

    var _this = this;

    if (this.data.clientCoins > 150) {
      api.subject.skip({
        subjectId: this.data.subjectId
      }, function (data) {

        _this.setData({
          timeSecond: 0,
          subjectId: data.id,
          titleWords: words.getTitleWord(data.title || ''),
          allWords: words.getAllWord(data.words || '')
        });
        _this.selectComponent('#player').ready(data.audioUrl, options.coverUrl);
        _this.selectComponent('#toast').show('-30', 'minus');
      });
    } else {
      util.showToast('咚豆不足');
    }
  },
  onTip: function () {

    var _this = this;

    if (this.data.clientCoins > 150){
      api.subject.tip({
        subjectId: this.data.subjectId
      }, function(data){

        _this.selectComponent('#toast').show('-50', 'minus');
      });
    } else {
      util.showToast('咚豆不足');
    }
  },
  onTitleChoice: function(event){

    var _this = this, index = event.currentTarget.dataset['index'];

    if (this.data.titleWords[index].index > -1){
      words.resetTitleWord(
        index,
        this.data.titleWords,
        this.data.allWords,
        function (titleIndex, titleWords, allWords) {

          _this.setData({
            titleIndex: titleIndex,
            titleWords: titleWords,
            allWords: allWords
          });
        });
    }
  },
  onAllChoice: function(event){

    var _this = this, index = event.currentTarget.dataset['index'];

    if (this.data.titleIndex < this.data.titleWords.length){
      words.setTitleWord(
        this.data.titleIndex, 
        this.data.titleWords, 
        index, 
        this.data.allWords, 
        function(titleIndex, titleWords, allWords){

          _this.setData({
            titleIndex: titleIndex,
            titleWords: titleWords,
            allWords: allWords
          });
        });
    }
    if (this.data.titleIndex >= this.data.titleWords.length) {
      this.timer && clearInterval(this.timer);
      if (words.getTitleResult(this.data.titleWords)){
        this.selectComponent('#result').show(true, this.data.subjectTitle, this.data.subjectThumbUrl);
      } else {
        this.selectComponent('#result').show(false, this.data.subjectTitle, this.data.subjectThumbUrl);
      }
    }
  },
  //  获取下一题
  _next: function(answer){

    answer = answer || {};

    var _this = this;

    api.subject.next({
      levelId: this.data.levelInfo.id || 0,
      subjectId: answer.subjectId || 0,  
      subjectTime: answer.subjectTime || 0,
      subjectResult: answer.subjectResult || 0
    }, function (data) {

      _this.setData({
        subjectId: data.id,
        subjectTitle: data.title,
        subjectThumbUrl: data.thumbUrl,
        subjectWords: data.words,
        titleIndex: 0,
        titleWords: words.getTitleWord(data.title || ''),
        allWords: words.getAllWord(data.words || '')
      });
      _this.selectComponent('#player').ready(data.audioUrl, _this.data.levelInfo.coverUrl);
      _this._clock();
    });
  },
  //  答对题目
  _answer: function(){

  },
  //  启动计时器
  _clock: function(){

    var _this = this;

    _this.timer = setInterval(function () {

      _this._interval();
    }, 1000);
  },
  _interval: function(){

    var seconds = (this.data.timeSecond || 0) + 1;
    var minute = Math.floor(seconds / 60);
    var second = seconds % 60;

    this.setData({
      timeSecond: seconds,
      timeText: (minute > 9 ? minute : '0' + minute) + ':' + (second > 9 ? second : '0' + second)
    });
  }
})
