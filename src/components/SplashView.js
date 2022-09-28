import React, {PureComponent} from 'react';
import {ActivityIndicator, Image, View} from 'react-native';
// import BottomDots from '../components/BottomDots';
import theme from '../theme';

export default function SplashView({loading = false}) {
  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.appBackground,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          resizeMode="contain"
          style={{
            width: 350,
            height: 140,

            // backgroundColor: 'red',
          }}
          source={require('../assets/images/logo.png')}
        />
        {loading && (
          <ActivityIndicator
            size="large"
            color={theme.colors.secondaryColor}
            style={{
              position: 'absolute',
              bottom: 40,
            }}
          />
        )}
      </View>
    </>
  );
}
