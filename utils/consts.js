//  utils/consts.js

//  常量定义
module.exports = {
  APP_LAUNCHED: false,                              //  已启动标识
  APP_3RD_ID: 2,                                    //  微信小程序 AppID
  APP_3RD_SESSION: '',                              //  三方会话标识
  HTTP_API: 'https://shenxu.name/wechat_app/api',   //  接口前缀
  HTTP_CDN: 'https://cdn.shenxu.name',              //  CDN 前缀
  AJAX_TIMESTAMP_NORMAL: 6000,
  AJAX_CODE_TYPE: {
    SESSION_NULL: 101,
    SESSION_EXPIRE: 102,
    LOGIN_FAIL: 111,
    UNKONOW: 999
  },
  AJAX_URL_STATE: {

  },
  DATA_CATEGORYS: ['电视', '电影', '动画', '游戏', '广告', '音乐', '其他']
}
