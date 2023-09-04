import React, {useEffect, useState} from 'react';
import Button from '../../components/Button';
import SelectRadio from '../../components/Controls/SelectRadio';
import TextInput from '../../components/Controls/TextInput';
import ModalContainer from '../../components/ModalContainer';
import {simpleToast} from '../../helpers/app.helpers';

export default function DiscountModal({
  data,
  subPrice,
  onUpdatePress,
  ...rest
}) {
  useState(false);
  const [discount, setDiscount] = useState('');
  const [discountReason, setDiscountReason] = useState('');
  const [discountType, setDiscountType] = useState('1');

  useEffect(() => {
    if (data) {
      setDiscount(data.discount ?? '');
      setDiscountReason(data.discount_reason ?? '');
      setDiscountType(data.discount_type ?? '1');
    }
  }, [data]);
  const updateDiscount = () => {
    if (discountType == '1' && parseFloat(discount) > 100) {
      simpleToast('Invalid discount');
      return;
    }
    if (discountType == '2' && parseFloat(discount) > subPrice) {
      simpleToast('Invalid discount');
      return;
    }

    onUpdatePress &&
      onUpdatePress({
        discount: discount,
        discount_type: discountType,
        discount_reason: discountReason,
      });
  };
  return (
    <ModalContainer
      // hideTitle
      center
      // noscroll
      {...rest}>
      <SelectRadio
        // disabled={submitted}
        // error={
        //   props.errors[data.id] && props.touched[data.id]
        //     ? props.errors[data.id]
        //     : ''
        // }
        onValueChange={value => {
          setDiscountType(value);
        }}
        value={discountType}
        data={[
          {label: 'Discount by percentage', value: '1'},
          {label: 'Discount by Amount', value: '2'},
        ]}
      />

      <TextInput
        textInputProps={{
          onChangeText: t => {
            setDiscount(t);
          },
          value: discount,
          keyboardType: 'numeric',
          autoFocus: true,
          placeholder: 'Enter Value',
        }}
        textStyle={{
          textAlign: 'left',
        }}
      />

      <TextInput
        title="Discount Reason"
        textInputProps={{
          onChangeText: t => {
            setDiscountReason(t);
          },
          value: discountReason,
          // keyboardType: 'numeric',
          autoFocus: true,
          placeholder: 'Reason',
          multiline: true,
        }}
        textStyle={{
          textAlign: 'left',
          height: 80,
          textAlignVertical: 'top',
        }}
      />
      <Button onPress={updateDiscount}> Ok</Button>
    </ModalContainer>
  );
}
