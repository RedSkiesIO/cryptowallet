import Store from '@/store/settings';

const {
  state,
  actions,
  mutations,
} = Store;
const mockContext = {
  commit: jest.fn(),
};

describe('store setup module', () => {
  describe('actions', () => {
    it('calls context.commit for all actions', () => {
      const actionNames = Object.keys(actions);
      actionNames.forEach((action) => {
        actions[action](mockContext);
      });
    });
  });

  describe('mutations', () => {
    it('set loading', () => {
      mutations.SET_LOADING(state, true);
      expect(state.loading).toBe(true);
    });

    it('set selected account', () => {
      mutations.SET_SELECTED_ACCOUNT(state, true);
      expect(state.selectedAccount).toBe(true);
    });

    it('set authenticated account', () => {
      mutations.SET_AUTHENTICATED_ACCOUNT(state, true);
      expect(state.authenticatedAccount).toBe(true);
    });

    it('set layout', () => {
      mutations.SET_LAYOUT(state, 'light-modal');
      expect(state.layout).toBe('light-modal');
    });

    it('set currency', () => {
      mutations.SET_CURRENCY(state, 'EUR');
      expect(state.selectedCurrency).toBe('EUR');
    });
  });
});
