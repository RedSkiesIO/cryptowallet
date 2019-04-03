const actions = {
  scanQRCode: jest.fn(),
  cancelScanning: jest.fn(),
  setScannedAddress: jest.fn(),
};

const getters = {};
const mutations = {};
const state = {
  scanning: false,
  scannedAddress: null,
};

const qrcode = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default qrcode;
