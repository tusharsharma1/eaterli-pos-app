import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import Button from '../../components/Button';

// import BackIcon from '../assets/BackIcon';

function _ThemeButton({children, ...rest}) {
  const mobileBuilder = useSelector(s => s.user.mobileBuilder);

  let {
    product_bg,
    product_text,
    btn_text,
    price: price_color,
    primary,
  } = mobileBuilder.layout;

  return (
    <Button
      semibold
      noShadow
      backgroundColor={primary}
      color={btn_text}
      borderRadius={2}
      {...rest}>
      {children}
    </Button>
  );
}
const ThemeButton = memo(_ThemeButton);
export default ThemeButton;
