//  utils/payer.js

const innerAudioContext = wx.createInnerAudioContext()

var timer;
var seconds = 0;
var timespan = function (_seconds) {

  let ts_minute = Math.floor(_seconds / 60);
  let ts_second = (_seconds % 60);

  return (ts_minute > 9 ? ts_minute : '0' + ts_minute) + ':' + (ts_second > 9 ? ts_second : '0' + ts_second);
};
var interval = function (page) {

  timer && clearInterval(timer)
  timer = setInterval(function () {

    seconds += 1;
    page.setData({ playlength: timespan(seconds) });
  }, 1000)
};
var clear = function () {

  timer && clearInterval(timer)
};

module.exports = {

  page: null,
  init: function(page){

    this.page = page;

    innerAudioContext.onPlay(function () {

      seconds = 0;
      interval(page);
      page.setData({
        playready: true,
        playing: true 
      });
    })

    innerAudioContext.onStop(function () {

      clear();
      page.setData({
        playready: false,
        playing: false
      });
    })

    innerAudioContext.onEnded(function () {

      clear();
      page.setData({
        playready: false,
        playing: false
      });
    })

    innerAudioContext.onError(function (res) {

      wx.showToast({ title: '无法播放' });
    });
  },
  play: function(src){

    this.page.setData({
      playready: true
    });

    innerAudioContext.src = src;
    innerAudioContext.play();
  },
  stop: function(){

    innerAudioContext.stop();
  },
  playOrStop: function(src){

    if (this.page.data.playing){
      this.stop();
    } else {
      this.play(src);
    }
  }
}