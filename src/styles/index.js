import {StyleSheet} from 'react-native';
import theme from '../theme';

export default StyleSheet.create({
  containerBody: {
    flex: 1,
    // padding:10,
    backgroundColor: theme.colors.appBackground,
  },
  container: {
    flex: 1,
  },

  inputText: {
    fontFamily: theme.fonts.regular,
    fontSize: 15,
    color: '#212121',
    //  borderWidth: 2,
    // borderColor: "#9392b4",
    paddingVertical: 0,
    // paddingHorizontal: 10,
    // backgroundColor: "red",
    // textAlign: 'center',
    // height:50,
    // borderRadius:50,
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.infoColor,
    //  height: theme.hp(6),
    paddingVertical: theme.hp(1.5),
    borderRadius: theme.wp(20),
    marginBottom: theme.hp(1.7),
  },

  errorText: {
    fontSize: 12,
    color: 'red',
    fontFamily: theme.fonts.ExtraLight,
    // textAlign: 'center'
  },
});
