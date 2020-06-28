import TorusSdk from '@toruslabs/torus-direct-web-sdk';
import bip39 from 'bip39';


const auth = {
  async login() {
    try {
      const torusdirectsdk = new TorusSdk({
        baseUrl: `${window.location.origin}/statics/serviceworker`,
        enableLogging: true,
        proxyContractAddress: '0x4023d2a0D330bF11426B12C6144Cfb96B7fa6183', // details for test net
        network: 'ropsten', // details for test net
      });
      await torusdirectsdk.init({ skipSw: false });

      const loginDetails = await torusdirectsdk.triggerLogin({
        typeOfLogin: 'jwt',
        verifier: 'atlascity-auth0-sms-passwordless',
        clientId: 'sinmK0yyTRWpruIA2YfVSDUQ2vARX4CA',
        jwtParams: {
          connection: '',
          domain: 'https://atlascity.eu.auth0.com',
          verifierIdField: 'name',
          login_hint: '+447843812196',
        },
      });

      return loginDetails;
    } catch (error) {
      console.error(error, 'caught');
      return false;
    }
  },

  getMnemonic(entropy) {
    return bip39.entropyToMnemonic(entropy);
  },
};
export default auth;
