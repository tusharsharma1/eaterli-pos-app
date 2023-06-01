import {Formik} from 'formik';
import React, {useEffect, useState} from 'react';
import {Keyboard, ScrollView} from 'react-native';
// import ActionSheet from 'react-native-actionsheet';
// import ImagePicker from 'react-native-image-crop-picker';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import * as yup from 'yup';
import Button from '../components/Button';
import TextInput from '../components/Controls/TextInput';
import {showToast, simpleToast} from '../helpers/app.helpers';
import storageHelper from '../helpers/storage.helper';
import stringHelper from '../helpers/string.helper';
import userAction from '../redux/actions/user.action';
import paymentService from '../services/payment.service';
import appAction from '../redux/actions/app.action';
import {View} from 'react-native';
import Text from '../components/Text';
import Switch from '../components/Controls/Switch';
// import {showToast} from '../helpers/app.helpers';
// import stringHelper from '../helpers/string.helper';
// import AlertActions from '../redux/actions/alert.action';
// import UserActions from '../redux/actions/user.action';

const validationSchema = yup.object({
  name: yup.string().required('Required'),
  description: yup.string().required('Required'),
  model: yup.string().required('Required'),
  serial_number: yup.string().required('Required'),
});
const _initialValues = {
  name: 'Finix device1',
  description: 'My First Test Finix Device',
  model: 'LANE_3000',
  serial_number: '3011087727539064',
};

