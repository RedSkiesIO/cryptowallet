import { Magic } from 'magic-sdk';
import { ethers } from 'ethers';
import bip39 from 'bip39';

const m = new Magic('pk_test_4431477E0967CCCC'); // ✨

m.preload().then(() => { return console.log('Magic <iframe> loaded.'); });

const magic = {
  async login(email) {
    // log in a user by their email
    try {
      await m.auth.loginWithMagicLink({ email });
    } catch {
    // Handle errors if required!
    }
  },

  async logout() {
    await m.user.logout();
  },

  async isLoggedIn() {
    try {
      return await m.user.isLoggedIn();
    } catch {
      return false;
      // Handle errors if required!
    }
  },

  async getUser() {
    // Assumes a user is already logged in
    try {
      return await m.user.getMetadata();
    } catch {
      // Handle errors if required!
      return false;
    }
  },

  async getProvider() {
    const provider = new ethers.providers.Web3Provider(m.rpcProvider);
    return provider.getSigner();
  },

  async getMnemonic() {
    const provider = await this.getProvider();
    const entropy = await provider.signMessage('catalyst');
    const entropyBuffer = Buffer.from(entropy);
    const maxBytes = 32;
    const mnemonic = bip39.entropyToMnemonic(entropyBuffer.slice(0, maxBytes));
    console.log(mnemonic);
    return mnemonic;
  },
};

export default ({ Vue }) => {
  Vue.prototype.$magic = magic;
};
