function Email() {
  this.hasPermission = (callback) => { callback(); };
  this.requestPermissionBehaviour = null;
  this.requestPermission = function requestPermission(callback) {
    if (!this.requestPermissionBehaviour) { throw new Error('mock behaviour not specified'); }
    if (this.requestPermissionBehaviour === 'grant') { callback(true); }
    if (this.requestPermissionBehaviour === 'deny') { callback(false); }
  };
  this.isAvailableBehaviour = null;
  this.isAvailable = function isAvailable(callback) {
    if (!this.isAvailableBehaviour) { throw new Error('mock behaviour not specified'); }
    if (this.isAvailableBehaviour === 'yes') { callback(true); }
    if (this.isAvailableBehaviour === 'no') { callback(false); }
  };
  this.open = jest.fn();
}

export default Email;
