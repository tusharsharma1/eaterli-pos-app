import {DrawerActions, useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';

// import BackIcon from '../assets/BackIcon';
import Text from './Text';
import theme from '../theme';
import useTheme from '../hooks/useTheme';

export const HeaderHeight = 50;
function _Header({
  title = '',
  back = false,
  absolute = false,
  size = 18,
  // hideCart = false,
  color='#F4F4F6',
  backgroundColor,
}) {
  const themeData = useTheme();
  const navigation = useNavigation();
  // const mobileBuilder = useSelector(s => s.user.mobileBuilder);

  const backPress = () => {
    navigation.goBack();
  };
  const menuPress = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };
  // let {header_bg, header_text} = mobileBuilder.layout;
  // let backgroundColor = header_bg;
  // let color = header_text;
  return (
    <>
      <View
        style={{
          height: HeaderHeight,

          backgroundColor: backgroundColor ?? themeData.appBg,
          alignItems: 'center',
          flexDirection: 'row',
          paddingHorizontal: 10,

          ...(absolute
            ? {
                position: 'absolute',
                width: '100%',
                top: 0,
                left: 0,
                zIndex: 1,
              }
            : {}),
        }}>
        {back ? (
          <TouchableOpacity
            onPress={backPress}
            style={{
              // backgroundColor: 'red',
              width: 50,
              height: HeaderHeight - 2,
              alignItems: 'center',
              justifyContent: 'center',
              // paddingLeft: 25,
            }}>
            {/* <BackIcon /> */}
            <MaterialIcons
              name="arrow-back"
              color={color ?? themeData.textColor}
              size={30}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={menuPress}
            style={{
              // backgroundColor: 'red',
              width: 50,
              height: HeaderHeight - 2,
              alignItems: 'center',
              justifyContent: 'center',
              // paddingLeft: 25,
            }}>
            {/* <BackIcon /> */}
            <MaterialIcons
              name="menu"
              color={color ?? themeData.textColor}
              size={45}
            />
          </TouchableOpacity>
        )}

        <View
          style={{
            flex: 1,
            // backgroundColor: 'yellow',
            // paddingRight: !back ? 50 : 0,
            marginHorizontal: 5,
            // marginRight: 10,
            // alignItems: 'center',
          }}>
          <Text
            size={size}
            color={color ?? themeData.textColor}
            semibold
            align="left">
            {title}
          </Text>
        </View>
      </View>
    </>
  );
}
const Header = memo(_Header);
export default Header;
