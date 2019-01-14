const coins = {
  Bitcoin: {
    rate: 0.00000001,
  },
  Litecoin: {
    rate: 0.00000001,
  },
  Dash: {
    rate: 0.00000001,
  },
  Ethereum: {
    rate: 0.000000000000000001,
  },
};

export default ({ Vue }) => {
  Vue.prototype.CoinFormatter = {
    toDenomination(coin, value) {
      return parseFloat(value / coins[coin].rate);
    },
    fromDenomination(coin, value) {
      return parseFloat(value * coins[coin].rate);
    },
  };
};
