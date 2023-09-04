import React, {useEffect, useMemo, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {useDispatch, useSelector} from 'react-redux';
import Container from '../../components/Container';
import Header from '../../components/Header';
import Table from '../../components/Table';
import moment from 'moment';
import ModalContainer from '../../components/ModalContainer';
import ProgressImage from '../../components/react-native-image-progress';
import Text from '../../components/Text';
import theme from '../../theme';
import {
  DEFAULT_TAX_TITLE,
  PAYMENT_METHOD,
} from '../../constants/order.constant';
import {dummyImage} from '../../assets';
import userAction from '../../redux/actions/user.action';
import {getAddons, getVariants} from '../../helpers/order.helper';
export default function Orders({navigation, route}) {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const selectedLocation = useSelector(s => s.user.selectedLocation);
  const userData = useSelector(s => s.user.userData);
  const orders = useSelector(s => s.user.orders);
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  useEffect(() => {
    loadData();
  }, []);
  const loadData = async refresh => {
    setLoaded(false);
    let r = await dispatch(
      userAction.getOrders(userData.restaurant.id, selectedLocation, false),
    );
    setLoaded(true);
  };

  const columns = useMemo(() => {
    return [
      {title: 'Order No', align: 'left', key: 'id'},
      {
        title: 'Total Products',
        renderValue: data => {
          return `${data.order_items.length}`;
        },
        align: 'right',
      },
      {
        title: 'Total Amount',
        renderValue: data => {
          return `$ ${parseFloat(data.order_total).toFixed(2)}`;
        },
        align: 'right',
      },
      {
        title: 'Date',
        renderValue: data => {
          return moment(data.created_at).format('DD MMM, YYYY');
        },
      },
      {
        title: 'Payment Method',
        renderValue: data => {
          return data.payment_method?.toLocaleUpperCase();
        },
      },
      {
        title: 'Action',
        renderCell: data => {
          return (
            <View>
              {/* <TouchableOpacity>
          <FontAwesome5Icon name="pen" />
        </TouchableOpacity> */}
              <TouchableOpacity
                onPress={() => {
                  setSelectedOrder(data);
                  toggleModal();
                }}
                style={{
                  // backgroundColor:'red',
                  padding: 4,
                }}>
                <FontAwesome5Icon name="eye" color={'#212121'} size={22} />
              </TouchableOpacity>
            </View>
          );
        },
        // width: 100,
      },
    ];
  }, []);
  let remaining_amount =
    parseFloat(selectedOrder?.order_total) -
    parseFloat(selectedOrder?.received_amount);
  if (!isFinite(remaining_amount)) {
    remaining_amount = 0;
  }
  return (
    <>
      <Header title={'Orders'} back />
      <Container style={{flex: 1}}>
        <Table
          data={orders}
          columns={columns}
          refreshing={!loaded}
          onRefresh={() => {
            loadData(true);
          }}
        />
      </Container>
      <ModalContainer
        // hideTitle
        center
        // noscroll
        onRequestClose={toggleModal}
        visible={showModal}
        title={`Order Details`}
        landscapeWidth={550}
        // width={550}
        // height={theme.hp(60)}
        // borderRadius={25}
        // renderFooter={() => {
        //   return (
        //     <View
        //       style={{
        //         alignItems: 'flex-end',
        //       }}>
        //       <Button ph={30} size={14} onPress={addToCartPress}>
        //         Add To Cart $ {parseFloat(totalPrice || 0).toFixed(2)}
        //       </Button>
        //     </View>
        //   );
        // }}
      >
        {!!selectedOrder && (
          <>
            <View
              style={{
                // alignItems: 'flex-end',
                marginBottom: 20,
              }}>
              <InfoRow title={'Order No:'} value={selectedOrder.id} />
              <InfoRow
                title={'Order Date:'}
                value={moment(selectedOrder.created_at).format(
                  'DD MMM, YYYY hh:mm A',
                )}
              />
              <InfoRow
                title={'Payment Method:'}
                value={`${
                  selectedOrder.payment_method || ''
                }`.toLocaleUpperCase()}
              />
              {selectedOrder.paymentMethod == PAYMENT_METHOD.card.id && (
                <>
                  <InfoRow title={'Payment ID:'} value={'PAY_2332hhj34x'} />
                </>
              )}
            </View>

            {selectedOrder.point_transactions &&
              !!selectedOrder.point_transactions.length && (
                <View>
                  <Text size={18} bold mb={5}>
                    Reward Points
                  </Text>
                  {selectedOrder.point_transactions.map((d, i) => {
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
                data={selectedOrder.order_items}
                columns={[
                  {
                    title: 'Name',
                    align: 'left',
                    renderCell: data => {
                      let variants = getVariants(data);
                      let add_ons = getAddons(data);
                      return (
                        <View
                          style={{
                            flexDirection: 'row',
                          }}>
                          <ProgressImage
                            // color={}
                            source={
                              data.image
                                ? {
                                    uri: data.image,
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
                          />
                          <View>
                            <Text>{data.item_name}</Text>
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
                    renderValue: data => {
                      return data.rate
                        ? `$${parseFloat(data.rate).toFixed(2)}`
                        : '';
                    },
                  },
                  {
                    title: 'Dis.',
                    align: 'right',
                    renderValue: data => {
                      return `${data.discount_type == '2' ? '$' : ''}${
                        data.discount ?? 0
                      }${data.discount_type == '1' ? '%' : ''}`;
                      // return data.rate
                      //   ? `$${parseFloat(data.rate).toFixed(2)}`
                      //   : '';
                    },
                  },
                  {
                    title: 'Total',
                    align: 'right',
                    renderValue: data => {
                      let discount_type = data.discount_type ?? '1';

                      let _discount = parseFloat(data.discount ?? 0);
                      let totalPrice = data.total_price;
                      if (_discount) {
                        if (discount_type == '1') {
                          totalPrice =
                            totalPrice - totalPrice * (_discount / 100);
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

            {[PAYMENT_METHOD.split_payment.id].includes(
              selectedOrder.payment_method,
            ) && (
              <View
                style={{
                  marginBottom: 10,
                }}>
                <Text size={18} bold>
                  Split Payment
                </Text>

                <Table
                  data={selectedOrder.order_split_payments || []}
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

                {/* {(selectedOrder.order_split_payments || []).map(sp => {
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
                value={`$ ${parseFloat(selectedOrder.sub_total).toFixed(2)}`}
              />
              <InfoRow
                title={`${
                  selectedOrder?.tax_title || DEFAULT_TAX_TITLE
                } (${parseFloat(selectedOrder?.tax_per || 0)}%)`}
                value={`$ ${parseFloat(selectedOrder.tax_amt).toFixed(2)}`}
              />

              {!!selectedOrder.discount && (
                <>
                  <InfoRow
                    title={'Total:'}
                    value={`$ ${(
                      parseFloat(selectedOrder.sub_total) +
                      parseFloat(selectedOrder.tax_amt)
                    ).toFixed(2)}`}
                  />
                  <InfoRow
                    title={'Discount:'}
                    value={`${selectedOrder.discount_type == '2' ? '$ ' : ''}${
                      selectedOrder.discount ?? 0
                    }${selectedOrder.discount_type == '1' ? '%' : ''}`}
                  />
                </>
              )}

              <InfoRow
                title={'Grand Total:'}
                value={`$ ${parseFloat(selectedOrder.order_total).toFixed(2)}`}
              />
              {[
                PAYMENT_METHOD.cash.id,
                PAYMENT_METHOD.split_payment.id,
              ].includes(selectedOrder.payment_method) && (
                <>
                  <InfoRow
                    title={'Received Amount:'}
                    value={`$ ${parseFloat(
                      selectedOrder.received_amount,
                    ).toFixed(2)}`}
                  />
                  <InfoRow
                    title={'Remaining Amount:'}
                    value={`$ ${parseFloat(remaining_amount).toFixed(2)}`}
                  />
                </>
              )}
            </View>
          </>
        )}
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
