import Account from '@/store/wallet/entities/account';

/**
 * Use this config to specify which:
 * - VuexORM models should be included in the encryption/decryption,
 * - which properties of those object should be encrypted
 *
 * @type {Array<Object>}
 */
const toEncryptConfig = [
  {
    model: Account,
    properties: ['salt', 'pinHash'],
  },
];

export default toEncryptConfig;
