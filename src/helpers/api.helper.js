import AppConfig from 'react-native-config';
import store from '../redux/store';
const css = {color: 'yellow', background: 'red'};
function getStyle(conf = css) {
  let c = {...css, ...conf};
  return [
    `color: ${c.color}`,
    `background: ${c.background}`,
    'font-size: 14px',
    'font-weight: bold',
    'border: 2px solid #000',
    // "text-shadow: 2px 2px black",

    'padding: 2px',
  ].join(';');
}

export function colorLog(data = [], style = ['color:red']) {
  let g = data.map(d => {
    return `%c ${d}`;
  });

  console.log(g.join(' '), ...style);
}
export function getFormData(data) {
  let formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }
  return formData;
}
export async function postData(
  method,
  url = '',
  data = {},
  token = null,
  abortSignal = null,
) {
  let authHeader = {};
  if (token) {
    authHeader = {Authorizationtoken: token};
  }

  let headers = {...authHeader};

  if (!(data instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  } else {
  }

  let body =
    method === 'GET'
      ? {}
      : {body: data instanceof FormData ? data : JSON.stringify(data)};

  // console.log('<-----------♦♦♦-Api Details-♦♦♦------------->');
  // console.log('Api method--> ', method);
  // console.log('Api url--> ', url);
  // console.log('Api headers--> ', url, '=>', headers);
  // console.log('Api Body--> ', url, '=>', body);

  colorLog(['<---♦♦♦-Api Details-♦♦♦---> ' + url], [getStyle()]);
  colorLog(['Api method--> ', method], [getStyle(), getStyle()]);
  colorLog(
    ['Api url--> ', url],
    [getStyle({background: '#333'}), getStyle({background: 'blue'})],
  );
  colorLog(['Api headers--> '], [getStyle()]);
  console.log(headers);
  colorLog(['Api Body--> '], [getStyle({background: 'blue'})]);
  console.log(data);

  const response = await fetch(url, {
    method, // *GET, POST, PUT, DELETE, etc.
    // mode: 'cors', // no-cors, *cors, same-origin
    // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: 'include', // include, *same-origin, omit
    signal: abortSignal,
    headers: {
      ...headers,

      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    // redirect: 'follow', // manual, *follow, error
    // referrerPolicy: 'no-referrer', // no-referrer, *client
    ...body, // body data type must match "Content-Type" header
  });
  // let text = await response.text();
  // console.log('Api response text--> ',text);
  let json = await response.text();
  //  let json = await response.text()
  return {response, json};
}

export function callApi(
  method,
  url = '',
  data = {},
  config = {isformData: true, applyToken: true, abortSignal: null},
) {
  let {isformData = true, applyToken = true, abortSignal = null} = config;

  let promise = new Promise((resolve, reject) => {
    url =
      url.split('~').length == 2
        ? url.split('~')[1]
        : `${AppConfig.API_BASE_URL}${url}`;
    if (isformData) {
      data = getFormData(data);
    }

    postData(
      method,
      url,
      data,
      applyToken ? getTokenHeader() : null,
      abortSignal,
    )
      .then(res => {
        let {response, json} = res;

        // console.log('Api response--> ', response);
        // console.log('Api response data--> ', url, '=>', json);

        colorLog(['Api response-->'], [getStyle()]);
        console.log(response);
        colorLog(
          [`Api response data--> ${url}`],
          [getStyle({background: 'green'})],
        );

        console.log(json);

        json = JSON.parse(json);
        json.statusCode = json.status;
        json.status =
          json.status === 'OK' ||
          json.status === 'true' ||
          json.status === true ||
          json.success === 'true' ||
          json.success === true
            ? true
            : false;
        colorLog(
          [`Api response data Object--> ${url}`],
          [getStyle({background: 'green'})],
        );

        console.log(json, url);
        // console.log('Api response data Object--> ', url, '=>', json);
        colorLog(['<--♦♦♦♦♦♦♦-END-♦♦♦♦♦♦♦--> ' + response.url], [getStyle()]);
        // console.log('<------------♦♦♦♦♦♦♦-END-♦♦♦♦♦♦♦-------------->', url);
        if (json.error) {
          if (json.error.code == 401) {
            resolve({tokenInvalid: true});
          } else {
            reject(new Error(json.error.message));
          }
          return;
        }

        if (json && !json.status && json.message == 'Invalid token.') {
          //apiMessageHandler(res.message);
          //returnResult = false;
          resolve({...json, tokenInvalid: true});
          return;
        }

        setTimeout(() => {
          resolve(json);
        }, 10);
      })
      .catch(err => {
        reject(err);
      });
  });
  return promise;
}

export function getTokenHeader() {
  let appState = store.getState();
  if (appState.user && appState.user.userData && appState.user.userData.token) {
    return `${appState.user.userData.token}`;
  }
  return '';
}
