const app = getApp();
const util = require('../utils/util.js');
const bus = require('../utils/bus.js');
const subject = {

  next: function (data, success) {
     util.request('/subject/next.ashx', Object.assign(data, { 'sessionCode': bus.client.sessionCode || '' }), success);
  }
}
module.exports = subject;