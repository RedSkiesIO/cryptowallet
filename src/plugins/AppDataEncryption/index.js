import AES from 'crypto-js/aes';
import encUTF8 from 'crypto-js/enc-utf8';

/**
 * Encrypts and returns a piece of data
 * @param  {Any} data
 * @param  {String} password
 * @return {Uint8Array}
 */
function encrypt(data, password) {
  try {
    return AES.encrypt(JSON.stringify(data), password).toString();
  } catch (exception) {
    throw new Error(exception.message);
  }
}

/**
 * Decrypts and returns a piece of data
 * @param  {Uint8Array} data
 * @param  {String} password
 * @return {Any}
 */
function decrypt(data, password) {
  try {
    const bytes = AES.decrypt(data, password);
    return JSON.parse(bytes.toString(encUTF8));
  } catch (exception) {
    throw new Error(exception.message);
  }
}

/**
 * Returns an ecrypted data of an Object
 * @param  {Array} properties
 * @param  {Object} obj
 * @param  {String} password
 * @return {Object}
 */
function encryptModelproperties(properties, obj, password) {
  const encryptedData = {};

  properties.forEach((field) => {
    encryptedData.id = obj.id;
    if (obj[field]) {
      encryptedData[field] = encrypt(obj[field], password);
    }
  });

  return encryptedData;
}

/**
 * Returns a decrypted data of an Object
 * @param  {Array} properties
 * @param  {Object} obj
 * @param  {String} password
 * @return {Object}
 */
function decryptModelproperties(properties, obj, password) {
  const decryptedData = {};

  properties.forEach((field) => {
    decryptedData.id = obj.id;

    if (obj[field]) {
      decryptedData[field] = decrypt(obj[field], password);
    }
  });

  return decryptedData;
}

function AppDataEncryption(config) {
  this.config = config;
  /**
   * Encrypts the store
   * @param  {string} password
   */
  this.encrypt = (password) => {
    this.config.forEach((target) => {
      const encryptedModelData = [];
      const data = target.model.all();
      if (data.length > 0) {
        target.model.all().forEach((obj) => {
          encryptedModelData.push(encryptModelproperties(target.properties, obj, password));
        });
      }

      encryptedModelData.forEach(modelData => target.model.update(modelData));
    });
  };

  /**
   * Decrypts the store
   * @param  {string} password
   */
  this.decrypt = (password) => {
    this.config.forEach((target) => {
      const decryptedModelData = [];
      const data = target.model.all();
      if (data.length > 0) {
        target.model.all().forEach((obj) => {
          decryptedModelData.push(decryptModelproperties(target.properties, obj, password));
        });
      }

      decryptedModelData.forEach(modelData => target.model.update(modelData));
    });
  };
}

export default ({ Vue }) => {
  Vue.prototype.AppDataEncryption = AppDataEncryption;
};
