import React, {useEffect} from 'react';
import Button from '../../components/Button';
import Container from '../../components/Container';
import Header from '../../components/Header';
import {
  createOrderReceiptPrintData,
  doPrintUSBPrinter,
  doWebViewPrint,
  loadPrinters,
  selectPrinters,
} from '../../helpers/printer.helper';
import theme from '../../theme';
import NumberInput from '../../components/NumberInput';
import Text from '../../components/Text';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import appAction from '../../redux/actions/app.action';
import {useNonInitialEffect} from '../../hooks/useNonInitialEffect';
import storageHelper from '../../helpers/storage.helper';
import useTheme from '../../hooks/useTheme';

export default function PrinterSettings({navigation, route}) {
  const pageWidthLength = useSelector(s => s.app.pageWidthLength);
  const dispatch = useDispatch();
const themeData=useTheme();
  useNonInitialEffect(() => {
    storageHelper.storeData('pageWidthLength', pageWidthLength);
  }, [pageWidthLength]);
  return (
    <>
      <Header title={'Printer Settings'} back />
      <Container scroll style={{
        backgroundColor:themeData.bodyBg
      }}>
        <Container
          style={{
            // flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-start',
            padding: 20,
            flexWrap: 'wrap',
          }}>
          <Button
          borderRadius={4}
            mr={10}
            mb={10}
            onPress={async () => {
              await loadPrinters(false);
              selectPrinters();
            }}>
            Connect USB Printer
          </Button>
          <Button
           borderRadius={4}
            backgroundColor={theme.colors.primaryColor}
            mr={10}
            mb={10}
            onPress={async () => {
              let printData = createOrderReceiptPrintData(TEST_ORDER);
              await doPrintUSBPrinter(printData);
              // return;
              __DEV__ && doWebViewPrint(printData);
            }}>
            Test Print
          </Button>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text color={themeData.textColor} mr={10}>Page Width:</Text>
            <NumberInput
              value={pageWidthLength}
              onChange={v => {
                dispatch(
                  appAction.set({
                    pageWidthLength: v,
                  }),
                );
              }}
            />
          </View>
        </Container>
      </Container>
    </>
  );
}

