import {fcmService} from '../firebase/FCMService';
import {onPressNotification} from './notification-service';
let initFirebaseNotif = false;
let handler;
export function registerPushNotification(
  onRegister,
  onNotification,
  onOpenNotification,
) {
  if (!initFirebaseNotif) {
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    handler = onPressNotification(onOpenNotification);

    initFirebaseNotif = true;
  }
}

export function unRegisterPushNotification() {
  fcmService.unRegister();
  handler && handler();

  initFirebaseNotif = false;
}
