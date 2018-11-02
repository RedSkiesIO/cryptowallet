import jest from 'jest-mock';

const actions = {
  updateSearchContactsQueryString: jest.fn(),
  updateIsSearchingContacts: jest.fn(),
};
const getters = {};
const mutations = {};
const state = {
  isSearchingContacts: false,
  searchingContactsQueryString: '',
};

const search = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default search;
