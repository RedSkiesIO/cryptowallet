import { Model } from '@vuex-orm/core';
import Coin from './coin';

/**
 * Wallet Entity.
 */
export default class Wallet extends Model {
  static entity = 'wallet';

  static AES = ['hdWallet'];

  static fields() {
    return {
      id: this.increment(),
      account_id: this.attr(''),
      name: this.attr(''),
      displayName: this.attr(''),
      symbol: this.attr(''),
      sdk: this.attr(''),
      network: this.attr(''),
      internalChainAddressIndex: this.attr(0),
      externalChainAddressIndex: this.attr(0),
      externalAddress: this.attr(null),
      confirmedBalance: this.attr(0),
      unconfirmedBalance: this.attr(0),
      imported: this.attr(false),
      enabled: this.attr(false),
      lastBlockHeight: this.attr(0),
      parentName: this.attr(''),
      parentSdk: this.attr(''),
      contractAddress: this.attr(''),
      decimals: this.attr(''),
      hdWallet: this.attr(''),
      erc20Wallet: this.attr(''),
    };
  }

  get identifier() {
    const coin = Coin.query()
      .where('name', this.name)
      .where('contractAddress', this.contractAddress)
      .get()[0];


    if (coin.sdk === 'ERC20') {
      return this.contractAddress;
    }

    return coin.identifier;
  }
}
