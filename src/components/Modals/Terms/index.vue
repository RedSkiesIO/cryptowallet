<template>
  <div>
    <q-modal
      v-model="termsModalOpened"
      class="light-modal"
    >
      <div class="header-section">
        <h1 class="header-h1">Terms & Conditions</h1>
      </div>
      <!-- eslint-disable -->
      <div class="modal-layout-wrapper">

        <h2>Introduction</h2>

        <p>These Website Standard Terms and Conditions written on this webpage shall manage your use of our website, <span class="highlight preview_website_name">Webiste Name</span> accessible at <span class="highlight preview_website_url">Website.com</span>.</p>

        <p>These Terms will be applied fully and affect to your use of this Website. By using this Website, you agreed to accept all terms and conditions written in here. You must not use this Website if you disagree with any of these Website Standard Terms and Conditions.</p>

        <p>Minors or people below 18 years old are not allowed to use this Website.</p>

        <h2>Intellectual Property Rights</h2>

        <p>Other than the content you own, under these Terms, <span class="highlight preview_company_name">Company Name</span> and/or its licensors own all the intellectual property rights and materials contained in this Website.</p>

        <p>You are granted limited license only for purposes of viewing the material contained on this Website.</p>

        <h2>Restrictions</h2>

        <p>You are specifically restricted from all of the following:</p>

        <ul>
            <li>publishing any Website material in any other media;</li>
            <li>selling, sublicensing and/or otherwise commercializing any Website material;</li>
            <li>publicly performing and/or showing any Website material;</li>
            <li>using this Website in any way that is or may be damaging to this Website;</li>
            <li>using this Website in any way that impacts user access to this Website;</li>
            <li>using this Website contrary to applicable laws and regulations, or in any way may cause harm to the Website, or to any person or business entity;</li>
            <li>engaging in any data mining, data harvesting, data extracting or any other similar activity in relation to this Website;</li>
            <li>using this Website to engage in any advertising or marketing.</li>
        </ul>

        <p>Certain areas of this Website are restricted from being access by you and <span class="highlight preview_company_name">Company Name</span> may further restrict access by you to any areas of this Website, at any time, in absolute discretion. Any user ID and password you may have for this Website are confidential and you must maintain confidentiality as well.</p>

        <h2>Your Content</h2>

        <p>In these Website Standard Terms and Conditions, “Your Content” shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant <span class="highlight preview_company_name">Company Name</span> a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.</p>

        <p>Your Content must be your own and must not be invading any third-party's rights. <span class="highlight preview_company_name">Company Name</span> reserves the right to remove any of Your Content from this Website at any time without notice.</p>

        <h2>No warranties</h2>

        <p>This Website is provided “as is,” with all faults, and <span class="highlight preview_company_name">Company Name</span> express no representations or warranties, of any kind related to this Website or the materials contained on this Website. Also, nothing contained on this Website shall be interpreted as advising you.</p>

        <h2>Limitation of liability</h2>

        <p>In no event shall <span class="highlight preview_company_name">Company Name</span>, nor any of its officers, directors and employees, shall be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract.  <span class="highlight preview_company_name">Company Name</span>, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.</p>












      </div>
    </q-modal>
  </div>
</template>

<script>
export default {
  name: 'NewAccount',
  data() {
    return {
      termsModalOpened: false,
    };
  },
  mounted() {
    this.$root.$on('termsModalOpened', (value) => {
      this.termsModalOpened = value;
    });
  },
  methods: {


  },
};
</script>

<style>

</style>
