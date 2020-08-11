import { Model } from '@vuex-orm/core';
import CryptoWalletJs from 'cryptowallet-js';
// import Wallet from './wallet';
// import Tx from './tx';
import networks from '../../settings/state/supportedNetworks';
import { storeERC20Wallet, storeERC20Coin, storeTx } from '@/helpers/StorageHelpers';

/**
 * Coin Entity.
 */
export default class Coin extends Model {
  static entity = 'coin';

  static fields() {
    return {
      id: this.increment(),
      name: this.attr(''),
      displayName: this.attr(''),
      minConfirmations: this.attr(''),
      sdk: this.attr(''),
      symbol: this.attr(''),
      network: this.attr(''),
      denomination: this.attr(''),
      parentName: this.attr(''),
      parentSdk: this.attr(''),
      contractAddress: this.attr(''),
      decimals: this.attr(''),
      identifier: this.attr(''),
      api: this.attr(''),
      imported: this.attr(false),
      testnet: this.attr(false),
      transak: this.attr(false),
      rampNetwork: this.attr(false),
      show: this.attr(true),
    };
  }

  static findToken(name, contract = false) {
    let coin;
    if (contract) {
      coin = Coin.query()
        .where('name', name)
        .where('contractAddress', contract)
        .get();
    } else {
      coin = Coin.query()
        .where('name', name)
        .get();
    }

    return coin.length > 0 ? coin[0] : null;
  }

  static deleteToken(name, contract = false) {
    let coin;
    if (contract) {
      coin = Coin.query()
        .where('name', name)
        .where('contractAddress', contract)
        .get();
    } else {
      coin = Coin.query()
        .where('name', name)
        .get();
    }

    return coin.length > 0 ? coin[0] : null;
  }

  static async fetchAllTokens(address, account, network) {
    const SDK = new CryptoWalletJs();
    const coinSDK = SDK.SDKFactory.createSDK('Ethereum', networks[network]);
    const ERC20SDK = SDK.SDKFactory.createSDK('ERC20', networks[network]);
    const txs = await coinSDK.getERC20History(
      address,
    );

    if (txs && txs.length > 0) {
      const erc20Tokens = [];

      const tokens = txs.reduce((r, a) => {
        r[a.contractAddress] = r[a.contractAddress] || [];
        r[a.contractAddress].push(a);
        return r;
      }, Object.create(null));

      const tokenObj = async (contract) => {
        const {
          tokenName,
          tokenSymbol,
          tokenDecimal,
        } = tokens[contract][0];

        const transactions = tokens[contract];

        // const balance = await ERC20SDK.getBalance({
        //   contract,
        //   address,
        //   decimals: tokenDecimal,
        // });

        const data = {
          name: tokenName,
          displayName: tokenName,
          sdk: 'ERC20',
          symbol: tokenSymbol,
          network,
          denomination: '0.00000000',
          parentSdk: 'Ethereum',
          parentName: 'Ethereum',
          contractAddress: contract,
          decimals: tokenDecimal,
          minConfirmations: 1,
          imported: true,
          api: networks[network],
        };

        await storeERC20Coin(data);

        data.account_id = account;
        data.imported = false;
        data.enabled = false;
        data.parentName = 'Ethereum';
        // data.confirmedBalance = balance;
        data.externalAddress = address;
        data.erc20Wallet = {
          decimals: tokenDecimal,
          address,
          network,
          name: tokenName,
          symbol: tokenSymbol,
          contract,
        };

        const wallet = await storeERC20Wallet(data, ERC20SDK);

        if (wallet.storeTxs) {
          const txPromises = [];
          transactions.forEach((tx) => {
            tx.account_id = account;
            tx.wallet_id = wallet;
            txPromises.push(storeTx(tx));
          });

          await Promise.all(txPromises);
        }

        // tokens[contract] = {
        //   id: contract,
        //   name: tokens[contract][0].tokenName,
        //   sdk: 'ERC20',
        //   symbol: tokens[contract][0].tokenSymbol,
        //   account_id: account,
        //   balance,
        //   enabled: balance > 0,
        //   txs: tokens[contract],
        //   erc20Wallet: {
        //     decimals: tokens[contract][0].tokenDecimal,
        //     address,
        //     network,
        //     name: tokens[contract][0].tokenName,
        //     symbol: tokens[contract][0].tokenSymbol,
        //     contract,
        //   },
        // };
        erc20Tokens.push(data);
      };
      const promises = [];
      Object.keys(tokens).forEach(async (contract) => {
        promises.push(tokenObj(contract));
      });
      await Promise.all(promises);
      // await Coin.insert({ data: erc20Tokens });

      return erc20Tokens;
    }

    return null;
  }
}
