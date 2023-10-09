import React, {memo} from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import Text from './Text';
import {textAlignToFlexAlign} from '../theme';

export default function Table({
  data,
  keyExtractor = (item, index) => {
    return index;
  },
  columns = [],
  rowPress,
  ...props
}) {
  const renderHeader = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#fff',
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderBottomColor: '#ddd',
          borderBottomWidth: 1,
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
              <Text bold>{h.title}</Text>
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
          return <RowItem onPress={rowPress} columns={columns} data={item} index={index}/>;
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
      {renderHeader()}
      {renderRows()}
    </View>
  );
}

function _RowItem({columns, data,index,onPress}) {
  const renderCell = h => {
    if (h.renderCell) {
      return h.renderCell(data,index);
    }
    return (
      <Text size={12} medium>
        {h.renderValue ? h.renderValue(data,index) : data[h.key]}
      </Text>
    );
  };
  const renderDataRow = () => {

    let Root=onPress?TouchableOpacity:View;
    return (
      <Root
      activeOpacity={.6}
      onPress={()=>{
        onPress && onPress(data,index)
      }}
        style={{
          flexDirection: 'row',
          backgroundColor: '#eee',
          paddingHorizontal: 10,
          paddingVertical: 8,
          borderBottomColor: '#ddd',
          borderBottomWidth: 1,
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
