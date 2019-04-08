const permissions = {
  READ_CONTACTS: {
    name: 'READ_CONTACTS',
    status: {
      hasPermission: undefined,
    },
    mockBehaviour: undefined,
  },
  checkPermission(permissionToCheck, statusCallback, errorCallback) {
    const permission = this[permissionToCheck.name];
    if (!permission.mockBehaviour) throw new Error('mock behaviour not specified');

    if (permission.mockBehaviour === 'error') {
      errorCallback(new Error('mocked error'));
    }

    if (permission.mockBehaviour === 'pass') {
      permission.status.hasPermission = true;
    }

    if (permission.mockBehaviour === 'fail') {
      permission.status.hasPermission = false;
    }

    statusCallback(permission.status);
  },
};

export default permissions;
