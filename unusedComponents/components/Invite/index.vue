<template>
  <div>
    <q-btn
      :label="$t('sendAppInvitation')"
      icon="send"
      color="primary"
      class="send-invitation"
      @click="sendAppInvitation"
    />

    <q-modal
      v-model="invitationModalOpened"
      class="dark-modal"
    >
      <div class="close-button-wrapper">
        <q-btn
          :label="$t('close')"
          color="secondary"
          size="sm"
          @click.prevent="invitationModalOpened = false"
        />
      </div>
      <SearchContacts />
      <ContactsList click-item-action="app-invitation" />
    </q-modal>

    <q-modal
      v-model="permissionsNoticeModalOpened"
      minimized
    >
      <div style="padding: 2rem">
        <div class="q-display-1 q-mb-md">
          {{ $t('permissions') }}
        </div>
        <p>{{ $t('contactsPermissions') }}</p>
        <q-btn
          color="primary"
          label="Ok"
          @click.prevent="closePermissionsNoticeModal"
        />
      </div>
    </q-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import SearchContacts from '@/components/Contacts/SearchContacts';
import ContactsList from '@/components/Contacts/ContactsList';

export default {
  name: 'Invite',
  components: {
    SearchContacts,
    ContactsList,
  },

  data() {
    return {
      permissionsNoticeModalOpened: false,
      invitationModalOpened: false,
    };
  },
  computed: {
    ...mapState({
      delay: (state) => { return state.settings.delay; },
    }),
  },
  methods: {
    /**
     * Initiates the sending invitation process
     * If has premissions, just import contacts
     * If no premissions, show the premissions notice modal
     */
    sendAppInvitation() {
      const { permissions } = cordova.plugins;
      permissions.checkPermission(permissions.READ_CONTACTS, (status) => {
        if (status.hasPermission) {
          this.importContacts();
        } else {
          this.permissionsNoticeModalOpened = true;
        }
      }, () => {
        this.$toast.create(10, this.$t('contactsImportError'), this.delay.normal);
      });
    },

    /**
     * Closes the premissions notice modal and
     * initiaties contacts import
     */
    closePermissionsNoticeModal() {
      this.permissionsNoticeModalOpened = false;
      this.importContacts();
    },

    /**
     * Attempts to import and save contacts in the store
     */
    importContacts() {
      new this.ContactsImport(this)
        .on('success', () => {
          this.invitationModalOpened = true;
        })
        .on('failure', () => {
          this.$toast.create(420, this.$t('contactsImportFailure'), this.delay.normal);
        })
        .on('error', () => {
          this.$toast.create(10, this.$t('contactsImportError'), this.delay.normal);
        })
        .import(this.$store.state.contacts);
    },
  },
};
</script>

<style lang="scss">
  .close-button-wrapper {
    padding: 0.5rem;
    height: 2.7rem;
  }

  .dark-modal {
    .modal-content {
      background: #1e3c57;
    }
  }
</style>
