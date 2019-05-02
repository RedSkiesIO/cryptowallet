
export default class Network {
  constructor(platform) {
    this.platform = platform;
    if (platform.desktop || platform.mobile) {
      this.online = window.navigator.onLine;
      window.addEventListener('online', this.wentOnline.bind(this), false);
      window.addEventListener('offline', this.wentOffline.bind(this), false);
    } else if (platform.android || platform.ios) {
      this.connection = navigator.connection;
      document.addEventListener('online', this.wentOnline.bind(this), false);
      document.addEventListener('offline', this.wentOffline.bind(this), false);
    } else {
      throw new Error('Platform not detected');
    }
  }

  wentOnline() {
    if (typeof this.online === 'function') { this.online(); }
  }

  wentOffline() {
    if (typeof this.offline === 'function') { this.offline(); }
  }

  isOnline() {
    if (this.platform.desktop || this.platform.mobile) {
      return window.navigator.onLine;
    }
    if (this.connection.type === 'none') { return false; }
    return true;
  }

  on(event, callback) {
    this[event] = callback;
    return this;
  }
}