const TEST_ORDER = {
  id: 20,
  user_id: 0,
  staff_id: 50,
  address_id: null,
  delivery_id: null,
  pos_order_id: null,
  restaurant_location_id: 9,
  order_status: 'created',
  order_date: '2023-10-04 08:10:12',
  pickup_date: null,
  delivery_type: '',
  discount: 10,
  discount_type: 1,
  discount_reason: null,
  order_total: '40.50',
  received_amount: '50.25',
  address_lat: null,
  address_lng: null,
  is_cancelled: 0,
  dining_option: 'dine_in',
  door_dash_status: null,
  dasher_id: null,
  dasher_name: null,
  dasher_phone_number: null,
  dasher_dropoff_phone_number: null,
  dasher_pickup_phone_number: null,
  dasher_vehicle_make: null,
  dasher_vehicle_model: null,
  dasher_vehicle_year: null,
  pickup_time_estimated: null,
  dropoff_time_estimated: null,
  pickup_time_actual: null,
  dropoff_time_actual: null,
  dasher_location: null,
  status_stack: null,
  dates_stack: null,
  restaurant_id: 7,
  promo_amount: '0.00',
  promo_code: null,
  sub_total: 36,
  tip_amount: '0.00',
  offer_id: null,
  gift_card_id: 0,
  gift_card_amount: null,
  delivery_fee: '0.00',
  delivery_zone_name: null,
  created_at: '2023-10-04T08:12:53.000000Z',
  tax_per: '25.00',
  tax_amt: '9.00',
  tax_title: 'States Sales Tax 2',
  card_last_four: null,
  payment_method: 'split payment',
  pickupType: null,
  curbsideVehicle: null,
  order_type: 'pos',
  order_from: 'pos',
  device_id: 'fad22a677dc57027',
  updated_at: '2023-10-04T08:12:53.000000Z',
  order_items: [
    {
      id: 33,
      order_id: 20,
      menu_item_id: 795,
      item_type: 'menu',
      quantity: '1',
      price: '6',
      rate: '6',
      total_price: '6',
      offer_type: null,
      discount: '0',
      discount_type: 1,
      discount_reason: null,
      item_name: 'ewfewf',
      special_ins: null,
      image: null,
      add_ons: null,
      variants: null,
      created_at: '2023-10-04T08:12:53.000000Z',
      updated_at: '2023-10-04T08:12:53.000000Z',
      menu_items: {
        id: 795,
        pos_item_id: null,
        parent_item_id: null,
        location_id: null,
        link_status: null,
        menu_category_id: 386,
        item_name: 'ewfewf',
        item_description: null,
        out_of_stock: 0,
        pos_status: 1,
        item_image: '',
        item_price: 6,
        is_variation: '0',
        is_feature_item: null,
        set_default_price: null,
        add_ons: null,
        discount: null,
        label: null,
        label_bg_color: null,
        sort_order: '0',
        active: '1',
        estimate_cooking_time: null,
        variants: null,
        inventory_type: null,
        inventory_item: null,
        deleted_at: null,
        created_at: '2023-08-14T05:47:23.000000Z',
        updated_at: '2023-08-19T15:19:14.000000Z',
        menu_category: {
          id: 386,
          pos_category_id: null,
          parent_id: null,
          location_id: null,
          link_status: 1,
          category_name: 'AA',
          category_description: null,
          category_image: '',
          sort_order: 0,
          deleted_at: null,
          created_at: '2023-04-21T15:24:09.000000Z',
          updated_at: '2023-04-21T15:24:09.000000Z',
          type: 0,
        },
      },
    },
    {
      id: 34,
      order_id: 20,
      menu_item_id: 796,
      item_type: 'menu',
      quantity: '1',
      price: '15',
      rate: '15',
      total_price: '15',
      offer_type: null,
      discount: '0',
      discount_type: 1,
      discount_reason: null,
      item_name: '43',
      special_ins: null,
      image: null,
      add_ons: null,
      variants: null,
      created_at: '2023-10-04T08:12:53.000000Z',
      updated_at: '2023-10-04T08:12:53.000000Z',
      menu_items: {
        id: 796,
        pos_item_id: null,
        parent_item_id: null,
        location_id: null,
        link_status: null,
        menu_category_id: 386,
        item_name: '43',
        item_description: null,
        out_of_stock: 0,
        pos_status: 1,
        item_image: '',
        item_price: 15,
        is_variation: '0',
        is_feature_item: null,
        set_default_price: null,
        add_ons: null,
        discount: null,
        label: null,
        label_bg_color: null,
        sort_order: '3',
        active: '1',
        estimate_cooking_time: null,
        variants: null,
        inventory_type: null,
        inventory_item: null,
        deleted_at: null,
        created_at: '2023-08-14T05:47:34.000000Z',
        updated_at: '2023-08-19T15:19:35.000000Z',
        menu_category: {
          id: 386,
          pos_category_id: null,
          parent_id: null,
          location_id: null,
          link_status: 1,
          category_name: 'AA',
          category_description: null,
          category_image: '',
          sort_order: 0,
          deleted_at: null,
          created_at: '2023-04-21T15:24:09.000000Z',
          updated_at: '2023-04-21T15:24:09.000000Z',
          type: 0,
        },
      },
    },
    {
      id: 35,
      order_id: 20,
      menu_item_id: 780,
      item_type: 'menu',
      quantity: '1',
      price: '15',
      rate: '15',
      total_price: '15',
      offer_type: null,
      discount: '0',
      discount_type: 1,
      discount_reason: null,
      item_name: 'Bread Cheese',
      special_ins: null,
      image:
        'https://eaterli.s3.us-east-2.amazonaws.com/restaurants/87/menuitems/kqB4I3gYwb2baBGB9mkNbcivE4gzM9thCJfAAAZ6.jpg',
      add_ons: null,
      variants:
        '[{"id": 11, "pid": "7", "price": 7, "title": "L", "pos_status": true}, {"id": 40, "pid": "19", "price": 3, "title": "Tomato", "pos_status": true}, {"id": 42, "pid": "19", "price": 5, "title": "Souce", "pos_status": true}]',
      created_at: '2023-10-04T08:12:53.000000Z',
      updated_at: '2023-10-04T08:12:53.000000Z',
      menu_items: {
        id: 780,
        pos_item_id: null,
        parent_item_id: null,
        location_id: null,
        link_status: null,
        menu_category_id: 386,
        item_name: 'Bread Cheese',
        item_description: null,
        out_of_stock: 0,
        pos_status: 1,
        item_image:
          'https://eaterli.s3.us-east-2.amazonaws.com/restaurants/87/menuitems/kqB4I3gYwb2baBGB9mkNbcivE4gzM9thCJfAAAZ6.jpg',
        item_price: 5,
        is_variation: '0',
        is_feature_item: null,
        set_default_price: null,
        add_ons:
          '[{"id": "69692eac61bc6b1828", "conf": {"66": {"pos_status": false}, "67": {"pos_status": false}}, "items": [66, 67], "title": "Drinks", "required": false}, {"id": "edab58b408e30aca76", "items": [68, 69], "title": "Snacks", "required": false}]',
        discount: null,
        label: '[]',
        label_bg_color: null,
        sort_order: '1',
        active: '1',
        estimate_cooking_time: '[]',
        variants:
          '[{"id": "f027b0a8b5f8b93704", "upto": 0, "items": [{"id": 39, "price": 2, "title": "Veg"}, {"id": 40, "price": 3, "title": "Tomato", "pos_status": true}, {"id": 41, "price": 4, "title": "Chilly", "pos_status": true}, {"id": 42, "price": 5, "title": "Souce", "pos_status": true}], "require": false, "required": false, "title_id": "19", "default_id": "", "multiselect": true}, {"id": "2e2dd5b011cd58bfc6", "upto": 3, "items": [{"id": 10, "price": 6, "title": "M", "pos_status": true}, {"id": 11, "price": 7, "title": "L", "pos_status": true}, {"id": 12, "price": 3, "title": "S", "pos_status": true}], "require": false, "required": false, "title_id": "7", "default_id": "", "multiselect": true}]',
        inventory_type: '1',
        inventory_item: '[]',
        deleted_at: null,
        created_at: '2023-04-25T05:31:45.000000Z',
        updated_at: '2023-08-19T15:19:12.000000Z',
        menu_category: {
          id: 386,
          pos_category_id: null,
          parent_id: null,
          location_id: null,
          link_status: 1,
          category_name: 'AA',
          category_description: null,
          category_image: '',
          sort_order: 0,
          deleted_at: null,
          created_at: '2023-04-21T15:24:09.000000Z',
          updated_at: '2023-04-21T15:24:09.000000Z',
          type: 0,
        },
      },
    },
  ],
  payment: null,
  order_split_payments: [
    {
      id: 111,
      order_id: 20,
      type: 'cash',
      amount: 20.25,
      received_amount: 20.25,
    },
    {
      id: 112,
      order_id: 20,
      type: 'cash',
      amount: 20.25,
      received_amount: 30,
    },
  ],
  point_transactions: [],
  qr_reward: {
    id: 135,
    order_id: 20,
    activity_id: 1,
    points: 0,
    status: 0,
    created_at: '2023-10-04T08:12:53.000000Z',
    updated_at: '2023-10-04T08:12:53.000000Z',
    activity: {
      id: 1,
      activity_id: 2,
      price: null,
      status: 1,
      title: 'Make first order',
      description:
        'Award 100 points when refers friends who make a purchase (for each referral)',
      points: 100,
      point_type: 1,
      user_id: 50,
      inactive_orders_month: null,
      last_order_day: null,
      apply_on_order: null,
      created_at: '2023-07-10T18:38:33.000000Z',
      updated_at: '2023-09-01T03:14:57.000000Z',
    },
  },
  egift_card: null,
};
