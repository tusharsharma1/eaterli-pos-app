import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import theme from '../theme';
import Text from './Text';
function AppLoader({message}) {
  return (
    <>
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
          }}>
          <ActivityIndicator size="large" color={theme.colors.primaryColor} />

          <Text color="#212121" size={14} mt={10}>
            {message}
          </Text>
        </View>
      </View>
    </>
  );
}

export default AppLoader;
