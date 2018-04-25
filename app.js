//  app.js

const util = require('utils/util.js')
const store = require('utils/store.js')
const api = require('api/index.js')

App ({

  /*
    说明：启动时发生
  */
  onLaunch: function(options){
    
    var query = options.query || {};

    //  检查登录态
    api.wechat.checkSession(options.scene)
      .then( function( data ){
        
        store.launched = true;
        store.client = data;
        store.session3rd = data.session3rd || ''
        store.gameFirstDone = wx.getStorageSync('gameFirstDone');

        wx.setStorageSync('session3rd', data.session3rd || '')
        
        //  获取用户资料
        if (data.actived != 1) {
          api.wechat.getUserInfo()
            .then(function (data) {

              data = data.data || {};
              store.client = data;
            })
        }
      })
  },
  
  /*
    说明：打开时发生
  */
  onShow: function (options) {
    
    var query = options.query || {};

    util.timerStart('AppShow', function(){

      //  记录用户来源 ( 内部做了去重，避免重复调用 )
      if (store.launched == true && store.session3rd) {
        
        util.timerClear('AppShow', function(){
          
          api.wechat.checkSource(query.mid, query.cid, options.shareTicket)
            .then(function (data) {
              
            })
        });
      }
    }, 50)
  }
})