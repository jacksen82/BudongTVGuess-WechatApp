//  data/store.js

const utils = require('../utils/utils.js')
const constants = require('constants.js')

const store = {

  /*
    说明：是否已触发授权
  */
  authorized: false,

  /*
    说明：获取当前客户端编号
  */
  checkAuthorize: function(){

    return store.authorized;
  },

  /*
    说明：等待授权成功后执行
  */
  awaitAuthorize: function(callback){

    var count = 0;
    var timer = setInterval(function () {

      store.client = store.client || {};
      
      if ((store.client.id && store.related == true) || count > 100) {
        clearInterval(timer);
        store.client.id && callback();
      }
      count++;
    }, 100);
    
  }
}

module.exports = store