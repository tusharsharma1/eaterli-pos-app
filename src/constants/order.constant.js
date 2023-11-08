export const CLOSED_MESSAGE = 'We are currently not accepting delivery orders.';
export const OUT_OF_STOCK_MESSAGE = 'This item is currently unavailable.';
export const PRODUCT_MENU_TYPE = {
  all: {id: '-1'},
  catering: {id: '1'},
  restuarant: {id: '0'},
};

export const PAYMENT_METHOD = {
  card: {id: 'card'},
  gift_card: {id: 'gift card'},
  cash: {id: 'cash'},
  split_payment: {id: 'split payment'},
};

export const DINING_OPTION = {
  dine_in: {id: 'dine_in', text: 'Dine In'},
  take_out: {id: 'take_out', text: 'Take Out'},
};

export const DELIVERY_TYPE = {
  pickup: {id: 'pickup', text: 'Pickup'},
  delivery: {id: 'delivery', text: 'Delivery'},
  dine_in: {id: 'dine_in', text: 'Dine In'},
  take_out: {id: 'take_out', text: 'Take Out'},
};

export const CART_MODAL_VIEW = {
  reward_question: {id: 'reward_question'},
  customer_phone: {id: 'customer_phone'},
  scan_qr: {id: 'scan_qr'},
  loyality: {id: 'loyality'},
  ask_split_payment: {id: 'ask_split_payment'},
  split_payment: {id: 'split_payment'},
  payment_method: {id: 'payment_method'},
  price_calc: {id: 'price_calc'},
  price_calc_split: {id: 'price_calc_split'},
  scan_gift_card: {id: 'scan_gift_card'},
};

export const CUSTOMER_DETAIL = {
  phoneNo: '',
  email: '',
  firstName: '',
  lastName: '',
};

export const DEFAULT_TAX_TITLE = 'Tax Fee';

export const ORDER_ITEM_TYPE = {
  menu: {id: 'menu'},
  giftcard: {id: 'giftcard'},
  giftcard_add_balance: {id: 'giftcard_add_balance'},
  offer: {id: 'offer'},
};

export const REFUND_TYPE = {
  percantage: {id: 'percantage'},
  amount: {id: 'amount'},
  items: {id: 'items'},
  full: {id: 'full'},
};

export const ORDER_STATUS = {
  created: {id: 'created'},
  restaurant_confirmed: {id: 'restaurant_confirmed'},
  restaurant_rejected: {id: 'restaurant_rejected'},

  DASHER_CONFIRMED: {id: 'enroute_to_pickup'},
  DASHER_ARRIVED_AT_PICKUP: {id: 'arrived_at_pickup'},
  DELIVERY_PICKED_UP: {id: 'picked_up'},
  DASHER_PICKED_UP: {id: 'enroute_to_dropoff'},
  DELIVERED: {id: 'delivered'},
  CANCELLED: {id: 'cancelled'},
  DASHER_ARRIVED_AT_RETURN: {id: 'arrived_at_return'},
  RETURNED: {id: 'returned'},
  CONFIRMED: {id: 'confirmed_to_pickup'},
  PICKED_UP: {id: 'self_picked_up'},
};
