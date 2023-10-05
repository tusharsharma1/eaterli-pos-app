import React from 'react';
import POSModule from './pos.helper';
import appAction from '../redux/actions/app.action';
import {ensureTextLength, simpleToast} from './app.helpers';
import RNPrint from 'react-native-print';
import moment from 'moment';
import {getAddons, getVariants} from './order.helper';
import {PAYMENT_METHOD} from '../constants/order.constant';

export function getUSBGPrinters() {
  return new Promise(res => {
    POSModule.getUSBGPrinters({}, result => {
      res(result?.devices || []);
    });
  });
}

export function connectUSBPrinters(pname) {
  return new Promise(res => {
    POSModule.getConnectUSBGPrinter({pname}, result => {
      if (result.error) {
        simpleToast(result.error);
        res(false);
      } else {
        simpleToast(`${pname} Connected`);
        React.store.dispatch(
          appAction.set({
            selectedPrinter: pname,
          }),
        );
        res(true);
      }
     
    });
  });
}

export function doPrintUSBPrinter(printData) {
  return new Promise(res => {
    POSModule.printUSBGPrinter(printData, result => {
      if (result.error) {
        simpleToast(result.error);
      }
      res(true);
    });
  });
}

export async function loadPrinters(autoSelect = true) {
  let printers = await getUSBGPrinters();
  React.store.dispatch(
    appAction.set({
      printers,
    }),
  );
  if (autoSelect) {
    if (printers.length) {
      await connectUSBPrinters(printers[0]);
    } else {
      simpleToast('No Printer Device Connected.');
    }
  }
}
export function selectPrinters() {
  React.store.dispatch(
    appAction.set({
      printerModal: true,
    }),
  );
}

export async function checkPrinterConnection() {
  let {selectedPrinter} = React.store.getState().app;
  if (!selectedPrinter) {
    await loadPrinters(false);
    selectPrinters();
  }
  return !!selectedPrinter
}

export async function doWebViewPrint(printData = []) {
  let fscal = 12;
  let fonts = {
    35: 'var(--sh)',
    25: 'var(--wh)',
    20: 'var(--wp)',
    1: `${fscal}px`,
    2: `${fscal * 2}px`,
    3: `${fscal * 3}px`,
  };
  let htmlData = printData
    .map(p => {
      console.log(p.text);
      return `<p class="para" style="color:black;text-align:${
        p.align
      };font-weight:${p.style};font-size:${fonts[p.charSize]}">${p.text}</p>`;
    })
    .join('');

  htmlData = `
    <!DOCTYPE html>
   <html>
    <head>
      <title>Page Title</title>
  
      <style>
      :root {
        --sh:20px;
        --wp: 12px;
        --wh: 16px;
    }
        @page {
          margin: 0;
        }
  
        body{
          margin: 0;
          padding: 0;
      }
            .para {
               white-space: pre-wrap;
               font-family: monospace;
               margin: 0;
               padding: 0;
            }
            .page{
              width: 77mm;
              background-color:#fff;
              margin:auto
            }
      </style>
    </head>
    <body>
    <div class="page">
      ${htmlData}
      </div>
    </body>
  </html>
  `;
  // console.log('print printData', printData, htmlData);

  let r = await RNPrint.print({
    html: `
    
    ${htmlData}`,
  }).catch(e => {
    console.log('print error', e);
  });
  console.log('print result', r);
}

