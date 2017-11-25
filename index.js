'use strict';

const Promise = require('bluebird');
const upyun = require('upyun');
const fs = require('fs');
const urlParse = require('url').parse;
const moment = require('moment');
const BaseAdapter = require('ghost-storage-base');

class UpyunAdapter extends BaseAdapter {
  constructor(options) {
    super(options);
    this.options = options || {};
    const bucket = new upyun.Service(this.options.bucket, this.options.operator, this.options.password);
    this.client = new upyun.Client(bucket);
  }

  /**
   * Saves the image to storage
   * - image is the express image object
   * - returns a promise which ultimately returns the full url to the uploaded image
   *
   * @param file
   * @param targetDir
   * @returns {*}
   */
  save(file, targetDir) {
    const client = this.client;
    const _this = this;

    return new Promise(function(resolve, reject) {
      const remotePath = _this.getRemotePath(file);
      const remoteDomain = _this.options.domain;
      client.putFile(remotePath, fs.readFileSync(file.path)).then(function(result) {
        if (_this.options.suffix !== undefined) {
          resolve(remoteDomain + remotePath + _this.options.suffix);
        } else {
          resolve(remoteDomain + remotePath);
        }
      }).catch(function(error) {
        reject('[' + result.data.code + '] ' + result.data.msg);
      });
    });
  }

  /**
   * don't need it in Upyun
   * @param filename
   * @param targetDir
   * @returns {*|bluebird}
   * TODO: if fileKey option set, should use key to check file whether exists
   */
  exists(filename, targetDir) {
    return new Promise(function(resolve, reject) {
      resolve(false);
    });
  }

  // middleware for serving the files
  serve() {
    // a no-op, these are absolute URLs
    return function(req, res, next) {
      next();
    };
  }

  /**
   * Not implemented.
   * @description not really delete from Upyun, may be implemented later
   * @param fileName
   * @param targetDir
   * @returns {*|bluebird}
   */
  delete(fileName, targetDir) {

    return new Promise(function(resolve, reject) {
      resolve(true);
    });
  }

  /**
   * Reads bytes from Upyun for a target image
   *
   * @param options
   */
  read(options) {
    options = options || {};

    const client = this.client;
    const key = urlParse(options.path).pathname.slice(1);

    return new Promise(function(resolve, reject) {
      client.getFile(key).then(function(result) {
        resolve(result);
      }).catch(function(error) {
        reject('Could not read image');
      });
    });
  }

  getRemotePath(image) {
    const folder = moment().format(this.options.folder || 'YYYY/MM/').replace(/^\//, '');

    return '/' + this.options.prefix + folder + image.name;
  }
}

module.exports = UpyunAdapter;