const AddFinixDeviceForm = ({email, password, onSubmitSuccess}) => {
  const [initialValues, setInitialValues] = useState(_initialValues);
  const dispatch = useDispatch();
  const userData = useSelector(s => s.user.userData);
  const [logs, setLogs] = useState([]);
  const [deviceid, setDeviceId] = useState('');
  const [live, setLive] = useState(false);
  const [amount, setAmount] = useState('1');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    let r = await storageHelper.getData('deviceid');
    if (r) {
      setDeviceId(r);
    }
  };

  const onSubmit = async (values, helpers) => {
    console.log(values);
    Keyboard.dismiss();
    setLogs([]);
    dispatch(appAction.showProgress());

    if (!userData.restaurant?.merchant_information) {
      simpleToast('Please , setup finix payment.');
      return;
    }
    setLogs(_logs => [..._logs, 'creating device....']);

    let r = await paymentService.createMerchantDevice(
      {
        configuration: {
          prompt_amount_confirmation: true,
        },
        description: values.description,
        model: values.model,
        name: values.name,
        serial_number: values.serial_number,
      },
      userData.restaurant?.merchant_information, //sandbox
      // "MUgFUeHEHVfufshKjbipcwLG" //live
      live,
    );
    setLogs(_logs => [..._logs, 'created device....', JSON.stringify(r.id)]);

    if (r && r.id) {
      await storageHelper.storeData('deviceid', r.id);
      setDeviceId(r.id);
    } else {
      setLogs(_logs => [
        ..._logs,
        'created device.... error--',
        JSON.stringify(r?._embedded?.errors),
      ]);
    }
    dispatch(appAction.hideProgress());
  };
  const activatePress = async () => {
    if (!deviceid) {
      simpleToast('deviceId Not Find');
      return;
    }
    setLogs([]);
    setLogs(_logs => [
      ..._logs,
      'activate device....',
      JSON.stringify(deviceid),
    ]);
    dispatch(appAction.showProgress());
    let r1 = await paymentService.activateDevice(
      {
        action: 'ACTIVATE',
      },
      deviceid, //sandbox
      // "MUgFUeHEHVfufshKjbipcwLG" //live
      live,
    );
    console.log(r1);

    if (r1?._embedded?.errors) {
      setLogs(_logs => [
        ..._logs,
        'activated device.... error--',
        JSON.stringify(r1?._embedded?.errors),
      ]);
    } else {
      setLogs(_logs => [
        ..._logs,
        'activated device.... --',
        JSON.stringify(r1),
      ]);
    }
    dispatch(appAction.hideProgress());
  };
  const payPress = async () => {
    if (!amount) {
      return;
    }
    if (!deviceid) {
      simpleToast('deviceId Not Find');
      return;
    }
    setLogs([]);
    setLogs(_logs => [..._logs, 'transfer.... start', _amount]);
    let _amount = parseFloat(amount) * 100;
    console.log(_amount, deviceid);
    dispatch(appAction.showProgress());
    let r1 = await paymentService.transferAmountByDevice(
      {
        amount: _amount,
        currency: 'USD',
        device: deviceid,
        operation_key: 'CARD_PRESENT_DEBIT',
        tags: {
          order_number: 'test order',
        },
      },
      live,
    );
    console.log(r1);
    if (r1?._embedded?.errors) {
      setLogs(_logs => [
        ..._logs,
        'transfer.... error--',
        JSON.stringify(r1?._embedded?.errors),
      ]);
    } else {
      setLogs(_logs => [..._logs, 'transfer.... --', JSON.stringify(r1)]);
    }
    dispatch(appAction.hideProgress());
  };
  return (
    <>
      {/* <ActionSheet
        ref={(o) => (this.ActionSheet = o)}
        title={'Which one do you like ?'}
        options={['Camera', 'Gallery', 'Cancel']}
        cancelButtonIndex={2}
        onPress={(index) => {
          if (index == 0) {
            this.onSelectCamera();
          }

          if (index == 1) {
            this.onSelectFile();
          }
        }}
      /> */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={onSubmit}
        validateOnChange={true}>
        {props => {
          // console.log(props.values, props.errors, props.touched);
          return (
            <>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text mr={20}>Live</Text>
                <Switch
                  checked={live}
                  onChange={r => {
                    setLive(r);
                  }}
                />
              </View>
              <TextInput
                textInputProps={{
                  onChangeText: props.handleChange('name'),
                  onBlur: props.handleBlur('name'),
                  value: props.values.name,
                  // keyboardType: 'email-address',
                  // autoCompleteType: 'email',
                  autoCapitalize: 'none',
                  // returnKeyType: 'next',
                  placeholder: 'Name',
                  //  onSubmitEditing: () => this.passwordInput.focus(),
                  //ref: r => (this.emailInput = r),
                }}
                error={
                  props.errors.name && props.touched.name
                    ? props.errors.name
                    : ''
                }
                title="Name"
              />

              <TextInput
                textInputProps={{
                  onChangeText: props.handleChange('description'),
                  onBlur: props.handleBlur('description'),
                  value: props.values.description,
                  // keyboardType: 'email-address',
                  // autoCompleteType: 'email',
                  autoCapitalize: 'none',
                  // returnKeyType: 'next',
                  placeholder: 'Description',
                  //  onSubmitEditing: () => this.passwordInput.focus(),
                  //ref: r => (this.emailInput = r),
                }}
                error={
                  props.errors.description && props.touched.description
                    ? props.errors.description
                    : ''
                }
                title="Description"
              />

              <TextInput
                textInputProps={{
                  onChangeText: props.handleChange('model'),
                  onBlur: props.handleBlur('model'),
                  value: props.values.model,
                  // keyboardType: 'email-address',
                  // autoCompleteType: 'email',
                  autoCapitalize: 'none',
                  // returnKeyType: 'next',
                  placeholder: 'Model',
                  //  onSubmitEditing: () => this.passwordInput.focus(),
                  //ref: r => (this.emailInput = r),
                }}
                error={
                  props.errors.model && props.touched.model
                    ? props.errors.model
                    : ''
                }
                title="Model"
              />

              <TextInput
                textInputProps={{
                  onChangeText: props.handleChange('serial_number'),
                  onBlur: props.handleBlur('serial_number'),
                  value: props.values.serial_number,
                  // keyboardType: 'email-address',
                  // autoCompleteType: 'email',
                  autoCapitalize: 'none',
                  // returnKeyType: 'next',
                  placeholder: 'Serial Number',
                  //  onSubmitEditing: () => this.passwordInput.focus(),
                  //ref: r => (this.emailInput = r),
                }}
                error={
                  props.errors.serial_number && props.touched.serial_number
                    ? props.errors.serial_number
                    : ''
                }
                title="Serial Number"
              />

              <Button
                width={200}
                mb={20}
                style={{alignSelf: 'center'}}
                // disabled={props.isSubmitting}
                onPress={props.handleSubmit}>
                Add Device
              </Button>

              <Button
                width={200}
                mb={20}
                style={{alignSelf: 'center'}}
                // disabled={props.isSubmitting}
                onPress={activatePress}>
                Activate
              </Button>

              <TextInput
                textInputProps={{
                  onChangeText: v => {
                    setAmount(v);
                  },

                  value: amount,
                  keyboardType: 'numeric',
                  // autoCompleteType: 'email',
                  autoCapitalize: 'none',
                  // returnKeyType: 'next',
                  placeholder: 'Amount',
                  //  onSubmitEditing: () => this.passwordInput.focus(),
                  //ref: r => (this.emailInput = r),
                }}
                title="Amount ($)"
              />
              <Button
                width={200}
                mb={20}
                style={{alignSelf: 'center'}}
                // disabled={props.isSubmitting}
                onPress={payPress}>
                Pay
              </Button>
            </>
          );
        }}
      </Formik>
      <ScrollView
        nestedScrollEnabled={true}
        style={{
          width: '100%',
          height: 200,
          backgroundColor: '#fff',
          borderColor: '#f00',
          borderWidth: 1,
          marginTop: 10,
          // position:'absolute',
          // bottom:0,
          // left:0
        }}>
        {logs.map((l, i) => {
          return (
            <Text key={i} selectable>
              {l}
            </Text>
          );
        })}
      </ScrollView>
    </>
  );
};

export default AddFinixDeviceForm;
