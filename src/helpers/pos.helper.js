import {NativeModules, NativeEventEmitter} from 'react-native';
const {POSModule} = NativeModules;

export const POSModuleEventEmitter = new NativeEventEmitter(POSModule);

export default POSModule;
