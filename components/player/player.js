
const util = require('../../utils/util.js');

Component({
  data: {
    playing: false,
    audioUrl: null,
    coverUrl: null
  },
  methods: {
    ready: function(audioUrl, coverUrl){

      var _this = this;
    console.log(audioUrl);
    console.log(coverUrl);
      wx.onBackgroundAudioPlay(function () {
        _this.setData({ playing: true });
      });
      wx.onBackgroundAudioStop(function () {
        _this.setData({ playing: false });
      });
      _this.setData({
        audioUrl: audioUrl,
        coverUrl: coverUrl
      });
    },
    press: function(){

      if (this.data.playing) {
        wx.stopBackgroundAudio();
      } else {
        wx.playBackgroundAudio({
          title: '步咚猜剧',
          dataUrl: this.data.audioUrl,
          coverImgUrl: this.data.coverUrl
        });
      }
    }
  }
})