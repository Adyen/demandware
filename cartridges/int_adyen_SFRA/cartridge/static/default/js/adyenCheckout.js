/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyenCheckout.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyenCheckout.js":
/*!********************************************************************************!*\
  !*** ./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyenCheckout.js ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const checkout = new AdyenCheckout(window.Configuration);\nconst cardNode = document.getElementById('card');\nvar oneClickCard = [];\nvar card;\nvar idealComponent;\nvar afterpayComponent;\nvar klarnaComponent;\nvar isValid = false;\nvar storeDetails;\nvar maskedCardNumber;\nconst MASKED_CC_PREFIX = '************';\nvar oneClickValid = false;\n\nrenderOneClickComponents();\nrenderGenericComponent();\n\nfunction renderGenericComponent(){\n    GetCheckoutPaymentMethods(function(data){\n        var paymentMethodsResponse = JSON.stringify(data.AdyenPaymentMethods);\n\n        var scripts = `\n              <script type=\"module\" src=\"https://unpkg.com/generic-component@latest/dist/adyen-checkout/adyen-checkout.esm.js\"></script>\n              <script nomodule src=\"https://unpkg.com/generic-component@latest/dist/adyen-checkout/adyen-checkout.js\"></script>\n           `;\n\n        var componentNode = ` \n                         <adyen-checkout\n                                locale=\"${window.Configuration.locale}\"\n                                environment=\"${window.Configuration.environment}\"\n                                origin-key=\"${window.Configuration.originKey}\"\n                                payment-methods='${paymentMethodsResponse}'\n                                >\n                            <adyen-payment-method-card></adyen-payment-method-card>\n                        </adyen-checkout>\n                        `;\n\n        $('head').append(scripts);\n        $('#adyen-webcomponent').append(componentNode);\n\n        const myComponent = document.querySelector('adyen-checkout');\n        const logEvent = ({ detail }) => {\n            console.log(detail.state.data);\n            $(\"#adyenStateData\").val(JSON.stringify(detail.state.data));\n        }\n        myComponent.addEventListener('adyenChange', logEvent);\n        myComponent.addEventListener('adyenBrand', logEvent);\n    })\n}\n\nfunction GetCheckoutPaymentMethods(paymentMethods) {\n    $.ajax({\n        url: 'Adyen-GetCheckoutPaymentMethods',\n        type: 'get',\n        success: function (data) {\n            paymentMethods(data);\n        }\n    });\n};\n\nfunction renderOneClickComponents() {\n    var componentContainers = document.getElementsByClassName(\"cvc-container\");\n    jQuery.each(componentContainers, function (i, oneClickCardNode) {\n        var container = document.getElementById(oneClickCardNode.id);\n        var cardId = container.id.split(\"-\")[1];\n        var brandCode = document.getElementById('cardType-' + cardId).value;\n        oneClickCard[cardId] = checkout.create('card', {\n            // Specific for oneClick cards\n            brand: brandCode,\n            storedPaymentMethodId: cardId,\n            onChange: function (state) {\n                oneClickValid = state.isValid;\n                if (state.isValid) {\n                    $('#browserInfo').val(JSON.stringify(state.data.browserInfo));\n                    $('#adyenEncryptedSecurityCode').val(state.data.paymentMethod.encryptedSecurityCode);\n                }\n            } // Gets triggered whenever a user changes input\n        }).mount(container);\n    });\n};\n\n$('.payment-summary .edit-button').on('click', function (e) {\n    jQuery.each(oneClickCard, function (i) {\n        oneClickCard[i].unmount();\n    });\n    renderOneClickComponents();\n    oneClickValid = false;\n});\n\nfunction displayPaymentMethods() {\n    $('#paymentMethodsUl').empty();\n    getPaymentMethods(function (data) {\n        jQuery.each(data.AdyenPaymentMethods, function (i, method) {\n            addPaymentMethod(method, data.ImagePath, data.AdyenDescriptions[i].description);\n        });\n\n        $('input[type=radio][name=brandCode]').change(function () {\n            resetPaymentMethod();\n            $('#component_' + $(this).val()).show();\n        });\n\n        if(data.AdyenConnectedTerminals && data.AdyenConnectedTerminals.uniqueTerminalIds && data.AdyenConnectedTerminals.uniqueTerminalIds.length > 0){\n            $('#AdyenPosTerminals').empty();\n            addPosTerminals(data.AdyenConnectedTerminals.uniqueTerminalIds);\n        }\n    });\n};\n\nfunction addPosTerminals(terminals) {\n    //create dropdown and populate connected terminals\n    var dd_terminals = $(\"<select>\").attr(\"id\", \"terminalList\");\n    for(var i=0; i< terminals.length;i++) {\n        $(\"<option/>\", {\n            value: terminals[i],\n            html: terminals[i]\n        }).appendTo(dd_terminals);\n    }\n    $('#AdyenPosTerminals').append(dd_terminals);\n}\nfunction resetPaymentMethod() {\n    $('#requiredBrandCode').hide();\n    $('#selectedIssuer').val(\"\");\n    $('#adyenIssuerName').val(\"\");\n    $('#dateOfBirth').val(\"\");\n    $('#telephoneNumber').val(\"\");\n    $('#gender').val(\"\");\n    $('#bankAccountOwnerName').val(\"\");\n    $('#bankAccountNumber').val(\"\");\n    $('#bankLocationId').val(\"\");\n    $('.additionalFields').hide();\n};\n\nfunction getPaymentMethods(paymentMethods) {\n    $.ajax({\n        url: 'Adyen-GetPaymentMethods',\n        type: 'get',\n        success: function (data) {\n            paymentMethods(data);\n        }\n    });\n};\n\nfunction addPaymentMethod(paymentMethod, imagePath, description) {\n    var li = $('<li>').addClass('paymentMethod');\n    li.append($('<input>')\n        .attr('id', 'rb_' + paymentMethod.name)\n        .attr('type', 'radio')\n        .attr('name', 'brandCode')\n        .attr('value', paymentMethod.type));\n    li.append($('<img>').addClass('paymentMethod_img').attr('src', imagePath + paymentMethod.type + '.png'));\n    li.append($('<label>').text(paymentMethod.name).attr('for', 'rb_' + paymentMethod.name));\n    li.append($('<p>').text(description));\n\n    if (paymentMethod.type == \"ideal\") {\n        var idealContainer = document.createElement(\"div\");\n        $(idealContainer).addClass('additionalFields').attr('id', 'component_' + paymentMethod.type).attr('style', 'display:none');\n        idealComponent = checkout.create('ideal', {\n            details: paymentMethod.details\n        });\n        li.append(idealContainer);\n        idealComponent.mount(idealContainer);\n    }\n\n    if (paymentMethod.type.indexOf(\"klarna\") !== -1 && paymentMethod.details) {\n        var klarnaContainer = document.createElement(\"div\");\n        $(klarnaContainer).addClass('additionalFields').attr('id', 'component_' + paymentMethod.type).attr('style', 'display:none');\n        klarnaComponent = checkout.create('klarna', {\n            countryCode: $('#currentLocale').val(),\n            details: filterOutOpenInvoiceComponentDetails(paymentMethod.details),\n            visibility: {\n                personalDetails: \"editable\"\n            }\n        });\n        klarnaComponent.mount(klarnaContainer);\n\n        if (isNordicCountry($('#shippingCountry').val())) {\n            var ssnContainer = document.createElement(\"div\");\n            $(ssnContainer).attr('id', 'ssn_' + paymentMethod.type);\n            var socialSecurityNumberLabel = document.createElement(\"span\");\n            $(socialSecurityNumberLabel).text(\"Social Security Number\").attr('class', 'adyen-checkout__label');\n            var socialSecurityNumber = document.createElement(\"input\");\n            $(socialSecurityNumber).attr('id', 'ssnValue').attr('class', 'adyen-checkout__input').attr('type', 'text'); //.attr('maxlength', ssnLength);\n\n            ssnContainer.append(socialSecurityNumberLabel);\n            ssnContainer.append(socialSecurityNumber);\n            klarnaContainer.append(ssnContainer);\n        }\n\n        li.append(klarnaContainer);\n\n    }\n    ;\n\n    if (paymentMethod.type.indexOf(\"afterpay_default\") !== -1) {\n        var afterpayContainer = document.createElement(\"div\");\n        $(afterpayContainer).addClass('additionalFields').attr('id', 'component_' + paymentMethod.type).attr('style', 'display:none');\n        afterpayComponent = checkout.create('afterpay', {\n            countryCode: $('#currentLocale').val(),\n            details: filterOutOpenInvoiceComponentDetails(paymentMethod.details),\n            visibility: {\n                personalDetails: \"editable\"\n            }\n        });\n        li.append(afterpayContainer);\n        afterpayComponent.mount(afterpayContainer);\n    }\n    ;\n\n    if (paymentMethod.type == 'ratepay') {\n        var ratepayContainer = document.createElement(\"div\");\n        $(ratepayContainer).addClass('additionalFields').attr('id', 'component_' + paymentMethod.type).attr('style', 'display:none');\n\n        var genderLabel = document.createElement(\"span\");\n        $(genderLabel).text(\"Gender\").attr('class', 'adyen-checkout__label');\n        var genderInput = document.createElement(\"select\");\n        $(genderInput).attr('id', 'genderInput').attr('class', 'adyen-checkout__input');\n\n        //Create array of options to be added\n        var genders = {'M': 'Male','F': 'Female'};\n\n        for (var key in genders) {\n            var option = document.createElement(\"option\");\n            option.value = key;\n            option.text = genders[key];\n            genderInput.appendChild(option);\n        }\n\n        var dateOfBirthLabel = document.createElement(\"span\");\n        $(dateOfBirthLabel).text(\"Date of birth\").attr('class', 'adyen-checkout__label');\n        var dateOfBirthInput = document.createElement(\"input\");\n        $(dateOfBirthInput).attr('id', 'dateOfBirthInput').attr('class', 'adyen-checkout__input').attr('type', 'date');\n\n\n        ratepayContainer.append(genderLabel);\n        ratepayContainer.append(genderInput);\n        ratepayContainer.append(dateOfBirthLabel);\n        ratepayContainer.append(dateOfBirthInput);\n\n        li.append(ratepayContainer);\n    }\n    ;\n\n    if (paymentMethod.type.substring(0, 3) == \"ach\") {\n        var achContainer = document.createElement(\"div\");\n        $(achContainer).addClass('additionalFields').attr('id', 'component_' + paymentMethod.type).attr('style', 'display:none');\n\n        var bankAccountOwnerNameLabel = document.createElement(\"span\");\n        $(bankAccountOwnerNameLabel).text(\"Bank Account Owner Name\").attr('class', 'adyen-checkout__label');\n        var bankAccountOwnerName = document.createElement(\"input\");\n        $(bankAccountOwnerName).attr('id', 'bankAccountOwnerNameValue').attr('class', 'adyen-checkout__input').attr('type', 'text');\n\n        var bankAccountNumberLabel = document.createElement(\"span\");\n        $(bankAccountNumberLabel).text(\"Bank Account Number\").attr('class', 'adyen-checkout__label');\n        var bankAccountNumber = document.createElement(\"input\");\n        $(bankAccountNumber).attr('id', 'bankAccountNumberValue').attr('class', 'adyen-checkout__input').attr('type', 'text').attr('maxlength', 17);\n\n        var bankLocationIdLabel = document.createElement(\"span\");\n        $(bankLocationIdLabel).text(\"Routing Number\").attr('class', 'adyen-checkout__label');\n        var bankLocationId = document.createElement(\"input\");\n        $(bankLocationId).attr('id', 'bankLocationIdValue').attr('class', 'adyen-checkout__input').attr('type', 'text').attr('maxlength', 9);\n\n\n        achContainer.append(bankAccountOwnerNameLabel);\n        achContainer.append(bankAccountOwnerName);\n\n        achContainer.append(bankAccountNumberLabel);\n        achContainer.append(bankAccountNumber);\n\n        achContainer.append(bankLocationIdLabel);\n        achContainer.append(bankLocationId);\n\n        li.append(achContainer);\n    }\n\n    if (paymentMethod.details) {\n        if (paymentMethod.details.constructor == Array && paymentMethod.details[0].key == \"issuer\") {\n            var additionalFields = $('<div>').addClass('additionalFields')\n                .attr('id', 'component_' + paymentMethod.type)\n                .attr('style', 'display:none');\n\n            var issuers = $('<select>').attr('id', 'issuerList');\n            jQuery.each(paymentMethod.details[0].items, function (i, issuer) {\n                var issuerOption = $('<option>')\n                    .attr('label', issuer.name)\n                    .attr('value', issuer.id);\n                issuers.append(issuerOption);\n            });\n            additionalFields.append(issuers);\n            li.append(additionalFields);\n        }\n    }\n    $('#paymentMethodsUl').append(li);\n};\n\n\n//Filter fields for open invoice validation\nfunction filterOutOpenInvoiceComponentDetails(details) {\n    var filteredDetails = details.map(function (detail) {\n        if (detail.key == \"personalDetails\") {\n            var detailObject = detail.details.map(function (childDetail) {\n                if (childDetail.key == 'dateOfBirth' ||\n                    childDetail.key == 'gender') {\n                    return childDetail;\n                }\n            });\n\n            if (!!detailObject) {\n                return {\n                    \"key\": detail.key,\n                    \"type\": detail.type,\n                    \"details\": filterUndefinedItemsInArray(detailObject)\n                };\n            }\n        }\n    });\n\n    return filterUndefinedItemsInArray(filteredDetails);\n};\n\n/**\n * Helper function to filter out the undefined items from an array\n * @param arr\n * @returns {*}\n */\nfunction filterUndefinedItemsInArray(arr) {\n    return arr.filter(function (item) {\n        return typeof item !== 'undefined';\n    });\n};\n\nfunction isNordicCountry(country) {\n    if (country === \"SE\" || country === \"FI\" || country === \"DK\" || country === \"NO\") {\n        return true;\n    }\n    return false;\n};\n\n//Submit the payment\n    $('button[value=\"submit-payment\"]').on('click', function (e) {\n        // $.ajax({\n        //     url: 'CheckoutServices-SubmitPayment',\n        //     type: 'POST',\n        //     data: { test: 'testDataBasZaid'},\n        //     success: function(response){\n        //         console.log(response);\n        //     },\n        //     error: function(){\n        //         console.log(\"error\");\n        //     }\n        // });\n\n    return true;\n    // if ($('#selectedPaymentOption').val() == 'CREDIT_CARD') {\n    //     //new card payment\n    //     if ($('.payment-information').data('is-new-payment')) {\n    //         if (!isValid) {\n    //             card.showValidation();\n    //             return false;\n    //         } else {\n    //             $('#selectedCardID').val('');\n    //             setPaymentData();\n    //         }\n    //     }\n    //     //oneclick payment\n    //     else {\n    //         var uuid = $('.selected-payment').data('uuid');\n    //         var selectedOneClick = oneClickCard[uuid];\n    //         if (!selectedOneClick.state.isValid) {\n    //             selectedOneClick.showValidation();\n    //             return false;\n    //         } else {\n    //             var selectedCardType = document.getElementById('cardType-' + uuid).value;\n    //             document.getElementById('saved-payment-security-code-' + uuid).value = \"000\";\n    //             $('#cardType').val(selectedCardType)\n    //             $('#selectedCardID').val($('.selected-payment').data('uuid'));\n    //             return true;\n    //         }\n    //     }\n    // } else if ($('#selectedPaymentOption').val() == 'Adyen') {\n    //     var selectedMethod = $(\"input[name='brandCode']:checked\");\n    //     //no payment method selected\n    //     if (!adyenPaymentMethodSelected(selectedMethod.val())) {\n    //         $('#requiredBrandCode').show();\n    //         return false;\n    //     }\n    //     //check component details\n    //     else {\n    //         var componentState = checkComponentDetails(selectedMethod);\n    //         $('#adyenPaymentMethod').val($(\"input[name='brandCode']:checked\").attr('id').substr(3));\n    //         return componentState;\n    //     }\n    // } else if ($('#selectedPaymentOption').val() == 'AdyenPOS') {\n    //     $(\"#terminalId\").val($(\"#terminalList\").val());\n    // }\n    // return true;\n});\n\nfunction checkComponentDetails(selectedMethod) {\n    //set data from components\n    if (selectedMethod.val() == \"ideal\") {\n        if (idealComponent.componentRef.state.isValid) {\n            $('#selectedIssuer').val(idealComponent.componentRef.state.data.issuer);\n            $('#adyenIssuerName').val(idealComponent.componentRef.props.items.find(x => x.id == idealComponent.componentRef.state.data.issuer).name);\n        }\n        return idealComponent.componentRef.state.isValid;\n    } else if (selectedMethod.val().indexOf(\"klarna\") > -1 && klarnaComponent) {\n        if (klarnaComponent.componentRef.state.isValid) {\n            setOpenInvoiceData(klarnaComponent);\n            if ($('#ssnValue')) {\n                $('#socialSecurityNumber').val($('#ssnValue').val());\n            }\n        }\n        return klarnaComponent.componentRef.state.isValid;\n    } else if (selectedMethod.val().indexOf(\"afterpay_default\") > -1) {\n        if (afterpayComponent.componentRef.state.isValid) {\n            setOpenInvoiceData(afterpayComponent);\n        }\n        return afterpayComponent.componentRef.state.isValid;\n    }\n    else if (selectedMethod.val() == 'ratepay') {\n        if ($('#genderInput').val() && $('#dateOfBirthInput').val()) {\n            $('#gender').val($('#genderInput').val());\n            $('#dateOfBirth').val($('#dateOfBirthInput').val());\n            return true;\n        }\n\n        return false;\n    }\n    //if issuer is selected\n    else if (selectedMethod.closest('li').find('.additionalFields #issuerList').val()) {\n        $('#selectedIssuer').val(selectedMethod.closest('li').find('.additionalFields #issuerList').val());\n        $('#adyenIssuerName').val(selectedMethod.closest('li').find('.additionalFields #issuerList').find('option:selected').attr('label'));\n    } else if (selectedMethod.val().substring(0, 3) == \"ach\") {\n        $('#bankAccountOwnerName').val($('#bankAccountOwnerNameValue').val());\n        $('#bankAccountNumber').val($('#bankAccountNumberValue').val());\n        $('#bankLocationId').val($('#bankLocationIdValue').val());\n\n        if (!$('#bankLocationIdValue').val() || !$('#bankAccountNumberValue').val() || !$('#bankAccountOwnerNameValue').val()) {\n            return false;\n        }\n    }\n\n    return true;\n}\n\nfunction setOpenInvoiceData(component) {\n    if(component.componentRef.state.data.personalDetails){\n        if(component.componentRef.state.data.personalDetails.dateOfBirth){\n            $('#dateOfBirth').val(component.componentRef.state.data.personalDetails.dateOfBirth);\n        }\n        if(component.componentRef.state.data.personalDetails.gender){\n            $('#gender').val(component.componentRef.state.data.personalDetails.gender);\n        }\n        if(component.componentRef.state.data.personalDetails.telephoneNumber){\n            $('#telephoneNumber').val(component.componentRef.state.data.personalDetails.telephoneNumber);\n        }\n    }\n}\n\nfunction adyenPaymentMethodSelected(selectedMethod) {\n    if (!selectedMethod) {\n        return false;\n    }\n    return true;\n}\n\n$('button[value=\"add-new-payment\"]').on('click', function (e) {\n    setPaymentData();\n});\n\nfunction setPaymentData() {\n    $('#adyenEncryptedCardNumber').val(card.state.data.encryptedCardNumber);\n    $('#adyenEncryptedExpiryMonth').val(card.state.data.encryptedExpiryMonth);\n    $('#adyenEncryptedExpiryYear').val(card.state.data.encryptedExpiryYear);\n    $('#adyenEncryptedSecurityCode').val(card.state.data.encryptedSecurityCode);\n    $('#cardOwner').val(card.state.data.holderName);\n    $('#cardNumber').val(maskedCardNumber || \"\");\n    $('#saveCardAdyen').val(storeDetails || false);\n}\n\nmodule.exports = {\n    methods: {\n        displayPaymentMethods: displayPaymentMethods\n    }\n};\n\n\n\n//# sourceURL=webpack:///./cartridges/int_adyen_SFRA/cartridge/client/default/js/adyenCheckout.js?");

/***/ })

/******/ });