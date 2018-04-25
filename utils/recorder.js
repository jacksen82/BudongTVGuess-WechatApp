const recorderManager = wx.getRecorderManager()  

var timer;
var seconds = 0;
var timespan = function(_seconds){

  let ts_minute = Math.floor(_seconds / 60);
  let ts_second = (_seconds % 60);

  return (ts_minute > 9 ? ts_minute : '0' + ts_minute) + ':' + (ts_second > 9 ? ts_second : '0' + ts_second);
};
var interval = function(page){

  timer && clearInterval(timer)
  timer = setInterval(function () {

    seconds += 1;
    page.setData({ recordlength: timespan(seconds) });
  }, 1000)
};
var clear = function(){

  timer && clearInterval(timer)
};

module.exports = {

  page: null,
  init: function (page, callback) {

    this.page = page;

    recorderManager.onStart(function () {

      seconds = 0;
      interval(page);
      page.setData({
        recording: true,
        recordlength: '00:00' 
      })
    });

    recorderManager.onStop(function (res) {

      clear();

      if (seconds < 5) {
        wx.showToast({
          title: '音频太短',
        })
        page.setData({
          recorded: false,
          recording: false,
          recordlength: '00:00' 
        })
      } else {
        page.setData({
          recorded: true,
          recording: false,
          recordFileName: res.tempFilePath
        })
      }
    });

    recorderManager.onError(function (res) {

      wx.showToast({
        title: '录音失败'
      })
    });
  },
  start: function(duration){

    recorderManager.start({
      duration: duration || 15000,
      format: 'mp3'
    });
  },
  stop: function(){

    recorderManager.stop();
  }
}