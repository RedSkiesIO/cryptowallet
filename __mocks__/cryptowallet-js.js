

export const mockBitcoinSDK = {
  generateHDWallet: jest.fn(),
  generateKeyPair: jest.fn(),

};

export const mockEthereumSDK = {
  generateHDWallet: jest.fn(),
  generateKeyPair: jest.fn(),
};

export const mockERC20SDK = {
  generateERC20Wallet: jest.fn(),
};

const mockCreateSDK = ((sdk) => {
  if (sdk === 'Bitcoin') {
    return mockBitcoinSDK;
  }

  if (sdk === 'Ethereum') {
    return mockEthereumSDK;
  }

  if (sdk === 'ERC20') {
    return mockERC20SDK;
  }

  return mockBitcoinSDK;
});

const SDKFactory = {
  createSDK: mockCreateSDK,
};

class CryptoWalletJS {
  constructor() {
    this.SDKFactory = SDKFactory;
  }
}
export default CryptoWalletJS;
