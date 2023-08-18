import {Formik} from 'formik';
import React, {useEffect, useState} from 'react';
import {Keyboard, View} from 'react-native';
// import ActionSheet from 'react-native-actionsheet';
// import ImagePicker from 'react-native-image-crop-picker';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch} from 'react-redux';
import * as yup from 'yup';
import Button from '../components/Button';
import TextInput from '../components/Controls/TextInput';
import {showToast} from '../helpers/app.helpers';
import storageHelper from '../helpers/storage.helper';
import stringHelper from '../helpers/string.helper';
import userAction from '../redux/actions/user.action';
import Text from '../components/Text';
import CalculatorPriceInput from '../components/CalculatorPriceInput';
// import {showToast} from '../helpers/app.helpers';
// import stringHelper from '../helpers/string.helper';
// import AlertActions from '../redux/actions/alert.action';
// import UserActions from '../redux/actions/user.action';

const validationSchema = yup.object({
  received_amount: yup
    .number()
    .typeError('Invalid Amount')
    .required('Required'),
});
const _initialValues = {
  received_amount: '',
};

const CashPaymentForm = ({total = 0, onSubmitSuccess}) => {
  const [initialValues, setInitialValues] = useState(_initialValues);
  const dispatch = useDispatch();
  // useEffect(() => {
  //   loadData();
  // }, [total]);

  // const loadData = () => {
  //   // setInitialValues({
  //   //   email: email || '', //'keyanna@eaterli.com',
  //   //   password: password || '', //'Al12880aL',
  //   // });
  // };

  const onSubmit = async (values, helpers) => {
    // console.log(values);
    Keyboard.dismiss();
    onSubmitSuccess && onSubmitSuccess(values);
    // let r = await dispatch(userAction.login(values));
    // console.log('result===>  ', r);
    // if (r && r.status) {
    //   // let {onSubmit} = this.props;
    //   helpers.resetForm();
    //   // showSnackbar('Sign successfully.');
    //   showToast(r.message, 'success');

    //   let data = r.data;
    //   console.log('srsss', data);
    //   let password = await stringHelper.encrypt(values.password);
    //   console.log('password', password);

    //   await storageHelper.storeData('email', values.email);

    //   // Store the credentials
    //   // await Keychain.setGenericPassword(values.email, password);
    //   onSubmitSuccess && onSubmitSuccess(values);
    //   // this.props.dispatch(UserActions.setProperty('userData', data));
    //   // this.props.dispatch(UserActions.setFavLocation(data.location_id));

    //   // StorageService.storeData(AppConfig.STORAGE_USER_KEY, data).then((_) => {

    //   // });

    //   // onSubmit && onSubmit(values);

    //   // this.props.dispatch(
    //   //   AlertActions.showAlert(
    //   //     AlertActions.type.ALERT,
    //   //     's',
    //   //     r.message,
    //   //     'Success',
    //   //     {
    //   //       text: 'OK',
    //   //       onPress: () => {
    //   //         onSubmit && onSubmit(values, helpers);
    //   //       },
    //   //     },
    //   //   ),
    //   // );
    // }
    // return;
    // let r = await this.props.dispatch(UserActions.login(values));
    // console.log(r);
    // if (r && r.status) {
    //   let {onSubmit} = this.props;
    //   helpers.resetForm();
    //   // showSnackbar('Sign successfully.');
    //   showToast(r.message, 'success');

    //   let data = {...r.result, token: r.token};
    //   console.log('srsss', data);
    //   let password = await stringHelper.encrypt(values.password);
    //   // Store the credentials
    //   await Keychain.setGenericPassword(values.email, password);
    //   this.props.dispatch(UserActions.setProperty('userData', data));
    //   // this.props.dispatch(UserActions.setFavLocation(data.location_id));

    //   // StorageService.storeData(AppConfig.STORAGE_USER_KEY, data).then((_) => {

    //   // });

    //   onSubmit && onSubmit(values);

    //   // this.props.dispatch(
    //   //   AlertActions.showAlert(
    //   //     AlertActions.type.ALERT,
    //   //     's',
    //   //     r.message,
    //   //     'Success',
    //   //     {
    //   //       text: 'OK',
    //   //       onPress: () => {
    //   //         onSubmit && onSubmit(values, helpers);
    //   //       },
    //   //     },
    //   //   ),
    //   // );
    // }
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
          // console.log(props.values);

          let received_amount =
            parseFloat(props.values.received_amount) - parseFloat(total);
          if (!isFinite(received_amount)) {
            received_amount = 0;
          }
          return (
            <>
              <Row title={'Total amount'}>
                <Text>${parseFloat(total).toFixed(2)}</Text>
              </Row>
              {/* <Row title={'Received amount  ($)'}>
                <TextInput
                  textInputProps={{
                    onChangeText: props.handleChange('received_amount'),
                    onBlur: props.handleBlur('received_amount'),
                    value: props.values.received_amount,
                    keyboardType: 'numeric',
                    // autoCompleteType: 'email',
                    // autoCapitalize: 'none',
                    // returnKeyType: 'next',
                    placeholder: 'Received amount ($)',
                    //  onSubmitEditing: () => this.passwordInput.focus(),
                    //ref: r => (this.emailInput = r),
                  }}
                  error={
                    props.errors.received_amount &&
                    props.touched.received_amount
                      ? props.errors.received_amount
                      : ''
                  }
                />
              </Row> */}
              <Row title={'Remaining amount'}>
                <Text semibold color={received_amount >= 0 ? 'green' : 'red'}>
                  ${Math.abs(received_amount).toFixed(2)}
                </Text>
              </Row>
              <View
                style={{
                  marginTop: 20,
                }}>
                <CalculatorPriceInput
                  total={total}
                  onChange={price => {
                    props.setFieldValue('received_amount', price);
                  }}
                />
              </View>
              <Button
                mt={20}
                width={200}
                style={{alignSelf: 'center'}}
                // disabled={props.isSubmitting}
                onPress={props.handleSubmit}>
                Pay
              </Button>
            </>
          );
        }}
      </Formik>
    </>
  );
};

export default CashPaymentForm;

function Row({title, children}) {
  return (
    <View
      style={{
        // width: '100%',
        // flex: 1,
        // backgroundColor:'yellow',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <View style={{}}>
        <Text semibold>{title}</Text>
      </View>
      <View
        style={
          {
            // flex: 1,
          }
        }>
        {children}
      </View>
    </View>
  );
}
