import Color from 'color';
import {Dimensions, Platform, StatusBar} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
const deviceHeight =
  Platform.OS === 'ios'
    ? Dimensions.get('window').height
    : require('react-native-extra-dimensions-android').get(
        'REAL_WINDOW_HEIGHT',
      );
const themeMainColor = '#00ABA5'; //#1630c7

const themeSecondaryColor = '#A92A40';
const zoomScale = 1;
const theme = {
  fonts: {
    light: Platform.OS === 'ios' ? 'Inter-Light' : 'Inter-Light',
    regular: Platform.OS === 'ios' ? 'Inter-Regular' : 'Inter-Regular',
    medium: Platform.OS === 'ios' ? 'Inter-Medium' : 'Inter-Medium',
    semibold: Platform.OS === 'ios' ? 'Inter-SemiBold' : 'Inter-SemiBold',
    bold: Platform.OS === 'ios' ? 'Inter-Bold' : 'Inter-Bold',
  },
  colors: {
    primaryColor: themeMainColor,
    darkPrimaryColor: '#0b2987',
    secondaryColor: themeSecondaryColor,
    infoColor: '#00BED1',
    lightInfoColor: '#bef4f3',
    successColor: 'green',
    warningColor: '#edb500',
    dangerColor: '#e53737',
    statusBarColor: Color(themeMainColor).darken(0).string(),
    appBackground: '#EEEEEE',
    linkBtnTextColor: themeMainColor,
    errorColor: '#e01d1d',
    rowColor: '#fcfcfc',
    borderColor: '#BDBDBD',
  },
  screenWidth: Dimensions.get('window').width,
  screenHeight: deviceHeight,
  statusBarHeight: StatusBar.currentHeight,
  fontScale: Dimensions.get('window').fontScale,
  scale: Dimensions.get('window').scale,

  paddingHorizontal: 25,
  wp: v => {
    return wp(v) * zoomScale;
  },
  hp: v => {
    return hp(v) * zoomScale;
  },
};
export default theme;

export function getFont(data) {
  let font = '';
  for (const key in data) {
    if (data[key]) {
      font = theme.fonts[key];
      break;
    }
  }

  return font ? font : theme.fonts.regular;
}
