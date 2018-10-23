/**
 * Action to set salt.
 * @param {*} context
 */
export function setSalt(context, salt) {
  return new Promise((resolve) => {
    setTimeout(() => {
      context.commit('SET_SALT', salt);
      resolve();
    }, 1000);
  });
}

/**
 * Action to set seed.
 * @param {*} context
 */
export function setSeed(context, seed) {
  return new Promise((resolve) => {
    setTimeout(() => {
      context.commit('SET_SEED', seed);
      resolve();
    }, 1000);
  });
}

/**
 * Action to set pin hash.
 * @param {*} context
 */
export function setPinHash(context, pinHash) {
  return new Promise((resolve) => {
    setTimeout(() => {
      context.commit('SET_PIN_HASH', pinHash.pinHash);
      resolve();
    }, 1000);
  });
}
