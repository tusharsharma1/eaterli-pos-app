import {ALERT_TYPE} from '../../constants/alert.constant';
import {
  CUSTOMER_DETAIL,
  PRODUCT_MENU_TYPE,
} from '../../constants/order.constant';

const initialState = {
  app: {
    inProgress: false,
    progressMessage: 'Please wait',
    printers: [],
    pageWidthLength: 40,
    pageLeftMarginLength: 0,
    selectedPrinter:'',
    printerModal:false,
    pendingOrderPrint:null
  },
  alert: {
    show: false,

    type: ALERT_TYPE.ALERT,
    icon: 'i',
    text: '',
    heading: 'Message',
    onPositivePress: null,
    onNegativePress: null,
    positiveText: 'OK',
    NegativeText: 'No',
  },
  user: {
    deviceId: '',
    deviceToken: '',
    userData: null,

    categoriesSortable: {},
    categories: {},
    menuItems: {},

    categoriesSortable1: {},

    selectedCategory: '',
    selectedCategory1: '',
    options: [],
    selectedLocation: '',

    addonProducts: [],
    addonProductsById: {},
    menuTitles: [],
    selectedMenuTitle: '',
    orders: {
      totalPage: 1,
      data: [],
      currentPage: 1,
    },
    activeOrders: {
      totalPage: 1,
      data: [],
      currentPage: 1,
    },

    mobileBuilder: {
      layout: {
        id: 1,
        primary: '#f84242',
        price: '#f84242',
        product_bg: '#222',
        product_text: '#fff',
        btn_text: '#fff',
        menu_bg: '#999',
        sidebar_bg: '#222',
        sidebar_text: '#fff',
        sidebar_accent: '#f84242',
        header_bg: '#222',
        header_text: '#fff',
        section_bg: '#222',
        section_text: '#fff',
      },
      menu_layout: 'box',
      logo: '',
      app_name: '',
    },
    rewards: [],

    giftCardModal: {show: false, ref: ''},
    scanOfferModal: {show: false, ref: ''},
    cashDrawerTrasactions: {
      totalPage: 1,
      data: [],
      currentPage: 1,
    },
  },
  order: {
    cart: {},
    productMenuType: PRODUCT_MENU_TYPE.restuarant.id,
    orderType: 'pickup',
    selectedCartItem: null,
    diningOption: '',
    diningOptionModal: {show: false, ref: ''},
    payModal: {show: false, ref: ''},
    customerDetail: CUSTOMER_DETAIL,
    splitBills: [],
  },
};
export default initialState;
