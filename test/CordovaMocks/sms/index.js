function Sms() {
  this.hasPermissionBehaviour = null;
  this.hasPermission = function hasPermission(callback1, callback2) {
    if (!this.hasPermissionBehaviour) { throw new Error('mock behaviour not specified'); }
    if (this.hasPermissionBehaviour === 'success') { callback1(true); }
    if (this.hasPermissionBehaviour === 'failure') { callback1(false); }
    if (this.hasPermissionBehaviour === 'error') { callback2(new Error('mock error')); }
  };
  this.requestPermissionBehaviour = null;
  this.requestPermission = function requestPermission(callback1, callback2) {
    if (!this.requestPermissionBehaviour) { throw new Error('mock behaviour not specified'); }
    if (this.requestPermissionBehaviour === 'callback1') { callback1(); }
    if (this.requestPermissionBehaviour === 'callback2') { callback2(); }
  };
  this.sendBehaviour = null;
  this.send = function send(number, message, options, success, error) {
    if (!this.sendBehaviour) { throw new Error('mock behaviour not specified'); }
    if (this.sendBehaviour === 'success') { success(); }
    if (this.sendBehaviour === 'error') { error(new Error('mock error')); }
  };
}

export default Sms;
