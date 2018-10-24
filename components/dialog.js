// components/modal.js

Component({

  /*
    说明：组件定义的数据
  */
  data: {
    modalFade: '',
    modalVisible: false,
    panelTop: 0
  },

  /*
    说明：组件定义的方法
  */
  methods: {

    /*
      说明：显示窗口方法
    */
    show: function () {

      var wp = this;
      var sysinfo = wx.getSystemInfoSync();
      var query = wx.createSelectorQuery().in(this)

      this.setData({
        modalVisible: true
      });

      query.select('#dialogPanel').boundingClientRect()
      query.exec(function (res) {

        wp.setData({
          panelTop: Math.floor((sysinfo.windowHeight - res[0].height) / 2),
          modalFade: 'fadein'
        });
      })
    },

    /*
      说明：关闭窗口
    */
    close: function () {

      var wp = this;

      this.setData({
        modalFade: 'fadeout'
      });
      
      setTimeout(function () {

        wp.setData({
          modalVisible: false
        });
      }, 360);
    },

    /*
      说明：触控空白区域
    */
    onModalTap: function (e) {

    },

    /*
      说明：触控对话框面板
    */
    onPanelTap: function(e){

    },

    /*
      说明：关闭窗口
    */
    onClose: function (e) {

      this.close();
    }
  }
})
