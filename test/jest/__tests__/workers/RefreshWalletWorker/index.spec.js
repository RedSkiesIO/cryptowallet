import RefreshWalletWorker from '@/workers/RefreshWallet';
import Wallet from '@/store/wallet/entities/wallet';
// import Tx from '@/store/wallet/entities/tx';

describe('RefreshWallet worker', () => {
  it('can spawn a refresh wallet worker', async () => {
    Wallet.$update = jest.fn();
    const instance = await new RefreshWalletWorker();
    const cb = await instance.refreshWallet();
    cb.funcs.updateWallet(1, { newBalance: 5 });
    cb.funcs.updateWallet(1, { addr: '123' });
  });

  it('can update a wallet', async () => {
    Wallet.$update = jest.fn();
    const instance = await new RefreshWalletWorker();
    const cb = await instance.refreshWallet();
    cb.funcs.updateWallet(1, { newBalance: 5 });
    cb.funcs.updateWallet(1, { addr: '123' });
  });

//   it('can get txs', async () => {
//     Tx.query = jest.fn();
//     const instance = await new RefreshWalletWorker();
//     const cb = await instance.refreshWallet();
//     cb.funcs.getTxs(1);
//   });
});
