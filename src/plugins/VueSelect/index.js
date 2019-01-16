import vSelect from 'vue-select';

export default ({ Vue }) => {
  Vue.use(vSelect);
  Vue.component('v-select', vSelect);
};
