import { Model } from '@vuex-orm/core';
import { ethers } from 'ethers';
import Account from '@/store/wallet/entities/account';
import Wallet from '@/store/wallet/entities/wallet';
import networks from '@/store/settings/state/supportedNetworks';
import { ENSResolver } from '@/boot/ENS';
import { trackTx } from '@/boot/Notify';

export default class Transactions extends Model {
  static entity = 'transactions';

  static fields() {
    return {
      id: this.increment(),
      tx_hash: this.attr(''),
      account_id: this.attr(''),
      wallet_id: this.attr(''),
      to: this.attr(''),
      gasPrice: this.attr(''),
      gasLimit: this.attr(''),
      data: this.attr(''),
      value: this.attr(0),
      serialized: this.attr(''),
      status: this.attr('CREATED'),
      type: this.attr(''),
    };
  }

  get valueInWei() {
    return ethers.utils.parseUnits(this.value.toString(), this.wallet.decimals);
  }

  account() {
    return Account.find(this.account_id);
  }

  wallet() {
    return Wallet.find(this.wallet_id);
  }

  async sign() {
    const { signer } = this.wallet();
    const {
      to, gasPrice, gasLimit, data, valueInWei: value,
    } = this;

    const txRequest = await signer.populateTransaction({
      to, gasPrice, gasLimit, data, value,
    });
    this.serialized = signer.signTransaction(txRequest);
    return this.serialized;
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
