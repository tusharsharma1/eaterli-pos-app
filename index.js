import 'react-native-reanimated';
import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import {AppRegistry, LogBox} from 'react-native';
import {Provider} from 'react-redux';
import {name as appName} from './app.json';
import App from './src/App';
import store from './src/redux/store';
import {MenuProvider} from 'react-native-popup-menu';
import Text from './src/components/Text';
import messaging from '@react-native-firebase/messaging';

import {
  createChannel,
  displayNotification,
  requestPermission,
} from './src/firebase/notification-service';
import notifee, {EventType} from '@notifee/react-native';
React.store = store;
LogBox.ignoreAllLogs();

notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification, pressAction} = detail;
  console.log('[onBackgroundEvent] onOpenNotification', type, detail);
  // Check if the user pressed the "Mark as read" action
  // if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
  //   // Update external API
  //   await fetch(`https://my-api.com/chat/${notification.data.chatId}/read`, {
  //     method: 'POST',
  //   });

  //   // Remove the notification
  //   await notifee.cancelNotification(notification.id);
  // }
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);

  // notifee.cancelDisplayedNotifications()
  // const options = {
  //   title: remoteMessage.notification.title,
  //   body: remoteMessage.notification.body,
  //   data: remoteMessage.data,
  //   tag: remoteMessage.messageId, // (optional) add tag to message
  // };

  // displayNotification(JSON.parse(remoteMessage.data.notifee));

  // notifee.displayNotification(JSON.parse(remoteMessage.data.notifee));

  //  wakeUpApp();
});

function MainApp() {
  useEffect(() => {
    setupNotification();
  }, []);

  const setupNotification = async () => {
    await requestPermission();
    await createChannel();
  };
  return (
    <Provider store={store}>
      {/* <Text>AA</Text> */}
      <MenuProvider>
        <App />
      </MenuProvider>
    </Provider>
  );
}
function HeadlessCheck({isHeadless}) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return <MainApp />;
}
AppRegistry.registerComponent(appName, () => HeadlessCheck);

// /**
//  * @format
//  */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);
