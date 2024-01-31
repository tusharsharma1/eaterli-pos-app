import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Container from '../../components/Container';
import Header from '../../components/Header';
import Text from '../../components/Text';
import MenuItem from '../../components/app/MenuItem';
import useTheme from '../../hooks/useTheme';
import General from './View/General';

import {saveSettings} from '../../helpers/settings.helper';
import {useNonInitialEffect} from '../../hooks/useNonInitialEffect';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import ImageSetting from './View/ImageSetting';
const MENU_ITEMS = [
  {
    id: 'General',
    title: 'General',
    View: General,
  },
  {
    id: 'Image',
    title: 'Image Setting',
    View: ImageSetting,
  },
  // {
  //   id: 'Colors',
  //   title: 'Colors',
  //   // View: Colors,
  // },
  // {
  //   id: 'Printer',
  //   title: 'Printer',
  //   View: Printer,
  // },
];
export default function Settings({navigation, route}) {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const deviceId = useSelector(s => s.user.deviceId);
  const userData = useSelector(s => s.user.userData);
  const [activeMenu, setActiveMenu] = useState(MENU_ITEMS[0].id);
  const themeData = useTheme();
  const {isPortrait} = useWindowDimensions();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoaded(true);
  };

  const renderView = () => {
    let menu = MENU_ITEMS.find(m => m.id == activeMenu);
    if (!menu) {
      return null;
    }

    return (
      <>
        <View
          style={{
            flex: 1,
            backgroundColor: themeData.appBg,
          }}>
          <View
            style={{
              backgroundColor: themeData.cardBg,
              paddingHorizontal: 20,
              paddingVertical: 10,
              // borderBottomColor: themeData.cardBorderColor,
              // borderBottomWidth: 1,
            }}>
            <Text align="center" color={themeData.textColor} size={18} semibold>
              {menu.title}
            </Text>
          </View>
          <Container
            contentContainerStyle={{
              paddingHorizontal: 10,
              paddingVertical: 10,
            }}
            scroll>
            {menu.View && <menu.View />}
          </Container>
        </View>
      </>
    );
  };
  return (
    <>
      <Header title={'Settings'} back />
      <Container style={{flex: 1, flexDirection: 'row'}}>
        <View
          style={{
            width: isPortrait ? 170 : 300,
            backgroundColor: themeData.cardBg,
            borderRightColor: themeData.cardBorderColor,
            borderRightWidth: 1,
          }}>
          <Container scroll>
            {MENU_ITEMS.map(m => {
              return (
                <MenuItem
                  onPress={() => {
                    setActiveMenu(m.id);
                  }}
                  active={activeMenu == m.id}
                  key={m.id}>
                  {m.title}
                </MenuItem>
              );
            })}
          </Container>
        </View>

        {loaded && renderView()}
      </Container>
      <SettingSaver />
    </>
  );
}

function SettingSaver() {
  const imageSettings = useSelector(s => s.settings.imageSettings);
  const generalSettings = useSelector(s => s.settings.generalSettings);
  useNonInitialEffect(() => {
    saveSettings();
  }, [imageSettings, generalSettings]);
  return null;
}
