import React from 'react';
import {TouchableOpacity} from 'react-native';
import Text from '../../components/Text';
import useTheme from '../../hooks/useTheme';

// import BackIcon from '../assets/BackIcon';

export default function POSButton({text, onPress}) {
  let themeData = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        height: 100,
        backgroundColor: themeData.cardBg,
        margin: 3,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
      }}>
      <Text semibold color={themeData.textColor} size={18}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}
