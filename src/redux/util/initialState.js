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
    selectedPrinter: '',
    printerModal: false,
    pendingOrderPrint: null,
    searchModal:false,
    themeConfig: {
      light: {
        appBg: '#71717B',
        bodyBg: '#F4F4F6',
        cardBg: '#E4E3E8',
        textColor: '#18171D',
        modalBg: '#F4F4F6',
        inputBorderColor: '#A1A1AA',
        inputBg: '#F4F4F6',

        btnSecondaryBg: '#71717B',

        tabBg: '#F4F4F6',
        tabBorderColor: '#A1A1AA',

        loginBg:'#E4E3E8eb'
      },
      dark: {
        appBg: '#414147',
        bodyBg: '#18171D',
        cardBg: '#27262B',
        textColor: '#F4F4F6',
        modalBg: '#34333A',

        inputBorderColor: '#A1A1AA',
        inputBg: '#27262B',

        btnSecondaryBg: '#636369',

        tabBg: '#27262B',
        tabBorderColor: '#E4E3E8',

        loginBg:'#18171Dcc'
      },
    },
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
    negativeText: 'No',
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
    totalActiveOrder: 0,
    totalOngoingPickupOrder: 0,
    totalOngoingDeliveryOrder: 0,
  },
  order: {
    holdCarts: [],
    cart: {},
    productMenuType: PRODUCT_MENU_TYPE.restuarant.id,
    orderType: 'pickup',
    selectedCartItem: null,
    diningOption: '',
    diningOptionModal: {show: false, ref: ''},
    payModal: {show: false, ref: ''},
    customerDetail: CUSTOMER_DETAIL,
    ticketName:'',
    splitBills: [],
  },
  settings: {
    generalSettings: {
      darkMode: true,
     
    },
    imageSettings: {
      showCatImage:true,
      showProductImage:true,
      showOrderItemImage:true
    }
  },
};
export default initialState;
