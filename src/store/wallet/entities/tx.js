import { Model } from '@vuex-orm/core';
import Account from '@/store/wallet/entities/account';
import Wallet from '@/store/wallet/entities/wallet';
import networks from '@/store/settings/state/supportedNetworks';
import { ENSResolver } from '@/boot/ENS';
import { trackTx } from '@/boot/Notify';
/**
 * Tx Entity.
 */
export default class Tx extends Model {
  static entity = 'tx';

  static fields() {
    return {
      id: this.increment(),
      account_id: this.attr(''),
      wallet_id: this.attr(''),
      hash: this.attr(''),
      blockHeight: this.attr(''),
      change: this.attr(''),
      confirmed: this.attr(''),
      confirmations: this.attr(''),
      receivedTime: this.attr(''),
      confirmedTime: this.attr(''),
      fee: this.attr(''),
      receiver: this.attr(''),
      sender: this.attr(''),
      sent: this.attr(''),
      value: this.attr(''),
      isChange: this.attr(false),
      contractCall: this.attr(false),
    };
  }

  account() {
    return Account.find(this.account_id);
  }

  wallet() {
    return Wallet.find(this.wallet_id);
  }

  track() {
    const { chainId } = networks[this.wallet().network];
    return trackTx(this.hash, chainId, this.account().darkMode);
  }

  async ensName(address) {
    const network = networks[this.wallet().network];
    if (network.ens) {
      const ens = new ENSResolver(this.wallet().network);
      return ens.lookup(address);
    }
    return null;
  }
}
