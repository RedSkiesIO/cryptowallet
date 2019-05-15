/*
 * SET STATE sendCoin modal opened
 */
export function SET_SENDCOIN_MODAL_OPENED(state, payload) {
  state.sendCoinModalOpened = payload;
}

/*
 * SET STATE sendConfirm modal opened
 */
export function SET_SENDCONFIRM_MODAL_OPENED(state, payload) {
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
  state.termsModalOpened = payload;
}

export function SET_RECEIVECOIN_MODAL_OPENED(state, payload) {
  state.receiveCoinModalOpened = payload;
}

export function SET_ADDWALLET_MODAL_OPENED(state, payload) {
  state.addWalletModalOpened = payload;
}
