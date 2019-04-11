/**
 * Action setSendCoinModalOpened
 */
export function setSendCoinModalOpened(context, payload) {
  context.commit('SET_SENDCOIN_MODAL_OPENED', payload);
}

/**
 * Action setConfirmSendModalOpened
 */
export function setConfirmSendModalOpened(context, payload) {
  context.commit('SET_SENDCONFIRM_MODAL_OPENED', payload);
}

/**
 * Action setConfirmTransactionData
 */
export function setConfirmTransactionData(context, payload) {
  context.commit('SET_CONFIRM_TRANSACITON_DATA', payload);
}

/**
 * Action setSendFailureModalOpened
 */
export function setSendFailureModalOpened(context, payload) {
  context.commit('SET_SENDFAILURE_MODAL_OPENED', payload);
}

/**
 * Action setSendSuccessModalOpened
 */
export function setSendSuccessModalOpened(context, payload) {
  context.commit('SET_SENDSUCCESS_MODAL_OPENED', payload);
}
