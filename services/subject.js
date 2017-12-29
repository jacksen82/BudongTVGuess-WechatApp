const app = getApp();
const util = require('../utils/util.js');
const bus = require('../utils/bus.js');
const subject = {

  next: function (data, success) {
     util.request('/subject/next.ashx', Object.assign(data, { 'sessionCode': bus.client.sessionCode || '' }), success);
  },
  titleWords: function(title){

    var items = [];
    var titles = (title || '').split('');
    for (let i = 0; i < titles.length; i++) {
      items.push({
        'tip': titles[i],
        'text': '',
        'index': -1,
        'animate': null
      });
    }
    return items;
  },
  allWords: function (words) {

    words = (words || '').split('');
    var items = [];
    var index = -1;
    while (words.length > 0) {
      index = Math.round(Math.random() * (words.length - 1));
      items.push({
        'tip': words[index],
        'text': words[index],
        'animate': null
      });
      words.splice(index, 1);
    }
    return items;
  }
}
module.exports = subject;