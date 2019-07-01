import Store from '@/store/setup';

const {
  state, actions, mutations, getters,
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
    it('set salt', () => {
      mutations.SET_SALT(state, 'salt');
      expect(state.salt).toBe('salt');
    });

    it('set pin hash', () => {
      mutations.SET_PIN_HASH(state, 'PINHASH');
      expect(state.pinHash).toBe('PINHASH');
    });

    it('set pin hash confirm', () => {
      mutations.SET_PIN_HASH_CONFIRM(state, true);
      expect(state.pinHashConfirm).toBe(true);
    });

    it('set seed', () => {
      const mockSeed = 'real debate another phone response toddler fee offer bundle crack monster earth';
      mutations.SET_SEED(state, mockSeed.split(' '));
      expect(state.seed).toEqual({
        another: 'another', bundle: 'bundle', crack: 'crack', debate: 'debate', earth: 'earth', fee: 'fee', monster: 'monster', offer: 'offer', phone: 'phone', real: 'real', response: 'response', toddler: 'toddler',
      });
    });

    it('set spv mode', () => {
      mutations.SET_SPV_MODE(state, true);
      expect(state.spvMode).toBe(true);
    });

    it('set account name', () => {
      mutations.SET_ACCOUNT_NAME(state, 'Stephen');
      expect(state.accountName).toBe('Stephen');
    });

    it('set account currency', () => {
      mutations.SET_ACCOUNT_CURRENCY(state, 'USD');
      expect(state.accountCurrency).toBe('USD');
    });

    it('set account type', () => {
      mutations.SET_ACCOUNT_TYPE(state, 'restored');
      expect(state.accountType).toBe('restored');
    });

    it('set account locale', () => {
      mutations.SET_ACCOUNT_LOCALE(state, 'en-gb');
      expect(state.accountLocale).toBe('en-gb');
    });

    it('set account ip node', () => {
      mutations.SET_ACCOUNT_IP_NODE(state, '192.168.0.0.1');
      expect(state.accountIpNode).toBe('192.168.0.0.1');
    });

    it('set account created', () => {
      mutations.SET_ACCOUNT_CREATED(state);
      expect(state.accountCreated).toBe(true);
    });

    it('set pin', () => {
      state.pinArray = undefined;
      const mockPin = { value: 0 };
      mutations.SET_PIN(state, mockPin);
      mutations.SET_PIN(state, mockPin);
      expect(state.pinArray).toEqual([0, 0]);
    });

    it('set pin confirm', () => {
      state.pinConfirmArray = undefined;
      const mockPin = { value: 0 };
      mutations.SET_PIN_CONFIRM(state, mockPin);
      mutations.SET_PIN_CONFIRM(state, mockPin);
      expect(state.pinArray).toEqual([0, 0]);
    });

    it('set reset pin', () => {
      mutations.RESET_PIN(state);
      expect(state.pinArray).toEqual([]);
    });

    it('set reset pin confirm', () => {
      mutations.RESET_PIN_CONFIRM(state);
      expect(state.pinConfirmArray).toEqual([]);
    });

    it('set clear setup data', () => {
      mutations.CLEAR_SETUP_DATA(state);
      expect(state.pinArray).toEqual(null);
      expect(state.accountIpNode).toEqual(null);
      expect(state.accountLocale).toEqual(null);
      expect(state.accountName).toEqual(null);
      expect(state.accountType).toEqual(null);
      expect(state.pinConfirmArray).toEqual(null);
      expect(state.salt).toEqual(null);
      expect(state.seed).toEqual(null);
      expect(state.spvMode).toEqual(null);
    });

    it('set get started modal', () => {
      mutations.SET_GETSTARTED_MODAL_OPENED(state, true);
      expect(state.getStartedModalOpened).toEqual(true);
    });
  });

  describe('getters', () => {
    it('get salt', () => {
      state.salt = 'salt';
      const response = getters.getSalty(state)();
      expect(response).toBe('salt');
    });

    it('get pin hash', () => {
      state.pinHash = 'pinHash';
      const response = getters.getPinHash(state)();
      expect(response).toBe('pinHash');
    });

    it('get seed', () => {
      state.seed = 'seed';
      const response = getters.getSeed(state)();
      expect(response).toBe('seed');
    });

    it('get shuffled seed', () => {
      state.seed = {
        another: 'another', bundle: 'bundle', crack: 'crack', debate: 'debate', earth: 'earth', fee: 'fee', monster: 'monster', offer: 'offer', phone: 'phone', real: 'real', response: 'response', toddler: 'toddler',
      };
      const response = getters.getShuffledSeed(state)();
      expect(Array.isArray(response)).toBe(true);
    });

    it('get spv mode', () => {
      state.spvMode = true;
      const response = getters.getSPVmode(state)();
      expect(response).toBe(true);
    });
  });
});
