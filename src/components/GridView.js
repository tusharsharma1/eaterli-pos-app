import {memo} from 'react';
import {FlatList, Image, TouchableOpacity, View} from 'react-native';
// import ProgressImage from '../../components/react-native-image-progress/index';

import {formatGridData, getPercentValue} from '../helpers/app.helpers';

import theme from '../theme';
import Text from './Text';

function _GridView({
  data = [],
  numColumns = 2,
  imagePerSize = 50,
  getImageSource = null,
  onItemPress,
  itemStyle = {},
  itemBackgroundColor = '#eee',
  component = FlatList,
  renderItem,
  marginHorizontal=5,
  keyExtractor=(item, index) => index,
  ...rest
}) {
  const _renderItem = ({item, index}) => {
   
    let empty = item.empty === true;
    let itemSize =
      (theme.screenWidth - theme.horizontalSpacing * 2) / numColumns -
      marginHorizontal * 2;
    let imageSize = getPercentValue(itemSize, imagePerSize);
    let _itemStyle = {
      backgroundColor: empty ? 'transparent' : itemBackgroundColor,
      alignItems: 'center',

      flex: 1,
      marginVertical: 5, //theme.wp(2.5),
      marginHorizontal: marginHorizontal, // theme.wp(2.5),
      paddingTop: 10,
      paddingBottom: 15,
      paddingHorizontal: getPercentValue(itemSize, 9.5),
      // width: itemSize,
      // height: itemSize,
      borderRadius: getPercentValue(itemSize, 12),
      ...itemStyle,
    };

    if (empty) {
      return <View style={_itemStyle} />;
    }

    if(renderItem){
      return renderItem({item,index,itemSize,itemStyle:_itemStyle})
    }

    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          item.onPress && item.onPress(item);
          onItemPress && onItemPress(item);
        }}
        style={_itemStyle}>
        <Image
          source={getImageSource ? getImageSource(item) : item.image}
          style={{
            width: imageSize,
            height: imageSize,
            // backgroundColor: '#f0f',
            marginBottom: 10,
          }}
        />

        <Text
          bold
          size={getPercentValue(itemSize, 9.5)}
          align="center"
          // backgroundColor={'red'}
          style={{
            width: '100%',
          }}
          // lineHeight={15}
          //size={vwidth * (4.5 / 100)}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };
  let Root = component;
  return (
    <>
      <Root
        showsVerticalScrollIndicator={false}
        data={formatGridData(data, numColumns)}
        renderItem={_renderItem}
        numColumns={numColumns}
        keyExtractor={keyExtractor} //item.cat_id}
        {...rest}
      />
    </>
  );
}

const GridView = memo(_GridView);
export default GridView;
