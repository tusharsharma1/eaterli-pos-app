import AsyncStorage from '@react-native-async-storage/async-storage';
import stringHelper from './string.helper';
const skey = 'qwsd5ty6';
const storeData = async (key, value) => {
  //console.log(key,value)
  const jsonValue = JSON.stringify(value);
  //console.log(jsonValue)
  let encryptedData = await stringHelper.encrypt(jsonValue, skey);
  let encryptedKey = await stringHelper.encrypt(key);
  //console.log('encryptedData',encryptedData)
  //console.log('encryptedKey',encryptedKey)
  await AsyncStorage.setItem(encryptedKey, encryptedData);
};

const getData = async key => {
  let encryptedKey = await stringHelper.encrypt(key);
  const jsonValue = await AsyncStorage.getItem(encryptedKey);
  let decryptedData = await stringHelper.decrypt(jsonValue, skey);
  return jsonValue != null ? JSON.parse(decryptedData) : null;
};
const removeItem = async (key) => {
  let encryptedKey = await stringHelper.encrypt(key);
  await AsyncStorage.removeItem(encryptedKey);
  // console.log('AsyncStorage clear Done.')
};
const clearAll = async () => {
  await AsyncStorage.clear();
  // console.log('AsyncStorage clear Done.')
};

export default {
  storeData,
  getData,
  clearAll,
  removeItem
};
