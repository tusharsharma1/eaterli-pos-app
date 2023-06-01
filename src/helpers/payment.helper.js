import store from "../redux/store";

function createNoOptions(from, to, reverse = false) {
  let total = to - from + 1;
  let options = Array.from(Array(total), (r, i) => {
    let no = i + from;
    return { label: `${no}`, value: `${no.toString().padStart(2, 0)}` };
  });
  if (reverse) {
    options.reverse();
  }
  return options;
}

/////eaterli  API Credentials
export const username = "USss1r5jqUXgpndmp5vyEuBK";
export const password = "5433ee5f-2c8b-4289-b5aa-0e2394144703";
export const applicationID='APjoXDYncUMQa5eTmrrdAzDQ'
export const productionKey='sandbox'
/////eaterli Live  API Credentials
// export const username = "USeiGYCuK7HRrCCoYzBRmS8i";
// export const password = "924a8d06-a500-454a-a097-b359dadd9c90";
// export const applicationID = "APkiDc9WHAXdzH8eU5G8qV7T";
// export const productionKey = "live";

// curl https://finix.live-payments-api.com/merchant_profiles/MUidg4GCdWhG6WcrpRFrnpr1 \
//   -H "Content-Type: application/vnd.json+api" \
//   -u USeiGYCuK7HRrCCoYzBRmS8i:924a8d06-a500-454a-a097-b359dadd9c90
// "identity_id": "ID3LUtoaMcSe2gzAtgnaVF5r",
//     "merchant_information": "MUidg4GCdWhG6WcrpRFrnpr1",
//     "payment_information": "PIm3B8KQzEePvTdym4CjNKJ6",
//     "verification": "VIfpVzzU2J5akaDeEeCQfds3",
//     "onboarding_state": "REJECTED",


const Buffer = require("buffer").Buffer;

export const api_url = `https://finix.${productionKey}-payments-api.com`;
export const paymentAuthorization = "Basic " +new Buffer(username + ":" + password).toString("base64")// btoa(username + ":" + password);
export const request_headers = {
  Authorization: paymentAuthorization,
  "Content-Type": "application/json",
};



export const username_p = "USeiGYCuK7HRrCCoYzBRmS8i";
export const password_p = "924a8d06-a500-454a-a097-b359dadd9c90";
export const applicationID_p = "APkiDc9WHAXdzH8eU5G8qV7T";
export const productionKey_p = "live";
export const api_url_p = `https://finix.${productionKey_p}-payments-api.com`;
export const paymentAuthorization_p = "Basic " + new Buffer(username_p + ":" + password_p).toString("base64")//btoa(username_p + ":" + password_p);
export const request_headers_p = {
  Authorization: paymentAuthorization_p,
  "Content-Type": "application/json",
};

export function isSubmmitted() {
  let { submitted_ids } = store.getState().payment;

  return (
    submitted_ids.identity_id &&
    submitted_ids.merchant_information &&
    submitted_ids.payment_information &&
    submitted_ids.verification
  );
}

export const PAYMENT_FORMS = {
  businessProfile: {
    id: 1,
    title: "Business Profile",
    heading: "Business Profile",
  },
  businessInformation: {
    id: 2,
    title: "Business Information",
    heading: "Business Information",
  },
  addPrincipals: { id: 3, title: "Add Principals", heading: "Add Principals" },
  additionalUnderwritingData: {
    id: 4,
    title: "Additional Underwriting Data",
    heading: "Additional Underwriting Data",
  },
  bankAccount: { id: 5, title: "Bank Account", heading: "Bank Account" },
  termsConditions: {
    id: 6,
    title: "Terms & Conditions",
    heading: "Terms & Conditions",
  },
};

