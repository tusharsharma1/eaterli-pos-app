import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import Container from '../../components/Container';
import Header from '../../components/Header';
import AddFinixDeviceForm from '../../forms/AddFinixDeviceForm';
import {View} from 'react-native';
export default function AddFinixDevice({navigation, route}) {
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  return (
    <>
      <Header title={'Add Finix Device'} back />
      <Container
        scroll
        style={{
          flex: 1,
          // flexDirection: 'row',

          // padding: 20,
        }}
        contentContainerStyle={{
          paddingVertical:20,
          paddingHorizontal:20
        }}>
        <View
          style={{
            width: 300,
            alignSelf: 'center',
          }}>
          <AddFinixDeviceForm />
        </View>
        
      </Container>
      
    </>
  );
}
