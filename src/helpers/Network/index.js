import { Platform } from 'quasar';

export default class Network {
  constructor() {
    if (Platform.is.desktop || Platform.is.mobile) {
      this.online = window.navigator.onLine;
      window.addEventListener('online', this.wentOnline.bind(this), false);
      window.addEventListener('offline', this.wentOffline.bind(this), false);
    } else if (Platform.is.android || Platform.is.ios) {
      this.connection = navigator.connection;
      document.addEventListener('online', this.wentOnline.bind(this), false);
      document.addEventListener('offline', this.wentOffline.bind(this), false);
    } else {
      throw new Error('Platform not detected');
    }
  }

  wentOnline() {
    if (typeof this.online === 'function') this.online();
  }

  wentOffline() {
    if (typeof this.offline === 'function') this.offline();
  }

  getConnectionType() {
    return this.connection.type;
  }

  isOnline() {
    if (Platform.is.desktop || Platform.is.mobile) {
      return window.navigator.onLine;
    }

    if (Platform.is.android || Platform.is.ios) {
      if (this.getConnectionType() === 'none') return false;
      return true;
    }

    return throw new Error('Platform not detected');
  }

  on(event, callback) {
    this[event] = callback;
    return this;
  }
}
