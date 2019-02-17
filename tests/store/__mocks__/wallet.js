const actions = {};
const getters = {};
const mutations = {};
const state = {
  contacts: [
    {
      displayName: 'Kipros',
      address: '1CK6KHY6MHgYvmRQ4PAafKYDrg1ejbH1cE',
    },
    {
      displayName: 'James',
    },
    {
      displayName: 'Fio',
      address: '1CK6KHY6MHgYvmRQ4PAafKYDrg1ejbH1cE',
    },
    {
      displayName: 'Marcos',
      address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
    },
    {
      displayName: 'Vahan',
      address: '1CK6KHY6MHgYvmRQ4PAafKYDrg1ejbH1cE',
    },
    {
      displayName: 'Fran',
      address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
    },
    {
      displayName: 'Joanna',
      address: '1CK6KHY6MHgYvmRQ4PAafKYDrg1ejbH1cE',
    },
  ],
  recentContacts: [
    {
      displayName: 'Kipros',
    },
    {
      displayName: 'James',
    },
    {
      displayName: 'Fio',
    },
  ],
};

const wallet = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default wallet;
