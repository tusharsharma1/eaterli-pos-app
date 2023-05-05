import {Formik} from 'formik';
import React, {useEffect, useState} from 'react';
import {Keyboard} from 'react-native';
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
// import {showToast} from '../helpers/app.helpers';
// import stringHelper from '../helpers/string.helper';
// import AlertActions from '../redux/actions/alert.action';
// import UserActions from '../redux/actions/user.action';

const validationSchema = yup.object({
  email: yup.string().email('Invalid email Address').required('Required'),
  password: yup.string().min(6).required('Required'),
});
const _initialValues = {
  email: '',
  password: '',
};

const LoginForm = ({email, password, onSubmitSuccess}) => {
  const [initialValues, setInitialValues] = useState(_initialValues);
  const dispatch = useDispatch();
  useEffect(() => {
    loadData();
  }, [email, password]);

  const loadData = () => {
    setInitialValues({
      email: email || '',//'keyanna@eaterli.com',
      password: password || ''//'Al12880aL',
    });
  };

  const onSubmit = async (values, helpers) => {
    console.log(values);
    Keyboard.dismiss();
    let r = await dispatch(userAction.login(values));
    console.log('result===>  ', r);
    if (r && r.status) {
      // let {onSubmit} = this.props;
      helpers.resetForm();
      // showSnackbar('Sign successfully.');
      showToast(r.message, 'success');

      let data = r.data;
      console.log('srsss', data);
      let password = await stringHelper.encrypt(values.password);
      console.log('password', password);

      await storageHelper.storeData('email', values.email);

      // Store the credentials
      // await Keychain.setGenericPassword(values.email, password);
      onSubmitSuccess && onSubmitSuccess(values);
      // this.props.dispatch(UserActions.setProperty('userData', data));
      // this.props.dispatch(UserActions.setFavLocation(data.location_id));

      // StorageService.storeData(AppConfig.STORAGE_USER_KEY, data).then((_) => {

      // });

      // onSubmit && onSubmit(values);

      // this.props.dispatch(
      //   AlertActions.showAlert(
      //     AlertActions.type.ALERT,
      //     's',
      //     r.message,
      //     'Success',
      //     {
      //       text: 'OK',
      //       onPress: () => {
      //         onSubmit && onSubmit(values, helpers);
      //       },
      //     },
      //   ),
      // );
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
                textInputProps={{
                  onChangeText: props.handleChange('email'),
                  onBlur: props.handleBlur('email'),
                  value: props.values.email,
                  keyboardType: 'email-address',
                  autoCompleteType: 'email',
                  autoCapitalize: 'none',
                  returnKeyType: 'next',
                  placeholder: 'Email',
                  //  onSubmitEditing: () => this.passwordInput.focus(),
                  //ref: r => (this.emailInput = r),
                }}
                error={
                  props.errors.email && props.touched.email
                    ? props.errors.email
                    : ''
                }
              />

              <TextInput
                textInputProps={{
                  secureTextEntry: true,
                  onChangeText: props.handleChange('password'),
                  onBlur: props.handleBlur('password'),
                  value: props.values.password,
                  returnKeyType: 'next',
                  // ref: r => (this.passwordInput = r),
                  placeholder: 'Password',
                  onSubmitEditing: props.handleSubmit,
                }}
                error={
                  props.errors.password && props.touched.password
                    ? props.errors.password
                    : ''
                }
              />

              <Button
                width={200}
                style={{alignSelf: 'center'}}
                // disabled={props.isSubmitting}
                onPress={props.handleSubmit}>
                Login
              </Button>
            </>
          );
        }}
      </Formik>
    </>
  );
};

export default LoginForm;
