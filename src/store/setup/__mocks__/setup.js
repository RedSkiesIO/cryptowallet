const actions = {
  setAccountLocale: jest.fn(),
  setAccountType: jest.fn(),
  setAccountName: jest.fn(),
  resetPin: jest.fn(),
  resetPinConfirm: jest.fn(),
  setPinConfirm: jest.fn(),
  setPin: jest.fn(),
  clearSetupData: jest.fn(),
  setGetStartedModalOpened: jest.fn(),
};
const getters = {};
const mutations = {};
const state = {
  accountName: 'Stephen',
  pinArray: [0, 0, 0, 0, 0, 0],
  pinConfirmArray: [0, 0, 0, 0, 0, 0],
  salt: '$2a$10$KE86k38NXlqTBgOQUC9bE.',
  node: null,
  seed: {
    real: 'real', debate: 'debate', another: 'another', phone: 'phone', response: 'response', toddler: 'toddler', fee: 'fee', offer: 'offer', bundle: 'bundle', crack: 'crack', monster: 'monster', earth: 'earth',
  },
};

const account = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default account;
