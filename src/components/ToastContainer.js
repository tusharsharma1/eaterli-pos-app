import React, {memo} from 'react';
import Toast, {BaseToast} from 'react-native-toast-message';
import theme from '../theme';

const ToastContainer = memo(({}) => {
  return <Toast config={toastConfig} />;
});

export default ToastContainer;
const BaseToastComponent = (color = 'red', icon) => {
  return ({text1, props, ...rest}) => {
    // console.log(rest);

    // return (
    //   <View style={{height: 60, width: '100%', backgroundColor: 'white'}}>
    //     <Text>{text2}</Text>
    //     <Text>{props.guid}</Text>
    //   </View>
    // );

    return (
      <BaseToast
        {...rest}
        style={{borderLeftColor: color}}
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
        text1Style={{
          fontSize: 12,
          color: 'black',
          fontFamily: theme.fonts.medium,
        }}
        text2Style={{
          fontSize: 12,

          // fontWeight: 'semibold',
          fontFamily: theme.fonts.regular,
          color: 'black',
        }}
        text1={text1}
        leadingIconStyle={{}}
        leadingIconContainerStyle={{
          width: 20,
          paddingLeft: 15,
        }}
        leadingIcon={icon}
        // trailingIcon={require('react-native-toast-message/src/assets/icons/error.png')}
        // text2={'sdfsf'}
      />
    );
  };
};
const toastConfig = {
  success: BaseToastComponent(
    '#69C779',
    require('../assets/icons/success.png'),
  ),
  error: BaseToastComponent('#FE6301', require('../assets/icons/error.png')),
  info: BaseToastComponent('#87CEFA', require('../assets/icons/info.png')),
  any_custom_type: () => {},
};
