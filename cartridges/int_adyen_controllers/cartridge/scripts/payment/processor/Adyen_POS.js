'use strict';

/* API Includes */
var PaymentMgr = require('dw/order/PaymentMgr');
var Resource = require("dw/web/Resource");
var Transaction = require("dw/system/Transaction");
var Logger = require('dw/system/Logger');
var constants = require("*/cartridge/adyenConstants/constants");
/* Script Modules */
var app = require('app_storefront_controllers/cartridge/scripts/app');

/**
 * Creates a Adyen payment instrument for the given basket
 */
function handle(args) {
	var adyenRemovePreviousPI = require('*/cartridge/scripts/adyenRemovePreviousPI');

    Transaction.wrap(function () {
    	var result = adyenRemovePreviousPI.removePaymentInstruments(args.Basket);
        if (result.error) {
    		return result;
    	}

        var paymentInstrument = args.Basket.createPaymentInstrument(
            constants.METHOD_ADYEN_POS, args.Basket.totalGrossPrice
        );
        paymentInstrument.custom.adyenPaymentMethod = "POS Terminal";
    });

    return { success: true };
}

/**
 * Authorizes a payment using a POS terminal. 
 * The payment is authorized by using the Adyen_POS processor only and setting the order no as the transaction ID. 
 */
function authorize(args) {
    var adyenTerminalApi = require("*/cartridge/scripts/adyenTerminalApi");
	var order = args.Order;
    var orderNo = args.OrderNo;
    var paymentInstrument = args.PaymentInstrument;
    var paymentProcessor = PaymentMgr.getPaymentMethod(paymentInstrument.getPaymentMethod()).getPaymentProcessor();

    Transaction.wrap(function () {
        paymentInstrument.paymentTransaction.transactionID = orderNo;
        paymentInstrument.paymentTransaction.paymentProcessor = paymentProcessor;
    });

    var paymentForm = session.forms.adyPaydata;

    var terminalId = paymentForm.terminalId.value;

    if(!terminalId){
        Logger.getLogger("Adyen").error("No terminal selected");
        var errors = [];
        errors.push(Resource.msg("error.payment.processor.not.supported", "checkout", null));
        return {
            authorized: false, fieldErrors: [], serverErrors: errors, error: true
        };
    }

    var result = adyenTerminalApi.createTerminalPayment(order, paymentInstrument, terminalId);
    if (result.error) {
        Logger.getLogger("Adyen").error("POS Authorise error, result: " + result.response);
        var errors = [];
        errors.push(Resource.msg("error.payment.processor.not.supported", "checkout", null));
        return {
            authorized: false, fieldErrors: [], serverErrors: errors, error: true
        };
    }
    else {
        return result;
    }
}

exports.Handle = handle;
exports.Authorize = authorize;
