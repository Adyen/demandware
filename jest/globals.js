global.dw = {
  order: {
    Order: {
      PAYMENT_STATUS_PAID: 'MOCKED_PAID',
      EXPORT_STATUS_READY: 'MOCKED_READY',
    },
  },
};
global.showStoreDetails = true;
global.$ = require('jquery');

global.session = {
  privacy: { orderNo: 'mocked_orderNo' },
  forms: { billing: { clearFormElement: jest.fn() } },
};

global.server = {
  forms: {
    getForm: jest.fn(() => ({
      adyenStateData: { value: 'mocked_value' },
    })),
  },
};

global.request = { getLocale: jest.fn(() => 'nl_NL') };
