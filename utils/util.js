var timer = {};

module.exports = {

  categoryItems: ['电视', '电影', '动画', '游戏', '广告', '音乐', '其他'],

  categoryIdToName: function (categoryId) {

    switch (categoryId) {
      case 101: return '电视';
      case 102: return '电影';
      case 103: return '动画';
      case 104: return '游戏';
      case 105: return '广告';
      case 106: return '音乐';
      default: return '其他';
    }
  },
  
  durationToTimeSpan : function(duration){

    var minute = Math.floor(duration / 60);
    var second = (duration % 60);

    return (minute > 9 ? minute : '0' + minute) + 
      ':' + 
      (second > 9 ? second : '0' + second);
  },

  timerStart: function(id, callback, delay){

    timer[id] && clearInterval(timer[id])
    timer[id] = setInterval(callback, delay)
  },

  timerClear: function(id, callback){

    timer[id] && clearInterval(timer[id])
    callback && callback()
  },

  pageSetTitle: function(title){

    wx.setNavigationBarTitle({
      title: title || '画外听音'
    })
  },

  pageSetData: function(page, key, value){

    var data = {};

    data[key] = value;

    page.setData(data)
  },

  pageNavigate: function (url, isRedirect){

    if (url == 'back'){
      wx.navigateBack()
    } else {
      if (isRedirect == true) {
        wx.redirectTo({
          url: url
        })
      } else {
        wx.navigateTo({
          url: url
        })
      }
    }
  },

  pageToast: function (title){

    wx.showToast({
      title: title || '未知错误',
    })
  },

  pageShareMenu: function(){

    wx.showShareMenu({
      withShareTicket: true
    })
  }
}
