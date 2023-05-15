import React from 'react';
import {Modal, View} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {ALERT_ICON_TYPE, ALERT_TYPE} from '../constants/alert.constant';
import alertAction from '../redux/actions/alert.action';

import theme from '../theme';
import Button from './Button';
import Text from './Text';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { getPercentValue } from '../helpers/app.helpers';

export default function AlertBox({}) {
  const {pWidth}=useWindowDimensions();
  const dispatch = useDispatch();
  const alert = useSelector(s => s.alert);
  const closeBtn = () => {
    dispatch(alertAction.hideAlert());
  };
  const NegativeBtn = () => {
    alert.onNegativePress && alert.onNegativePress();

    dispatch(alertAction.hideAlert());
  };
  const positiveBtn = () => {
    alert.onPositivePress && alert.onPositivePress();
    dispatch(alertAction.hideAlert());
  };

  return (
    <>
      <Modal
        animationType={'fade'}
        transparent={true}
        visible={alert.show}
        onRequestClose={closeBtn}>
        <View
          style={{
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              width: getPercentValue(pWidth,90),
              // height: 500,
              backgroundColor: '#FFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: theme.wp(2),
              paddingHorizontal: theme.wp(4),
              paddingVertical: theme.hp(3),
            }}>
            {/* <Button
            onPress={this.closeBtn}
            style={{
              height: 25,
              width: 25,
              borderRadius: 5,
              //height: null,
              marginLeft: 5,
              marginBottom: 0,
              backgroundColor: '#00000000',
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 2000,
            }}>
            <FontAwesome5 name={'times'} size={18} color={'gray'} />
          </Button> */}
            {/* <Image
            source={require('../assets/alert-icon.png')}
            style={{width: 80, height: 80,
             // backgroundColor: '#000000'
            }}
          /> */}

            <Text
              numberOfLines={1}
              medium
              size={25}
              mb={10}
              style={
                {
                  //  / fontFamily: theme.fonts.Medium,
                  //  fontSize: theme.hp(3),
                  // paddingVertical: theme.hp(1),
                  // textAlign: 'center',
                  // backgroundColor: 'red',
                }
              }>
              {alert.heading}
            </Text>
            {alert.icon == ALERT_ICON_TYPE.SUCCESS && (
              <Ionicons
                name={'checkmark-circle-outline'}
                size={theme.hp(8)}
                color={'green'}
              />
            )}
            {alert.icon == ALERT_ICON_TYPE.WARNING && (
              <Ionicons name={'warning'} size={theme.hp(8)} color={'#edb500'} />
            )}
            {alert.icon == ALERT_ICON_TYPE.INFO && (
              <Ionicons
                name={'ios-information-circle'}
                size={theme.hp(8)}
                color={'#16aaf4'}
              />
            )}
            {alert.icon == ALERT_ICON_TYPE.ERROR && (
              <FontAwesome5
                name={'exclamation-circle'}
                size={theme.hp(8)}
                color={theme.colors.errorColor}
              />
            )}
            {alert.icon == ALERT_ICON_TYPE.CONFIRM && (
              <FontAwesome5
                name={'question-circle'}
                size={theme.hp(8)}
                color={'#16aaf4'}
              />
            )}
            <View
              style={{
                // fontFamily: theme.fonts.Regular,
                // fontSize: theme.hp(2),
                // lineHeight: theme.hp(2.5),
                // textAlign: 'center',
                paddingVertical: 25,
              }}>
              {Array.isArray(alert.text) ? (
                alert.text.map((t, i) => {
                  return (
                    <Text align="center" key={i} size={16}>
                      {t}
                    </Text>
                  );
                })
              ) : (
                <Text align="center" size={16}>
                  {alert.text}
                </Text>
              )}
            </View>
            <View
              style={{
                //backgroundColor: 'red',
                //width:300,
                flexDirection: 'row',
              }}>
              {alert.type == ALERT_TYPE.CONFIRM && (
                <Button
                  onPress={NegativeBtn}
                  textStyle={{fontSize: theme.hp(2)}}
                  backgroundColor={'#212121'}
                  style={{
                    flex: 1,
                    // marginBottom: 0,
                    // // height: theme.hp(5),
                    marginRight: 5,
                    // borderRadius: theme.wp(1),
                    // backgroundColor: 'gray',
                    // paddingVertical: theme.hp(1.3),
                  }}>
                  {alert.NegativeText}
                </Button>
              )}
              <Button
                onPress={positiveBtn}
                textStyle={{fontSize: theme.hp(2)}}
                style={{
                  flex: 1,
                  // marginBottom: 0,
                  // height: theme.hp(5),
                  marginLeft: 5,
                  // borderRadius: theme.wp(1),
                  // paddingVertical:theme.hp(1.3),
                }}>
                {alert.positiveText}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
