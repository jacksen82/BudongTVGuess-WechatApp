//  guess.js

const app = getApp();
const util = require('../../utils/util.js');
const bus = require('../../utils/bus.js');
const api = require('../../services/api.js');
const words = require('./parts/words.js');;

Page({
  data: {
    titleIndex: 0,
    titleWords: [],
    allWords: []
  },
  onLoad: function (options) {

    var _this = this;

    _this.level = util.decodeParams(options);
    _this.setData({
      clientCoins: bus.client.coins || 0
    });
    api.subject.next({
      levelId: _this.level.id || 0
    }, function (data) {
      _this.setData({
        titleWords: api.subject.titleWords(data.title || ''),
        allWords: api.subject.allWords(data.words || '')
      });
      _this.selectComponent('#player').ready(data.audioUrl, options.coverUrl);
    });
  },
  onShareAppMessage: function (res) {

    var _this = this;

    return api.wechat.share('这么多年才发现，原来这段音乐是这个电视剧的', '', res, function (data) {
      _this.selectComponent('#toast').show('+100', 'add');
    });
  },
  titleChoice: function(event){

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
          console.log('还字成功');
        });
    }
  },
  allChoice: function(event){

    var _this = this, index = event.currentTarget.dataset['index'];

    if (this.data.titleIndex >= this.data.titleWords.length){
      //  完成之后再判断正确，错误
      console.log('答完了');
    } else {
      //  显示动画
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
          console.log('填字成功');
        });
    }
  }
})
