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
