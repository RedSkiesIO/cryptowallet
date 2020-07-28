import { Model } from '@vuex-orm/core';
import CryptoWalletJs from 'cryptowallet-js';
import networks from '../../settings/state/supportedNetworks';


/**
 * Coin Entity.
 */
export default class Token extends Model {
  static entity = 'token';

  static fields() {
    return {
      name: this.attr(''),
      id: this.attr(''),
      symbol: this.attr(''),
      account_id: this.attr(''),
      balance: this.attr(0),
      parentName: this.attr('Ethereum'),
      parentSdk: this.attr('Ethereum'),
      enabled: this.attr(true),
      erc20Wallet: this.attr(''),
      txs: this.attr(''),
    };
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
        const balance = await ERC20SDK.getBalance({
          contract,
          address,
          decimals: tokens[contract][0].tokenDecimal,
        });

        tokens[contract] = {
          id: contract,
          name: tokens[contract][0].tokenName,
          symbol: tokens[contract][0].tokenSymbol,
          account_id: account,
          balance,
          enabled: balance > 0,
          txs: tokens[contract],
          erc20Wallet: {
            decimals: tokens[contract][0].tokenDecimal,
            address,
            network,
            name: tokens[contract][0].tokenName,
            symbol: tokens[contract][0].tokenSymbol,
            contract,
          },
        };
        erc20Tokens.push(tokens[contract]);
      };
      const promises = [];
      Object.keys(tokens).forEach(async (contract) => {
        promises.push(tokenObj(contract));
      });
      await Promise.all(promises);
      await Token.create({ data: erc20Tokens });

      return erc20Tokens;
    }

    return null;
  }
}
