import {Formik} from 'formik';
import React, {useEffect, useState} from 'react';
import {Keyboard} from 'react-native';
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
// import {showToast} from '../helpers/app.helpers';
// import stringHelper from '../helpers/string.helper';
// import AlertActions from '../redux/actions/alert.action';
// import UserActions from '../redux/actions/user.action';

const validationSchema = yup.object({
  reason: yup.string().required('Required'),
});
const _initialValues = {
  reason: '',
};

const OrderRefundForm = ({orderData, onSubmitSuccess}) => {
  const userData = useSelector(s => s.user.userData);
  const deviceId = useSelector(s => s.user.deviceId);
  const [initialValues, setInitialValues] = useState(_initialValues);
  const dispatch = useDispatch();
  useEffect(() => {}, []);

  const onSubmit = async (values, helpers) => {
    console.log(values);
    Keyboard.dismiss();
    // return;
    let body = {
      order_id: orderData.id,
      refund_amount: orderData.order_total,
      refund_reason: values.reason,
      staff_id: userData.user_id,
      payment_method: orderData.payment_method,
      refund_status: 'refunded',
      device_id: deviceId,

      // customer_id
    };

    if (orderData.gift_card_id) {
      body.gift_card_id = orderData.gift_card_id;
    }
    let r = await dispatch(
      userAction.refundOrder(userData.restaurant.id, orderData.id, body),
    );
    console.log('result===>  ', r);
    if (r && r.status) {
      // let {onSubmit} = this.props;
      simpleToast(r.message);
      onSubmitSuccess && onSubmitSuccess();
    }
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
          // console.log(props.values, props.errors, props.touched);
          return (
            <>
              <TextInput
                title="Reason"
                containerStyle={{
                  marginBottom: 20,

                  paddingVertical: 5,
                  paddingHorizontal: 15,

                  height: 100,
                }}
                textStyle={{
                  flex: 1,
                  textAlignVertical: 'top',
                }}
                textInputProps={{
                  multiline: true,

                  placeholder: '',
                  onChangeText: props.handleChange('reason'),
                  onBlur: props.handleBlur('reason'),
                  value: props.values.reason,
                }}
                error={
                  props.errors.reason && props.touched.reason
                    ? props.errors.reason
                    : ''
                }
              />

              <Button
                width={200}
                style={{alignSelf: 'center'}}
                // disabled={props.isSubmitting}
                onPress={props.handleSubmit}>
                Submit
              </Button>
            </>
          );
        }}
      </Formik>
    </>
  );
};

export default OrderRefundForm;
