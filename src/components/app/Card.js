import React from 'react';
import {View} from 'react-native';
import useTheme from '../../hooks/useTheme';
export default function Card({children, mb = 10}) {
  const themeData = useTheme();
  return (
    <View
      style={{
        borderRadius: 6,
        backgroundColor: themeData.cardBg,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginBottom: mb,
      }}>
      {children}
    </View>
  );
}
