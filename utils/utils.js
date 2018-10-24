//  utils/utils.js

module.exports = {

  /* 
    说明：等待任务
  */
  getScene: function(options, key){

    var scene = (options || {}).scene || '';
    var params = scene.split(',');
    var item;

    for (var i = 0; i < params.length; i++){
      item = (params[i] || '').split('-');
      if (item.length == 2 && item[0] == key){
        return item[1];
      }
    }
    return ;
  }
}
