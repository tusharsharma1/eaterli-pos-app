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
import {PAYMENT_METHOD} from '../../constants/order.constant';
import {dummyImage} from '../../assets';
import userAction from '../../redux/actions/user.action';
import {getAddons, getVariants} from '../../helpers/order.helper';
export default function Orders({navigation, route}) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const selectedLocation = useSelector(s => s.user.selectedLocation);
  const orders = useSelector(s => s.user.orders);
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    let r = await dispatch(userAction.getOrders(selectedLocation,!orders.length));
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
    parseFloat(selectedOrder?.received_amount) -
    parseFloat(selectedOrder?.order_total);
  if (!isFinite(remaining_amount)) {
    remaining_amount = 0;
  }
  return (
    <>
      <Header title={'Orders'} back />
      <Container style={{flex: 1}}>
        <Table
          data={orders}
          // data={Array.from(Array(20)).map((r, i) => {
          //   return {
          //     id: i + 1,

          //     products: [
          //       {
          //         id: 781,
          //         qty: 1,
          //         price: 12,
          //         rate: 12.5,
          //         totalPrice: 12.5,
          //         name: "Create Your Own- Load'M Potato",
          //         image:
          //           'https://eaterli.s3.us-east-2.amazonaws.com/restaurants/87/menuitems/Rcm3xysiOkQsRERgoStGj4ZkwuVDoCbcuOYNsKbY.jpg',
          //         variants: [
          //           {
          //             pid: '42',
          //             id: 150,
          //             price: '',
          //             title: 'No Dressing',
          //           },
          //           {
          //             pid: '43',
          //             id: 99,
          //             price: '',
          //             title: 'Romano',
          //           },
          //           {
          //             pid: '44',
          //             id: 147,
          //             price: '',
          //             title: 'NO MEAT',
          //           },
          //           {
          //             pid: '45',
          //             id: 118,
          //             price: '',
          //             title: 'Broccoli',
          //           },
          //           {
          //             pid: '52',
          //             id: 143,
          //             price: 12,
          //             title: 'Baked Potato',
          //           },
          //         ],
          //         add_ons: [
          //           {
          //             id: 73,
          //             location_id: 143,
          //             product_name: 'Addons | Extra Dressing - Blue Cheese',
          //             product_description: null,
          //             product_image: '',
          //             product_price: 0.5,
          //             sort_order: '0',
          //             active: '1',
          //             deleted_at: null,
          //             category_id: 387,
          //             created_at: '2023-04-26T17:57:01.000000Z',
          //             updated_at: '2023-04-26T17:57:01.000000Z',
          //           },
          //         ],
          //         special_ins: '',
          //       },
          //       {
          //         id: 783,
          //         qty: 1,
          //         price: 18.99,
          //         rate: 18.99,
          //         totalPrice: 18.99,
          //         name: "Create Your Own - Load'M Fries",
          //         image:
          //           'https://eaterli.s3.us-east-2.amazonaws.com/restaurants/87/menuitems/kqB4I3gYwb2baBGB9mkNbcivE4gzM9thCJfAAAZ6.jpg',
          //         variants: [
          //           {
          //             pid: '42',
          //             id: 93,
          //             price: '',
          //             title: 'Sour Cream',
          //           },
          //           {
          //             pid: '43',
          //             id: 99,
          //             price: '',
          //             title: 'Romano',
          //           },
          //           {
          //             pid: '44',
          //             id: 100,
          //             price: '',
          //             title: 'Chili',
          //           },
          //           {
          //             pid: '45',
          //             id: 112,
          //             price: '',
          //             title: 'Bell Peppers',
          //           },
          //           {
          //             pid: '46',
          //             id: 128,
          //             price: '',
          //             title: 'Queso',
          //           },
          //           {
          //             pid: '47',
          //             id: 133,
          //             price: 18.99,
          //             title: 'Tater Tots',
          //           },
          //         ],
          //         add_ons: [],
          //         special_ins: '',
          //       },
          //       {
          //         id: 785,
          //         qty: 1,
          //         price: 12,
          //         rate: 12,
          //         totalPrice: 12,
          //         name: "Create Your Own - Load'M Soup",
          //         image:
          //           'https://eaterli.s3.us-east-2.amazonaws.com/restaurants/87/menuitems/FW11xyRFzWaEuBFiTZznKWo3ZBSik4VjvzuGS2Iv.jpg',
          //         variants: [],
          //         add_ons: [],
          //         special_ins: '',
          //       },
          //       {
          //         id: 787,
          //         qty: 2,
          //         price: 12,
          //         rate: 12,
          //         totalPrice: 24,
          //         name: "Create Your Own - Load'M Nachos",
          //         image:
          //           'https://eaterli.s3.us-east-2.amazonaws.com/restaurants/87/menuitems/ow6AZiSw563FQgjixiQXGlvnHPwYwCJjQke37q0p.jpg',
          //         variants: [],
          //         add_ons: [],
          //         special_ins: '',
          //       },
          //       {
          //         id: 784,
          //         qty: 1,
          //         price: 12,
          //         rate: 12,
          //         totalPrice: 12,
          //         name: "Create Your Own - Load'M Tortilla Bowl",
          //         image:
          //           'https://eaterli.s3.us-east-2.amazonaws.com/restaurants/87/menuitems/bP5Gb3wPvugc8kusWl6EgCB88OKLRjdV7TYFoqQV.jpg',
          //         variants: [],
          //         add_ons: [],
          //         special_ins: '',
          //       },
          //       {
          //         id: 786,
          //         qty: 3,
          //         price: 12,
          //         rate: 12,
          //         totalPrice: 36,
          //         name: "Create Your Own - Load'M Flat Bread",
          //         image:
          //           'https://eaterli.s3.us-east-2.amazonaws.com/restaurants/87/menuitems/5ZYULIGxVrxReNkFtapfxMCwaTYM6TdKJ9GjrXJ0.jpg',
          //         variants: [],
          //         add_ons: [],
          //         special_ins: '',
          //       },
          //     ],
          //     restaurant_location_id: 143,
          //     restaurant_id: 87,
          //     total: 115.49,
          //     received_amount: '150',

          //     // products: [
          //     //   {
          //     //     id: 780,
          //     //     qty: 3,
          //     //     price: 0,
          //     //     rate: 5,
          //     //     totalPrice: 15,
          //     //     name: 'scdcs',
          //     //     variants: [],
          //     //     add_ons: [
          //     //       {
          //     //         id: 68,
          //     //         location_id: 9,
          //     //         product_name: 's',
          //     //         product_description: null,
          //     //         product_image: '',
          //     //         product_price: 3,
          //     //         sort_order: '0',
          //     //         active: '1',
          //     //         deleted_at: null,
          //     //         category_id: 386,
          //     //         created_at: '2023-04-24T06:34:13.000000Z',
          //     //         updated_at: '2023-04-24T06:34:13.000000Z',
          //     //       },
          //     //       {
          //     //         id: 69,
          //     //         location_id: 9,
          //     //         product_name: 'e',
          //     //         product_description: null,
          //     //         product_image: '',
          //     //         product_price: 2,
          //     //         sort_order: '0',
          //     //         active: '1',
          //     //         deleted_at: null,
          //     //         category_id: 386,
          //     //         created_at: '2023-04-24T06:34:17.000000Z',
          //     //         updated_at: '2023-04-24T06:34:17.000000Z',
          //     //       },
          //     //     ],
          //     //     special_ins: '',
          //     //   },
          //     //   {
          //     //     id: 780,
          //     //     qty: 2,
          //     //     price: 13,
          //     //     rate: 13,
          //     //     totalPrice: 26,
          //     //     name: 'scdcs',
          //     //     variants: [
          //     //       {
          //     //         pid: '7',
          //     //         id: 10,
          //     //         price: 6,
          //     //         title: 'M',
          //     //       },
          //     //       {
          //     //         pid: '7',
          //     //         id: 11,
          //     //         price: 7,
          //     //         title: 'L',
          //     //       },
          //     //     ],
          //     //     add_ons: [],
          //     //     special_ins: '',
          //     //   },
          //     //   {
          //     //     id: 780,
          //     //     qty: 1,
          //     //     price: 7,
          //     //     rate: 12,
          //     //     totalPrice: 12,
          //     //     name: 'scdcs',
          //     //     variants: [
          //     //       {
          //     //         pid: '7',
          //     //         id: 11,
          //     //         price: 7,
          //     //         title: 'L',
          //     //       },
          //     //     ],
          //     //     add_ons: [
          //     //       {
          //     //         id: 68,
          //     //         location_id: 9,
          //     //         product_name: 's',
          //     //         product_description: null,
          //     //         product_image: '',
          //     //         product_price: 3,
          //     //         sort_order: '0',
          //     //         active: '1',
          //     //         deleted_at: null,
          //     //         category_id: 386,
          //     //         created_at: '2023-04-24T06:34:13.000000Z',
          //     //         updated_at: '2023-04-24T06:34:13.000000Z',
          //     //       },
          //     //       {
          //     //         id: 69,
          //     //         location_id: 9,
          //     //         product_name: 'e',
          //     //         product_description: null,
          //     //         product_image: '',
          //     //         product_price: 2,
          //     //         sort_order: '0',
          //     //         active: '1',
          //     //         deleted_at: null,
          //     //         category_id: 386,
          //     //         created_at: '2023-04-24T06:34:17.000000Z',
          //     //         updated_at: '2023-04-24T06:34:17.000000Z',
          //     //       },
          //     //     ],
          //     //     special_ins: '',
          //     //   },
          //     // ],
          //     // restaurant_location_id: 9,
          //     // restaurant_id: 7,
          //     // total: 53,
          //     // received_amount: '77',
          //     paymentMethod: i % 2 ? 'card' : 'cash',
          //     created_at: '2023-04-24T06:34:17.000000Z',
          //   };
          // })}
          columns={columns}
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
                      return data.rate?`$${parseFloat(data.rate).toFixed(2)}`:'';
                    },
                  },
                  {
                    title: 'Total',
                    align: 'right',
                    renderValue: data => {
                      return data.total_price?`$${parseFloat(data.total_price).toFixed(2)}`:'';
                    },
                  },
                ]}
              />
            </View>
            <View
              style={{
                alignSelf: 'flex-end',
                width: 300,
              }}>
              <InfoRow
                title={'Grand Total:'}
                value={`$ ${parseFloat(selectedOrder.order_total).toFixed(2)}`}
              />
              {selectedOrder.payment_method == PAYMENT_METHOD.cash.id && (
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
