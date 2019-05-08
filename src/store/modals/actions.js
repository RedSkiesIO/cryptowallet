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
/**
 * Action setAddErc20ModalOpened
 */
export function setAddErc20ModalOpened(context, payload) {
  context.commit('SET_ADDERC20_MODAL_OPENED', payload);
}
/**
 * Action setPriceChartModalOpened
 */
export function setPriceChartModalOpened(context, payload) {
  context.commit('SET_PRICECHART_MODAL_OPENED', payload);
}

export function setSelectAccountModalOpened(context, payload) {
  context.commit('SET_SELECTACCOUNT_MODAL_OPENED', payload);
}

export function setNewAccountModalOpened(context, payload) {
  context.commit('SET_NEWACCOUNT_MODAL_OPENED', payload);
}

export function setTermsModalOpened(context, payload) {
  context.commit('SET_TERMS_MODAL_OPENED', payload);
}

export function setReceiveCoinModalOpened(context, payload) {
  context.commit('SET_RECEIVECOIN_MODAL_OPENED', payload);
}
