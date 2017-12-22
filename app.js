//  app.js

App({
  onLaunch: function (options) {
    
    this.getSystemInfo();
    this.getLaunchInfo(options);
  },
  onLoad: function (options){
    
    console.log(22222);
    console.log(options);
  },
  getSystemInfo: function (){

    var self = this;

    wx.getSystemInfo({
      success: function(res){

        self.systemInfo = res;
      }
    });
  },
  getLaunchInfo: function(options){

    var self = this;

    this.globalData.launchInfo = this.globalData.launchInfo || {};
    this.globalData.launchInfo.fromClientId = options.query.fromClientId || 0;
    this.globalData.launchInfo.scene = options.scene || 0;
    
    wx.getShareInfo({
      shareTicket: options.shareTicket,
      success: function(res){

        self.globalData.launchInfo.shareTicketDate = res.encryptedData;
        self.globalData.launchInfo.shareTicketIV = res.iv;
      }
    })
  },
  globalData: {
    clientInfo: null,
    launchInfo: null,
    systemInfo: null
  }
})