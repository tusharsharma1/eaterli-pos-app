import {callApi} from '../helpers/api.helper';
// import moment from 'moment';
function getQueryString(data) {
  let q = Object.keys(data)
    .map(k => {
      return `${k}=${data[k]}`;
    })
    .join('&');
  return q;
}
export default {
  login(data) {
    return callApi('POST', '/api/staff/login', data, {
      applyToken: false,
    });
  },
  loginWithPin(data) {
    return callApi('POST', '/api/passcode/login', data, {
      applyToken: false,
    });
  },

  getMenus(location_id, rest_id) {
    return callApi(
      'GET',
      `/api/restaurants/locations/${location_id}?restaurant_id=${rest_id}`,
    );
  },
  getMobileBuilder(restaurant_id) {
    return callApi('GET', `/api/mobile/config/get/${restaurant_id}`);
  },
  getAddons(location_id, category_id) {
    return callApi(
      'GET',
      `/api/products/addons?location_id=${location_id}${
        category_id ? `&category_id=${category_id}` : ''
      }`,
    );
  },
  getBusinessData(restaurant_id) {
    return callApi('GET', `/api/restaurants/${restaurant_id}`);
  },
  getVariations(restaurant_id) {
    return callApi('GET', `/api/restaurants/variations/${restaurant_id}`);
  },
  getMenuTitle(restaurant_id) {
    return callApi('GET', `/api/list/menu/title/${restaurant_id}`);
  },
  createOrder(data) {
    return callApi('POST', `/api/pos-order/create`, data, {
      isformData: false,
    });
  },
  getOrders(rest_id, restaurant_location_id, data = {}) {
    let d = getQueryString(data);
    return callApi(
      'GET',
      `/api/pos-order/list/${rest_id}/${restaurant_location_id}?${d}`,
    );
  },
  updateSubCategory(data, id, config) {
    return callApi(config.method, `/api/menu-items/${id}`, data, {
      isformData: config.isformData,
    });
  },

  getCustomerDetail(restaurant_id, id) {
    return callApi('GET', `/api/get-customer-details/${restaurant_id}/${id}`);
  },

  getCustomerDetailPhoneNo(restaurant_id, phone_no) {
    return callApi(
      'GET',
      `/api/get-user-details/${restaurant_id}/phone?phone=${phone_no}`,
    );
  },

  getRewardBag(restaurant_id, id) {
    return callApi('GET', `/api/redeem-bag/${id}/${restaurant_id}`);
  },
  getRewards(res_id) {
    return callApi('GET', `/api/rewards/${res_id}`);
  },

  createRewardBagOrder(data) {
    return callApi('POST', `/api/reward-bag/create/order`, data, {
      isformData: false,
    });
  },

  createGiftCard(data) {
    return callApi('POST', `/api/restaurant/7/customer/egift-cards`, data, {
      isformData: false,
    });
  },

  getGiftCardBalance(res_id, card_id) {
    return callApi(
      'GET',
      `/api/restaurant/${res_id}/egift-cards/${card_id}/balance`,
    );
  },

  getOfferDetail(res_id, offer_id) {
    return callApi(
      'GET',
      `/api/restaurant/${res_id}/offers/${offer_id}`,
    );
  },
};

//--->  https://maps.googleapis.com/maps/api/distancematrix/json?departure_time=now&destinations=place_id:ChIJVXLyCt0GoDkRDcqCTX7FDWs&origins=place_id:ChIJeYSWxSIHoDkR3sGoRXQaQBc&key=AIzaSyCL6zp79W047VPyb-sReTtHsklzYP767ac
