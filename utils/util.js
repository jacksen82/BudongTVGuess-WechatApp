const formatTime = date => {

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {

  n = n.toString()
  return n[1] ? n : '0' + n
}

const serialize = function(data){

  data = data || {};

  var querys = [];

  for (let key in data){
    querys.push(key + "=" + encodeURIComponent(data[key]));
  }
  return querys.join("&");
}

module.exports = {
  formatTime: formatTime,
  serialize: serialize
}
