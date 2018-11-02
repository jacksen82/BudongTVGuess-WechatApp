//  data/store.js

const utils = require('../utils/utils.js')
const constants = require('constants.js')

const store = {

  /*
    说明：等待授权成功后执行
  */
  waitForAuthorize: function(callback){

    var count = 0;
    var timer = setInterval(function () {

      //  循环超过 100 次，则跳出
      if (count > 100){
        clearInterval(timer);
        callback();
      }

      //  客户端及来源客户端已初始化，则跳出
      if (store.client != null && store.clientId){
        if (store.fromClient !=null){
          clearInterval(timer);
          callback();
        }
      }

      count++;
    }, 100);
    
  }
}

module.exports = store