export function createOrderReceiptPrintData(data) {
  let {pageWidthLength, pageLeftMarginLength} = React.store.getState().app;

  let AmountWidthLength = 8;
  let fontSize = 20;
  let headingFontSize = 25;

  let charSize = 1;
  let headingCharSize = 1;
  let pAlign = 'center';
  let leftPaddingText = ensureTextLength(``, pageLeftMarginLength, false, '=');

  let setMargin = _text => {
    return `${leftPaddingText}${_text}`;
  };

  let newLineData = {
    charSize,
    size: fontSize,
    align: 'left',
    style: 'normal',
    text: ` `,
  };
  let printData = [
    {
      charSize: 2,
      size: 35,
      align: 'center',
      style: 'bold',
      text: 'Fish N Fry',
    },
    newLineData,
    {
      charSize,
      size: fontSize,
      align: pAlign,
      style: 'normal',
      text: setMargin(
        `${ensureTextLength(`Order No.:`, 14, true)}${ensureTextLength(
          `#${data.id}`,
          pageWidthLength - 14,
          false,
        )}`,
      ),
    },
    {
      charSize,
      size: fontSize,
      align: pAlign,
      style: 'normal',
      text: `${ensureTextLength(`Order Date:`, 14, true)}${ensureTextLength(
        moment(data.created_at).format('DD MMM, YYYY hh:mm A'),
        pageWidthLength - 14,
        false,
      )}`,
    },
    {
      charSize,
      size: fontSize,
      align: pAlign,
      style: 'normal',
      text: `${ensureTextLength(`Payment Method:`, 16, true)}${ensureTextLength(
        data.payment_method || '',
        pageWidthLength - 16,
        false,
      )}`,
    },
  ];
  // printData.push(newLineData);

  // printData.push({
  //   charSize: headingCharSize,
  //   size: headingFontSize,
  //   align: pAlign,
  //   style: 'bold',
  //   text: `Payment Details`,
  // });

  // printData.push({
  //   charSize,
  //   size: fontSize,
  //   align: pAlign,
  //   style: 'normal',
  //   text: `${ensureTextLength(`Payment ID:`, 14, true)}${ensureTextLength(
  //     'PAY_2332hhj34x',
  //     pageWidthLength - 14,
  //     false,
  //   )}`,
  // });

  // printData.push({
  //   charSize,
  //   size: fontSize,
  //   align: pAlign,
  //   style: 'normal',
  //   text: `${ensureTextLength(`Card No.:`, 14, true)}${ensureTextLength(
  //     '**** **** **** 4141',
  //     pageWidthLength - 14,
  //     false,
  //   )}`,
  // });

  if (data.point_transactions && !!data.point_transactions.length) {
    printData.push(newLineData);
    printData.push({
      charSize: headingCharSize,
      size: headingFontSize,
      align: pAlign,
      style: 'bold',
      text: `${ensureTextLength(`Reward Points`, pageWidthLength, true)}`,
    });
    data.point_transactions.forEach(d => {
      printData.push({
        charSize,
        size: fontSize,
        align: pAlign,
        style: 'normal',
        text: `${ensureTextLength(`Description:`, 14, true)}${ensureTextLength(
          d.description,
          pageWidthLength - 14,
          false,
        )}`,
      });
      printData.push({
        charSize,
        size: fontSize,
        align: pAlign,
        style: 'normal',
        text: `${ensureTextLength(`Point:`, 15, true)}${ensureTextLength(
          d.point,
          pageWidthLength - 15,
          false,
        )}`,
      });
    });
  }
  /////Products//////
  printData.push(newLineData);
  // printData.push({
  //   charSize: headingCharSize,
  //   size: headingFontSize,
  //   align: pAlign,
  //   style: 'bold',
  //   text: `Products`,
  // });
  printData.push({
    charSize,
    size: fontSize,
    align: pAlign,
    style: 'bold',
    text: `${ensureTextLength('', pageWidthLength, true, '-')}`,
  });

  printData.push({
    charSize,
    size: fontSize,
    align: pAlign,
    style: 'bold',
    text: `${ensureTextLength(
      'Product',
      pageWidthLength - AmountWidthLength - 4 - AmountWidthLength,
      true,
    )}${ensureTextLength('Qty.', 4, false)}${ensureTextLength(
      'Rate',
      AmountWidthLength,
      false,
    )}${ensureTextLength('Total', AmountWidthLength, false)}`,
  });
  printData.push({
    charSize,
    size: fontSize,
    align: pAlign,
    style: 'bold',
    text: `${ensureTextLength('', pageWidthLength, true, '-')}`,
  });
  data.order_items.forEach(d => {
    let variants = getVariants(d);
    let add_ons = getAddons(d);
    let discount_type = d.discount_type ?? '1';

    let _discount = parseFloat(d.discount ?? 0);
    let totalPrice = d.total_price;
    if (_discount) {
      if (discount_type == '1') {
        totalPrice = totalPrice - totalPrice * (_discount / 100);
      } else if (discount_type == '2') {
        totalPrice = totalPrice - _discount;
      }
    }
    let item_name = `${d.item_name}`;
    // ${
    //   variants.length
    //     ? variants.map(r => r.title).join(', ')
    //     : ''
    // }${
    //   add_ons.length
    //     ? add_ons.map(r => r.product_name).join(', ')
    //     : ''
    // }`;
    //  - (${d.quantity} @ ${parseFloat(d.rate || '0').toFixed(
    //   2,
    // )})`;
    printData.push({
      charSize,
      size: fontSize,
      align: pAlign,
      style: 'normal',
      text: `${ensureTextLength(
        item_name,
        pageWidthLength - AmountWidthLength - 4 - AmountWidthLength,
        true,
      )}${ensureTextLength(d.quantity, 4, false)}${ensureTextLength(
        parseFloat(d.rate || '0').toFixed(2),
        AmountWidthLength,
        false,
      )}${ensureTextLength(
        parseFloat(totalPrice).toFixed(2),
        AmountWidthLength,
        false,
      )}`,
    });
    if (variants.length) {
      variants.forEach(r => {
        printData.push({
          charSize,
          size: fontSize,
          align: pAlign,
          style: 'normal',
          text: `${ensureTextLength(
            ` ${r.title}`,
            pageWidthLength - AmountWidthLength - 4 - AmountWidthLength,
            true,
          )}${ensureTextLength('', 4, false)}${ensureTextLength(
            '',
            AmountWidthLength,
            false,
          )}${ensureTextLength('', AmountWidthLength, false)}`,
        });
      });
    }
    if (add_ons.length) {
      add_ons.forEach(r => {
        printData.push({
          charSize,
          size: fontSize,
          align: pAlign,
          style: 'normal',
          text: `${ensureTextLength(
            ` ${r.product_name}`,
            pageWidthLength - AmountWidthLength - 4 - AmountWidthLength,
            true,
          )}${ensureTextLength('', 4, false)}${ensureTextLength(
            '',
            AmountWidthLength,
            false,
          )}${ensureTextLength('', AmountWidthLength, false)}`,
        });
      });
    }
    // printData.push(newLineData);
  });

  if ([PAYMENT_METHOD.split_payment.id].includes(data.payment_method)) {
    printData.push(newLineData);
    printData.push({
      charSize,
      size: fontSize,
      align: pAlign,
      style: 'normal',
      text: `${ensureTextLength('', pageWidthLength, true, '.')}`,
    });
    printData.push(newLineData);
    printData.push({
      charSize: headingCharSize,
      size: headingFontSize,
      align: pAlign,
      style: 'bold',
      text: `${ensureTextLength(`Split Payment`, pageWidthLength, true)}`,
    });

    data.order_split_payments.forEach((d, i) => {
      printData.push({
        charSize,
        size: fontSize,
        align: pAlign,
        style: 'normal',
        text: `${ensureTextLength(
          `${i + 1}. ${d.type}`,
          pageWidthLength,
          true,
        )}`,
      });
      printData.push({
        charSize,
        size: fontSize,
        align: pAlign,
        style: 'normal',
        text: `${ensureTextLength(
          `Amount:`,
          pageWidthLength - AmountWidthLength,
          true,
        )}${ensureTextLength(
          parseFloat(d.amount || '0').toFixed(2),
          AmountWidthLength,
          false,
        )}`,
      });
      printData.push({
        charSize,
        size: fontSize,
        align: pAlign,
        style: 'normal',
        text: `${ensureTextLength(
          `Received Amount:`,
          pageWidthLength - AmountWidthLength,
          true,
        )}${ensureTextLength(
          parseFloat(d.received_amount || '0').toFixed(2),
          AmountWidthLength,
          false,
        )}`,
      });
    });
  }

  printData.push(newLineData);
  printData.push({
    charSize,
    size: fontSize,
    align: pAlign,
    style: 'normal',
    text: `${ensureTextLength('', pageWidthLength, true, '.')}`,
  });
  printData.push(newLineData);
  printData.push({
    charSize,
    size: fontSize,
    align: pAlign,
    style: 'normal',
    text: `${ensureTextLength(
      `Sub Total:`,
      pageWidthLength - AmountWidthLength,
      true,
    )}${ensureTextLength(
      parseFloat(data.sub_total || '0').toFixed(2),
      AmountWidthLength,
      false,
    )}`,
  });
  printData.push(newLineData);
  printData.push({
    charSize,
    size: fontSize,
    align: pAlign,
    style: 'normal',
    text: `${ensureTextLength(
      `${data?.tax_title || DEFAULT_TAX_TITLE} (${parseFloat(
        data?.tax_per || 0,
      )}%):`,
      pageWidthLength - AmountWidthLength,
      true,
    )}${ensureTextLength(
      parseFloat(data.tax_amt).toFixed(2),
      AmountWidthLength,
      false,
    )}`,
  });
  printData.push(newLineData);
  if (!!data.discount) {
    printData.push({
      charSize,
      size: fontSize,
      align: pAlign,
      style: 'normal',
      text: `${ensureTextLength(
        `Total:`,
        pageWidthLength - AmountWidthLength,
        true,
      )}${ensureTextLength(
        (
          parseFloat(data.sub_total || 0) + parseFloat(data.tax_amt || 0)
        ).toFixed(2),
        AmountWidthLength,
        false,
      )}`,
    });
    printData.push(newLineData);
    printData.push({
      charSize,
      size: fontSize,
      align: pAlign,
      style: 'normal',
      text: `${ensureTextLength(
        `Discount:`,
        pageWidthLength - AmountWidthLength,
        true,
      )}${ensureTextLength(
        `${data.discount_type == '2' ? '$ ' : ''}${data.discount ?? 0}${
          data.discount_type == '1' ? '%' : ''
        }`,
        AmountWidthLength,
        false,
      )}`,
    });
    printData.push(newLineData);
  }

  printData.push({
    charSize,
    size: fontSize,
    align: pAlign,
    style: 'normal',
    text: `${ensureTextLength(
      `Grand Total:`,
      pageWidthLength - AmountWidthLength,
      true,
    )}${ensureTextLength(
      parseFloat(data.order_total).toFixed(2),
      AmountWidthLength,
      false,
    )}`,
  });
  printData.push(newLineData);
  if (
    [PAYMENT_METHOD.cash.id, PAYMENT_METHOD.split_payment.id].includes(
      data.payment_method,
    )
  ) {
    printData.push({
      charSize,
      size: fontSize,
      align: pAlign,
      style: 'normal',
      text: `${ensureTextLength(
        `Received Amount:`,
        pageWidthLength - AmountWidthLength,
        true,
      )}${ensureTextLength(
        parseFloat(data.received_amount).toFixed(2),
        AmountWidthLength,
        false,
      )}`,
    });
    printData.push(newLineData);
    let remaining_amount =
      parseFloat(data?.order_total) - parseFloat(data?.received_amount);
    if (!isFinite(remaining_amount)) {
      remaining_amount = 0;
    }
    // printData.push({
    //   charSize,
    //   size: fontSize,
    //  align: pAlign,
    //   style: 'normal',
    //   text: `${ensureTextLength(
    //     `Remaining Amount:`,
    //     pageWidthLength - AmountWidthLength,
    //     true,
    //   )}${ensureTextLength(
    //     parseFloat(
    //       remaining_amount >= 0 ? remaining_amount : 0,
    //     ).toFixed(2),
    //     AmountWidthLength,
    //     false,
    //   )}`,
    // });
    printData.push({
      charSize,
      size: fontSize,
      align: pAlign,
      style: 'normal',
      text: `${ensureTextLength(
        `Change:`,
        pageWidthLength - AmountWidthLength,
        true,
      )}${ensureTextLength(
        parseFloat(
          Math.abs(remaining_amount >= 0 ? 0 : remaining_amount),
        ).toFixed(2),
        AmountWidthLength,
        false,
      )}`,
    });
    printData.push(newLineData);
  }

  printData.push({
    charSize,
    size: fontSize,
    align: pAlign,
    style: 'normal',
    text: `${ensureTextLength('', pageWidthLength, true, '*')}`,
  });

  return printData;
}
