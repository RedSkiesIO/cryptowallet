<template>
  <div class="contact-list-item">
    <div @click.prevent="goToContact">
      <div class="circle" />
      {{ contact.displayName }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecentContactItem',
  props: {
    contact: {
      type: Object,
      required: true,
    },
  },
  methods: {
    goToContact() {
      this.$router.push({ path: `/contact-item/${this.contact.id}` });
    },
  },
};
</script>

<style scoped>
.contact-list-item > div {
  padding-right: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  white-space: nowrap;
}

.circle {
  background: #ececec;
  border-radius: 100%;
  height: 2.5rem;
  width: 2.5rem;
  margin-top: 0.1rem;
  margin-bottom: 0.5rem;
}
</style>
