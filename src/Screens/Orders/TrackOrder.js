import React, {useEffect, useState} from 'react';
import {WebView} from 'react-native-webview';
import {useDispatch} from 'react-redux';
import Container from '../../components/Container';
import Header from '../../components/Header';
import appAction from '../../redux/actions/app.action';
export default function TrackOrder({navigation, route}) {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  let data = route.params?.data;
  useEffect(() => {
    setLoaded(true);
  });
  return (
    <>
      <Header title={'Track Order'} back />
      <Container style={{flex: 1}}>
        {loaded && (
          <WebView
            // renderLoading={() => <ActivityIndicator size={'large'} />}
            // onLoad={() => {
            //   console.log('[webview] onLoad',data);
            // }}
            onLoadStart={() => {
              // console.log('[webview] onLoadStart');
              dispatch(appAction.showProgress());
            }}
            onLoadEnd={() => {
              console.log('[webview] onLoadEnd');
              dispatch(appAction.hideProgress());
            }}
            onLoadProgress={e => {
              // console.log('[webview] onLoadProgress', e.nativeEvent);
              if (e.nativeEvent.progress == 1) {
                dispatch(appAction.hideProgress());
              }
            }}
            source={{uri: data.tracking_url}}
            // style={{ marginTop: 20 }}
          />
        )}
      </Container>
    </>
  );
}
