import Color from 'color';
import React, {memo} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {dummyImage} from '../../assets';
import ProgressImage from '../../components/react-native-image-progress';
import Text from '../../components/Text';
import {OUT_OF_STOCK_MESSAGE} from '../../constants/order.constant';
import {showToast} from '../../helpers/app.helpers';
import {addToCart, getPrice} from '../../helpers/order.helper';
import useProducts from '../../hooks/useProducts';
import useWindowDimensions from '../../hooks/useWindowDimensions';

// import BackIcon from '../assets/BackIcon';

function _MenuItem({}) {
  const dispatch = useDispatch();
  let {width} = useWindowDimensions();
  let {categories, subCategories, isCatering, selectedCategory} = useProducts();

  const mobileBuilder = useSelector(s => s.user.mobileBuilder);

  const addClick = data => {
    console.log(data);

    let {price, sizeId} = getPrice(data.id, '', isCatering);
    let add_ons = data.add_ons;

    if (data.out_of_stock == '1') {
      showToast(OUT_OF_STOCK_MESSAGE, 'error');
      return;
    }

    // if (add_ons) {
    //   showToast('Add On ', "error");
    //   // this.props.dispatch(
    //   //   userAction.setProperty({ selectedCategoryItem: data.id })
    //   // );
    // } else {
    addToCart(data.id, sizeId, price);
    // }
  };
  let {
    product_bg,
    product_text,
    btn_text,
    price: price_color,
    primary,
  } = mobileBuilder.layout;
  let text_color = Color(product_text);
  const BoxItem = ({data, price, cutPrice}) => {
    let boxwidth = width >= 768 ? width / 4 - 10 - 5 : width / 2 - 10 - 10;
    return (
      <View
        style={{
          width: boxwidth,
          backgroundColor: product_bg,
          marginBottom: 10,
          marginHorizontal: 5,

          shadowColor: '#00000088',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 1,
          shadowRadius: 6,

          elevation: 5,
        }}>
        {/* <View
          style={{
            height: 150,
            }}> */}
        <ProgressImage
          color={primary}
          source={
            data.item_image
              ? {
                  uri: data.item_image,
                  //+ '?t=' + new Date().getTime()
                }
              : dummyImage
          }
          style={{
            // width: '100%',
            height: boxwidth - 30,

            backgroundColor: Color(product_bg).darken(0.2).toString(),

            // borderRadius: theme.wp(26) / 2,
            // borderWidth: 1,
            //borderColor: theme.colors.borderColor,
            // data.item_image
            //  backgroundColor:'red'
          }}
          imageStyle={{
            width: '100%',
            height: '100%',
            // width: 60,
            resizeMode: 'cover',
            // height: theme.screenWidth / numColumns - 100,
            // height:
            //   theme.screenWidth / numColumns -
            //   2 * theme.wp(2) * numColumns -
            //   theme.hp(5),
            // backgroundColor: 'red',
            // - (vheight * (10 / 100)), // theme.hp(10),
            flex: 1,
          }}
          // renderIndicator={(progress, inde) => {
          //   console.log(progress, inde);
          //   return (
          //     <>
          //       <Text
          //         style={{
          //           fontSize: 8,
          //           fontFamily: theme.fonts.regular,
          //           width: '100%',
          //           height: '100%',
          //        }}>
          //         Loading...{progress}
          //       </Text>
          //     </>
          //   );
          // }}
        />
        {/* </View> */}
        <View
          style={{
            padding: 10,
          }}>
          <Text semibold color={text_color.hex()} size={18}>
            {data.item_name}
          </Text>
          <Text
            size={14}
            numberOfLines={1}
            color={text_color.alpha(0.6).toString()}
            mb={10}>
            {data.item_description}
          </Text>

          <Text mb={10} color={price_color} size={16} bold>
            $ {parseFloat(price || 0).toFixed(2)}{' '}
            {!!parseFloat(data.discount) && (
              <Text
                color={text_color.alpha(0.6).toString()}
                style={{
                  textDecorationLine: 'line-through',
                  textDecorationStyle: 'solid',
                }}
                size={16}
                bold>
                $ {parseFloat(cutPrice || 0).toFixed(2)}
              </Text>
            )}
          </Text>

          {/* <ThemeButton
            onPress={() => {
              addClick(data);
            }}>
            Add
          </ThemeButton> */}
        </View>
      </View>
    );
  };

  const ListItem = ({data, price, cutPrice}) => {
    return (
      <View
        style={{
          width: width >= 768 ? width / 2 - 10 - 10 : width - 10 - 10 - 10,
          backgroundColor: product_bg,
          marginBottom: 10,
          marginHorizontal: 5,

          shadowColor: '#00000088',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 1,
          shadowRadius: 6,

          elevation: 5,
          flexDirection: 'row',
        }}>
        {/* <View
          style={{
            width:150,
            // height: 150,
            backgroundColor: Color(product_bg).darken(0.2).toString(),
          }}> */}
        <ProgressImage
          color={primary}
          source={
            data.item_image
              ? {
                  uri: data.item_image,
                  // + '?t=' + new Date().getTime()
                }
              : dummyImage
          }
          style={{
            width: 150,
            // height: 150,
            backgroundColor: Color(product_bg).darken(0.2).toString(),
            // borderRadius: theme.wp(26) / 2,
            // borderWidth: 1,
            //borderColor: theme.colors.borderColor,
            // data.item_image
            //  backgroundColor:'red'
          }}
          imageStyle={{
            width: '100%',
            height: '100%',
            // width: 60,
            resizeMode: 'cover',
            // height: theme.screenWidth / numColumns - 100,
            // height:
            //   theme.screenWidth / numColumns -
            //   2 * theme.wp(2) * numColumns -
            //   theme.hp(5),
            // backgroundColor: 'red',
            // - (vheight * (10 / 100)), // theme.hp(10),
            flex: 1,
          }}
          // renderIndicator={(progress, inde) => {
          //   console.log(progress, inde);
          //   return (
          //     <>
          //       <Text
          //         style={{
          //           fontSize: 8,
          //           fontFamily: theme.fonts.regular,
          //           width: '100%',
          //           height: '100%',
          //        }}>
          //         Loading...{progress}
          //       </Text>
          //     </>
          //   );
          // }}
        />
        {/* </View> */}
        <View
          style={{
            padding: 10,
            flex: 1,
          }}>
          <Text semibold color={text_color.hex()} size={18}>
            {data.item_name}
          </Text>
          <Text
            size={14}
            numberOfLines={1}
            color={text_color.alpha(0.6).toString()}
            mb={10}>
            {data.item_description}
          </Text>

          <Text mb={10} color={price_color} size={16} bold>
            $ {parseFloat(price || 0).toFixed(2)}{' '}
            {!!parseFloat(data.discount) && (
              <Text
                color={text_color.alpha(0.6).toString()}
                style={{
                  textDecorationLine: 'line-through',
                  textDecorationStyle: 'solid',
                }}
                size={16}
                bold>
                $ {parseFloat(cutPrice || 0).toFixed(2)}
              </Text>
            )}
          </Text>

          {/* <ThemeButton
            onPress={() => {
              addClick(data);
            }}>
            Add
          </ThemeButton> */}
        </View>
      </View>
    );
  };

  let cat = categories[selectedCategory];
  if (!cat) {
    return null;
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingVertical: 15,
        paddingHorizontal: 10,
      }}>
      {cat.menu_items.map(id => {
        let data = subCategories[id];
        let {price, cutPrice} = getPrice(id, '', false);
        if (!data) {
          return null;
        }
        if (mobileBuilder.menu_layout == 'box') {
          return (
            <BoxItem key={id} data={data} price={price} cutPrice={cutPrice} />
          );
        }
        return (
          <ListItem key={id} data={data} price={price} cutPrice={cutPrice} />
        );
      })}
    </View>
  );
}
const MenuItem = memo(_MenuItem);
export default MenuItem;
