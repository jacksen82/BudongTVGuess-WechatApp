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
  },

  /* 
    说明：获取答案选项
  */
  getOptions: function(options){

    options = options || [];

    var result = [];
    var index = -1;
    var count = 0;

    while(options.length > 0 && count < 100){
      index = Math.floor(Math.random() * options.length);
      result.push(options[index]);
      options.splice(index, 1); 
      count ++ ;
    }

    return result;
  }
}
