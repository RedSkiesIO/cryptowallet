import { VueFormWizard, FormWizard, TabContent } from 'vue-form-wizard';
import 'vue-form-wizard/dist/vue-form-wizard.min.css';

export default ({ Vue }) => {
  Vue.use(VueFormWizard, TabContent, FormWizard);
};
