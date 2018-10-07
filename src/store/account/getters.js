/**
 * return the store salt.
 * @param {*} state
 */
export function getSalty(state) {
  return state.salt;
}

/**
 * return the hashed pin hash.
 * @param {*} state
 */
export function getPinHash(state) {
  return state.pinHash;
}

/**
 * return the unhashed pin length.
 * @param {*} state
 */
export function getPinLength(state) {
  return state.pinLength;
}

/**
 * return the minimum pin length.
 * @param {*} state
 */
export function getMinLength(state) {
  return state.minLength;
}
