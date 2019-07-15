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
  constructor(msg, timeout, type = 'error', icon = 'report_problem', position, stackTrace = null, debug = []) {
    this.msg = msg;
    this.type = type;
    this.icon = icon;
    this.position = position;
    this.timeout = timeout;
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
      msg, timeout, type, icon, position,
    } = toast;
    this.msg = msg;
    this.type = type;
    this.icon = icon;
    this.position = position;
    this.timeout = timeout;
    this.pop();
  }

  /**
   * Toast notification.
   */
  pop() {
    Notify.create({
      message: this.msg,
      position: this.position,
      color: this.type,
      timeout: this.timeout,
      icon: this.icon,
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
   * @param timeout
   * @param stackTrace
   * @param debug
   */
  create(status, msg, timeout = 1000, position = 'bottom', stackTrace = null, debug = []) {
    switch (status) {
      case 5:
        this.vm.$emit('WARN', new Toaster(new Toast(msg, timeout, 'warning', 'report_problem', position, stackTrace, debug)));
        break;
      case 10:
        this.vm.$emit('ERROR', new Toaster(new Toast(msg, timeout, 'negative', 'report_problem', position, stackTrace, debug)));
        break;
      case 20:
        this.vm.$emit('FAILURE', new Toaster(new Toast(msg, timeout, 'negative', 'report_problem', position, stackTrace, debug)));
        break;
      case 420:
        this.vm.$emit('GENERAL', new Toaster(new Toast(msg, timeout, 'info', 'info', position)));
        break;
      case 0:
        this.vm.$emit('SUCCESS', new Toaster(new Toast(msg, timeout, 'positive', 'thumb_up', position)));
        break;
      case 418:
        this.vm.$emit('TEAPOT', new Toaster(new Toast("I'm a techno teapot.", timeout, 'info', 'info', 'bottom')));
        break;
      default:
        this.vm.$emit('1', new Toaster(new Toast()));
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
