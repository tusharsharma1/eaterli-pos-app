import {Formik} from 'formik';
import React, {useEffect, useState} from 'react';
import {Keyboard, Platform} from 'react-native';
// import ActionSheet from 'react-native-actionsheet';
// import ImagePicker from 'react-native-image-crop-picker';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import * as yup from 'yup';
import Button from '../components/Button';
import TextInput from '../components/Controls/TextInput';
import Select from '../components/Controls/Select';
import Text from '../components/Text';
import userAction from '../redux/actions/user.action';
import {useNavigation} from '@react-navigation/native';
// import {showToast} from '../helpers/app.helpers';
// import stringHelper from '../helpers/string.helper';
// import AlertActions from '../redux/actions/alert.action';
// import UserActions from '../redux/actions/user.action';

const validationSchema = yup.object({
  name: yup.string().required('Required'),
  description: yup.string(),
  location_id: yup.string().required('Required'),
});
const _initialValues = {
  name: '',
  description: '',
  location_id: '',
};

const DeviceSetupForm = ({email, password, onSubmitSuccess}) => {
  const selectedLocation = useSelector(s => s.user.selectedLocation);
  const deviceId = useSelector(s => s.user.deviceId);
  const [initialValues, setInitialValues] = useState(_initialValues);
  const dispatch = useDispatch();
  const userData = useSelector(s => s.user.userData);
  const navigation = useNavigation();
  useEffect(() => {
    loadData();
  }, [selectedLocation]);

  const loadData = async () => {
    setInitialValues({..._initialValues, location_id: selectedLocation});
  };

  const onSubmit = async (values, helpers) => {
    console.log(values);
    Keyboard.dismiss();
    let body = {
      ...values,
      device_id: deviceId,
      type: 'pos',
      device_os: Platform.OS,
    };
    console.log(body);
    let r = await dispatch(
      userAction.createDevice(userData.restaurant.id, body),
    );
    if (r && r.status) {
      navigation.replace('HomeNav');
    }
  };

  return (
    <>
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
                  onChangeText: props.handleChange('name'),
                  onBlur: props.handleBlur('name'),
                  value: props.values.name,
                  // keyboardType: 'email-address',
                  // autoCompleteType: 'email',
                  autoCapitalize: 'none',
                  // returnKeyType: 'next',
                  placeholder: 'Device Name',
                  //  onSubmitEditing: () => this.passwordInput.focus(),
                  //ref: r => (this.emailInput = r),
                }}
                error={
                  props.errors.name && props.touched.name
                    ? props.errors.name
                    : ''
                }
                title="Device Name"
              />

              <TextInput
                containerStyle={{
                  // marginBottom: 20,
                  // paddingVertical: 5,
                  // paddingHorizontal: 15,
                  height: 100,
                }}
                textInputProps={{
                  onChangeText: props.handleChange('description'),
                  onBlur: props.handleBlur('description'),
                  value: props.values.description,
                  multiline: true,
                  // keyboardType: 'email-address',
                  // autoCompleteType: 'email',
                  autoCapitalize: 'none',
                  // returnKeyType: 'next',
                  placeholder: 'Additional Notes',
                  //  onSubmitEditing: () => this.passwordInput.focus(),
                  //ref: r => (this.emailInput = r),
                }}
                error={
                  props.errors.description && props.touched.description
                    ? props.errors.description
                    : ''
                }
                title="Additional Notes"
              />
              <Select
                renderOption={ldata => {
                  let nearByAddress =
                    ldata &&
                    [
                      ldata.street,
                      ldata.zip_code,
                      ldata.city,
                      ldata.state,
                      ldata.country,
                    ]
                      .filter(Boolean)
                      .join(', ');
                  return (
                    <>
                      <Text style={{color: '#000', fontSize: 18}}>
                        {ldata.label}
                      </Text>
                      <Text style={{color: '#660', fontSize: 14}}>
                        {nearByAddress}
                      </Text>
                    </>
                  );
                }}
                data={userData.locations.map(r => {
                  return {
                    ...r,
                    label: `${r.name} ${r.is_primary == 1 ? '(Master)' : ''}`,
                    value: r.id,
                  };
                })}
                value={props.values.location_id}
                onValueChange={r => props.setFieldValue('location_id', r)}
                // textInputProps={{
                //   onChangeText: props.handleChange('description'),
                //   onBlur: props.handleBlur('description'),
                //   value: props.values.description,
                //   // keyboardType: 'email-address',
                //   // autoCompleteType: 'email',
                //   autoCapitalize: 'none',
                //   // returnKeyType: 'next',
                //   placeholder: 'Description',
                //   //  onSubmitEditing: () => this.passwordInput.focus(),
                //   //ref: r => (this.emailInput = r),
                // }}
                error={
                  props.errors.location_id && props.touched.location_id
                    ? props.errors.location_id
                    : ''
                }
                title="Restaurant Location"
              />

              <Button
                width={200}
                mb={20}
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

export default DeviceSetupForm;
