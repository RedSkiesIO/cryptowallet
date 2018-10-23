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
 * return the seed.
 * @param {*} state
 */
export function getSeed(state) {
  return state.seed;
}
