import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import appAction from '../../redux/actions/app.action';
import ModalContainer from '../ModalContainer';
import Table from '../Table';
import TextInput from '../Controls/TextInput';
import {TouchableOpacity, View} from 'react-native';
import Text from '../Text';
import useTheme from '../../hooks/useTheme';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import theme from '../../theme';
import Button from '../Button';
const VIEWS = {
  money: {id: 'money'},
  weather: {id: 'weather'},
};
export default function StartDateModal({}) {
  const themeData = useTheme();
  const startModal = useSelector(s => s.app.startModal);
  const userData = useSelector(s => s.user.userData);
  const [view, setView] = useState(VIEWS.money.id);
  const deviceId = useSelector(s => s.user.deviceId);
  const [notes, setNotes] = useState([
    {
      title: 'One',
      money: 1,
      qty: '',
    },
    {
      title: 'Five',
      money: 5,
      qty: '',
    },
    {
      title: 'Ten',
      money: 10,
      qty: '',
    },
    {
      title: 'Twenty',
      money: 20,
      qty: '',
    },
    {
      title: 'Fifty',
      money: 50,
      qty: '',
    },
    {
      title: 'Hundred',
      money: 100,
      qty: '',
    },
  ]);
  const [cents, setCents] = useState([
    {
      title: 'Pennies',
      money: 0.01,
      qty: '',
    },
    {
      title: 'Nickels',
      money: 0.05,
      qty: '',
    },
    {
      title: 'Dimes',
      money: 0.1,
      qty: '',
    },
    {
      title: 'Quarters',
      money: 0.25,
      qty: '',
    },
  ]);
  const [weather, setWeather] = useState('sun');
  const [remark, setRemark] = useState('');
  const dispatch = useDispatch();
  useEffect(() => {}, []);

  const toggleModal = () => {
    dispatch(
      appAction.set({
        startModal: !startModal,
      }),
    );
  };

  const onNoteChangeQty = (val, index) => {
    setNotes(d => {
      let _d = [...d];
      _d.splice(index, 1, {..._d[index], qty: parseInt(val)});
      return _d;
    });
  };
  const getNotesTotal = () => {
    let gtotal = notes.reduce((s, r) => {
      let qty = isNaN(r.qty) ? 0 : r.qty;
      let total = qty * r.money;
      return s + total;
    }, 0);
    return gtotal.toFixed(2);
  };
  const onCentsChangeQty = (val, index) => {
    setCents(d => {
      let _d = [...d];
      _d.splice(index, 1, {..._d[index], qty: parseInt(val)});
      return _d;
    });
  };

  const getCentsTotal = () => {
    let gtotal = cents.reduce((s, r) => {
      let qty = isNaN(r.qty) ? 0 : r.qty;
      let total = qty * r.money;
      return s + total;
    }, 0);
    return gtotal.toFixed(2);
  };

  const onSubmit = () => {
    let payload = {
      notes: notes,
      cents: cents,
      notes_total: getNotesTotal(),
      cents_total: getCentsTotal(),
      weather: weather,
      remark: remark,
      device_id: deviceId,
      user_id: userData.user_id,
    };
    console.log(payload);
  };

  const renderView = () => {
    if (view == VIEWS.money.id) {
      return (
        <>
          <Table
            data={notes}
            columns={[
              {
                title: 'Money',
                align: 'left',
                key: 'title',
              },
              {
                title: 'Quantity',
                align: 'auto',
                // backgroundColor: 'red',
                width: 100,
                renderValue: (_data, index) => {
                  return (
                    <View
                      style={{
                        // backgroundColor: 'yellow',
                        width: 100,
                        // height:20
                        // flex:1
                      }}>
                      {/* <Text>dd</Text> */}
                      <TextInput
                        textInputProps={{
                          onChangeText: v => {
                            onNoteChangeQty(v, index);
                          },
                          // onBlur: props.handleBlur('name'),
                          value: isNaN(_data.qty) ? '' : _data.qty.toString(),
                          keyboardType: 'numeric',
                          // autoCompleteType: 'email',
                          autoCapitalize: 'none',
                          // returnKeyType: 'next',
                          // placeholder: 'Name',
                          //  onSubmitEditing: () => this.passwordInput.focus(),
                          //ref: r => (this.emailInput = r),
                        }}
                        containerStyle={{
                          marginBottom: 0,
                          paddingVertical: 2,
                          paddingHorizontal: 5,
                          // width: '100%',
                          // flex: 1,
                          // backgroundColor:'red'
                        }}
                        // error={
                        //   props.errors.name && props.touched.name
                        //     ? props.errors.name
                        //     : ''
                        // }
                        // title="Name"
                      />
                    </View>
                  );
                },
              },
              {
                title: 'Totals',
                align: 'right',
                renderValue: _data => {
                  return `$${((_data.qty || 0) * _data.money).toFixed(2)}`;
                },
              },
            ]}
          />
          <View
            style={{
              marginBottom: 20,
            }}>
            <Text align="right" semibold color={themeData.textColor} size={16}>
              Grand Total: ${getNotesTotal()}
            </Text>
          </View>
          <Table
            data={cents}
            columns={[
              {
                title: 'Money',
                align: 'left',
                key: 'title',
              },
              {
                title: 'Quantity',
                align: 'auto',
                // backgroundColor: 'red',
                width: 100,
                renderValue: (_data, index) => {
                  return (
                    <View
                      style={{
                        // backgroundColor: 'yellow',
                        width: 100,
                        // height:20
                        // flex:1
                      }}>
                      {/* <Text>dd</Text> */}
                      <TextInput
                        textInputProps={{
                          onChangeText: v => {
                            onCentsChangeQty(v, index);
                          },
                          // onBlur: props.handleBlur('name'),
                          value: isNaN(_data.qty) ? '' : _data.qty.toString(),
                          keyboardType: 'numeric',
                          // autoCompleteType: 'email',
                          autoCapitalize: 'none',
                          // returnKeyType: 'next',
                          // placeholder: 'Name',
                          //  onSubmitEditing: () => this.passwordInput.focus(),
                          //ref: r => (this.emailInput = r),
                        }}
                        containerStyle={{
                          marginBottom: 0,
                          paddingVertical: 2,
                          paddingHorizontal: 5,
                          // width: '100%',
                          // flex: 1,
                          // backgroundColor:'red'
                        }}
                        // error={
                        //   props.errors.name && props.touched.name
                        //     ? props.errors.name
                        //     : ''
                        // }
                        // title="Name"
                      />
                    </View>
                  );
                },
              },
              {
                title: 'Totals',
                align: 'right',
                renderValue: _data => {
                  return `$${((_data.qty || 0) * _data.money).toFixed(2)}`;
                },
              },
            ]}
          />
          <View
            style={{
              marginBottom: 20,
            }}>
            <Text align="right" semibold color={themeData.textColor} size={16}>
              Grand Total: ${getCentsTotal()}
            </Text>
          </View>

          <Button
            onPress={() => {
              setView(VIEWS.weather.id);
            }}
            mt={20}
            mb={20}
            width={200}
            style={{
              alignSelf: 'center',
            }}>
            Next
          </Button>
        </>
      );
    } else if (view == VIEWS.weather.id) {
      return (
        <>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,
            }}>
            <Text
              color={themeData.textColor}
              semibold
              style={{
                flex: 1,
              }}>
              Weather
            </Text>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <WeatherBtn
                onPress={() => {
                  setWeather('sun');
                }}
                active={weather == 'sun'}
                iconName={'sun'}
              />
              <WeatherBtn
                onPress={() => {
                  setWeather('cloud-sun');
                }}
                active={weather == 'cloud-sun'}
                iconName={'cloud-sun'}
              />
              <WeatherBtn
                onPress={() => {
                  setWeather('cloud');
                }}
                active={weather == 'cloud'}
                iconName={'cloud'}
              />
              <WeatherBtn
                onPress={() => {
                  setWeather('cloud-rain');
                }}
                active={weather == 'cloud-rain'}
                iconName={'cloud-rain'}
              />
              <WeatherBtn
                onPress={() => {
                  setWeather('bolt');
                }}
                active={weather == 'bolt'}
                iconName={'bolt'}
              />
            </View>
          </View>
          <TextInput
            textInputProps={{
              onChangeText: v => {
                setRemark(v);
              },
             
              value: remark,
              // keyboardType: 'numeric',
              // autoCompleteType: 'email',
              // autoCapitalize: 'none',
              multiline: true,

              // returnKeyType: 'next',
              // placeholder: 'Name',
              //  onSubmitEditing: () => this.passwordInput.focus(),
              //ref: r => (this.emailInput = r),
            }}
            textStyle={{
              height: 80,
              textAlignVertical: 'top',
            }}
            containerStyle={{
              marginBottom: 0,
              paddingVertical: 2,
              paddingHorizontal: 5,
              // width: '100%',
              // flex: 1,
              // backgroundColor:'red'
            }}
            // error={
            //   props.errors.name && props.touched.name
            //     ? props.errors.name
            //     : ''
            // }
            title="Note"
          />
          <Button
            onPress={onSubmit}
            mt={20}
            mb={20}
            width={200}
            style={{
              alignSelf: 'center',
            }}>
            Submit
          </Button>
        </>
      );
    }
    return null;
  };

  return (
    <ModalContainer
      title={'Start of the Date'}
      visible={startModal}
      landscapeWidth={400}
      onRequestClose={toggleModal}>
      {renderView()}
    </ModalContainer>
  );
}

function WeatherBtn({active, iconName, ...props}) {
  const themeData = useTheme();
  return (
    <TouchableOpacity
      style={{
        paddingHorizontal: 10,
        paddingVertical: 5,
      }}
      {...props}>
      <FontAwesome5
        solid
        size={22}
        color={active ? theme.colors.primaryColor : themeData.textColor}
        name={iconName}
      />
    </TouchableOpacity>
  );
}
