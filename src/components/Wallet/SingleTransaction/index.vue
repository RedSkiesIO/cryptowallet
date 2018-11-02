<template>
  <q-timeline-entry
    :title="paymentDirection"
    side="left"
  >
    <q-collapsible
      :label="date"
      :sublabel="amount"
      :class="{ 'positive-amount': data.amount > 0, 'negative-amount': data.amount < 0 }"
    >
      <div>
        <p>
          {{ $t('received') }}:<br>
          <span class="received">{{ data.received }}</span>
        </p>
        <p>
          TX Hash:<br>
          <span class="tx-hash">{{ data.tx_hash }}</span>
        </p>
        <p>
          {{ $t('status') }}:<br>
          <span
            :class="{ 'unconfirmed-tx': data.status === 1, 'confirmed-tx': data.status === 2 }"
            class="status"
          >
            {{ $t(status) }}
          </span>
        </p>
        <p>
          TX {{ $t('fee') }}:<br>
          <span class="tx-fee">{{ data.tx_fee }}</span>
        </p>
      </div>
    </q-collapsible>
  </q-timeline-entry>
</template>

<script>
import { dateTranslater, AmountFormatter } from '@/helpers';

export default {
  name: 'SingleTransaction',

  props: {
    data: {
      type: Object,
      required: true,
    },
  },

  computed: {
    /**
     * Prepends "To: " or "From: " into transaction title
     * @return {String}
     */
    paymentDirection() {
      if (this.data.to) return `${this.$t('to')}: ${this.data.to}`;
      return `${this.$t('from')}: ${this.data.from}`;
    },

    /**
     * Returns formatted date of the transaction
     * @return {String}
     */
    date() {
      return dateTranslater(this.data.ts, 'DD MMMM', this);
    },

    /**
     * Converts amount value (Number) into a String with optional currency symbol
     * @return {String}
     * @deprecated
     */
    amount() {
      const amount = new AmountFormatter({
        amount: this.data.amount,
        format: '0.00', // @TODO get the exponent from selected currency.
        prependPlusOrMinus: true,
      });
      return amount.getFormatted();
    },

    /**
     * Returns the transaction status in a human friendly format
     * @return {String}
     */
    status() {
      if (this.data.status === 1) return 'unconfirmed';
      if (this.data.status === 2) return 'confirmed';
      return 'pending';
    },
  },
};
</script>

<style lang="scss">
  .positive-amount .q-item-sublabel, .confirmed-tx  {
    color: green;
  }

  .negative-amount .q-item-sublabel, .unconfirmed-tx {
    color: red;
  }
</style>
