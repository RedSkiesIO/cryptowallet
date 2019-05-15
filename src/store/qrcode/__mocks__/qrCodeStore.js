const actions = {
  scanQRCode: jest.fn(),
  cancelScanning: jest.fn(),
  setScannedAddress: jest.fn(),
  toDataURL: jest.fn(),
  setQRMode: jest.fn(),
};

const getters = {};
const mutations = {};
const state = {
  scanning: false,
  scannedAddress: null,
  qrMode: null,
};

const qrcode = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default qrcode;
