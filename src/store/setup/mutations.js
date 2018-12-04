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
 * State mutation for pin hash.
 * @param state
 * @param pinHashConfirm
 * @constructor
 */
export function SET_PIN_HASH_CONFIRM(state, pinHashConfirm) {
  state.pinHashConfirm = pinHashConfirm;
}

/**
 * State mutation for seed.
 * @param state
 * @param seed
 * @constructor
 */
export function SET_SEED(state, seed) {
  state.seed = {};
  for (let i = 0; i < seed.length; i += 1) {
    state.seed[seed[i].substring(0, 4)] = seed[i];
  }
}

/**
 * SET STATE for seet counter
 */
export function SET_SPV_MODE(state, payload) {
  state.spvMode = payload;
}

/**
 * SET ACCOUNT NAME
 */
export function SET_ACCOUNT_NAME(state, payload) {
  state.accountName = payload;
}

/**
 * SET ACCOUNT LOCALE
 */
export function SET_ACCOUNT_LOCALE(state, payload) {
  state.accountLocale = payload;
}

/**
 * SET ACCOUNT IP NODE
 */
export function SET_ACCOUNT_IP_NODE(state, payload) {
  state.accountIpNode = payload;
}

