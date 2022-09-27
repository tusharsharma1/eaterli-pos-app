import {callApi} from '../helpers/api.helper';
// import moment from 'moment';

export default {
  login(data) {
    return callApi('POST', '/api/staff/login', data, {
      applyToken: false,
    });
  },
};

//--->  https://maps.googleapis.com/maps/api/distancematrix/json?departure_time=now&destinations=place_id:ChIJVXLyCt0GoDkRDcqCTX7FDWs&origins=place_id:ChIJeYSWxSIHoDkR3sGoRXQaQBc&key=AIzaSyCL6zp79W047VPyb-sReTtHsklzYP767ac
