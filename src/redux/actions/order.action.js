import { PRODUCT_MENU_TYPE } from '../../constants/order.constant';
import {getCartItemID} from '../../helpers/order.helper';
import {actions} from '../reducers/order.reducer';

export default {
  ...actions,
  addToCart(itemid, sizeId, price, addons = [], special_ins = '') {
    return (dispatch, getState) => {
      // let idPart = [itemid];
      // sizeId && idPart.push(sizeId);
      // let { productMenuType } = getState().theme;
      let productMenuType=PRODUCT_MENU_TYPE.restuarant.id
      let id = getCartItemID(itemid, sizeId, addons, productMenuType); //idPart.join("-");

      let {cart} = getState().order;
      let qty = 1;
      if (cart[id]) {
        // return false;
        qty = cart[id].qty + 1;
      }

      dispatch(
        actions.set({
          _prop: 'cart',
          values: {
            [id]: {qty: qty, price, add_ons: addons, special_ins},
          },
        }),
      );

      return true;
    };
  },
};
