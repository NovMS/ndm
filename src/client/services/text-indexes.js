const getTextIndexes = async (text) => {
  try {
    const axios = require('axios');
    const instance = axios.create({
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Mobile Safari/537.36',
        'Content-Type': 'text/plain'
      }
    });

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
    };

    const { data: { result:titleIndex } } = await instance.post(`http://10.106.78.205:80/windows-services/getRussianStemmPost`, encodeURI(text.replace(/%/gi, '')));
    const titleStemmIndex = getQuery(titleIndex);
    return await {
      titleIndex,
      titleStemmIndex
    };
  } catch (error) {
    console.error(error);;
  }
};

module.exports = {
  getTextIndexes
}
