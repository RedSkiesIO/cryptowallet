// // import { mount } from '@vue/test-utils';
// // import Complete from '@/pages/Setup/Steps/Complete';
// import { localVue } from '@/helpers/SetupLocalVue';
// import Vuex from 'vuex';
// import { Quasar, uid } from 'quasar';
// import Account from '@/store/wallet/entities/account';
// // import Wallet from '@/store/wallet/entities/wallet';

// describe('Complete.vue', () => {
//   // let store;
//   let getters;
//   let actions;
//   // let wrapper;

//   localVue.use(Quasar, { components: { uid } });
//   localVue.use(Account);

//   beforeEach(() => {
//     const mockGet = [
//       {
//         name: 'Stephen',
//       },
//     ];
//     const mockAccounts = {
//       get: () => { return mockGet; },
//     };
//     getters = {
//       'entities/account/query': () => { return () => { return mockAccounts; }; },
//     };
//     actions = {
//       'settings/setLoading': jest.fn(),
//       'settings/setSelectedAccount': jest.fn(),
//     };
//     store = new Vuex.Store({
//       state: {
//         settings: {
//           delay: 500,
//         },
//       },
//       actions,
//       getters,
//     });
//     // wrapper = mount(Complete, {
//     // i18n, localVue, store,
//     // });
//   });
// });
