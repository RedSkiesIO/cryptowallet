import TorusSdk from '@toruslabs/torus-direct-web-sdk';

async function login() {
  try {
    // AUTH0_DOMAIN: "torus-test.auth0.com"
    // AUTH0_CLIENT_ID: "sqKRBVSdwa4WLkaq419U7Bamlh5vK1H7"
    // GOOGLE_CLIENT_ID: "876733105116-i0hj3s53qiio5k95prpfmj0hp0gmgtor.apps.googleusercontent.com",
    // FACEBOOK_CLIENT_ID: "2554219104599979",
    // AUTH0
    const torusdirectsdk = new TorusSdk({
      baseUrl: 'http://localhost:3000/serviceworker',
      enableLogging: true,
      proxyContractAddress: '0x4023d2a0D330bF11426B12C6144Cfb96B7fa6183', // details for test net
      network: 'ropsten', // details for test net
    });
    await torusdirectsdk.init();

    const loginDetails = await torusdirectsdk.triggerLogin({
      typeOfLogin: this.selectedVerifier,
      verifier: 'torus-auth0',
      clientId: 'P7PJuBCXIHP41lcyty0NEb7Lgf7Zme8Q',
      jwtParams: {
        domain: 'https://torus-test.auth0.com',
        connection: 'email',
        login_hint: 'chai@tor.us',
      },
    });

    return loginDetails;
  } catch (error) {
    console.error(error, 'caught');
    return false;
  }
}
export default login;
