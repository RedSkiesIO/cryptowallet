const actions = {
  clearSetupData: jest.fn(),
  setAccountName: jest.fn(),
  setAccountLocale: jest.fn(),
  setAccountType: jest.fn(),
};

const getters = {};
const mutations = {};
const state = {
  accountName: 'Stephen',
  pinArray: [0, 0, 0, 0, 0, 0],
  pinConfirmArray: [0, 0, 0, 0, 0, 0],
  salt: '$2a$10$KE86k38NXlqTBgOQUC9bE.',
  node: null,
};

const account = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default account;
