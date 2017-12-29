const animate = require('../../../utils/animate.js');

const clearAllWord = function(allWords){

  for (let i = 0; i < allWords.length; i++) {
    allWords[i].animate = null;
  }
  return allWords;
};
const resetTitleWord = function(titleIndex, titleWords, allWords, callback){

  allWords = clearAllWord(allWords);

  for (let i = titleIndex; i < titleWords.length; i++) {
    if (titleWords[i].index > -1) {
      allWords[titleWords[i].index].text = allWords[titleWords[i].index].tip;
      allWords[titleWords[i].index].animate = animate.word.choiceIn((i - titleIndex) * 100);
      titleWords[i].text = '';
      titleWords[i].index = -1;
      titleWords[i].animate = animate.word.entryOut((i-titleIndex) * 100);
    }
  }

  titleIndex = titleIndex;

  callback && callback(titleIndex, titleWords, allWords);
};
const setTitleWord = function (titleIndex, titleWords, allIndex, allWords, callback) {

  titleWords = titleWords || [];
  allWords = allWords || [];

  for (let i = 0; i < allWords.length; i++) {
    if (allIndex == i) {
      allWords[i]['text'] = '';
      allWords[i]['animate'] = animate.word.choiceOut();
    } else {
      allWords[i]['text'] = allWords[i]['text'];
      allWords[i]['animate'] = null;
    }
  }

  titleWords[titleIndex]['text'] = allWords[allIndex].tip;
  titleWords[titleIndex]['index'] = allIndex;
  titleWords[titleIndex]['animate'] = animate.word.entryIn();

  titleIndex += 1;

  callback && callback(titleIndex, titleWords, allWords);
};

module.exports = {
  resetTitleWord: resetTitleWord,
  setTitleWord: setTitleWord
};