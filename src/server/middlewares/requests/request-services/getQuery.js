const getQuery = (text) => {

  const words = text.split(' ');
  let arrays = new Set();
  words.map((word, i) => {
    arrays.add(words[i]);
    if (i < words.length - 1){
      arrays.add(words[i] + "x" + words[i+1]);
    }
    if (i < words.length - 2){
      arrays.add(words[i] + "x" + words[i+1] + "x" + words[i+2]);
    }
  })
  return [...arrays].join(' | ');

}

module.exports.getQuery = getQuery;
