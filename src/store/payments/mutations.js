export function updateIsSearchingContacts(state, payload) {
  state.isSearchingContacts = payload.value;
}

export function updateSearchContactsQueryString(state, payload) {
  state.searchingContactsQueryString = payload.value;
}
