/**
 * Action to set salt.
 * @param {*} context
 */
export function setSalt(context, salt) {
  context.commit('SET_SALT', salt);
}

/**
 * Action to set pin hash.
 * @param {*} context
 */
export function setPinHash(context, pinHash) {
  return new Promise((resolve) => {
    setTimeout(() => {
      context.commit('SET_PIN_HASH', pinHash.pinHash);
      context.commit('SET_PIN_LENGTH', pinHash.pinLength);
      resolve();
    }, 1000);
  });
}
