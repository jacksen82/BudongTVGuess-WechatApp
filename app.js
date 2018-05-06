//  app.js

const consts = require('utils/consts.js')
const util = require('utils/util.js')
const store = require('utils/store.js')
const api = require('api/index.js')

App ({

  /*
    说明：启动时发生
  */
  onLaunch: function(options){

    var query = options.query || {};

    //  获取本地缓存三方标识
    consts.APP_SCENE = options.scene || 0;
    consts.APP_3RD_SESSION = wx.getStorageSync('session3rd') || '';

    //  检查登录态
    api.wechat.authorize(query.mid, query.cid, options.shareTicket, function(data){

      //  初始化客户端数据
      store.client = data.client || {};
      store.client.lastTime = new Date().getTime();

      //  初始化关卡数据
      store.missions = data.missions || {};
      store.missions.pageId = 1;
      store.missions.lastTime = new Date().getTime();

      //  初始化本地数据
      wx.setStorageSync('session3rd', data.session3rd || '');

      //  初始化系统常量
      consts.APP_3RD_SESSION = data.session3rd || '';
      consts.APP_LAUNCHED = true;
    })
  },
  
  /*
    说明：打开时发生
  */ 
  onShow: function (options) {
    
    var query = options.query || {}; 
    
    api.wechat.trace(query.sid, query.mid, query.cid, options.shareTicket, function(){
      
      if (query.mid) {
        setTimeout(function () {

          if (query.sid) {
            util.pageNavigate('/pages/index/mission/help/help?missionId=' + query.mid + '&subjectId=' + query.sid + '&fromClientId=' + query.cid);
          } else {
            util.pageNavigate('/pages/index/mission/start/start?missionId=' + query.mid);
          }
        }, 300);
      }
    });
  }
})