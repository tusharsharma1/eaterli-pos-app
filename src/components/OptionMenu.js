import React, {PureComponent} from 'react';
import {TouchableOpacity} from 'react-native';
import {Menu, MenuItem} from 'react-native-material-menu';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import theme from '../theme';
class OptionMenu extends PureComponent {
  state = {
    visible: false,
  };

  toggleMenu = () => {
    this.setState({visible: !this.state.visible});
  };

  render() {
    let {menus, width,color='#fff'} = this.props;
    width = width ? width : 25;
    menus = menus ? menus : [];
    let {visible} = this.state;
    return (
      <Menu
        visible={visible}
        onRequestClose={this.toggleMenu}
        anchor={
          <TouchableOpacity
            style={{
              width: width,
              // height: 25,
              justifyContent: 'center',
              alignItems: 'center',
              // backgroundColor:'red',
              paddingVertical: 1,
            }}
            onPress={this.toggleMenu}>
            <FontAwesome5 name={'ellipsis-v'} size={22} color={color} />
          </TouchableOpacity>
        }>
        {menus.map(m => {
          return (
            <MenuItem
              key={m.text}
              style={{
                justifyContent: 'center',
              }}
              
              textStyle={{fontSize:16,color:'#212121', fontFamily: theme.fonts.regular}}
              onPress={() => {
                this.toggleMenu();
                setTimeout(() => {
                  m.onPress && m.onPress();
                }, 500);
              }}>
              {m.icon}{'  '}
              {m.text}
            </MenuItem>
          );
        })}
      </Menu>
    );
  }
}

export default OptionMenu;
