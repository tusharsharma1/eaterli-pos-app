import React, {memo} from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import Text from './Text';
import {textAlignToFlexAlign} from '../theme';
import useTheme from '../hooks/useTheme';

export default function Table({
  data,
  keyExtractor = (item, index) => {
    return index;
  },
  columns = [],
  hideHeader,
  rowPress,

  ...props
}) {
  const themeData = useTheme();
  const renderHeader = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: themeData.bodyBg,
          paddingHorizontal: 10,
          paddingVertical: 5,
          // borderBottomColor: '#ddd',
          // borderBottomWidth: 1,
        }}>
        {columns.map((h, i) => {
          let vstyle = {flex: h.flex ?? 1};
          if (h.width) {
            delete vstyle.flex;
            vstyle.width = h.width;
          }

          return (
            <View
              key={i}
              style={{
                ...vstyle,
                alignItems: textAlignToFlexAlign(h.align),
              }}>
              <Text color={themeData.textColor} bold>
                {h.title}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };
  const renderRows = () => {
    return (
      <FlatList
        renderItem={({item, index}) => {
          return (
            <RowItem
              onPress={rowPress}
              columns={columns}
              data={item}
              index={index}
             
            />
          );
        }}
        data={data}
        keyExtractor={keyExtractor}
        {...props}
      />
    );
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      {!hideHeader && renderHeader()}
      {renderRows()}
    </View>
  );
}

function _RowItem({columns, data, index, onPress}) {
  const themeData = useTheme();
  const renderCell = h => {
    if (h.renderCell) {
      return h.renderCell(data, index);
    }
    return (
      <Text size={12} color={themeData.textColor} medium  {...h.textProps}>
        {h.renderValue ? h.renderValue(data, index) : data[h.key]}
      </Text>
    );
  };
  const renderDataRow = () => {
    let Root = onPress ? TouchableOpacity : View;
    return (
      <Root
        activeOpacity={0.6}
        onPress={() => {
          onPress && onPress(data, index);
        }}
        style={{
          flexDirection: 'row',
          // backgroundColor: '#eee',
          paddingHorizontal: 10,
          paddingVertical: 8,
          // borderBottomColor: '#ddd',
          // borderBottomWidth: 1,
        }}>
        {columns.map((h, i) => {
          let vstyle = {flex: h.flex ?? 1};
          if (h.width) {
            delete vstyle.flex;
            vstyle.width = h.width;
          }

          return (
            <View
              key={i}
              style={{
                ...vstyle,
                alignItems: textAlignToFlexAlign(h.align),
              }}>
              {renderCell(h)}
            </View>
          );
        })}
      </Root>
    );
  };
  return renderDataRow();
}

const RowItem = memo(_RowItem);
