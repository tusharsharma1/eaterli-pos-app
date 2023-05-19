import React, {memo} from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import AppProgess from '../components/AppProgess';
// import {Grid, Row} from 'react-native-easy-grid';
import theme from '../theme';
import Text from './Text';
import AppProgess from './AppProgess';

function _ModalContainer({
  visible,
  title,
  onRequestClose,
  hideTitle = false,
  noscroll,
  fullHeight,
  height = theme.hp(80),
  minHeight = 200,
  center,
  children,
  renderFooter,
  borderRadius=10,
  width=theme.wp(92),
}) {
  // console.log(onRequestClose);
  let ConELE = noscroll ? View : ScrollView;
  let heightProp = fullHeight ? 'height' : 'maxHeight';
  return (
    <Modal visible={visible} transparent onRequestClose={onRequestClose}>
      <SafeAreaView
        style={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
          // paddingVertical: theme.hp(3),

          justifyContent: center ? 'center' : 'flex-start',
        }}>
        <View
          style={{
            width: width,

            //  minHeight: theme.hp(20),
            //  [heightProp]: height ? height : '92%',
            minHeight: minHeight,
            maxHeight: height,

            //  marginVertical: theme.hp(3),
            backgroundColor: 'white',
            borderRadius: borderRadius,
            overflow: 'hidden',
            marginTop: 10,
            // paddingHorizontal: theme.wp(3),
            // paddingVertical: theme.wp(3),
          }}>
          {hideTitle ? (
            <View
              style={{
                // backgroundColor: '#ededed',
                //paddingVertical: theme.wp(3),
                // borderWidth:StyleSheet.hairlineWidth,
                //elevation: 5,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  // textAlign: 'left',
                  // fontFamily: theme.fonts.SemiBold,
                  // color: 'white',
                  // fontSize: theme.hp(3),
                  // paddingLeft: theme.wp(3),
                  // paddingVertical: theme.wp(3),
                  // borderWidth:StyleSheet.hairlineWidth,
                  //  elevation: 5,
                  flex: 1,
                  //backgroundColor: 'red',
                }}
              />
              <TouchableOpacity
                style={{
                  paddingHorizontal: 15,
                  paddingTop: 15,
                  // backgroundColor: 'green',
                }}
                onPress={onRequestClose}>
                <FontAwesome5 name={'times'} size={18} color={'gray'} />
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                // backgroundColor: theme.colors.primaryColor,
                paddingVertical: 8,
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: '#aaa',
                flexDirection: 'row',

                alignItems: 'center',
              }}>
              <Text
                style={{
                  flex: 1,
                  //  marginTop:2
                  paddingLeft: 15,
                }}
                color={theme.colors.textColor}
                semibold
                size={16}>
                {title}
              </Text>

              {/* <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: theme.fonts.SemiBold,
                    color: 'white',
                    fontSize: theme.hp(2.2),
                    paddingLeft: theme.wp(3),
                    // paddingVertical: theme.wp(3),
                    // borderWidth:StyleSheet.hairlineWidth,
                    //  elevation: 5,
                    flex: 1,
                    //backgroundColor: 'red',
                  }}>
                  {title}
                </Text> */}
              <TouchableOpacity
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  opacity: 0.9,
                  // backgroundColor: 'green',
                  alignSelf: 'flex-start',
                }}
                onPress={onRequestClose}>
                <FontAwesome5
                  name={'times'}
                  size={18}
                  color={theme.colors.textColor}
                />
              </TouchableOpacity>
            </View>
          )}
          <ConELE
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={{
              paddingHorizontal: 10,
              // paddingVertical: 10,
              //  backgroundColor: 'blue',
              // flex: 1,
            }}
            contentContainerStyle={{
              paddingVertical: 10,
            }}>
            {children}
          </ConELE>

          {renderFooter && (
            <View style={{paddingHorizontal: 10, paddingVertical: 10}}>
              {renderFooter()}
            </View>
          )}
          {/* <AppProgess height="100%" /> */}
        </View>
        <AppProgess />
      </SafeAreaView>
    </Modal>
  );
}
const ModalContainer = memo(_ModalContainer);
export default ModalContainer;

const inStyle = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  row: {
    paddingBottom: theme.hp(1.7),
    paddingHorizontal: theme.paddingHorizontal,
    marginTop: theme.hp(1.7),
  },
  body: {
    width: '100%',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,

    elevation: 5,
    borderRadius: 3,
    paddingHorizontal: theme.hp(1.7),
    paddingVertical: theme.hp(1.7),
  },
  title: {
    textAlign: 'center',
    fontFamily: theme.fonts.SemiBold,
    color: theme.colors.primaryColor,
    fontSize: theme.hp(3),
  },
  container: {
    //  backgroundColor:'blue',
    paddingHorizontal: theme.hp(1.4),
    paddingVertical: theme.hp(1.4),
  },
});
