import notifee, {
  AndroidColor,
  AndroidImportance,
  AndroidVisibility,
  EventType,
} from '@notifee/react-native';
export const createChannel = (id = 'high_priority') => {
  return notifee.createChannel({
    id: 'high_priority',
    name: 'High Priority',
    badge: true,
    vibration: true,
    importance: AndroidImportance.HIGH,
    sound: 'default',
    lightColor: AndroidColor.GREEN,
    lights: true,
    visibility: AndroidVisibility.PUBLIC,
  });
};

export const requestPermission = () => {
  return notifee.requestPermission();
};

export const displayNotification = (
  options = {
    title: '',
    body: '',
    data: undefined,
  },
) => {
  // Display a notification
  return notifee.displayNotification({
    ...options,
    android: {
      channelId: 'high_priority',
      smallIcon: 'ic_stat_name', // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
      color: '#4a81d4',
      // timestamp: Date.now(), // 8 minutes ago
      showTimestamp: true,
      ...options.android,
    },
  });
};

export const onPressNotification = cb => {
  let handler = notifee.onForegroundEvent(({type, detail}) => {
    switch (type) {
      case EventType.DISMISSED:
        break;
      case EventType.PRESS:
        cb && cb(detail, 'local');
        break;
    }
  });

  notifee.getInitialNotification().then(initialNotification => {
    if (initialNotification) {
      cb && cb(initialNotification, 'local');
    }
  });

  return handler;
};
