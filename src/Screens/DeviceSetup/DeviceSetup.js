import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Container from '../../components/Container';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import DeviceSetupForm from '../../forms/DeviceSetupForm';
import {View} from 'react-native';
import Text from '../../components/Text';
import {getNearRestaurantLocation} from '../../helpers/user.helper';

export default function DeviceSetup(props) {
  const userData = useSelector(s => s.user.userData);
  const dispatch = useDispatch();
  const {height, width, isPortrait} = useWindowDimensions();
  useEffect(() => {
    loadData();
  }, [userData]);

  const loadData = async () => {
    await getNearRestaurantLocation();
  };
  return (
    <Container
      scroll
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingVertical: 20,
      }}>
      <View
        style={{
          width: isPortrait ? '100%' : 350,
          alignSelf: 'center',
        }}>
        <Text align="center" bold size={26} mb={10}>
         POS Initial Configuration
        </Text>
        <DeviceSetupForm />
      </View>
    </Container>
  );
}
