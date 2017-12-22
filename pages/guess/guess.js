//  guess.js

const app = getApp()

Page({
  data: {
    programInfo: {
      answerItems: [
        "新", "白", "娘", "子", "传","奇"
      ],
      optionItems: [
        "大","浒", "新", "娘", "传", "龙", 
        "聊", "西", "封", "白","游", "记", 
        "水", "传", "子", 
        "国", "门", "部", "义", "奇", 
         "斋", 
        "神", "榜", "演", 
        "天","八","部",
        "三", "天", "龙", "八",
        "宅"
      ]
    }
  },
  onLoad: function () {

  },
  chioce: function(event){

    console.log(event.currentTarget.dataset);
  }
})
