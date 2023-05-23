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

  getMenus(location_id) {
    return callApi('GET', `/api/restaurants/locations/${location_id}`);
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
  getOrders(restaurant_location_id) {
    let d = getQueryString({restaurant_location_id});
    return callApi('GET', `/api/pos-order/list?${d}`);
  },
  updateSubCategory(data, id, config) {
    return callApi(config.method, `/api/menu-items/${id}`, data, {
      isformData: config.isformData,
    });
  },
};

//--->  https://maps.googleapis.com/maps/api/distancematrix/json?departure_time=now&destinations=place_id:ChIJVXLyCt0GoDkRDcqCTX7FDWs&origins=place_id:ChIJeYSWxSIHoDkR3sGoRXQaQBc&key=AIzaSyCL6zp79W047VPyb-sReTtHsklzYP767ac
