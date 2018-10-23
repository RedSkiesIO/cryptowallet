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
import { amount, date } from '@/helpers';

export default {
  name: 'SingleTransaction',
  props: {
    data: {
      type: Object,
      required: true,
    },
    currency: {
      type: String,
      default() {
        return '';
      },
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
      return date(this.data.ts, 'DD MMMM', this);
    },
    /**
     * Converts amount value (Number) into a String with optional currency symbol
     * @return {String}
     */
    amount() {
      return amount(this.data.amount, this.currency);
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

<style>
  .confirmed-tx {
    color: green;
  }

  .unconfirmed-tx {
    color: red;
  }

  .positive-amount .q-item-sublabel {
    color: green;
  }

  .negative-amount .q-item-sublabel {
    color: red;
  }
</style>
