/**
 *                       ######
 *                       ######
 * ############    ####( ######  #####. ######  ############   ############
 * #############  #####( ######  #####. ######  #############  #############
 *        ######  #####( ######  #####. ######  #####  ######  #####  ######
 * ###### ######  #####( ######  #####. ######  #####  #####   #####  ######
 * ###### ######  #####( ######  #####. ######  #####          #####  ######
 * #############  #############  #############  #############  #####  ######
 *  ############   ############  #############   ############  #####  ######
 *                                      ######
 *                               #############
 *                               ############
 * Adyen Salesforce Commerce Cloud
 * Copyright (c) 2021 Adyen B.V.
 * This file is open source and available under the MIT license.
 * See the LICENSE file for more info.
 *
 * Add all product and shipping line items to request
 */

require('dw/crypto');
require('dw/system');
require('dw/order');
require('dw/util');
require('dw/value');
require('dw/net');
require('dw/web');
const AdyenHelper = require('*/cartridge/scripts/util/adyenHelper');

const LineItemHelper = require('*/cartridge/scripts/util/lineItemHelper');

function getLineItems({ Order: order }) {
    if (!order) return null;
    const allLineItems = order.getProductLineItems();
    const shopperReference = getShopperReference(order);

    return allLineItems.toArray().reduce((acc, lineItem, index) => {
        const description = LineItemHelper.getDescription(lineItem);
        const id = LineItemHelper.getId(lineItem);
        const quantity = LineItemHelper.getQuantity(lineItem);
        const itemAmount = LineItemHelper.getItemAmount(lineItem).divide(quantity);
        const vatAmount = LineItemHelper.getVatAmount(lineItem).divide(quantity);
        const commodityCode = AdyenHelper.getAdyenLevel23CommodityCode();
        const currentLineItem = {
            [`enhancedSchemeData.itemDetailLine${index + 1}.unitPrice`]: itemAmount.value.toFixed(),
            [`enhancedSchemeData.itemDetailLine${index + 1}.totalAmount`]: parseFloat(itemAmount.value.toFixed()) + parseFloat(vatAmount.value.toFixed()),
            [`enhancedSchemeData.itemDetailLine${index + 1}.quantity`]: quantity,
            [`enhancedSchemeData.itemDetailLine${index + 1}.unitOfMeasure`]: 'EAC',
            ...(commodityCode && { [`enhancedSchemeData.itemDetailLine${index + 1}.commodityCode`]: commodityCode }),
            ...(description && { [`enhancedSchemeData.itemDetailLine${index + 1}.description`]: description.substring(0, 26).replace(/[^\x00-\x7F]/g, '') }),
            ...(id && { [`enhancedSchemeData.itemDetailLine${index + 1}.productCode`]: id.substring(0, 12) }),
        };

        return {
            ...acc,
            ...currentLineItem,
            'enhancedSchemeData.totalTaxAmount': acc['enhancedSchemeData.totalTaxAmount'] + parseFloat(vatAmount.value.toFixed()),
        };
    }, { 'enhancedSchemeData.totalTaxAmount': 0.0, 'enhancedSchemeData.customerReference': shopperReference.substring(0, 25) });
}

function getShopperReference(order) {
    const customer = order.getCustomer();
    const isRegistered = customer && customer.registered;
    const profile = isRegistered && customer.getProfile();
    const profileCustomerNo = profile && profile.getCustomerNo();
    const orderNo = profileCustomerNo || order.getCustomerNo();
    return orderNo || customer.getID() || 'no-unique-ref';
}

module.exports.getLineItems = getLineItems;