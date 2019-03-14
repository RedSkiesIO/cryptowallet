/* eslint-disable no-magic-numbers */
import { Notify } from 'quasar';

/**
 * Your toast, butter it as you please.
 */
export class Toast {
  /**
   * Toast message object.
   * @param msg string
   * @param code int
   * @param type string
   * @param position string
   * @param stackTrace obj
   * @param debug array
   */
  constructor(msg, code, type = 'error', position = 'bottom', stackTrace = null, debug = []) {
    this.msg = msg;
    this.code = code;
    this.type = type;
    this.position = position;
    this.stackTrace = stackTrace;
    this.debug = debug;
  }
}

/**
 * Pops your toast.
 */
class Toaster {
  /**
   * @param toast Toast
   */
  constructor(toast) {
    const {
      msg, code, type, position,
    } = toast;
    this.msg = msg;
    this.code = code;
    this.type = type;
    this.position = position;
    this.pop();
  }

  /**
   * Toast notification.
   */
  pop() {
    Notify.create({
      message: this.msg,
      position: this.position,
      type: this.type,
      timeout: 5000,
    });
  }
}

/**
 * Creates a toaster.
 */
class ToasterFactory {
  /**
   * ToasterFactory constructor.
   * @param vm
   */
  constructor(vm) {
    this.vm = vm;
  }

  /**
   * Method to create a toast notification.
   * @param status
   * @param msg
   * @param code
   * @param position
   * @param stackTrace
   * @param debug
   */
  create(status, msg, code, position = 'bottom', stackTrace = null, debug = []) {
    switch (status) {
      case 5:
        this.vm.$emit('WARN', new Toaster(new Toast(msg, code, 'warning', position, stackTrace, debug)));
        break;
      case 10:
        this.vm.$emit('ERROR', new Toaster(new Toast(msg, code, 'negative', position, stackTrace, debug)));
        break;
      case 20:
        this.vm.$emit('FAILURE', new Toaster(new Toast(msg, code, 'negative', position, stackTrace, debug)));
        break;
      case 420:
        this.vm.$emit('GENERAL', new Toaster(new Toast(msg, code, 'info', position)));
        break;
      case 0:
        this.vm.$emit('SUCCESS', new Toaster(new Toast(msg, code, 'positive', position)));
        break;
      case 418:
        this.vm.$emit('TEAPOT', new Toaster(new Toast("I'm a techno teapot.", 808, 'info', 'bottom')));
        break;
      default:
        this.vm.$emit('1');
    }
  }
}

/**
 * Export plugin as vue prototype.
 * @param Vue
 */
export default ({ Vue }) => {
  Vue.prototype.$toast = new ToasterFactory(new Vue());
};
