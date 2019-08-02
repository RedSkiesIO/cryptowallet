/* eslint-disable no-magic-numbers */
import RefreshWalletWorker from '@/workers/RefreshWallet';
import Wallet from '@/store/wallet/entities/wallet';
import Tx from '@/store/wallet/entities/tx';
import Utxo from '@/store/wallet/entities/utxo';
import Address from '@/store/wallet/entities/address';

describe('RefreshWallet worker', () => {
  it('can spawn a refresh wallet worker', async () => {
    const instance = await new RefreshWalletWorker();
    const cb = await instance.refreshWallet();
    expect(Object.keys(cb.funcs).length).toBe(9);
  });

  it('can update a wallet', async () => {
    Wallet.$update = jest.fn().mockImplementation((obj) => {
      obj.where({ id: '123' });
    });
    const instance = await new RefreshWalletWorker();
    const cb = await instance.refreshWallet();
    cb.funcs.updateWallet(1, { newBalance: 5 });
    expect(Wallet.$update.mock.calls[0][0].data.confirmedBalance).toBe(5);
    cb.funcs.updateWallet(1, { addr: { address: '123', index: 1 } });
    expect(Wallet.$update.mock.calls[1][0].data.externalAddress).toBe('123');
  });

  it('can get txs', async () => {
    Tx.query = jest.fn().mockImplementation(() => {
      return {
        where: jest.fn().mockReturnValue({ get: jest.fn().mockReturnValue([{ hash: '123' }]) }),
      };
    });
    const instance = await new RefreshWalletWorker();
    const cb = await instance.refreshWallet();
    expect(cb.funcs.getTxs(1)).toEqual(['123']);
  });

  it('can insert txs', async () => {
    Tx.$insert = jest.fn();
    const instance = await new RefreshWalletWorker();
    const cb = await instance.refreshWallet();
    cb.funcs.insertTxs({ hash: '123' });
    expect(Tx.$insert).toHaveBeenCalled();
  });

  it('can update txs', async () => {
    Tx.$update = jest.fn().mockImplementation((obj) => {
      obj.where({ id: '123' });
    });
    const instance = await new RefreshWalletWorker();
    const cb = await instance.refreshWallet();
    cb.funcs.updateTxs([{ hash: '123' }]);
    expect(Tx.$update.mock.calls[0][0].data).toEqual({ hash: '123' });
  });

  it('can delete a utxo', async () => {
    Utxo.query = jest.fn().mockImplementation(() => {
      return {
        where: jest.fn().mockReturnValue({ get: jest.fn().mockReturnValue([{ id: '123' }]) }),
      };
    });
    Utxo.$delete = jest.fn();
    const instance = await new RefreshWalletWorker();
    const cb = await instance.refreshWallet();
    cb.funcs.deleteUtxo('123');
    expect(Utxo.$delete).toHaveBeenCalled();
  });

  it('can insert utxos', async () => {
    Utxo.$insert = jest.fn();
    const instance = await new RefreshWalletWorker();
    const cb = await instance.refreshWallet();
    cb.funcs.insertUtxos([{ hash: '123' }]);
    expect(Utxo.$insert).toHaveBeenCalledWith({ data: [{ hash: '123' }] });
  });

  it('can get utxos', async () => {
    Utxo.query = jest.fn().mockImplementation(() => {
      return {
        where: jest.fn().mockReturnValue({ get: jest.fn().mockReturnValue([{ txid: '123' }]) }),
      };
    });
    const instance = await new RefreshWalletWorker();
    const cb = await instance.refreshWallet();
    expect(cb.funcs.getUtxos(1)).toEqual(['123']);
  });

  it('can insert an address', async () => {
    Address.$insert = jest.fn();
    const instance = await new RefreshWalletWorker();
    const cb = await instance.refreshWallet();
    cb.funcs.insertAddress('123');
    expect(Address.$insert).toHaveBeenCalledWith({ data: '123' });
  });

  it('can get an address', async () => {
    Address.query = jest.fn().mockImplementation(() => {
      return {
        where: jest.fn().mockReturnValue({ get: jest.fn().mockReturnValue([{ address: '123' }]) }),
      };
    });
    const instance = await new RefreshWalletWorker();
    const cb = await instance.refreshWallet();
    expect(cb.funcs.getAddresses('123')).toEqual(['123']);
  });
});
