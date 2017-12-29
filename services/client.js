const app = getApp();
const util = require('../utils/util.js');
const bus = require('../utils/bus.js');
const client = {
  login: function (data, success) {
    util.request('/client/login.ashx', data, success);
  },
  ticket: function (data, success) {
    util.request('/client/ticket.ashx', data, success);
  },
  share: function (data, success) {
    util.request('/client/share.ashx', Object.assign(data, { 'sessionCode': bus.client.sessionCode || '' }), success);
  }
}
module.exports = client;