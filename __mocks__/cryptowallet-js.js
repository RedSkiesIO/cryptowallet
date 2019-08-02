

export const mockBitcoinSDK = {
  generateHDWallet: jest.fn(),
  generateKeyPair: jest.fn(),
  getBalance: jest.fn(),
  getUTXOs: jest.fn().mockImplementation(() => {
    return [
      {
        id: 1,
        txid: '9e792178e63be3d05b7f03f822c060909bd9fa5c451ce4ab11c1827108c5fb6d',
        vout: 0,
        wallet_id: 5,
        amount: 1,
      },
      {
        id: 2,
        txid: '9e792178e63be3d05b7f03f822c060909bd9fa5c451ce4ab11c1827108c5fb6e',
        vout: 0,
        wallet_id: 5,
        amount: 2,
      },
    ];
  }),
  generateAddress: jest.fn(),
};

export const mockEthereumSDK = {
  generateHDWallet: jest.fn(),
  generateKeyPair: jest.fn(),
  getBalance: jest.fn(),
  getTransactionHistory: jest.fn(),
};

export const mockERC20SDK = {
  generateERC20Wallet: jest.fn(),
  getBalance: jest.fn(),
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
