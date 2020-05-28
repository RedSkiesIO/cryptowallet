// import ENS from 'ethereum-ens';
// import Web3 from 'web3';
import { ethers } from 'ethers';
import networks from '@/store/settings/state/supportedNetworks';

export class ENSResolver {
  constructor(network) {
    const url = networks[network].provider;
    this.provider = new ethers.providers.JsonRpcProvider(url);
    // this.ens = new ENS(this.provider);
  }

  async resolver(name) {
    try {
      const address = await this.provider.resolveName(name);
      return address;
    } catch {
      return false;
    }
  }

  async lookup(address) {
    const name = await this.provider.lookupAddress(address);
    return name;
  }
}

export default ({ Vue }) => {
  Vue.prototype.$ens = ENSResolver;
};
