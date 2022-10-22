import React from 'react';
import {PRODUCT_MENU_TYPE} from '../constants/order.constant';
import orderAction from '../redux/actions/order.action';

export function getPrice(itemId, sizeId, isCatering = false) {
  let {store} = React;
  let {subCategories, subCategories1} = store.getState().user;
  let data = isCatering ? subCategories1[itemId] : subCategories[itemId];
  if (!data) {
    return {};
  }
  if (data.out_of_stock == '1') return {};
  let price = data.item_price || 0;
  let cutPrice = '';
  let discount = data.discount;
  let sizeData = null;
  sizeId = sizeId || data.set_default_price;

  if (data.menu_item_variations && data.menu_item_variations.length) {
    let defaultp = data.menu_item_variations.find(m => m.id == sizeId);
    if (defaultp) {
      price = defaultp.pivot.price;
      sizeData = defaultp;
    }
  }
  if (discount) {
    cutPrice = price;
    price = price - price * (discount / 100);
  }
  return {price, cutPrice, sizeId, sizeData};
}

export async function addToCart(itemid, sizeId, price, addons = []) {
  // let { selectedAddress } = store.getState().theme;
  // if (!selectedAddress) {
  //   store.dispatch(themeAction.setProperty({ addressSelectorModal: true }));

  //   return;
  // }
  let {store} = React;

  let added = store.dispatch(
    orderAction.addToCart(itemid, sizeId, price, addons),
  );
  // store.dispatch(orderAction.setProperty({ page: ORDER_SUMMARRY.cart.id }));
  // if (!added) {
  //   showSnackbar("Already in cart", "f");
  // }
  return added;
}

export function getCartItemID(
  itemid,
  sizeId,
  add_ons = [],
  type = PRODUCT_MENU_TYPE.restuarant.id,
) {
  let idPart = [itemid];
  idPart.push(sizeId ?? '');

  idPart.push(add_ons.map(r => r.id).join(','));
  // console.log("[add_ons]", add_ons);
  idPart.push(type);

  let id = idPart.join('-');
  return id;
}
export function getAddonsTotal(data) {
  let total = data.reduce((r, d) => {
    let price = d.product_price;
    return r + parseFloat(price);
  }, 0);

  return total;
}

export function getTipAmount(total = 0) {
  let tip_amount = 0;
  // let state = store.getState();
  // let { selectedTip, tipData, otherTip } = state.order;
  // if (selectedTip) {
  //   if (selectedTip == "other") {
  //     tip_amount = parseFloat(otherTip);
  //   } else {
  //     let td = tipData[selectedTip - 1];
  //     tip_amount = (total * td.per) / 100;
  //   }
  // }

  return tip_amount;
}

export function getGrandTotal() {
  let {store} = React;
  let state = store.getState();
  let {cart} = state.order;
  let Ids = Object.keys(cart);

  let total = Ids.reduce((r, id) => {
    let [itemId, sizeId, add_on, productMenuType] = id.split('-');
    let {price} = getPrice(
      itemId,
      sizeId,
      productMenuType == PRODUCT_MENU_TYPE.catering.id,
    );
    let add_ons = cart[id].add_ons || [];
    let add_onsTotal = getAddonsTotal(add_ons);

    // console.log(
    //   "[log",
    //   price,
    //   add_onsTotal,
    //   cart[id].qty * (add_onsTotal + parseFloat(price))
    // );
    let pTotal = cart[id].qty * (add_onsTotal + parseFloat(price));
    if (isNaN(pTotal)) {
      return r;
    }
    return r + pTotal;
  }, 0);

  return total;
}
