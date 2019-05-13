import MockState from '../state.js';

const actions = {
  setSendCoinModalOpened: jest.fn(),
  setConfirmSendModalOpened: jest.fn(),
  setConfirmTransactionData: jest.fn(),
  setSendFailureModalOpened: jest.fn(),
  setSendSuccessModalOpened: jest.fn(),
  setAddErc20ModalOpened: jest.fn(),
  setAddWalletModalOpened: jest.fn(),
  setPriceChartModalOpened: jest.fn(),
  setSelectAccountModalOpened: jest.fn(),
  setNewAccountModalOpened: jest.fn(),
  setTermsModalOpened: jest.fn(),
  setReceiveCoinModalOpened: jest.fn(),
};

const getters = {};
const mutations = {};

const state = MockState;

const qrcode = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default qrcode;
