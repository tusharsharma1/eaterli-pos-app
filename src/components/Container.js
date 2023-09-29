import React, {PureComponent} from 'react';
import {ScrollView, View} from 'react-native';

const Container = ({scroll=false, contentContainerStyle={},children, ...rest}) => {
  return (
    <>
      {scroll ? (
        <ScrollView contentContainerStyle={contentContainerStyle} keyboardShouldPersistTaps="handled"  {...rest}>
          {children}
        </ScrollView>
      ) : (
        <View {...rest}>{children}</View>
      )}
    </>
  );
};

export default Container;
