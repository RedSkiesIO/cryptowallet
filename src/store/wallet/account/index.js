const state = {
  data: {
    salt: null,
    seed: null,
    pinHash: null,
  },
};

import * as actions from '../../setup/actions';

export default {
  namespaced: true,
  state,
  actions,
};
