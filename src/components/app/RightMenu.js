import React from 'react';
import {
  Image,
  PermissionsAndroid,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import Text from '../Text';
import useTheme from '../../hooks/useTheme';
import SettingIcon from '../../assets/SettingIcon';
import RMenuIcon from '../../assets/RMenuIcon';
import CustomerIcon from '../../assets/CustomerIcon';
import OrderIcon from '../../assets/OrderIcon';
import OfferIcon from '../../assets/OfferIcon';
import GiftCardIcon from '../../assets/GiftCardIcon';
import CheckInIcon from '../../assets/CheckInIcon';
import TestingIcon from '../../assets/TestingIcon';
import SaleIcon from '../../assets/SaleIcon';
import AdjustIcon from '../../assets/AdjustIcon';
import GiftCardsModal from '../../Screens/components/GiftCardsModal';
import ScanOfferModal from '../../Screens/components/ScanOfferModal';
import orderAction from '../../redux/actions/order.action';
import {useDispatch, useSelector} from 'react-redux';
import ModalContainer from '../ModalContainer';
import {DINING_OPTION} from '../../constants/order.constant';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import POSModule from '../../helpers/pos.helper';
import userAction from '../../redux/actions/user.action';
export default function RightMenu() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const diningOption = useSelector(s => s.order.diningOption);
  const diningOptionModal = useSelector(s => s.order.diningOptionModal);

  const toggleModal = () => {
    dispatch(
      orderAction.set({
        diningOptionModal: {show: !diningOptionModal.show, ref: ''},
      }),
    );
  };
  return (
    <>
      <View
        style={{
          // backgroundColor: 'green',
          width: 110,
        }}>
        <Text align="center" mt={10} medium size={17} color="#F4F4F6">
          5:30 PM
        </Text>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}>
          <MenuButton
            Icon={RMenuIcon}
            active
            text="Menu"
            onPress={() => {
              navigation.navigate('ProductMenu');
            }}
          />
          <MenuButton
            Icon={() => {
              return (
                <Image
                  style={{
                    width: 25,
                    height: 25,
                  }}
                  resizeMode="contain"
                  source={require('../../assets/ic_customers.png')}
                />
              );
            }}
            text="Customers"
          />
          <MenuButton
            Icon={OrderIcon}
            text="Orders"
            onPress={() => {
              navigation.navigate('Orders');
            }}
          />
          <MenuButton
            Icon={OrderIcon}
            text="Hold Orders"
            onPress={() => {
              navigation.navigate('HoldOrders');
            }}
          />
          <MenuButton
            Icon={() => {
              return (
                <Image
                  style={{
                    width: 25,
                    height: 25,
                  }}
                  resizeMode="contain"
                  source={require('../../assets/ic_offers.png')}
                />
              );
            }}
            text="Scan Offer"
            onPress={() => {
              dispatch(
                userAction.set({
                  scanOfferModal: {show: true, ref: ''},
                }),
              );
            }}
          />
          <MenuButton
            Icon={GiftCardIcon}
            text="Gift Cards"
            onPress={() => {
              dispatch(
                userAction.set({
                  giftCardModal: {show: true, ref: ''},
                }),
              );
            }}
          />
          <MenuButton
            Icon={CheckInIcon}
            text="Check In/Out"
            onPress={() => {
              navigation.navigate('CheckInOut');
            }}
          />
          <MenuButton
            Icon={TestingIcon}
            text="Testing"
            onPress={() => {
              navigation.navigate('TestingPOS');
              // POSModule.printByAllInOnePOS(
              //   {id: 22, name: 'aakash', active: true},
              //   res => {
              //     console.log('[printByAllInOnePOS]', res);
              //     // alert(JSON.stringify(res));
              //   },
              // );
            }}
          />
          <MenuButton
            Icon={SaleIcon}
            text="Sale"
            onPress={() => {
              POSModule.doOpenCashBox();
            }}
          />
          <MenuButton Icon={AdjustIcon} text="Adjust Float" />
          <MenuButton
            Icon={AdjustIcon}
            text="Dining Option"
            onPress={() => {
              toggleModal();
            }}
          />
          <MenuButton
            Icon={AdjustIcon}
            text="Scan Reader"
            onPress={async () => {
              // We need to ask permission for Android only
              if (Platform.OS === 'android') {
                // Calling the permission function
                const granted = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.CAMERA,
                  {
                    title: 'Eaterli POS Camera Permission',
                    message: 'Eaterli POS needs access to your camera',
                  },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                  // Permission Granted
                  POSModule.scanQRCode();
                } else {
                  // Permission Denied
                  alert('CAMERA Permission Denied');
                }
              }
            }}
          />
        </ScrollView>
      </View>
      <ModalContainer
        // hideTitle
        center
        // noscroll
        onRequestClose={toggleModal}
        visible={diningOptionModal.show}
        title={`Dining Option`}
        width={350}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 20,
          }}>
          <DiningItem
            iconName="utensils"
            text={DINING_OPTION.dine_in.text}
            onPress={() => {
              dispatch(
                orderAction.set({
                  diningOption: DINING_OPTION.dine_in.id,
                }),
              );
              toggleModal();
              if (diningOptionModal.ref == 'pay-btn') {
                dispatch(
                  orderAction.set({
                    payModal: {show: true, ref: ''},
                  }),
                );
              }
            }}
          />
          <DiningItem
            iconName="utensils"
            text={DINING_OPTION.take_out.text}
            onPress={() => {
              dispatch(
                orderAction.set({
                  diningOption: DINING_OPTION.take_out.id,
                }),
              );
              toggleModal();
              if (diningOptionModal.ref == 'pay-btn') {
                dispatch(
                  orderAction.set({
                    payModal: {show: true, ref: ''},
                  }),
                );
              }
            }}
          />
        </View>
      </ModalContainer>

      <GiftCardsModal />
      <ScanOfferModal />
    </>
  );
}

function MenuButton({Icon, active, text = '', ...props}) {
  const themeData = useTheme();
  let color = active ? '#18171D' : '#F4F4F6';

  return (
    <TouchableOpacity
      style={{
        marginBottom: 15,
        borderRadius: 4,
        alignItems: 'center',
        backgroundColor: active ? '#00ABA5' : null,
        paddingHorizontal: 8,
        paddingVertical: 8,
      }}
      {...props}>
      {!!Icon && <Icon color={color} width={22} height={22} />}
      <Text size={12} mt={5} color={color}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}
function DiningItem({
  text,
  iconName,
  IconComponent = FontAwesome5Icon,
  onPress,
}) {
  let themeData = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: 10,
        paddingVertical: 20,
        // borderBottomColor: '#eee',
        // borderBottomWidth: 1,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: themeData.cardBg,
        borderRadius: 5,
      }}>
      <IconComponent color={themeData.textColor} size={18} name={iconName} />
      <Text color={themeData.textColor} medium mt={10} size={16}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}
