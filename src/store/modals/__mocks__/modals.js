const actions = {
  setSendCoinModalOpened: jest.fn(),
};

const getters = {};
const mutations = {};
const state = {
  sendCoinModalOpened: false,
};

const qrcode = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default qrcode;
