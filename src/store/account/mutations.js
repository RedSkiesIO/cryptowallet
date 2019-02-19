/**
 * State mutation for salt.
 * @param {*} state
 * @param {*} salt
 */
export function SET_SALT(state, salt) {
  state.salt = salt;
}

/**
 * State mutation for pin hash.
 * @param {*} state
 * @param {*} pinHash
 */
export function SET_PIN_HASH(state, pinHash) {
  state.pinHash = pinHash;
}

/**
 * State mutation for pin length.
 * @param {*} state
 * @param {*} pinLength
 */
export function SET_PIN_LENGTH(state, pinLength) {
  state.pinLength = pinLength;
}
