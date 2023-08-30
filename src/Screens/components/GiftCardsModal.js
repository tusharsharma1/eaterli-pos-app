import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
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
export default function GiftCardsModal(props) {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(true);
  const [view, setView] = useState(GIFT_CARD_VIEW.options.id);
  const [formData, setFormData] = useState(initialFormData);
  const userData = useSelector(s => s.user.userData);

  const giftCardModal = useSelector(s => s.user.giftCardModal);

  let {width} = useWindowDimensions();

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
    let id = getCartItemID('giftcard', create_UUID(), {}, [], 0); //idPart.join("-");

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
            <POSButton text={'Add Value($)'} />
            <POSButton text={'Balance Inquiry'} />
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
                  mask: '(999) 999 9999',
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
                  mask: '(999) 999 9999',
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
