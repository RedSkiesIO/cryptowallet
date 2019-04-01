const actions = {
  setAccountLocale: jest.fn(),
  setAccountType: jest.fn(),
  resetPin: jest.fn(),
  resetPinConfirm: jest.fn(),
  setPinConfirm: jest.fn(),
  setPin: jest.fn(),
};

const getters = {};
const mutations = {};
const state = {
  pinArray: [0, 0, 0, 0, 0, 0],
  pinConfirmArray: [0, 0, 0, 0, 0, 0],
  salt: '$2a$10$KE86k38NXlqTBgOQUC9bE.',
};

const account = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default account;
