/**
 * return the store salt
 * @param {*} state
 */
export function getSalty(state) {
  return state.salt;
}

/**
 * return the hashed pin
 * @param {*} state
 */
export function getPin(state) {
  return state.pin;
}