export const STATE_OPTIONS = [
  {
    label: "",
    value: "",
  },
  {
    label: "Alabama",
    value: "AL",
  },
  {
    label: "Alaska",
    value: "AK",
  },
  {
    label: "Arizona",
    value: "AZ",
  },
  {
    label: "Arkansas",
    value: "AR",
  },
  {
    label: "California",
    value: "CA",
  },
  {
    label: "Colorado",
    value: "CO",
  },
  {
    label: "Connecticut",
    value: "CT",
  },
  {
    label: "Delaware",
    value: "DE",
  },
  {
    label: "District Of Columbia",
    value: "DC",
  },
  {
    label: "Florida",
    value: "FL",
  },
  {
    label: "Georgia",
    value: "GA",
  },
  {
    label: "Hawaii",
    value: "HI",
  },
  {
    label: "Idaho",
    value: "ID",
  },
  {
    label: "Illinois",
    value: "IL",
  },
  {
    label: "Indiana",
    value: "IN",
  },
  {
    label: "Iowa",
    value: "IA",
  },
  {
    label: "Kansas",
    value: "KS",
  },
  {
    label: "Kentucky",
    value: "KY",
  },
  {
    label: "Louisiana",
    value: "LA",
  },
  {
    label: "Maine",
    value: "ME",
  },
  {
    label: "Maryland",
    value: "MD",
  },
  {
    label: "Massachusetts",
    value: "MA",
  },
  {
    label: "Michigan",
    value: "MI",
  },
  {
    label: "Minnesota",
    value: "MN",
  },
  {
    label: "Mississippi",
    value: "MS",
  },
  {
    label: "Missouri",
    value: "MO",
  },
  {
    label: "Montana",
    value: "MT",
  },
  {
    label: "Nebraska",
    value: "NE",
  },
  {
    label: "Nevada",
    value: "NV",
  },
  {
    label: "New Hampshire",
    value: "NH",
  },
  {
    label: "New Jersey",
    value: "NJ",
  },
  {
    label: "New Mexico",
    value: "NM",
  },
  {
    label: "New York",
    value: "NY",
  },
  {
    label: "North Carolina",
    value: "NC",
  },
  {
    label: "North Dakota",
    value: "ND",
  },
  {
    label: "Ohio",
    value: "OH",
  },
  {
    label: "Oklahoma",
    value: "OK",
  },
  {
    label: "Oregon",
    value: "OR",
  },
  {
    label: "Pennsylvania",
    value: "PA",
  },
  {
    label: "Rhode Island",
    value: "RI",
  },
  {
    label: "South Carolina",
    value: "SC",
  },
  {
    label: "South Dakota",
    value: "SD",
  },
  {
    label: "Tennessee",
    value: "TN",
  },
  {
    label: "Texas",
    value: "TX",
  },
  {
    label: "Utah",
    value: "UT",
  },
  {
    label: "Vermont",
    value: "VT",
  },
  {
    label: "Virginia",
    value: "VA",
  },
  {
    label: "Washington",
    value: "WA",
  },
  {
    label: "West Virginia",
    value: "WV",
  },
  {
    label: "Wisconsin",
    value: "WI",
  },
  {
    label: "Wyoming",
    value: "WY",
  },
];

export const BUSINESS_TYPE_OPTIONS = [
  {
    label: "",
    value: "",
  },
  {
    label: "Individual Sole Proprietorship",
    value: "INDIVIDUAL_SOLE_PROPRIETORSHIP",
  },
  {
    label: "Corporation",
    value: "CORPORATION",
  },
  {
    label: "Limited Liability Company",
    value: "LIMITED_LIABILITY_COMPANY",
  },
  {
    label: "Partnership",
    value: "PARTNERSHIP",
  },
  {
    label: "Association Estate Trust",
    value: "ASSOCIATION_ESTATE_TRUST",
  },
  {
    label: "Tax Exempt Organization",
    value: "TAX_EXEMPT_ORGANIZATION",
  },
  {
    label: "International Organization",
    value: "INTERNATIONAL_ORGANIZATION",
  },
  {
    label: "Government Agency",
    value: "GOVERNMENT_AGENCY",
  },
];

export const OWNERSHIP_TYPE_OPTIONS = [
  {
    label: "",
    value: "",
  },
  {
    label: "Public",
    value: "PUBLIC",
  },
  {
    label: "Private",
    value: "PRIVATE",
  },
];

export const MONTH_OPTIONS = [
  {
    label: "",
    value: "",
  },
  {
    label: "January",
    value: "1",
  },
  {
    label: "February",
    value: "2",
  },
  {
    label: "March",
    value: "3",
  },
  {
    label: "April",
    value: "4",
  },
  {
    label: "May",
    value: "5",
  },
  {
    label: "June",
    value: "6",
  },
  {
    label: "July",
    value: "7",
  },
  {
    label: "August",
    value: "8",
  },
  {
    label: "September",
    value: "9",
  },
  {
    label: "October",
    value: "10",
  },
  {
    label: "November",
    value: "11",
  },
  {
    label: "December",
    value: "12",
  },
];
export const DAY_OPTIONS = [
  {
    label: "",
    value: "",
  },
  ...createNoOptions(1, 31),
];

export const YEAR_OPTIONS = [
  {
    label: "",
    value: "",
  },
  ...createNoOptions(1900, new Date().getFullYear(), true),
];

export const REFUND_POLICY_OPTIONS = [
  {
    label: "",
    value: "",
  },
  {
    label: "No Refunds",
    value: "NO_REFUNDS",
  },
  {
    label: "Merchandise Exchange Only",
    value: "MERCHANDISE_EXCHANGE_ONLY",
  },
  {
    label: "Within 30 Days",
    value: "WITHIN_30_DAYS",
  },
  {
    label: "Other",
    value: "OTHER",
  },
];

export const POS_VENDOR = [
  {
    label: "Square Up",
    value: "1",
  },
  {
    label: "Clover",
    value: "2",
  },
];
