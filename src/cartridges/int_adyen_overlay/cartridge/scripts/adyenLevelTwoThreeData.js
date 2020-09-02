/**
 * Generate the parameters needed for the redirect to the Adyen Hosted Payment Page.
 * A signature is calculated based on the configured HMAC code
 *
 * @input Order : dw.order.Order
 * @input OrderNo : String The order no
 * @input CurrentSession : dw.system.Session
 * @input CurrentUser : dw.customer.Customer
 * @input PaymentInstrument : dw.order.PaymentInstrument
 * @input brandCode : String
 * @input issuerId : String
 * @input dob : String
 * @input gender : String
 * @input telephoneNumber : String
 * @input houseNumber : String
 * @input houseExtension : String
 * @input socialSecurityNumber : String
 *
 * @output merchantSig : String;
 * @output Amount100 : String;
 * @output shopperEmail : String;
 * @output shopperReference : String;
 * @output paramsMap : dw.util.SortedMap;
 * @output sessionValidity : String;
 *
 */
require('dw/crypto');
require('dw/system');
require('dw/order');
require('dw/util');
require('dw/value');
require('dw/net');
require('dw/web');
const Logger = require('dw/system/Logger');
const AdyenHelper = require('*/cartridge/scripts/util/adyenHelper');

// script include
const LineItemHelper = require('*/cartridge/scripts/util/lineItemHelper');

Logger.getLogger('Adyen').error('inside l2/3 file');

function getLineItems(args) {
  let order;
  if (args.Order) {
    order = args.Order;
  } else {
    return null;
  }

  // Add all product and shipping line items to request
  const lineItemObject = {};
  const allLineItems = order.getAllLineItems();
  const customer = order.getCustomer();
  const profile = customer && customer.registered && customer.getProfile()
    ? customer.getProfile()
    : null;
  let shopperReference;
  if (profile && profile.getCustomerNo()) {
    shopperReference = profile.getCustomerNo();
  } else if (order.getCustomerNo()) {
    shopperReference = order.getCustomerNo();
  } else if (customer.getID()) {
    shopperReference = customer.getID();
  }

  lineItemObject['enhancedSchemeData.customerReference'] = shopperReference.substring(0, 25);

  let taxTotal = 0.0;
  for (const item in allLineItems) {
    const lineItem = allLineItems[item];
    const description = LineItemHelper.getDescription(lineItem);
    const id = LineItemHelper.getId(lineItem);
    const quantity = LineItemHelper.getQuantity(lineItem);
    const itemAmount = LineItemHelper.getItemAmount(lineItem) / quantity;
    const vatAmount = LineItemHelper.getVatAmount(lineItem) / quantity;

    taxTotal += parseFloat(vatAmount.toFixed());
    lineItemObject[`enhancedSchemeData.itemDetailLine${item + 1}.description`] = description.substring(0, 26).replace(/[^\x00-\x7F]/g, ''); //eslint-disable-line no-control-regex
    lineItemObject[`enhancedSchemeData.itemDetailLine${item + 1}.unitPrice`] = itemAmount.toFixed();
    lineItemObject[`enhancedSchemeData.itemDetailLine${item + 1}.totalAmount`] = JSON.stringify(parseFloat(itemAmount.toFixed()) + parseFloat(vatAmount.toFixed()));
    lineItemObject[`enhancedSchemeData.itemDetailLine${item + 1}.quantity`] = quantity;
    lineItemObject[`enhancedSchemeData.itemDetailLine${item + 1}.productCode`] = id.substring(0, 12);
    lineItemObject[`enhancedSchemeData.itemDetailLine${item + 1}.unitOfMeasure`] = 'EAC';
    if (AdyenHelper.getAdyenLevel23CommodityCode()) {
      lineItemObject[`enhancedSchemeData.itemDetailLine${item + 1}.commodityCode`] = AdyenHelper.getAdyenLevel23CommodityCode();
    }
  }
  lineItemObject['enhancedSchemeData.totalTaxAmount'] = JSON.stringify(taxTotal);
  return lineItemObject;
}

module.exports = {
  getLineItems: getLineItems,
};
