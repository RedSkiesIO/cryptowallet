import TorusSdk from '@toruslabs/torus-direct-web-sdk';

async function login() {
  try {
    // AUTH0_DOMAIN: "torus-test.auth0.com"
    // AUTH0_CLIENT_ID: "sqKRBVSdwa4WLkaq419U7Bamlh5vK1H7"
    // GOOGLE_CLIENT_ID: "876733105116-i0hj3s53qiio5k95prpfmj0hp0gmgtor.apps.googleusercontent.com",
    // FACEBOOK_CLIENT_ID: "2554219104599979",
    // AUTH0

    const torusdirectsdk = new TorusSdk({
      baseUrl: `${window.location.origin}/statics/serviceworker`,
      enableLogging: true,
      proxyContractAddress: '0x4023d2a0D330bF11426B12C6144Cfb96B7fa6183', // details for test net
      network: 'ropsten', // details for test net
    });
    await torusdirectsdk.init({ skipSw: false });

    // const loginDetails = await torusdirectsdk.triggerLogin({
    //   typeOfLogin: 'passwordless',
    //   verifier: 'auth0-atlascity',
    //   clientId: 'LgplOAge5k3n17shHwn7ehfzEoiQQHhm',
    //   jwtParams: {
    //     connection: 'sms',
    //     domain: 'https://atlascity.eu.auth0.com',
    //     login_hint: '+447843812196',
    //   },
    // });

    // return loginDetails;
    return true;
  } catch (error) {
    console.error(error, 'caught');
    return false;
  }
}
export default login;
