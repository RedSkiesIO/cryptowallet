/* eslint-disable no-magic-numbers */
import Store from '@/store/qrcode';

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
    it('scan qr code', () => {
      mutations.SCAN_QR_CODE(state);
      expect(state.scanning).toBe(true);
    });

    it('cancel scanning', () => {
      mutations.CANCEL_SCANNING(state);
      expect(state.scanning).toBe(false);
    });

    it('set scanned address', () => {
      mutations.SET_SCANNED_ADDRESS(state, '2NGBz7mknbB1GxFSddxa47C3S6qS4FuTnyd');
      expect(state.scannedAddress).toBe('2NGBz7mknbB1GxFSddxa47C3S6qS4FuTnyd');
    });

    it('set qr mode', () => {
      mutations.SET_QR_MODE(state, 'addErc20');
      expect(state.qrMode).toBe('addErc20');
    });

    it('set scanned amount', () => {
      mutations.SET_SCANNED_AMOUNT(state, 5);
      expect(state.scannedAmount).toBe(5);
    });
  });
});
