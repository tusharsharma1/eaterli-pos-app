import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import useTheme from '../../hooks/useTheme';
import MenuIcon from '../../assets/MenuIcon';
import {useDispatch} from 'react-redux';
import appAction from '../../redux/actions/app.action';
import SearchIcon from '../../assets/SearchIcon';
import SettingIcon from '../../assets/SettingIcon';
import HelpIcon from '../../assets/HelpIcon';
import { DrawerActions, useNavigation } from '@react-navigation/native';
export default function LeftMenu() {
  const dispatch = useDispatch();
  const themeData = useTheme();
  const navigation=useNavigation();
  return (
    <View
      style={{
        // backgroundColor: 'red',
        width: 62,
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 2,
      }}>
      <Image
        resizeMode="contain"
        style={{
          width: '90%',
          marginBottom: 10,
        }}
        source={
          themeData.darkMode
            ? require('../../assets/logo.png')
            : require('../../assets/logo-l.png')
        }
      />

      <MenuButton Icon={MenuIcon} onPress={()=>{
         navigation.dispatch(DrawerActions.toggleDrawer());
      }}/>
      <View
        style={{
          flex: 1,
        }}></View>
      <MenuButton
        onPress={() => {
          dispatch(appAction.set({darkMode: !themeData.darkMode}));
        }}
        Icon={SearchIcon}
      />
      <MenuButton Icon={SettingIcon} />
      <MenuButton Icon={HelpIcon} />
    </View>
  );
}

function MenuButton({Icon, ...props}) {
  const themeData = useTheme();
  return (
    <TouchableOpacity style={{marginBottom: 15}} {...props}>
      <Icon
        color={themeData.darkMode ? '#A1A1AA' : '#E4E3E8'}
        width={30}
        height={30}
      />
    </TouchableOpacity>
  );
}
