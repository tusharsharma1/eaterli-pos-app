import React from 'react';
import {TouchableOpacity} from 'react-native';
import Text from '../../components/Text';

// import BackIcon from '../assets/BackIcon';

export default function POSButton({text, onPress}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        height: 100,
        backgroundColor: '#eee',
        margin: 3,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
      }}>
      <Text semibold size={18}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}
