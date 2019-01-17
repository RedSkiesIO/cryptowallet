/**
 * Action to set salt.
 * @param {*} context
 */
export function setSalt(context, salt) {
  context.commit('SET_SALT', salt);
}

/**
 * Action to set seed.
 * @param {*} context
 */
export function setSeed(context, seed) {
  context.commit('SET_SEED', seed);
}

/**
 * Action to set pin hash.
 * @param {*} context
 * @param pinHash String
 */
export function setPinHash(context, pinHash) {
  context.commit('SET_PIN_HASH', pinHash);
}

/**
 * Action to set pin hash confirmation.
 * @param {*} context
 * @param pinHashConfirm String
 */
export function setPinHashConfirm(context, pinHashConfirm) {
  context.commit('SET_PIN_HASH_CONFIRM', pinHashConfirm);
}

/*
* Action setSeedCounter.
*/
export function setSeedCounter(context, payload) {
  context.commit('SET_SEED_COUNTER', payload);
}

/*
* Action setSPVmode
*/
export function setSPVmode(context, payload) {
  context.commit('SET_SPV_MODE', payload);
}

/*
 * Action setAccountName
 */
export function setAccountName(context, payload) {
  context.commit('SET_ACCOUNT_NAME', payload);
}

/*
 * Action setAccountType
 */
export function setAccountType(context, payload) {
  context.commit('SET_ACCOUNT_TYPE', payload);
}

/**
 * Action setAccountLanguage
 */

export function setAccountLocale(context, payload) {
  context.commit('SET_ACCOUNT_LOCALE', payload);
}

/**
 * Action setAccountIpNode
 */

export function setAccountIpNode(context, payload) {
  context.commit('SET_ACCOUNT_IP_NODE', payload);
}

/**
 * Action setPin
 */
export function setPin(context, payload) {
  context.commit('SET_PIN', payload);
}

/**
 * Action setPinConfirm
 */
export function setPinConfirm(context, payload) {
  context.commit('SET_PIN_CONFIRM', payload);
}

/**
 * Action resetPin
 */
export function resetPin(context) {
  context.commit('RESET_PIN');
}

/**
 * Action resetPinConfirm
 */
export function resetPinConfirm(context) {
  context.commit('RESET_PIN_CONFIRM');
}
