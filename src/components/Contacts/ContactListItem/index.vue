<template>
  <div
    class="contact-list-item"
    @click.prevent="clickHandler"
  >
    <div class="columns is-mobile no-margin-bottom">
      <div class="column is-2">
        <div class="circle" />
      </div>
      <div class="column">
        <div class="columns is-mobile no-margin-bottom">
          <div class="column is-7 no-padding-bottom">
            {{ contact.displayName }}
          </div>
        </div>
        <div class="wallet-address">
          <div v-if="contact.address">
            {{ contact.address }}
          </div>
          <div v-else>
            {{ $t('noWalletForContact') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactListItem',
  props: {
    contact: {
      type: Object,
      required: true,
    },
    clickItemAction: {
      type: String,
      required: false,
    },
  },
  methods: {
    /**
     * Initiates sending the invitation
     */
    clickHandler() {
      switch (this.clickItemAction) {
        case 'app-invitation':
          this.invitation = new this.AppInvitation({ vm: this, contact: this.contact });
          this.invitation.send();
          break;
        default:
          return false;
      }
      return false;
    },
  },
};
</script>

<style scoped>
.contact-list-item {
  margin: 1rem 0;
}

.wallet-address {
  font-size: 0.7rem;
}

.no-padding-bottom {
  padding-bottom: 0;
}

.no-margin-bottom {
  margin-bottom: 0;
}

.circle {
  background: #ececec;
  border-radius: 100%;
  height: 2.5rem;
  width: 2.5rem;
  margin-top: 0.1rem;
}
</style>
