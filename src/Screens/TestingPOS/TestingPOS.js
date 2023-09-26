import React, {useEffect, useMemo, useState} from 'react';
import {PermissionsAndroid, TouchableOpacity, View} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {useDispatch, useSelector} from 'react-redux';
import Container from '../../components/Container';
import Header from '../../components/Header';
import Table from '../../components/Table';
import moment from 'moment';
import ModalContainer from '../../components/ModalContainer';
import ProgressImage from '../../components/react-native-image-progress';
import Text from '../../components/Text';
import theme from '../../theme';
import {PAYMENT_METHOD} from '../../constants/order.constant';
import {dummyImage} from '../../assets';
import userAction from '../../redux/actions/user.action';
import {getAddons, getVariants} from '../../helpers/order.helper';
import POSModule from '../../helpers/pos.helper';
import Button from '../../components/Button';
import appAction from '../../redux/actions/app.action';
import {showToast, simpleToast} from '../../helpers/app.helpers';
import RNPrint from 'react-native-print';
function ensureLength(
  input = '',
  requiredLength = 3,
  padRight = true,
  padChar = ' ',
) {
  input = input.toString();
  if (input.length > requiredLength) return input.substring(0, requiredLength);
  if (input.length == requiredLength) return input;
  if (padRight) {
    return input.padEnd(requiredLength, padChar);
  } else {
    return input.padStart(requiredLength, padChar);
  }
}
export default function TestingPOS({navigation, route}) {
  const dispatch = useDispatch();
  const [printers, setPrinters] = useState([]);

  useEffect(() => {
    POSModule.initSDK();

    loadData();
  }, []);

  const loadData = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        ],
        {
          title: 'Camera Permission',
          message: 'Needs access to your camera ' + 'so you can take pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //   console.log('You can use the camera');
      // } else {
      //   console.log('Camera permission denied');
      // }
    } catch (err) {
      console.warn(err);
    }
  };

  const readCard = type => {
    dispatch(appAction.showProgress('Searching...'));
    POSModule.readCard({type: type}, res => {
      dispatch(appAction.hideProgress());
      console.log('[readCard]', res);
      alert(JSON.stringify(res));
    });
  };
  return (
    <>
      <Header title={'Testing POS'} back />
      <Container
        style={{
          // flex: 1,
          flexDirection: 'row',
          alignItems: 'flex-start',
          padding: 20,
          flexWrap: 'wrap',
        }}>
        <Button
          // style={{}}
          // backgroundColor="#00000000"
          noShadow
          // bold
          // color="#212121"
          mr={10}
          mb={10}
          onPress={() => {
            POSModule.doOpenCashBox();
          }}>
          Open Cashbox
        </Button>
        <Button
          // style={{}}
          // backgroundColor="#00000000"
          noShadow
          // bold
          // color="#212121"
          mr={10}
          mb={10}
          onPress={() => {
            POSModule.cutPaperPrint();
          }}>
          Cut paper
        </Button>
        {/* <Button
          mr={10}
          mb={10}
          onPress={async () => {
            let r = await RNPrint.print({
              html: `
              <style>
              @page {
                size:57mm 297mm;
                margin: 0;
              }
              @media print {
                html, body {
                  width: 57mm;
              
                }
                
              }
              
              .page{
                width: 57mm;
              }
              </style>
              <div class="page" style="height:297mm;background-color:yellow;">
              <h1 class="red">Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3>
              </div>
              `,
            }).catch(e => {
              console.log('print error', e);
            });
            console.log('print result', r);
            showToast('Success');
            // POSModule.printByNativeCode(
            //   {id: 22, name: 'aakash', active: true},
            //   res => {
            //     console.log('[printByNativeCode]', res);
            //     // alert(JSON.stringify(res));
            //     showToast('Success')
            //   },
            // );

            // POSModule.printByAllInOnePOS({id: 22, name: 'aakash', active: true}, res => {
            //   console.log('[printByAllInOnePOS]', res);
            //   alert(JSON.stringify(res));
            // });
          }}>
          Test Printer
        </Button> */}

        <Button
          mr={10}
          mb={10}
          onPress={() => {
            POSModule.scanHQRCode(
              {id: 22, name: 'aakash', active: true},
              res => {
                console.log('[scanHQRCode]', res);
                alert(JSON.stringify(res));
              },
            );
          }}>
          Scan QR Code
        </Button>

        <Button
          mr={10}
          mb={10}
          onPress={() => {
            POSModule.scanHQRCode(
              {id: 22, name: 'aakash', active: true},
              res => {
                console.log('[scanHQRCode]', res);
                alert(JSON.stringify(res));
              },
            );
          }}>
          Scan QR Code
        </Button>
        <Button
          mr={10}
          mb={10}
          onPress={() => {
            readCard('ic');
          }}>
          IC Card
        </Button>
        <Button
          mr={10}
          mb={10}
          onPress={() => {
            POSModule.initFinixSDK(
              {
                env: 'sandbox',
                username: 'USss1r5jqUXgpndmp5vyEuBK',
                password: '5433ee5f-2c8b-4289-b5aa-0e2394144703',
                merchantId: 'MUeCcC7PToWcsgexGaERJ7jC',
                deviceId: 'DVtTMarXFnyVU6NmiMLTmvzb',
                deviceIdentifier: '3011087727539064',
              },
              res => {
                console.log('[initFinixSDK]', res);
                alert(JSON.stringify(res));
              },
            );
          }}>
          Init Finix Payment SDK
        </Button>

        <Button
          mr={10}
          mb={10}
          onPress={() => {
            POSModule.getUSBGPrinters({}, res => {
              console.log('[getUSBGPrinters]', res);
              setPrinters(res.devices);
              if (!res.devices.length) {
                simpleToast('No Device Connected.');
              }
            });
          }}>
          USB Printers
        </Button>
        <Button
          backgroundColor={theme.colors.primaryColor}
          mr={10}
          mb={10}
          onPress={() => {
            let pageWidthLength = 40;
            let AmountWidthLength = 8;
            let fontSize = 20;
            let headingFontSize = 25;
            let charSize = 1;
            let headingCharSize = 2;
            let newLineData = {
              charSize,
              size: fontSize,
              align: 'left',
              style: 'normal',
              text: ` `,
            };
            let printData = [
              {
                charSize,
                size: 35,
                align: 'center',
                style: 'bold',
                text: 'Fish N Fry',
              },
              newLineData,
              {
                charSize,
                size: fontSize,
                align: 'left',
                style: 'normal',
                text: `${ensureLength(`Order No.:`, 14, true)}${ensureLength(
                  `#22`,
                  pageWidthLength - 14,
                  false,
                )}`,
              },
              {
                charSize,
                size: fontSize,
                align: 'left',
                style: 'normal',
                text: `${ensureLength(`Order Date:`, 14, true)}${ensureLength(
                  moment().format('DD MMM, YYYY hh:mm A'),
                  pageWidthLength - 14,
                  false,
                )}`,
              },
              {
                charSize,
                size: fontSize,
                align: 'left',
                style: 'normal',
                text: `${ensureLength(
                  `Payment Method:`,
                  16,
                  true,
                )}${ensureLength('CASH', pageWidthLength - 16, false)}`,
              },

              {
                charSize: 1,
                size: fontSize,
                align: 'left',
                style: 'normal',
                text: `Abcd - ${1}`,
              },
              {
                charSize: 1,
                size: fontSize,
                align: 'left',
                style: 'bold',
                text: `Abcd - ${1}`,
              },

              {
                charSize: 2,
                size: fontSize,
                align: 'left',
                style: 'normal',
                text: `Abcd - ${2}`,
              },
              {
                charSize: 2,
                size: fontSize,
                align: 'left',
                style: 'bold',
                text: `Abcd - ${2}`,
              },

              {
                charSize: 3,
                size: fontSize,
                align: 'left',
                style: 'normal',
                text: `Abcd - ${3}`,
              },
              {
                charSize: 3,
                size: fontSize,
                align: 'left',
                style: 'bold',
                text: `Abcd - ${3}`,
              },

              {
                charSize: 4,
                size: fontSize,
                align: 'left',
                style: 'normal',
                text: `Abcd - ${4}`,
              },
              {
                charSize: 4,
                size: fontSize,
                align: 'left',
                style: 'bold',
                text: `Abcd - ${4}`,
              },

              {
                charSize: 5,
                size: fontSize,
                align: 'left',
                style: 'normal',
                text: `Abcd - ${5}`,
              },
              {
                charSize: 5,
                size: fontSize,
                align: 'left',
                style: 'bold',
                text: `Abcd - ${5}`,
              },

              {
                charSize: 6,
                size: fontSize,
                align: 'left',
                style: 'normal',
                text: `Abcd - ${6}`,
              },
              {
                charSize: 6,
                size: fontSize,
                align: 'left',
                style: 'bold',
                text: `Abcd - ${6}`,
              },

              {
                charSize: 7,
                size: fontSize,
                align: 'left',
                style: 'normal',
                text: `Abcd - ${7}`,
              },
              {
                charSize: 7,
                size: fontSize,
                align: 'left',
                style: 'bold',
                text: `Abcd - ${7}`,
              },

              {
                charSize: 8,
                size: fontSize,
                align: 'left',
                style: 'normal',
                text: `Abcd - ${8}`,
              },
              {
                charSize: 8,
                size: fontSize,
                align: 'left',
                style: 'bold',
                text: `Abcd - ${8}`,
              },
            ];

            printData.push(newLineData);

            console.log(printData);

            POSModule.printUSBGPrinter(printData, res => {
              console.log('[printUSBGPrinter]', res);
              if (res.error) {
                simpleToast(res.error);
              }
            });
          }}>
          Test Print
        </Button>
      </Container>

      <View
        style={{
          // flex: 1,

          padding: 20,
          paddingVertical: 0,
        }}>
        <Text size={20} bold mb={10}>
          Connected Printers
        </Text>
        <Container
          style={{
            // flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-start',

            flexWrap: 'wrap',
          }}>
          {printers.map((pname, i) => {
            return (
              <Button
                backgroundColor={theme.colors.primaryColor}
                key={i}
                mr={10}
                mb={10}
                onPress={() => {
                  POSModule.getConnectUSBGPrinter({pname}, res => {
                    console.log('[getConnectUSBGPrinter]', res);
                    if (res.error) {
                      simpleToast(res.error);
                    }else{
                      simpleToast('Connected');
                    }
                  });
                }}>
                {pname}
              </Button>
            );
          })}
        </Container>
      </View>
    </>
  );
}
