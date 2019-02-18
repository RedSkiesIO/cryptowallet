export function updateIsSearchingContacts({ commit }, payload) {
  commit({
    ...payload,
    type: 'updateIsSearchingContacts',
  });
}

export function updateSearchContactsQueryString({ commit }, payload) {
  commit({
    ...payload,
    type: 'updateSearchContactsQueryString',
  });
}
