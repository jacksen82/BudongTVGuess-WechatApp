//  utils/util.js

module.exports = {

  //  获取时间区间
  getTimeSpan: function (secondCount) {

    var minute = Math.floor(secondCount / 60);
    var second = (secondCount % 60);

    return (minute > 9 ? minute : '0' + minute) + ':' +
      (second > 9 ? second : '0' + second);
  },

  //  获取分类名称
  getCategory: function(categoryId){

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

  getLogo: function (logoUrl) {

    logoUrl = logoUrl || '';

    return logoUrl.indexOf('https') == 0 ? logoUrl : 'https://cdn.shenxu.name' + logoUrl;
  },

  //  设置页面标题
  pageSetTitle: function(title){

    wx.setNavigationBarTitle({
      title: title || '画外听音'
    })
  },

  //  设置页面变量
  pageSetData: function(page, key, value){

    var data = {};

    data[key] = value;

    page.setData(data)
  },

  //  设置页面跳转
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

  //  显示弹出提示
  pageToast: function (title){

    wx.showToast({
      title: title || '未知错误',
    })
  },

  //  设置开启分享至群
  pageShareMenu: function(){

    wx.showShareMenu({
      withShareTicket: true
    })
  }
}
