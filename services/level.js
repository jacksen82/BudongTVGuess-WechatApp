const app = getApp();
const util = require('../utils/util.js');
const bus = require('../utils/bus.js');
const level = {

  all: function (data, success) {
    util.request('/level/all.ashx', Object.assign(data, { 'sessionCode': bus.client.sessionCode || '' }), success);
  },
  unlock: function (data, success) {
    util.request('/level/unlock.ashx', Object.assign(data, { 'sessionCode': bus.client.sessionCode || '' }), success);
  }
}
module.exports = level;