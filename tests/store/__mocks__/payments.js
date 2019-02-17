const actions = {
  updateSearchContactsQueryString: jest.fn(),
  updateIsSearchingContacts: jest.fn(),
};
const getters = {};
const mutations = {};
const state = {
  balance: 74.15,
  payments: [
    {
      ts: 1539527543100,
      title: 'Sainsbury\'s',
      amount: -4.97,
    },
    {
      ts: 1539527543000,
      title: 'Amazon',
      amount: -10.00,
    },
    {
      ts: 1539144743020,
      title: 'Motion',
      amount: -47.97,
    },
    {
      ts: 1539181943000,
      title: 'Space',
      amount: -27.98,
    },
    {
      ts: 1539866783020,
      title: 'From Tom Jones',
      amount: 8.10,
    },
  ],
  isSearchingContacts: false,
  searchingContactsQueryString: '',
};

const payments = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default payments;
