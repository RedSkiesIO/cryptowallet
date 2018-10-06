import { shallowMount } from '@vue/test-utils';
import EditProfile from '@/pages/EditProfile.vue';
import { localVue } from '../setupLocalVue';

describe('ProfileCard.vue', () => {
  let wrapper;

  function wrapperInit(options) {
    return shallowMount(EditProfile, options);
  }

  beforeEach(() => {
    wrapper = wrapperInit({ localVue });
  });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  
  it('expect back button', () => {
    expect(wrapper.contains('button#backButton_id')).toBe(true);
  });

  it('expect main content', () => {
    expect(wrapper.contains('div.mainContent')).toBe(true);
  });

  it('expect form', () => {
    expect(wrapper.contains('div#form_id')).toBe(true);
  });

  it('expect field', () => {
    expect(wrapper.contains('div.field')).toBe(true);
  });

  it('expect label', () => {
    expect(wrapper.contains('label.label')).toBe(true);
  });

  it('expect input', () => {
    expect(wrapper.contains('input#input_id')).toBe(true);
  });

  it('expect control', () => {
    expect(wrapper.contains('div.control')).toBe(true);
  });

  it('expect router-link save button', () => {
    expect(wrapper.contains('#saveBtn_id')).toBe(true);
  });

  it('expect router-link cancel button', () => {
    expect(wrapper.contains('#cancelBtn_id')).toBe(true);
  });
});
