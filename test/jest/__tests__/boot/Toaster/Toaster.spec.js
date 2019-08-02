/* eslint-disable no-magic-numbers */
import Toaster from '@/boot/Toaster/';
import { shallowMount } from '@vue/test-utils';
import { localVue } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import { Notify } from 'quasar';


describe('boot/Toaster', () => {
  let wrapperMock;
  let storeMocks;

  const defaultProps = {};

  const mockNotify = {
    create: jest.fn(),
  };

  function wrapperInit(options) {
    return shallowMount({ name: 'mock', template: '<div/>' }, options);
  }

  function storeInit(custom, propsData) {
    Notify.create = jest.fn();
    storeMocks = createStoreMocks(custom);
    wrapperMock = wrapperInit({
      localVue,
      propsData,
      store: storeMocks.store,
      mocks: {
        Notify: mockNotify,
      },
    });
  }

  beforeEach(() => { storeInit({}, defaultProps); });

  it('exports a function', () => {
    expect(typeof Toaster).toBe('function');
  });

  it('creates a toast', () => {
    wrapperMock.vm.$toast.create();
    expect(Notify.create).toHaveBeenCalled();
  });

  it('creates a warning toast', () => {
    wrapperMock.vm.$toast.create(5, 'Warning Message', 500);
    expect(Notify.create).toHaveBeenCalledWith({
      color: 'warning',
      icon: 'report_problem',
      message: 'Warning Message',
      position: 'bottom',
      timeout: 500,
    });
  });

  it('creates an error toast', () => {
    wrapperMock.vm.$toast.create(10, 'Error Message', 500);
    expect(Notify.create).toHaveBeenCalledWith({
      color: 'negative',
      icon: 'report_problem',
      message: 'Error Message',
      position: 'bottom',
      timeout: 500,
    });
  });

  it('creates a failure toast', () => {
    wrapperMock.vm.$toast.create(20, 'Failure Message', 500);
    expect(Notify.create).toHaveBeenCalledWith({
      color: 'negative',
      icon: 'report_problem',
      message: 'Failure Message',
      position: 'bottom',
      timeout: 500,
    });
  });

  it('creates a general toast', () => {
    wrapperMock.vm.$toast.create(420, 'General Message', 500);
    expect(Notify.create).toHaveBeenCalledWith({
      color: 'info',
      icon: 'info',
      message: 'General Message',
      position: 'bottom',
      timeout: 500,
    });
  });

  it('creates a success toast', () => {
    wrapperMock.vm.$toast.create(0, 'Success Message', 500, 'top');
    expect(Notify.create).toHaveBeenCalledWith({
      color: 'positive',
      icon: 'thumb_up',
      message: 'Success Message',
      position: 'top',
      timeout: 500,
    });
  });

  it('creates a an example toast', () => {
    wrapperMock.vm.$toast.create(418);
    expect(Notify.create).toHaveBeenCalledWith({
      color: 'info',
      icon: 'info',
      message: 'I\'m a techno teapot.',
      position: 'bottom',
      timeout: 1000,
    });
  });
});
