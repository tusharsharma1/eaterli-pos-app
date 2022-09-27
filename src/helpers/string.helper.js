import Des from 'react-native-des-cbc';
const KEY = ')&gy41^*';
let encrypt = (string, key = KEY) => {
  let promise = new Promise((resolve, reject) => {
    // resolve(string);
    Des.encryptCbc(
      string,
      key,
      key,
      function (base64) {
        // console.log('wwwwwww base64', base64);
        resolve(base64);
      },
      function (e) {
        // console.log('wwwwwww string', string,e);
        resolve(string);
      },
    );
  });
  return promise;
};
let decrypt = (string, key = KEY) => {
  let promise = new Promise((resolve, reject) => {
    // resolve(string);
    Des.decryptCbc(
      string,
      key,
      key,
      function (text) {
        resolve(text);
      },
      function () {
        resolve(string);
      },
    );
  });
  return promise;
};

export default {
  encrypt,
  decrypt,
};
