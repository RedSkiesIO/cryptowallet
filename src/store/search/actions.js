/**
 * @param  {Function} commit
 * @param  {Object} payload Should be {value: true} or {value: false}
 */
export function updateIsSearchingContacts({ commit }, payload) {
  commit({
    ...payload,
    type: 'updateIsSearchingContacts',
  });
}

/**
 * @param  {Function} commit
 * @param  {Object} payload Should be {value: String}
 */
export function updateSearchContactsQueryString({ commit }, payload) {
  commit({
    ...payload,
    type: 'updateSearchContactsQueryString',
  });
}
