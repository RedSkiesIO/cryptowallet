/**
 * Action to set salt.
 * @param {*} context
 */
export function setSalt(context, salt) {
  context.commit('SET_SALT', salt);
}
