/**
 * @TODO Konrad please document
 * @param state
 * @param payload
 */
export function updateIsSearchingContacts(state, payload) {
  state.isSearchingContacts = payload.value;
}

/**
 * @TODO Konrad please document
 * @param state
 * @param payload
 */
export function updateSearchContactsQueryString(state, payload) {
  state.searchingContactsQueryString = payload.value;
}
