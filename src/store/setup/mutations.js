/**
 * State mutation for salt.
 * @param state
 * @param salt
 * @constructor
 */
export function SET_SALT(state, salt) {
  state.salt = salt;
}

/**
 * State mutation for pin hash.
 * @param state
 * @param pinHash
 * @constructor
 */
export function SET_PIN_HASH(state, pinHash) {
  state.pinHash = pinHash;
}

/**
 * State mutation for seed.
 * @param state
 * @param seed
 * @constructor
 */
export function SET_SEED(state, seed) {
  state.pinHash = seed;
}
