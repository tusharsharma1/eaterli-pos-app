import React, {memo} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Text from '../../components/Text';
import {PRODUCT_MENU_TYPE} from '../../constants/order.constant';
import useProducts from '../../hooks/useProducts';
import userAction from '../../redux/actions/user.action';
// import BackIcon from '../assets/BackIcon';

function _CategoryNav() {
  const dispatch = useDispatch();

  let {categories, categoriesSortable, selectedCategory, productMenuType} =
    useProducts();

  const mobileBuilder = useSelector(s => s.user.mobileBuilder);

  let {header_bg, header_text, primary} = mobileBuilder.layout;
  return (
    <View>
      <ScrollView
        horizontal
        style={{
          backgroundColor: header_bg,
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          {categoriesSortable.map(id => {
            let data = categories[id];
            let selected = selectedCategory == id;

            // console.log(c.red())
            if (!data) {
              return null;
            }
            return (
              <TouchableOpacity
                key={id}
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  borderBottomColor: selected ? primary : '#00000000',
                  borderBottomWidth: 4,
                  // display: 'inline-block',
                  // borderBottom: selected ? `4px solid ${main}` : '',
                  // marginRight: 5,
                  // padding: '8px 10px',
                  // cursor: 'pointer',
                  // fontWeight: selected ? 700 : 500,
                  // color: selected
                  //   ? c.hex()
                  //   : `rgba(${c.red()},${c.green()},${c.blue()},${0.6})`,
                }}
                onPress={() => {
                  if (PRODUCT_MENU_TYPE.restuarant.id==productMenuType) {
                    dispatch(userAction.set({selectedCategory: id}));
                  } else {
                    dispatch(userAction.set({selectedCategory1: id}));
                  }
                }}
                // productStyle={productStyle}
                // viewMode={viewMode}
              >
                <Text color={header_text} semibold={selected}>
                  {data.category_name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
const CategoryNav = memo(_CategoryNav);
export default CategoryNav;
