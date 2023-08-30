import {PRODUCT_MENU_TYPE} from '../../constants/order.constant';
import {getCartItemID} from '../../helpers/order.helper';
import {actions} from '../reducers/order.reducer';

export default {
  ...actions,
  addToCart(cart_id, params = {}) {
    return (dispatch, getState) => {
      // let idPart = [itemid];
      // sizeId && idPart.push(sizeId);
      // let { productMenuType } = getState().theme;
      // let productMenuType = PRODUCT_MENU_TYPE.restuarant.id;
      // let id = getCartItemID(itemid, sizeId, addons, productMenuType); //idPart.join("-");

      let {cart} = getState().order;
      let qty = 1;
      if (cart[cart_id]) {
        // return false;
        qty = cart[cart_id].qty + 1;
      }

      dispatch(
        actions.set({
          _prop: 'cart',
          values: {
            [cart_id]: {qty: qty, ...params},
          },
        }),
      );

      dispatch(
        actions.set({
          selectedCartItem: cart_id,
        }),
      );

      return true;
    };
  },
};
