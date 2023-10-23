import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Text from '../../components/Text';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import moment from 'moment';
import {ORDER_STATUS, PAYMENT_METHOD} from '../../constants/order.constant';
import Table from '../../components/Table';
import {getAddons, getVariants} from '../../helpers/order.helper';
import ProgressImage from '../../components/react-native-image-progress';
import {dummyImage} from '../../assets';
import theme from '../../theme';
import ModalContainer from '../../components/ModalContainer';
// import BackIcon from '../assets/BackIcon';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {simpleToast} from '../../helpers/app.helpers';
export default function OrderDetail({
  hideRefund,
  showAccept,
  data,
  voidPress,
  refundPress,
  changeStatus,
}) {
  const [acceptModal, setAcceptModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleAcceptModal = () => {
    setAcceptModal(!acceptModal);
  };

  const getItemPrice = _data => {
    let discount_type = _data.discount_type ?? '1';

    let _discount = parseFloat(_data.discount ?? 0);
    let totalPrice = _data.total_price;
    if (_discount) {
      if (discount_type == '1') {
        totalPrice = totalPrice - totalPrice * (_discount / 100);
      } else if (discount_type == '2') {
        totalPrice = totalPrice - _discount;
      }
    }

    let sub_total = totalPrice;
    let tax_amt = (sub_total * data.tax_per) / 100;
    let tax_total = parseFloat(tax_amt) + parseFloat(sub_total);
    let total = tax_total;

    return {
      sub_total,
      total,
      tax_amt,
    };
  };

  if (!data) {
    return null;
  }

  let remaining_amount =
    parseFloat(data?.order_total) - parseFloat(data?.received_amount);
  if (!isFinite(remaining_amount)) {
    remaining_amount = 0;
  }

  return (
    <>
      {showAccept && data.order_status == ORDER_STATUS.created.id && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginBottom: 10,
            alignItems: 'center',
          }}>
          <Button
            pv={8}
            ph={30}
            mr={5}
            onPress={() => {
              toggleAcceptModal();
              //  changeStatus && changeStatus(ORDER_STATUS.restaurant_confirmed.id);
            }}>
            Accept
          </Button>

          <Button
            backgroundColor={theme.colors.primaryColor}
            pv={8}
            ph={30}
            onPress={() => {
              changeStatus && changeStatus(ORDER_STATUS.restaurant_rejected.id);
            }}>
            Reject
          </Button>
        </View>
      )}

      {!hideRefund && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginBottom: 10,
            alignItems: 'center',
          }}>
          {!(data.order_void == '1' || !!data.order_refunds?.length) && (
            <>
              <Button pv={8} ph={30} mr={5} onPress={voidPress}>
                Void
              </Button>

              <Button pv={8} ph={30} onPress={refundPress}>
                Refund
              </Button>
            </>
          )}

          {data.order_void == '1' && (
            <Badge backgroundColor="#e20b3c" mr={4}>
              Void
            </Badge>
          )}
          {!!data.order_refunds?.length && (
            <Badge backgroundColor="#e27b0b">Refund</Badge>
          )}
        </View>
      )}
      <View
        style={{
          // alignItems: 'flex-end',
          marginBottom: 20,
        }}>
        <InfoRow title={'Order No:'} value={data.id} />
        <InfoRow
          title={'Order Date:'}
          value={moment(data.created_at).format('DD MMM, YYYY hh:mm A')}
        />
        <InfoRow
          title={'Payment Method:'}
          value={`${data.payment_method || ''}`.toLocaleUpperCase()}
        />
        {data.paymentMethod == PAYMENT_METHOD.card.id && (
          <>
            <InfoRow title={'Payment ID:'} value={'PAY_2332hhj34x'} />
          </>
        )}
      </View>

      {data.point_transactions && !!data.point_transactions.length && (
        <View>
          <Text size={18} bold mb={5}>
            Reward Points
          </Text>
          {data.point_transactions.map((d, i) => {
            return (
              <View
                key={i}
                style={{
                  marginBottom: 5,
                }}>
                <Text size={14}>
                  Description:{' '}
                  <Text size={14} semibold>
                    {d.description}
                  </Text>
                </Text>
                <Text size={14}>
                  Point:{' '}
                  <Text size={14} semibold>
                    {d.point}
                  </Text>
                </Text>
              </View>
            );
          })}
        </View>
      )}

      <Text size={18} bold>
        Products
      </Text>
      <View
        style={{
          // height:theme.hp(50),
          marginBottom: 20,
        }}>
        <Table
          data={data.order_items}
          columns={[
            {
              title: 'Name',
              align: 'left',
              renderCell: _data => {
                let variants = getVariants(_data);
                let add_ons = getAddons(_data);
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <ProgressImage
                      // color={}
                      source={
                        _data.image
                          ? {
                              uri: _data.image,
                              //+ '?t=' + new Date().getTime()
                            }
                          : dummyImage
                      }
                      style={{
                        width: 50,
                        height: 50,

                        backgroundColor: '#aaa',
                        marginRight: 5,
                        // borderRadius: theme.wp(26) / 2,
                        // borderWidth: 1,
                        //borderColor: theme.colors.borderColor,
                        // _data.item_image
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
                    />
                    <View>
                      <Text>{_data.item_name}</Text>
                      {!!variants.length && (
                        <Text color="#666" size={12}>
                          {variants.map(r => r.title).join(', ')}
                        </Text>
                      )}
                      {!!add_ons.length && (
                        <Text color="#666" size={12}>
                          {add_ons.map(r => r.product_name).join(', ')}
                        </Text>
                      )}
                    </View>
                  </View>
                );
              },
            },
            {
              title: 'Qty',
              align: 'right',
              key: 'quantity',
            },
            {
              title: 'Rate',
              align: 'right',
              renderValue: _data => {
                return _data.rate
                  ? `$${parseFloat(_data.rate).toFixed(2)}`
                  : '';
              },
            },
            {
              title: 'Dis.',
              align: 'right',
              renderValue: _data => {
                return `${_data.discount_type == '2' ? '$' : ''}${
                  _data.discount ?? 0
                }${_data.discount_type == '1' ? '%' : ''}`;
                // return _data.rate
                //   ? `$${parseFloat(_data.rate).toFixed(2)}`
                //   : '';
              },
            },
            {
              title: 'Total',
              align: 'right',
              renderValue: _data => {
                let discount_type = _data.discount_type ?? '1';

                let _discount = parseFloat(_data.discount ?? 0);
                let totalPrice = _data.total_price;
                if (_discount) {
                  if (discount_type == '1') {
                    totalPrice = totalPrice - totalPrice * (_discount / 100);
                  } else if (discount_type == '2') {
                    totalPrice = totalPrice - _discount;
                  }
                }
                return totalPrice
                  ? `$${parseFloat(totalPrice).toFixed(2)}`
                  : '';
              },
            },
          ]}
        />
      </View>

      {[PAYMENT_METHOD.split_payment.id].includes(data.payment_method) && (
        <View
          style={{
            marginBottom: 10,
          }}>
          <Text size={18} bold>
            Split Payment
          </Text>

          <Table
            data={data.order_split_payments || []}
            columns={[
              {
                title: 'Type',
                align: 'left',
                key: 'type',
              },

              {
                title: 'Amount',
                align: 'right',
                renderValue: data => {
                  return data.amount
                    ? `$${parseFloat(data.amount).toFixed(2)}`
                    : '';
                },
              },
              {
                title: 'Received Amount',
                align: 'right',
                renderValue: data => {
                  return data.received_amount
                    ? `$${parseFloat(data.received_amount).toFixed(2)}`
                    : '';
                },
              },
            ]}
          />

          {/* {(data.order_split_payments || []).map(sp => {
                  return <View key={sp.id}></View>;
                })} */}
        </View>
      )}

      <View
        style={{
          alignSelf: 'flex-end',
          width: 300,
        }}>
        <InfoRow
          title={'Sub Total:'}
          value={`$ ${parseFloat(data.sub_total).toFixed(2)}`}
        />
        <InfoRow
          title={`${data?.tax_title || DEFAULT_TAX_TITLE} (${parseFloat(
            data?.tax_per || 0,
          )}%)`}
          value={`$ ${parseFloat(data.tax_amt).toFixed(2)}`}
        />

        {!!data.discount && (
          <>
            <InfoRow
              title={'Total:'}
              value={`$ ${(
                parseFloat(data.sub_total) + parseFloat(data.tax_amt)
              ).toFixed(2)}`}
            />
            <InfoRow
              title={'Discount:'}
              value={`${data.discount_type == '2' ? '$ ' : ''}${
                data.discount ?? 0
              }${data.discount_type == '1' ? '%' : ''}`}
            />
          </>
        )}

        <InfoRow
          title={'Grand Total:'}
          value={`$ ${parseFloat(data.order_total).toFixed(2)}`}
        />
        {[PAYMENT_METHOD.cash.id, PAYMENT_METHOD.split_payment.id].includes(
          data.payment_method,
        ) && (
          <>
            <InfoRow
              title={'Received Amount:'}
              value={`$ ${parseFloat(data.received_amount).toFixed(2)}`}
            />
            <InfoRow
              title={'Change:'}
              value={`$ ${Math.abs(parseFloat(remaining_amount)).toFixed(2)}`}
            />
          </>
        )}
      </View>

      <ModalContainer
        // hideTitle
        center
        // noscroll
        onRequestClose={toggleAcceptModal}
        visible={acceptModal}
        title={`Accept Order`}
        landscapeWidth={550}>
        <View
          style={{
            marginBottom: 10,
          }}>
          <Table
            rowPress={(_data, index) => {
              console.log(_data);
              setSelectedItems(v => {
                let _items = [...v];
                let _index = _items.indexOf(_data.id);
                if (_index != -1) {
                  _items.splice(_index, 1);
                } else {
                  _items.push(_data.id);
                }
                console.log(_items, v);
                return _items;
              });
            }}
            data={data.order_items}
            columns={[
              {
                title: '#',
                align: 'left',

                renderCell: (_data, index) => {
                  let selected = selectedItems.includes(_data.id);
                  return (
                    <FontAwesome5
                      size={20}
                      solid={selected}
                      color={selected ? theme.colors.secondaryColor : '#222222'}
                      name={selected ? 'check-circle' : 'circle'}
                    />
                  );
                },
              },
              {
                title: 'Name',
                align: 'left',
                renderCell: _data => {
                  let variants = getVariants(_data);
                  let add_ons = getAddons(_data);
                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <View>
                        <Text>{_data.item_name}</Text>
                        {!!variants.length && (
                          <Text color="#666" size={12}>
                            {variants.map(r => r.title).join(', ')}
                          </Text>
                        )}
                        {!!add_ons.length && (
                          <Text color="#666" size={12}>
                            {add_ons.map(r => r.product_name).join(', ')}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                },
              },
              {
                title: 'Qty',
                align: 'right',
                key: 'quantity',
              },
              {
                title: 'Rate',
                align: 'right',
                renderValue: _data => {
                  return _data.rate
                    ? `$${parseFloat(_data.rate).toFixed(2)}`
                    : '';
                },
              },
              {
                title: 'Dis.',
                align: 'right',
                renderValue: _data => {
                  return `${_data.discount_type == '2' ? '$' : ''}${
                    _data.discount ?? 0
                  }${_data.discount_type == '1' ? '%' : ''}`;
                  // return _data.rate
                  //   ? `$${parseFloat(_data.rate).toFixed(2)}`
                  //   : '';
                },
              },
              {
                title: 'Total',
                align: 'right',
                renderValue: _data => {
                  let discount_type = _data.discount_type ?? '1';

                  let _discount = parseFloat(_data.discount ?? 0);
                  let totalPrice = _data.total_price;
                  if (_discount) {
                    if (discount_type == '1') {
                      totalPrice = totalPrice - totalPrice * (_discount / 100);
                    } else if (discount_type == '2') {
                      totalPrice = totalPrice - _discount;
                    }
                  }
                  return totalPrice
                    ? `$${parseFloat(totalPrice).toFixed(2)}`
                    : '';
                },
              },
            ]}
          />

          <Button
            style={{
              alignSelf: 'center',
            }}
            pv={8}
            ph={30}
            mt={5}
            onPress={() => {
              if (!selectedItems.length) {
                simpleToast('Select Items');
                return;
              }

              changeStatus &&
                changeStatus(ORDER_STATUS.restaurant_confirmed.id, {
                  selected_items: selectedItems,
                });
              toggleAcceptModal();
              //  changeStatus && changeStatus(ORDER_STATUS.restaurant_confirmed.id);
            }}>
            Accept
          </Button>
          {/* {props.errors.items ? (
                    <Text align="center" color={theme.colors.errorColor}>
                      {props.errors.items}
                    </Text>
                  ) : null} */}
        </View>
      </ModalContainer>
    </>
  );
}
function InfoRow({title, value, style = {}}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',

        ...style,
      }}>
      <Text bold>{title}</Text>
      <Text ml={5}>{value}</Text>
    </View>
  );
}
