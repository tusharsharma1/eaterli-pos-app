import settingsAction from '../redux/actions/settings.action';
import store from '../redux/store';
import storageHelper from './storage.helper';

export async function saveSettings() {
  let state = store.getState().settings;
  let {generalSettings, imageSettings} = state;
  storageHelper.storeData('settings', {generalSettings, imageSettings});
}

export async function loadSettings() {
  let settings = await storageHelper.getData('settings');
  console.log('[settings]', settings);
  if (settings) {
    store.dispatch(settingsAction.set(settings));
  }
}
