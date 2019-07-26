import RefreshWalletWorker from '@/workers/RefreshWallet';

describe('RefreshWallet worker', () => {
  it('can spawn a refresh wallet worker', async () => {
    const instance = await new RefreshWalletWorker();
    console.log(await instance.refreshWallet());
  });
});
