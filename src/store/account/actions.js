/**
 * Action to set salt.
 * @param {*} context
 */
export function setSalt(context, salt) {
  context.commit('SET_SALT', salt);
}

/**
 * Action to set pin.
 * @param {*} context
 */
export function setPin(context, pin) {
  context.commit('SET_PIN', pin);
}
