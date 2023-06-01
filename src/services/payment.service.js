import {callApi} from '../helpers/api.helper';
import {
  api_url,
  api_url_p,
  request_headers,
  request_headers_p,
} from '../helpers/payment.helper';

export default {
  getPublicIP() {
    return callApi('GET', `~https://geolocation-db.com/json/`);
  },
  createMerchantIdentity(data) {
    return callApi('POST', `~${api_url}/identities`, data, {
      headers: request_headers,
      isformData: false,
    });
  },
  updateMerchantIdentity(data, identity_id) {
    return callApi('PUT', `~${api_url}/identities/${identity_id}`, data, {
      headers: request_headers,
      isformData: false,
    });
  },

  createAssociatedIdentities(data, identity_id) {
    return callApi(
      'POST',
      `~${api_url}/identities/${identity_id}/associated_identities`,
      data,
      {
        headers: request_headers,
        isformData: false,
      },
    );
  },

  addBankAccount(data) {
    return callApi('POST', `~${api_url}/payment_instruments`, data, {
      headers: request_headers,
      isformData: false,
    });
  },

  verifyMerchantUser(data, identity_id) {
    return callApi(
      'POST',
      `~${api_url}/identities/${identity_id}/merchants`,
      data,
      {
        headers: request_headers,
        isformData: false,
      },
    );
  },

  reverifyMerchantUser(data, merchant_id) {
    return callApi(
      'POST',
      `~${api_url}/merchants/${merchant_id}/verifications`,
      data,
      {
        headers: request_headers,
        isformData: false,
      },
    );
  },

  verificationDetail(verification_id) {
    return callApi(
      'GET',
      `~${api_url}/verifications/${verification_id}`,
      {},
      {
        headers: request_headers,
        isformData: false,
      },
    );
  },
  merchantDetail(_id) {
    return callApi(
      'GET',
      `~${api_url}/merchants/${_id}`,
      {},
      {
        headers: request_headers,
        isformData: false,
      },
    );
  },

  createMerchantDevice(data, merchant_id, live) {
    return callApi(
      'POST',
      `~${live ? api_url_p : api_url}/merchants/${merchant_id}/devices`,
      data,
      {
        headers: live ? request_headers_p : request_headers,
        isformData: false,
      },
    );
  },

  activateDevice(data, device_id, live) {
    return callApi(
      'PUT',
      `~${live ? api_url_p : api_url}/devices/${device_id}`,
      data,
      {
        headers: live ? request_headers_p : request_headers,
        isformData: false,
      },
    );
  },
  getDevice(device_id) {
    return callApi('GET', `~${api_url}/devices/${device_id}`, null, {
      headers: request_headers,
      isformData: false,
    });
  },
  transferAmountByDevice(data, live) {
    return callApi('POST', `~${live ? api_url_p : api_url}/transfers`, data, {
      headers: live ? request_headers_p : request_headers,
      isformData: false,
    });
  },
};
