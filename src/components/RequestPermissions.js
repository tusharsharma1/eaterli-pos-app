import React, {useEffect, useState} from 'react';
import {ActivityIndicator, BackHandler, Linking, View} from 'react-native';
// import {Camera} from 'react-native-vision-camera';
import {useSelector} from 'react-redux';
import theme from '../theme';
import {Button} from './Button';
import {Text} from './Text';

function RequestPermissions() {
  const [message, setMessage] = useState('');
  useEffect(() => {
    getPermission();
  }, []);
  const getPermission = async () => {
    // const cameraPermission = await Camera.getCameraPermissionStatus();
    // const microphonePermission = await Camera.getMicrophonePermissionStatus();
   // const newCameraPermission = await Camera.requestCameraPermission();
    // const newMicrophonePermission = await Camera.requestMicrophonePermission();
    // console.log(newCameraPermission == 'authorized');
    // if (newCameraPermission != 'authorized') {
    //   setMessage('This App need Camera permission.');
    // }
  };

  if (!message) {
    return null;
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        position: 'absolute',
        width: '100%',
        height: theme.screenHeight,
        top: 0,
        bottom: 0,
      }}>
      <View
        style={{
          backgroundColor: '#fff',
          paddingHorizontal: 30,
          paddingVertical: 30,
          borderRadius: 20,
          minWidth: 200,
          alignItems: 'center',
        }}>
        <Text color="#212121" medium mb={20} size={14}>
          {message}
        </Text>
        <Button
          onPress={() => {
            BackHandler.exitApp();
            Linking.openSettings();
          }}>
          Give permission
        </Button>
      </View>
    </View>
  );
}

export default RequestPermissions;
