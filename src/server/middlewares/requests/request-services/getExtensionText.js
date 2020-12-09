const getExtensionText = (text, words) => {

  let textArr = text.split(/[-+*/."«»]|\s+/g);
      index = 0;
      word = '',
      newText ='';
  for (let i = 0; i < text.length; i++) {
    newText += text[i];
    word += text[i];
    if (word.indexOf(textArr[index]) != -1) {
      if (words.includes(textArr[index].toLocaleLowerCase().trim())) {
        newText = `${newText.slice(0, (newText.length-textArr[index].trim().length))}<span>${textArr[index].trim()}</span>`
      }
      index++;
      word = '';
    }
  }
  return(newText);

}

module.exports.getExtensionText = getExtensionText;
