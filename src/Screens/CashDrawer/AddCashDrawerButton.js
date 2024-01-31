import {Formik} from 'formik';
import React, {useState} from 'react';
import {Keyboard} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as yup from 'yup';
import Button from '../../components/Button';
import TextInput from '../../components/Controls/TextInput';
import ModalContainer from '../../components/ModalContainer';
import {simpleToast} from '../../helpers/app.helpers';
import userAction from '../../redux/actions/user.action';
import OptionButton from '../components/OptionButton';
import useTheme from '../../hooks/useTheme';
import theme from '../../theme';
const validationSchema = yup.object({
  amount: yup.number().min(0.1).required('Required'),
  reason: yup.string(),
});
const _initialValues = {
  amount: '',
  reason: '',
};
export default function AddCashDrawerButton({
  type = '1',
  title = 'Add Cash',
  onSuccess,
}) {
  const [initialValues, setInitialValues] = useState(_initialValues);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const userData = useSelector(s => s.user.userData);
  const deviceId = useSelector(s => s.user.deviceId);
  const themeData = useTheme();
  const selectedLocation = useSelector(s => s.user.selectedLocation);
  //  console.log(route.params)
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  const onSubmit = async (values, helpers) => {
    console.log(values);
    Keyboard.dismiss();
    let payload = {
      ...values,
      user_id: userData.user_id,
      type: type,
      location_id: selectedLocation,
      device_id: deviceId,
    };
    console.log(payload);
    let r = await dispatch(
      userAction.addCashDrawer(payload, userData.restaurant.id),
    );
    if (r && r.status) {
      simpleToast(r.message);
      toggleModal();
      onSuccess && onSuccess();
    }
  };

  return (
    <>
      <OptionButton
        title={title}
        backgroundColor={themeData.cardBg}
        color={themeData.textColor}
        onPress={toggleModal}
      />
      <ModalContainer
        // hideTitle
        center
        // noscroll
        onRequestClose={toggleModal}
        visible={showModal}
        title={title}
        landscapeWidth={350}
        // height={'98%'}
        // borderRadius={25}
      >
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
                  title="Amount"
                  containerStyle={{
                    marginBottom: 20,

                    paddingVertical: 5,
                    paddingHorizontal: 15,
                  }}
                  textInputProps={{
                    keyboardType: 'numeric',
                    placeholder: '',
                    onChangeText: props.handleChange('amount'),
                    onBlur: props.handleBlur('amount'),
                    value: props.values.amount,
                  }}
                  error={
                    props.errors.amount && props.touched.amount
                      ? props.errors.amount
                      : ''
                  }
                />

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
                  borderRadius={4}
                  backgroundColor={theme.colors.primaryColor}
                  onPress={props.handleSubmit}>
                  {type == '1' ? 'Add' : 'Remove'}
                </Button>
              </>
            );
          }}
        </Formik>
      </ModalContainer>
    </>
  );
}
