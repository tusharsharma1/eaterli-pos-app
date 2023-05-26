import React, {PureComponent} from 'react';
import {ScrollView, View} from 'react-native';

const Container = ({scroll, children, ...rest}) => {
  return (
    <>
      {scroll ? (
        <ScrollView keyboardShouldPersistTaps="handled"  {...rest}>
          {children}
        </ScrollView>
      ) : (
        <View {...rest}>{children}</View>
      )}
    </>
  );
};

export default Container;
