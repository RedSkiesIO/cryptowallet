const actions = {
  setSendCoinModalOpened: jest.fn(),
  setConfirmSendModalOpened: jest.fn(),
  setConfirmTransactionData: jest.fn(),
  setSendFailureModalOpened: jest.fn(),
  setSendSuccessModalOpened: jest.fn(),
  setAddErc20ModalOpened: jest.fn(),
};

const getters = {};
const mutations = {};
const state = {
  sendCoinModalOpened: false,
  sendConfirmModalOpened: false,
  sendConfirmTxData: null,
  sendFailureModalOpened: false,
  sendSuccessModalOpened: false,
  addErc20ModalOpened: false,
};

const qrcode = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default qrcode;
