import React from 'react';
import Text from '../Text';
export default function CardHeading({children, ...rest}) {
  
  return (
    <Text size={16} semibold {...rest}>
      {children}
    </Text>
  );
}
