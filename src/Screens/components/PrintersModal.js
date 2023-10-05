import React, {useEffect} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../../components/Button';
import ModalContainer from '../../components/ModalContainer';
import Text from '../../components/Text';
import {
  connectUSBPrinters,
  createOrderReceiptPrintData,
  doPrintUSBPrinter,
} from '../../helpers/printer.helper';
import appAction from '../../redux/actions/app.action';

export default function PrintersModal({}) {
  const dispatch = useDispatch();
  const printerModal = useSelector(s => s.app.printerModal);
  let printers = useSelector(s => s.app.printers);
  const pendingOrderPrint = useSelector(s => s.app.pendingOrderPrint);

  useEffect(() => {
    if (!printerModal) {
      dispatch(
        appAction.set({
          pendingOrderPrint: null,
        }),
      );
    }
  }, [printerModal]);

  const toggleModal = () => {
    dispatch(
      appAction.set({
        printerModal: !printerModal,
      }),
    );
  };
  // printers = ['22', '33'];
  return (
    <ModalContainer
      // hideTitle
      center
      // noscroll
      onRequestClose={toggleModal}
      visible={printerModal}
      title={'Select USB Printer'}
      landscapeWidth={350}
      // height={'98%'}
      // borderRadius={25}
    >
      <View
        style={{
          // flex: 1,

          padding: 20,
          paddingVertical: 0,
        }}>
        {printers.map((pname, i) => {
          return (
            <Button
              backgroundColor={'#fff'}
              color="#313131"
              key={i}
              mr={10}
              mb={10}
              borderRadius={0}
              style={{}}
              onPress={async () => {
                // crashlytics().crash()
                await connectUSBPrinters(pname);

                if (pendingOrderPrint) {
                  let printData =
                    createOrderReceiptPrintData(pendingOrderPrint);
                  await doPrintUSBPrinter(printData);

                  dispatch(
                    appAction.set({
                      pendingOrderPrint: null,
                    }),
                  );
                }
              }}>
              {pname}
            </Button>
          );
        })}
        {!printers.length && (
          <Text mt={20} align="center" size={16}>
            No Printer Device Connected.
          </Text>
        )}
      </View>
    </ModalContainer>
  );
}
