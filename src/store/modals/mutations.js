function changeStatusBarColour(payload) {
  if (payload === true && window.cordova) {
    StatusBar.styleDefault();
    if (cordova.platformId === 'android') {
      StatusBar.backgroundColorByHexString('#f5f5f5');
      NavigationBar.backgroundColorByHexString('#f5f5f5', true);
    }
  } else if (payload === false && window.cordova) {
    StatusBar.styleLightContent();
    if (cordova.platformId === 'android') {
      StatusBar.backgroundColorByHexString('#dd3dff');
      NavigationBar.backgroundColorByHexString('#dd3dff');
    }
  }
}

/*
 * SET STATE sendCoin modal opened
 */
export function SET_SENDCOIN_MODAL_OPENED(state, payload) {
  changeStatusBarColour(payload);
  state.sendCoinModalOpened = payload;
}

/*
 * SET STATE sendConfirm modal opened
 */
export function SET_SENDCONFIRM_MODAL_OPENED(state, payload) {
  changeStatusBarColour(payload);
  state.sendConfirmModalOpened = payload;
}

/*
 * SET STATE confirm transaction data
 */
export function SET_CONFIRM_TRANSACITON_DATA(state, payload) {
  state.sendConfirmTxData = payload;
}

/*
 * SET STATE sendFailure modal opened
 */
export function SET_SENDFAILURE_MODAL_OPENED(state, payload) {
  state.sendFailureModalOpened = payload;
}

/*
 * Set STATE sendSuccess modal opened
 */
export function SET_SENDSUCCESS_MODAL_OPENED(state, payload) {
  state.sendSuccessModalOpened = payload;
}

/*
 * Set STATE addErc20 modal opened
 */
export function SET_ADDERC20_MODAL_OPENED(state, payload) {
  changeStatusBarColour(payload);
  state.addErc20ModalOpened = payload;
}

export function SET_PRICECHART_MODAL_OPENED(state, payload) {
  state.priceChartModalOpened = payload;
}

export function SET_SELECTACCOUNT_MODAL_OPENED(state, payload) {
  state.selectAccountModalOpened = payload;
}

export function SET_NEWACCOUNT_MODAL_OPENED(state, payload) {
  state.newAccountModalOpened = payload;
}

export function SET_TERMS_MODAL_OPENED(state, payload) {
  changeStatusBarColour(payload);
  state.termsModalOpened = payload;
}

export function SET_RECEIVECOIN_MODAL_OPENED(state, payload) {
  changeStatusBarColour(payload);
  state.receiveCoinModalOpened = payload;
}

export function SET_ADDWALLET_MODAL_OPENED(state, payload) {
  state.addWalletModalOpened = payload;
}

export function SET_SELECTCURRENCY_MODAL_OPENED(state, payload) {
  state.selectCurrencyModalOpened = payload;
}

export function SET_SELECTLANGUAGE_MODAL_OPENED(state, payload) {
  state.selectLanguageModalOpened = payload;
}

export function SET_DELETEACCOUNT_MODAL_OPENED(state, payload) {
  state.deleteAccountModalOpened = payload;
}

export function SET_NEWPIN_MODAL_OPENED(state, payload) {
  state.newPinModalOpened = payload;
}

export function SET_NEW_TX_DATA(state, payload) {
  state.newTxData = payload;
}

export function SET_ADD_FUNDS_MODAL_OPENED(state, payload) {
  changeStatusBarColour(payload);
  state.addFundsModalOpened = payload;
}

export function SET_UPDATE_EMAIL_MODAL_OPENED(state, payload) {
  state.updateEmailModalOpened = payload;
}
