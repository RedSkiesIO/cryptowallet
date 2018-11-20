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
 * @param pinHash String
 */
export function setPinHash(context, pinHash) {
  return new Promise((resolve) => {
    setTimeout(() => {
      context.commit('SET_PIN_HASH', pinHash);
      resolve();
    }, 1000);
  });
}

/**
 * Action to set pin hash confirmation.
 * @param {*} context
 * @param pinHashConfirm String
 */
export function setPinHashConfirm(context, pinHashConfirm) {
  return new Promise((resolve) => {
    setTimeout(() => {
      context.commit('SET_PIN_HASH_CONFIRM', pinHashConfirm);
      resolve();
    }, 1000);
  });
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
