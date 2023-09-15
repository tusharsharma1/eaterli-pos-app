import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View, TextInput as _TextInput} from 'react-native';
import {MenuProvider} from 'react-native-popup-menu';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../../components/Button';
import ModalContainer from '../../components/ModalContainer';
import Text from '../../components/Text';
import {ORDER_ITEM_TYPE} from '../../constants/order.constant';
import {SCAN_OFFER_VIEW} from '../../constants/user.constant';
import {
  create_UUID,
  getPercentValue,
  simpleToast,
} from '../../helpers/app.helpers';
import {breakCartItemID, getCartItemID} from '../../helpers/order.helper';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import orderAction from '../../redux/actions/order.action';
import userAction from '../../redux/actions/user.action';
const Buffer = require('buffer').Buffer;

const TEST_ORDATA = ''//Buffer.from('["offer",4,332,7]').toString('base64');
export default function ScanOfferModal(props) {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(true);
  const [view, setView] = useState(SCAN_OFFER_VIEW.scan_offer.id);

  const [offerData, setOfferData] = useState(null);
  const userData = useSelector(s => s.user.userData);
  const {height, width} = useWindowDimensions();
  const scanOfferModal = useSelector(s => s.user.scanOfferModal);

  const [QRData, setQRData] = useState(TEST_ORDATA); //WyJnaWZ0LWNhcmQiLDE3LDI3NSw3XQ==

  // useEffect(() => {
  //   loadData();
  // }, []);
  useEffect(() => {
    if (!scanOfferModal.show) {
      setView(SCAN_OFFER_VIEW.scan_offer.id);
      setOfferData(null);
    }
  }, [scanOfferModal.show]);

  // const loadData = async () => {
  //   setLoaded(true);
  // };
  //
  const toggleModal = () => {
    dispatch(
      userAction.set({
        scanOfferModal: {show: !scanOfferModal.show, ref: ''},
      }),
    );
  };

  const QRValidating = async () => {
    if (QRData) {
      let jsonob = null;
      // console.log(QRData);
      try {
        let json = Buffer.from(QRData, 'base64').toString('utf8');

        console.log(json);
        jsonob = JSON.parse(json);
      } catch {
        jsonob = null;
      }
      jsonob = jsonob || [];
      let [type, offer_id, uid, rid] = jsonob;
      // console.log(id, rid);
      if (
        jsonob &&
        offer_id &&
        rid &&
        rid == userData.restaurant.id &&
        type == 'offer'
      ) {
        // console.log(jsonob);
        let r = await dispatch(userAction.getOfferDetail(rid, offer_id));
        if (r && r.status) {
          if (!r.data) {
            simpleToast('Invalid QR Code.');
            setQRData('');
            return;
          }
          setOfferData(r.data);

          // setModalView(CART_MODAL_VIEW.customer_phone.id);
        } else {
          simpleToast('Invalid QR Code.');
          setQRData('');
          // setQRData({error: true, message: 'Invalid QR Code.'});
        }
      } else {
        simpleToast('Invalid QR Code.');
        setQRData('');
      }
      // setValidating(false);
    }
  };
  const onApplyPress = () => {
    let {cart} = React.store.getState().order;
    let findId = Object.keys(cart).find(d => {
      let {itemtype, itemId, sizeId, addon, productMenuType} =
        breakCartItemID(d);

      return itemtype == ORDER_ITEM_TYPE.offer.id;
    });
    if (!!findId) {
      simpleToast('You can apply only 1 offer');
      return;
    }
    let id = getCartItemID(ORDER_ITEM_TYPE.offer.id, create_UUID()); //idPart.join("-");

    let added = dispatch(
      orderAction.addToCart(id, {
        price: 0,
        offer_id: offerData.id,
        offerData: offerData,
      }),
    );
    toggleModal();
  };
  const renderView = () => {
    switch (view) {
      case SCAN_OFFER_VIEW.scan_offer.id:
        return (
          <>
            {/* <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Button
                onPress={() => {
                  setView(GIFT_CARD_VIEW.options.id);
                }}
                style={{
                  alignSelf: 'flex-start',
                }}>
                Back
              </Button>
              <Text ml={10} size={18} medium>
                Balance Inquiry
              </Text>
            </View> */}
            {!!offerData ? (
              <View
                style={{
                  alignItems: 'center',
                }}>
                <Text align="center" semibold mt={30} mb={30} size={22}>
                  {offerData.title}
                </Text>
                <Button onPress={onApplyPress} ph={30}>
                  Apply
                </Button>
              </View>
            ) : (
              <View
                style={{
                  width: '100%',
                  height: getPercentValue(height, 60),
                  alignItems: 'center',
                  justifyContent: 'center',
                  // paddingVertical: 10,
                  // backgroundColor: 'red',
                }}>
                <View
                  style={{
                    position: 'absolute',
                    zIndex: 1,
                  }}>
                  <ActivityIndicator size={'large'} />
                  <Text>Scanning...</Text>
                </View>
                <_TextInput
                  style={{
                    backgroundColor: '#000000',
                    color: TEST_ORDATA ? '#000' : '#00000000',
                    opacity: 0.1,
                    width: '100%',
                    height: '100%',
                    zIndex: 2,
                    textAlignVertical: 'top',
                  }}
                  caretHidden
                  selectionColor={'#000000'}
                  autoFocus
                  showSoftInputOnFocus={!!TEST_ORDATA}
                  returnKeyType="next"
                  value={QRData}
                  onChangeText={t => {
                    setQRData(t);
                  }}
                  onSubmitEditing={() => {
                    QRValidating();
                  }}
                />
              </View>
            )}
          </>
        );
    }
  };
  // console.log(formData.send_to_deliver_date);
  return (
    <>
      <ModalContainer
        // hideTitle
        center
        // noscroll
        onRequestClose={toggleModal}
        visible={scanOfferModal.show}
        title={`Scan Offer`}
        //width={350}
        landscapeWidth={720}>
        <MenuProvider skipInstanceCheck>{renderView()}</MenuProvider>
      </ModalContainer>
    </>
  );
}
