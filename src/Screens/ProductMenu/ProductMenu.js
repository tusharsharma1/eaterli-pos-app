import React, {PureComponent, useEffect, useState} from 'react';
import {TouchableOpacity, Image, PixelRatio, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Text from '../../components/Text';
import Button from '../../components/Button';
import appAction from '../../redux/actions/app.action';
import theme from '../../theme';
import TextInput from '../../components/Controls/TextInput';
import Container from '../../components/Container';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import LoginForm from '../../forms/LoginForm';
import * as Keychain from 'react-native-keychain';
import userAction from '../../redux/actions/user.action';
import AppLoader from '../../components/AppLoader';
import {convertDistance, getPreciseDistance} from 'geolib';
import {getCurrentPosition} from '../../helpers/location.helper';
import ProgressImage from '../../components/react-native-image-progress';
import Header from '../../components/Header';
import {PRODUCT_MENU_TYPE} from '../../constants/order.constant';
import CategoryNav from '../components/CategoryNav';
import MenuItem from '../components/MenuItem';
export default function Home({navigation, route, ...props}) {
 
  const [loaded, setLoaded] = useState(false);
  const [nearByLocation, setNearByLocation] = useState(null);
  const dispatch = useDispatch();
  const userData = useSelector(s => s.user.userData);
  const productMenuType=useSelector(s => s.order.productMenuType);
  const selectedLocation = useSelector(s => s.user.selectedLocation);
  const mobileBuilder = useSelector(s => s.user.mobileBuilder);
  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    // getMobileBuilder
    let {categoriesSortable, categoriesSortable1} = React.store.getState().user;
    // let categoriesSortable1 = React.store.getState().user.categoriesSortable1;

    // if (categoriesSortable.length) {
    //   return;
    // }
    let category =
    productMenuType == PRODUCT_MENU_TYPE.catering.id
        ? categoriesSortable1
        : categoriesSortable;
    if (category.length) {
      return;
    }
    // let location = userData.locations.find(f => f.is_primary == '1');

    if (selectedLocation) {
      // dispatch(userAction.set({selectedLocation: location.id}));
      let r = await dispatch(userAction.getMenus(selectedLocation));
    }

    // let r = await dispatch(userAction.getMenus(values));

    setLoaded(true);
  };
  //  console.log(route.params)
  let {
    menu_bg
  } = mobileBuilder.layout;
  return (
    <>
      <Header
        title={
          productMenuType == PRODUCT_MENU_TYPE.catering.id
            ? 'Catering Menu'
            : 'Restaurant Menu'
        }
        back
      />
      <CategoryNav  />
      <Container scroll style={{flex: 1,backgroundColor: menu_bg}}>
        <MenuItem />
      </Container>
    </>
  );
}
