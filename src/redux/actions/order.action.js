import {getCartItemID} from '../../helpers/order.helper';
import {actions} from '../reducers/order.reducer';

export default {
  ...actions,
  addToCart(itemid, sizeId, price, addons = []) {
    return (dispatch, getState) => {
      // let idPart = [itemid];
      // sizeId && idPart.push(sizeId);
      let {productMenuType, cart} = getState().order;
      let id = getCartItemID(itemid, sizeId, addons, productMenuType); //idPart.join("-");

      let qty = 1;
      if (cart[id]) {
        // return false;
        qty = cart[id].qty + 1;
      }

      dispatch(
        actions.set({
          _prop: 'cart',
          values: {
            [id]: {qty: qty, price, add_ons: addons},
          },
        }),
      );

      return true;
    };
  },
};
