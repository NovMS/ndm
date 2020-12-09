const getHash = async (data) => {
  const axios = require('axios');
  const instance = axios.create({
    headers: {'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Mobile Safari/537.36'},

  });
  try {
    let str = '';
    data.map((item) => {
      str = str + item.replace(/,/gi, '').replace(/%/gi, '');
    })
    const res = await instance.post('http://10.106.78.205:80/windows-services/getHash', str);
    return await res.data[0];
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  getHash
}
