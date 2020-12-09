const getBDM = (url) => {
  let result = '';
  let startB = url.lastIndexOf("base=")+5,
      startD = url.lastIndexOf("n=")+2,
      startM = url.lastIndexOf("dst=")+4;
  
  if (startB != 4) {
    for (let i = startB; i < url.length; i++) {
      if (url[i] == ';') {
        result += `Б=${url.substring(startB, i)}`;
        break;
      }
    }
  }

  if (startD != 1) {
    for (let i = startD; i < url.length; i++) {
      if (url[i] == ';') {
        result += `_Д=${url.substring(startD, i)}`;
        break;
      }
    }
  }

  if (startM != 3) {
    for (let i = startM; i < url.length; i++) {
      if (url[i] == ';') {
        result += `_М=${url.substring(startM, i)}`;
        break;
      }
    }
  }

  return result;
};

export {
  getBDM
}
