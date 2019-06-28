import Store from '@/store/modals';

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
    it('set send coin modal', () => {
      mutations.SET_SENDCOIN_MODAL_OPENED(state, true);
      expect(state.sendCoinModalOpened).toBe(true);
    });

    it('set send confirm  modal', () => {
      mutations.SET_SENDCONFIRM_MODAL_OPENED(state, true);
      expect(state.sendConfirmModalOpened).toBe(true);
    });

    it('set confirm transaction data', () => {
      mutations.SET_CONFIRM_TRANSACITON_DATA(state, { txid: '123' });
      expect(state.sendConfirmTxData).toEqual({ txid: '123' });
    });

    it('set send failure modal', () => {
      mutations.SET_SENDFAILURE_MODAL_OPENED(state, true);
      expect(state.sendFailureModalOpened).toBe(true);
    });

    it('set send success modal', () => {
      mutations.SET_SENDSUCCESS_MODAL_OPENED(state, true);
      expect(state.sendSuccessModalOpened).toBe(true);
    });

    it('set add erc20 modal', () => {
      mutations.SET_ADDERC20_MODAL_OPENED(state, true);
      expect(state.addErc20ModalOpened).toBe(true);
    });

    it('set price chart modal', () => {
      mutations.SET_PRICECHART_MODAL_OPENED(state, true);
      expect(state.priceChartModalOpened).toBe(true);
    });

    it('set select account modal', () => {
      mutations.SET_SELECTACCOUNT_MODAL_OPENED(state, true);
      expect(state.selectAccountModalOpened).toBe(true);
    });

    it('set new account modal', () => {
      mutations.SET_NEWACCOUNT_MODAL_OPENED(state, true);
      expect(state.newAccountModalOpened).toBe(true);
    });

    it('set terms modal', () => {
      mutations.SET_TERMS_MODAL_OPENED(state, true);
      expect(state.termsModalOpened).toBe(true);
    });

    it('set receive coin modal', () => {
      mutations.SET_RECEIVECOIN_MODAL_OPENED(state, true);
      expect(state.receiveCoinModalOpened).toBe(true);
    });

    it('set add wallet modal', () => {
      mutations.SET_ADDWALLET_MODAL_OPENED(state, true);
      expect(state.addWalletModalOpened).toBe(true);
    });

    it('set select currency modal', () => {
      mutations.SET_SELECTCURRENCY_MODAL_OPENED(state, true);
      expect(state.selectCurrencyModalOpened).toBe(true);
    });

    it('set new select language modal', () => {
      mutations.SET_SELECTLANGUAGE_MODAL_OPENED(state, true);
      expect(state.selectLanguageModalOpened).toBe(true);
    });

    it('set delete account modal', () => {
      mutations.SET_DELETEACCOUNT_MODAL_OPENED(state, true);
      expect(state.deleteAccountModalOpened).toBe(true);
    });

    it('set new pin coin modal', () => {
      mutations.SET_NEWPIN_MODAL_OPENED(state, true);
      expect(state.newPinModalOpened).toBe(true);
    });
  });
});
