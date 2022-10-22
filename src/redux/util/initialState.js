import {PRODUCT_MENU_TYPE} from '../../constants/order.constant';

const initialState = {
  app: {
    inProgress: false,
    progressMessage: 'Please wait',
  },
  user: {
    deviceToken: '',
    userData: null,

    categoriesSortable: [],
    categories: {},
    subCategories: {},

    categoriesSortable1: [],
    categories1: {},
    subCategories1: {},

    selectedCategory: '',
    selectedCategory1:'',

    selectedLocation:'',

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
  },
  order: {
    cart: {},
    productMenuType: PRODUCT_MENU_TYPE.restuarant.id,
    orderType:'pickup'
  },
};
export default initialState;
