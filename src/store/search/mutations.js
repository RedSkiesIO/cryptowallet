/**
 * @param  {Object} state Current Vuex state object
 * @param  {Object} payload Should be {value: true} or {value: false}
 */
export function updateIsSearchingContacts(state, payload) {
  state.isSearchingContacts = payload.value;
}

/**
 * @param  {Object} state Current Vuex state object
 * @param  {Object} payload Should be {value: String}
 */
export function updateSearchContactsQueryString(state, payload) {
  state.searchingContactsQueryString = payload.value;
}
