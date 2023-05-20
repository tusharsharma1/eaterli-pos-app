import React from 'react';
import {PRODUCT_MENU_TYPE} from '../constants/order.constant';
import orderAction from '../redux/actions/order.action';
import {simpleToast} from './app.helpers';

export function getPrice(itemId, sizeIds = {}) {
  let {store} = React;
  let {menuItems} = store.getState().user;
  let data = menuItems[itemId];
  if (!data) {
    return {};
  }
  if (data.out_of_stock == '1') return {};
  let price = data.item_price || 0;
  let cutPrice = '';
  let discount = data.discount;
  let sizeData = [];

  let variants = getVariants(data);

  if (variants.length) {
    // price=0;
    sizeIds = Object.keys(sizeIds).length
      ? sizeIds
      : variants.reduce((r, d) => {
          if (d.default_id) {
            return {...r, [d.title_id]: [d.default_id]};
          }
          return r;
        }, {});

    price = Object.keys(sizeIds).reduce((r, id) => {
      let sizeId_list = sizeIds[id] || [];
      let variation = variants.find(v => v.title_id == id);
      if (!variation) {
        return r;
      }
      let itemsprice = sizeId_list.reduce((d, sizeId) => {
        let defualtItem = variation.items.find(a => a.id == sizeId);
        if (defualtItem) {
          sizeData.push({pid: id, ...defualtItem});
          let p = parseFloat(defualtItem.price) || 0;
          return d + p;
        }
        return d;
      }, 0);
      // let defualtItem = variation.items.find((a) => a.id == sizeId_list);
      // // console.log("[variants]", data.id, d.items);
      // if (defualtItem) {
      //   sizeData.push({ pid: id, ...defualtItem });
      //   let p = parseFloat(defualtItem.price) || 0;
      //   return r + p;
      // }

      return r + itemsprice;
    }, 0);
  }

  if (!price) {
    price = data.item_price || 0;
  }
  if (discount) {
    cutPrice = price;
    price = price - price * (discount / 100);
  }
  // console.log("[variants]", sizeIds, sizeData);
  return {price, cutPrice, sizeIds, sizeData};
}

export function addToCart(
  itemid,
  sizeId,
  price,
  addons = [],
  special_ins = '',
) {
  let {store} = React;
  // let { selectedAddress } = store.getState().theme;
  // if (!selectedAddress) {
  //   store.dispatch(
  //     themeAction.setProperty({ addressSelectorModal: true, isPickup: true })
  //   );

  //   return;
  // }
  let added = store.dispatch(
    orderAction.addToCart(itemid, sizeId, price, addons, special_ins),
  );
  // store.dispatch(orderAction.setProperty({ page: ORDER_SUMMARRY.cart.id }));
  if (!added) {
    simpleToast('Already in cart');
  }
  return added;
}

export function getCartItemID(
  itemid,
  sizeId,
  add_ons = [],
  type = PRODUCT_MENU_TYPE.restuarant.id,
) {
  let idPart = [itemid];
  idPart.push(JSON.stringify(sizeId) ?? '');

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
      JSON.parse(sizeId),
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
export function getCartProducts() {
  let state = React.store.getState();

  let {menuItems} = state.user;
  let {cart} = state.order;

  let products = Object.keys(cart)
    .map((id, i) => {
      let cartItem = cart[id];

      let [itemId, sizeId, addon, productMenuType] = id.split('-');
      let itemData = menuItems[itemId];

      if (!itemData) {
        return false;
      }

      if (itemData.out_of_stock == '1') return false;

      let {price, sizeData} = getPrice(
        itemId,
        JSON.parse(sizeId),
        productMenuType == PRODUCT_MENU_TYPE.catering.id,
      );

      let add_onsTotal = getAddonsTotal(cartItem.add_ons);
      let rate = add_onsTotal + price;
      let totalPrice = rate * cartItem.qty;
      // console.log(id,cartItem,itemData,price,sizeData)

      return {
        id: itemData.id,
        qty: cartItem.qty,
        price,
        rate,
        totalPrice,
        name: `${itemData.item_name}`,
        image: itemData.item_image,
        // vid: sizeData ? sizeData.id : "",
        variants: sizeData,
        add_ons: cartItem.add_ons,
        special_ins: cartItem.special_ins,
      };
      //return {...r,[i+1]:{id:itemData.id,qty:cartItem.qty,price,name:`${itemData.item_name}${sizeData?` - ${sizeData.variation_option_name}`:''}`}}
    }, {})
    .filter(Boolean);

  return products;
}
export function getVariants(data) {
  let variants = [];
  try {
    variants = JSON.parse(data.variants) || [];
  } catch {}
  return variants;
}
export function getAddons(data) {
  let addons = [];

  try {
    if (data.add_ons) {
      addons = JSON.parse(data.add_ons);
    }
  } catch {}
  return addons;
}
export function getCartItem() {
  let {store} = React;
  let {menuItems} = store.getState().user;
  let {cart} = store.getState().order;
  let Ids = Object.keys(cart)
    .map((id, i) => {
      let [itemId, sizeId, addon, productMenuType] = id.split('-');

      let itemData = menuItems[itemId];

      if (!itemData) {
        return false;
      }
      if (itemData.out_of_stock == '1') return false;
      return id;
    })
    .filter(Boolean);

  return Ids;
}

export function getAllCategories(categoriesSortable) {
  let {store} = React;
  let {menuTitles, categories, menuItems} = store.getState().user;

  let titlesIds = Object.keys(categoriesSortable);
  // console.log("[_items]", titlesIds);
  let itemsList = titlesIds.reduce((data, titleId) => {
    let titleData = menuTitles.find(d => d.id == titleId);

    let catIds = categoriesSortable[titleId];

    let mitems = catIds.reduce((r, cid) => {
      let cdata = categories[cid];
      let itemsIds = cdata.menu_items;
      let _items = itemsIds.reduce((d, id) => {
        let itemData = {
          ...menuItems[id],
          category: cdata,
          menuTitle: titleData,
        };
        return [...d, itemData];
      }, []);

      let itemData = {
        ...cdata,
        totalProducts: _items.length,
        menuTitle: titleData,
      };
      return [...r, itemData];
    }, []);

    return [...data, ...mitems];
  }, []);

  return itemsList;
}

export function mergeCategorySortable(categoriesSortable) {
  return Array.from(new Set([].concat(...Object.values(categoriesSortable))));
}
