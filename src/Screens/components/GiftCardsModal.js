import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View, TextInput as _TextInput} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ModalContainer from '../../components/ModalContainer';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import orderAction from '../../redux/actions/order.action';
import userAction from '../../redux/actions/user.action';
import POSButton from './POSButton';
import {GIFT_CARD_VIEW} from '../../constants/user.constant';
import TextInput from '../../components/Controls/TextInput';
import {
  create_UUID,
  getPercentValue,
  simpleToast,
} from '../../helpers/app.helpers';
import SelectRadio from '../../components/Controls/SelectRadio';
import Button from '../../components/Button';
import Text from '../../components/Text';
import Select from '../../components/Controls/Select';
import {MenuProvider} from 'react-native-popup-menu';
import CheckBox from '../../components/Controls/CheckBox';
import * as yup from 'yup';
import DateTimePicker from '../../components/Controls/DateTimePicker';
import {uniqueId} from 'lodash';
import {getCartItemID} from '../../helpers/order.helper';
import theme from '../../theme';
import {ORDER_ITEM_TYPE} from '../../constants/order.constant';
const Buffer = require('buffer').Buffer;
let initialFormData = {
  amount: '',
  card_type: '1',

  send_to_email: '',
  send_to_phone: '',
  send_to_deliver: 'now',
  send_to_deliver_date: '',

  purchaser_info_email: '',
  purchaser_info_phone: '',
  purchaser_info_notify: false,

  personalized_message_to: '',
  personalized_message_from: '',
  personalized_message: '',
};
const TEST_ORDATA = ''; //WyJnaWZ0LWNhcmQiLDE3LDI3NSw3XQ==
export default function GiftCardsModal(props) {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(true);
  const [view, setView] = useState(GIFT_CARD_VIEW.options.id);

  const [formData, setFormData] = useState(initialFormData);
  const userData = useSelector(s => s.user.userData);
  const {height, width} = useWindowDimensions();
  const giftCardModal = useSelector(s => s.user.giftCardModal);
  const [balance, setBalanace] = useState('');
  const [giftCardID, setGiftCardId] = useState('');

  const [QRData, setQRData] = useState(TEST_ORDATA); //WyJnaWZ0LWNhcmQiLDE3LDI3NSw3XQ==

  // useEffect(() => {
  //   loadData();
  // }, []);
  useEffect(() => {
    if (!giftCardModal.show) {
      setView(GIFT_CARD_VIEW.options.id);
      setFormData(initialFormData);
    }
  }, [giftCardModal.show]);

  // const loadData = async () => {
  //   setLoaded(true);
  // };
  //
  const toggleModal = () => {
    dispatch(
      userAction.set({
        giftCardModal: {show: !giftCardModal.show, ref: ''},
      }),
    );
  };

  const createCardPress = async () => {
    let id = getCartItemID(
      ORDER_ITEM_TYPE.giftcard.id,
      create_UUID(),
      {},
      [],
      0,
    ); //idPart.join("-");

    let added = dispatch(
      orderAction.addToCart(id, {
        price: parseFloat(formData.amount),
        ...formData,
      }),
    );

    toggleModal();

    // let r = await dispatch(
    //   userAction.createGiftCard({...formData, staff_id: userData.user_id}),
    // );

    // if (r && r.status) {
    //   simpleToast(r.message);
    //   toggleModal();
    // }
  };
  const balanceQRValidating = async () => {
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
      let [type, card_id, uid, rid] = jsonob;
      // console.log(id, rid);
      if (
        jsonob &&
        card_id &&
        rid &&
        rid == userData.restaurant.id &&
        type == 'gift-card'
      ) {
        // console.log(jsonob);
        let r = await dispatch(userAction.getGiftCardBalance(rid, card_id));
        if (r && r.status) {
          if (!r.data) {
            simpleToast('Invalid QR Code.');
            setQRData('');
            return;
          }
          setBalanace(r.data.total_balance || 0);

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
  const addValueQRValidating = async () => {
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
      let [type, card_id, uid, rid] = jsonob;
      // console.log(id, rid);
      if (
        jsonob &&
        card_id &&
        rid &&
        rid == userData.restaurant.id &&
        type == 'gift-card'
      ) {
        // console.log(jsonob);
        let r = await dispatch(userAction.getGiftCardBalance(rid, card_id));
        if (r && r.status) {
          if (!r.data) {
            simpleToast('Invalid QR Code.');
            setQRData('');
            return;
          }
          setGiftCardId(card_id);
          setBalanace(r.data.total_balance || 0);

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

  const renderView = () => {
    switch (view) {
      case GIFT_CARD_VIEW.options.id:
        return (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20,
            }}>
            <POSButton
              onPress={() => {
                setView(GIFT_CARD_VIEW.sell_card.id);
              }}
              text={'Sell Card'}
            />
            <POSButton
              text={'Add Value($)'}
              onPress={() => {
                setGiftCardId('');
                setQRData(TEST_ORDATA);
                setView(GIFT_CARD_VIEW.add_value.id);
              }}
            />
            <POSButton
              text={'Balance Inquiry'}
              onPress={() => {
                setBalanace('');
                setQRData(TEST_ORDATA);
                setView(GIFT_CARD_VIEW.balance_inquiry.id);
              }}
            />
          </View>
        );

      case GIFT_CARD_VIEW.sell_card.id:
        return (
          <View
            style={{
              width: 320,
              // backgroundColor: 'red',
              alignSelf: 'center',
            }}>
            <TextInput
              title="Amount ($)"
              containerStyle={{
                marginBottom: 20,
                // flex: 2,
                // width: getPercentValue(width, 40),
                paddingVertical: 5,
                paddingHorizontal: 15,
                // backgroundColor: 'red',
              }}
              textInputProps={{
                keyboardType: 'numeric',
                placeholder: '$5.00 - $2,000.00',
                value: formData.amount,
                onChangeText: v => {
                  setFormData(f => {
                    return {...f, amount: v};
                  });
                },
              }}
            />
            <SelectRadio
              title="Card Type"
              // disabled={submitted}
              // error={
              //   props.errors[data.id] && props.touched[data.id]
              //     ? props.errors[data.id]
              //     : ''
              // }
              onValueChange={value => {
                setFormData(f => {
                  return {...f, card_type: value};
                });
              }}
              value={formData.card_type}
              data={[
                {label: 'eGift Card', value: '1'},
                {label: 'Classic Gift Card', value: '2'},
              ]}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Button
                onPress={() => {
                  setView(GIFT_CARD_VIEW.options.id);
                }}
                backgroundColor="#212121">
                Back
              </Button>
              <Button
                onPress={() => {
                  if (!formData.amount.trim()) {
                    simpleToast('Enter amount');
                    return;
                  }

                  let amount = parseFloat(formData.amount);
                  if (!(amount >= 5 && amount <= 2000)) {
                    simpleToast('Enter Amount between 5-2000');
                    return;
                  }

                  setView(GIFT_CARD_VIEW.send_to.id);
                }}>
                Next
              </Button>
            </View>
          </View>
        );

      case GIFT_CARD_VIEW.send_to.id:
        return (
          <View
            style={{
              width: 320,
              // backgroundColor: 'red',
              alignSelf: 'center',
            }}>
            <Text bold size={20} mb={5}>
              Send To:
            </Text>
            <TextInput
              title="Email"
              containerStyle={{
                marginBottom: 20,
                // flex: 2,
                // width: getPercentValue(width, 40),
                paddingVertical: 5,
                paddingHorizontal: 15,
                // backgroundColor: 'red',
              }}
              textInputProps={{
                keyboardType: 'email-address',
                placeholder: '',
                value: formData.send_to_email,
                onChangeText: v => {
                  setFormData(f => {
                    return {...f, send_to_email: v};
                  });
                },
              }}
            />
            <Text medium size={16} align="center" mb={5}>
              OR
            </Text>
            <TextInput
              title="Phone"
              containerStyle={{
                marginBottom: 20,
                // flex: 2,
                // width: getPercentValue(width, 40),
                paddingVertical: 5,
                paddingHorizontal: 15,
                // backgroundColor: 'red',
              }}
              textInputProps={{
                autoCapitalize: 'none',

                placeholder: 'Phone No.',

                type: 'custom',
                options: {
                  mask: '(999) 999-9999',
                },

                keyboardType: 'numeric',

                value: formData.send_to_phone,
                onChangeText: v => {
                  setFormData(f => {
                    return {...f, send_to_phone: v};
                  });
                },
              }}
            />

            <Select
              title="When would you like it to be delivered?"
              containerStyle={{
                marginBottom: 20,
                // flex: 1,
                // width: getPercentValue(width, 20),
                paddingVertical: 5,
                paddingHorizontal: 15,
                // backgroundColor: 'red',
                // marginRight: 5,
              }}
              onValueChange={item => {
                setFormData(f => {
                  return {...f, send_to_deliver: item};
                });
              }}
              data={[
                // {
                //   value: '',
                //   label: 'Select',
                // },
                {
                  value: 'now',
                  label: 'Now',
                },
                {
                  value: 'schedule',
                  label: 'Schedule',
                },
              ]}
              value={formData.send_to_deliver}
              // error={props.errors.mode?.value ? props.errors.mode?.value : ''}
              // containerStyle={{marginBottom: 20}}
            />

            {formData.send_to_deliver == 'schedule' && (
              <View
                style={{
                  flexDirection: 'row',
                  // backgroundColor: 'red',
                }}>
                <View
                  style={{
                    flex: 1,
                    marginRight: 2.5,
                  }}>
                  <DateTimePicker
                    sm
                    mode="date"
                    value={formData.send_to_deliver_date}
                    placeholder={'Select Date'}
                    title={'Date'}
                    // error={props.errors.date ? props.errors.date : ''}
                    onChange={value => {
                      setFormData(f => {
                        return {...f, send_to_deliver_date: value};
                      });
                    }}
                    minimumDate={new Date()}
                    // containerStyle={{
                    //   flex:1
                    // }}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    marginLeft: 2.5,
                  }}>
                  <DateTimePicker
                    sm
                    mode="time"
                    value={formData.send_to_deliver_date}
                    title={'Time'}
                    placeholder={'Select Time'}
                    // error={props.errors.time ? props.errors.time : ''}
                    onChange={value => {
                      setFormData(f => {
                        return {...f, send_to_deliver_date: value};
                      });
                    }}
                    minimumDate={new Date()}
                    // containerStyle={{
                    //   flex:1
                    // }}
                  />
                </View>
              </View>
            )}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Button
                onPress={() => {
                  setView(GIFT_CARD_VIEW.sell_card.id);
                }}
                backgroundColor="#212121">
                Back
              </Button>
              <Button
                onPress={async () => {
                  const validationSchema = yup
                    .string()
                    .email('Invalid email Address');

                  if (formData.send_to_email.trim()) {
                    let email = await validationSchema
                      .validate(formData.send_to_email)
                      .catch(e => {
                        simpleToast(e.message);
                        // console.log(e.message);
                      });
                    if (!email) {
                      return;
                    }
                  }

                  if (
                    !(
                      formData.send_to_email.trim() ||
                      formData.send_to_phone.trim().length == 14
                    )
                  ) {
                    simpleToast('Enter Email or Phone');
                    return;
                  }

                  if (
                    formData.send_to_deliver == 'schedule' &&
                    !formData.send_to_deliver_date
                  ) {
                    simpleToast('Enter Date Time');
                    return;
                  }

                  setView(GIFT_CARD_VIEW.purchaser_info.id);
                }}>
                Next
              </Button>
            </View>
          </View>
        );
      case GIFT_CARD_VIEW.purchaser_info.id:
        return (
          <View
            style={{
              width: 380,
              // backgroundColor: 'red',
              alignSelf: 'center',
            }}>
            <Text bold size={20} mb={5}>
              Purchaser Information (Optional)
            </Text>
            <TextInput
              title="Email"
              containerStyle={{
                marginBottom: 20,
                // flex: 2,
                // width: getPercentValue(width, 40),
                paddingVertical: 5,
                paddingHorizontal: 15,
                // backgroundColor: 'red',
              }}
              textInputProps={{
                keyboardType: 'email-address',
                placeholder: '',
                value: formData.purchaser_info_email,
                onChangeText: v => {
                  setFormData(f => {
                    return {...f, purchaser_info_email: v};
                  });
                },
              }}
            />

            <TextInput
              title="Phone"
              containerStyle={{
                marginBottom: 20,
                // flex: 2,
                // width: getPercentValue(width, 40),
                paddingVertical: 5,
                paddingHorizontal: 15,
                // backgroundColor: 'red',
              }}
              textInputProps={{
                autoCapitalize: 'none',

                placeholder: 'Phone No.',

                type: 'custom',
                options: {
                  mask: '(999) 999-9999',
                },

                keyboardType: 'numeric',

                value: formData.purchaser_info_phone,
                onChangeText: v => {
                  setFormData(f => {
                    return {...f, purchaser_info_phone: v};
                  });
                },
              }}
            />

            <CheckBox
              title="Notify purchaser when the card is opened"
              checked={formData.purchaser_info_notify}
              onChange={d => {
                setFormData(f => {
                  return {...f, purchaser_info_notify: d};
                });
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Button
                onPress={() => {
                  setView(GIFT_CARD_VIEW.send_to.id);
                }}
                backgroundColor="#212121">
                Back
              </Button>
              <Button
                onPress={() => {
                  setView(GIFT_CARD_VIEW.personalized_message.id);
                }}>
                Next
              </Button>
            </View>
          </View>
        );

      case GIFT_CARD_VIEW.personalized_message.id:
        return (
          <View
            style={{
              width: 380,
              // backgroundColor: 'red',
              alignSelf: 'center',
            }}>
            <Text bold size={20} mb={5}>
              Sending To:
            </Text>
            <Text size={18} mb={5}>
              Text Message : {formData.send_to_phone}
            </Text>
            <Text bold size={20} mb={5}>
              Personalized Message (Optional)
            </Text>
            <TextInput
              title="To"
              containerStyle={{
                marginBottom: 20,
                // flex: 2,
                // width: getPercentValue(width, 40),
                paddingVertical: 5,
                paddingHorizontal: 15,
                // backgroundColor: '#f6f6f6',
              }}
              textInputProps={{
                //  keyboardType: 'email-address',
                placeholder: "Recipient's Name",
                value: formData.personalized_message_to,
                onChangeText: v => {
                  setFormData(f => {
                    return {...f, personalized_message_to: v};
                  });
                },
              }}
            />
            <TextInput
              title="From"
              containerStyle={{
                marginBottom: 20,
                // flex: 2,
                // width: getPercentValue(width, 40),
                paddingVertical: 5,
                paddingHorizontal: 15,
                // backgroundColor: '#f6f6f6',
              }}
              textInputProps={{
                //  keyboardType: 'email-address',
                placeholder: 'Your Name',
                value: formData.personalized_message_from,
                onChangeText: v => {
                  setFormData(f => {
                    return {...f, personalized_message_from: v};
                  });
                },
              }}
            />

            <TextInput
              title="Message"
              containerStyle={{
                marginBottom: 20,
                // flex: 2,
                // width: getPercentValue(width, 40),
                paddingVertical: 5,
                paddingHorizontal: 15,
                // backgroundColor: '#f6f6f6',
                height: 100,
              }}
              textInputProps={{
                multiline: true,
                //  keyboardType: 'email-address',
                placeholder: '',
                value: formData.personalized_message,
                onChangeText: v => {
                  setFormData(f => {
                    return {...f, personalized_message: v};
                  });
                },
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Button
                onPress={() => {
                  setView(GIFT_CARD_VIEW.purchaser_info.id);
                }}
                backgroundColor="#212121">
                Back
              </Button>
              <Button onPress={createCardPress}>Create</Button>
            </View>
          </View>
        );
      ////////////////////
      case GIFT_CARD_VIEW.balance_inquiry.id:
        return (
          <>
            <View
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
            </View>
            {balance != '' ? (
              <View>
                <Text align="center" semibold mt={30} mb={30} size={22}>
                  Total Balance:{' '}
                  <Text
                    align="center"
                    color={theme.colors.primaryColor}
                    bold
                    size={22}>
                    $ {parseFloat(balance).toFixed(2)}
                  </Text>
                </Text>
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
                    color: '#00000000',
                    opacity: 0.1,
                    width: '100%',
                    height: '100%',
                    zIndex: 2,
                    textAlignVertical: 'top',
                  }}
                  caretHidden
                  selectionColor={'#00000000'}
                  autoFocus
                  showSoftInputOnFocus={!!TEST_ORDATA}
                  returnKeyType="next"
                  value={QRData}
                  onChangeText={t => {
                    setQRData(t);
                  }}
                  onSubmitEditing={() => {
                    balanceQRValidating();
                  }}
                />
              </View>
            )}
          </>
        );
      ////////////////////////
      case GIFT_CARD_VIEW.add_value.id:
        return (
          <>
            <View
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
                Add Value($)
              </Text>
            </View>
            {giftCardID != '' ? (
              <View
                style={{
                  width: 380,
                  // backgroundColor: 'red',
                  alignSelf: 'center',
                  paddingVertical: 10,
                }}>
                <Text semibold mt={10} mb={10} size={22}>
                  Card No.: {giftCardID}
                </Text>
                <Text semibold mb={10} size={22}>
                  Available Balance: {parseFloat(balance).toFixed(2)}
                </Text>
                <TextInput
                  title="Enter Amount ($)"
                  containerStyle={{
                    marginBottom: 20,
                    // flex: 2,
                    // width: getPercentValue(width, 40),
                    paddingVertical: 5,
                    paddingHorizontal: 15,
                    // backgroundColor: 'red',
                  }}
                  textInputProps={{
                    keyboardType: 'numeric',
                    placeholder: '$5.00 - $2,000.00',
                    value: formData.amount,
                    onChangeText: v => {
                      setFormData(f => {
                        return {...f, amount: v};
                      });
                    },
                  }}
                />
                <Button
                  onPress={() => {
                    if (!formData.amount.trim()) {
                      simpleToast('Enter amount');
                      return;
                    }

                    let amount = parseFloat(formData.amount);
                    if (!(amount >= 5 && amount <= 2000)) {
                      simpleToast('Enter Amount between 5-2000');
                      return;
                    }
                    let id = getCartItemID(
                      ORDER_ITEM_TYPE.giftcard_add_balance.id,
                      create_UUID(),
                    ); //idPart.join("-");

                    let added = dispatch(
                      orderAction.addToCart(id, {
                        price: parseFloat(amount.toFixed(2)),
                        card_id: giftCardID,
                      }),
                    );
                    toggleModal();
                  }}
                  style={{
                    alignSelf: 'flex-end',
                  }}>
                  Add
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
                    color: '#00000000',
                    opacity: 0.1,
                    width: '100%',
                    height: '100%',
                    zIndex: 2,
                    textAlignVertical: 'top',
                  }}
                  caretHidden
                  selectionColor={'#00000000'}
                  autoFocus
                  showSoftInputOnFocus={!!TEST_ORDATA}
                  returnKeyType="next"
                  value={QRData}
                  onChangeText={t => {
                    setQRData(t);
                  }}
                  onSubmitEditing={() => {
                    addValueQRValidating();
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
        visible={giftCardModal.show}
        title={`Gift Cards`}
        //width={350}
        landscapeWidth={720}>
        <MenuProvider skipInstanceCheck>{renderView()}</MenuProvider>
      </ModalContainer>
    </>
  );
}
