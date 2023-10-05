import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {PermissionsAndroid, ScrollView} from 'react-native';
import {useDispatch} from 'react-redux';
import Button from '../../components/Button';
import Container from '../../components/Container';
import Header from '../../components/Header';
import Text from '../../components/Text';
import POSModule, {POSModuleEventEmitter} from '../../helpers/pos.helper';
import appAction from '../../redux/actions/app.action';

export default function TestingPOS({navigation, route}) {
  const dispatch = useDispatch();

  const [logs, setLogs] = useState([]);
  useEffect(() => {
    POSModule.initSDK();

    loadData();

    let eventListener = POSModuleEventEmitter.addListener(
      'onMessage',
      onPOSModuleMessage,
    );
    return () => {
      eventListener.remove();
    };
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
  const onPOSModuleMessage = message => {
    console.log('POSModuleEventEmitter', message);
    setLogs(_logs => [
      ..._logs,
      message.event,
      JSON.stringify(message.data),
      '------------',
    ]);
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
      <Container scroll>
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
          {/* <Button
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
        </Button> */}
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
                  // merchantId: 'MUeCcC7PToWcsgexGaERJ7jC',
                  merchantId: 'MU6TcvvdfqdwzFETGVmTMKmS',
                  deviceId: 'DV5SSgSRhYJY6s3Gmi24Y3cU',
                  deviceIdentifier: 'CHB206132000590',
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
              setLogs(_logs => [
                ..._logs,
                `••••••••••••••${moment().format(
                  'DD MMM, YYYY hh:mm:ss A',
                )}••••••••••••••`,
              ]);

              POSModule.createFinixSDKTransaction(
                {
                  env: 'sandbox',
                  // username: 'USss1r5jqUXgpndmp5vyEuBK',
                  // password: '5433ee5f-2c8b-4289-b5aa-0e2394144703',
                  // merchantId: 'MUeCcC7PToWcsgexGaERJ7jC',
                  // deviceId: 'DVtTMarXFnyVU6NmiMLTmvzb',
                  // deviceIdentifier: '3011087727539064',
                },
                res => {
                  console.log('[createFinixSDKTransaction]', res);
                  // alert(JSON.stringify(res));
                },
              );
            }}>
            Create Finix Payment Transaction
          </Button>
        </Container>

        <ScrollView
          nestedScrollEnabled={true}
          style={{
            width: '90%',
            height: 300,
            backgroundColor: '#fff',
            borderColor: '#f00',
            borderWidth: 1,
            marginTop: 10,
            marginHorizontal: 20,
            // position:'absolute',
            // bottom:0,
            // left:0
          }}>
          {logs.map((l, i) => {
            return (
              <Text key={i} selectable>
                {l}
              </Text>
            );
          })}
        </ScrollView>
      </Container>
    </>
  );
}
