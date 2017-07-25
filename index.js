'use strict';

const Promise = require('bluebird');
const upyun = require('upyun');
const moment = require('moment');
const util = require('util');
const BaseAdapter = require('ghost-storage-base');

class UpyunAdapter extends BaseAdapter {
  constructor(options) {
    super(options);
    this.options = options || {};
    this.client = new yun(this.options.bucket, this.options.operator, this.options.password, 'v0.api.upyun.com', { apiVersion: 'v2' });
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
      const remoteURL = _this.options.domain;
      client.putFile(remotePath, file.path, null, false, {}, function (err, result) {
        if (err || result.statusCode !== 200) {
          reject('[' + result.data.code + '] ' + result.data.msg);
        } else {
          if (_this.options.imageVersion !== undefined) {
            resolve(remoteURL + remotePath + _this.options.imageVersion);
          } else {
            resolve(remoteURL + remotePath);
          }
        }
      });
    });
  }

  /**
   * don't need it in Upyun
   * @param filename
   * @param targetDir
   * @returns {*|bluebird}
   * @see https://support.qiniu.com/hc/kb/article/112817/
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
   * @description not really delete from Qiniu, may be implemented later
   * @param fileName
   * @param targetDir
   * @returns {*|bluebird}
   */
  delete(fileName, targetDir) {
    // return Promise.reject('not implemented');
    return new Promise(function(resolve, reject) {
      resolve(true);
    });
  }

  getRemotePath(image) {
    const folder = moment().format(this.options.folder || 'YYYY/MM/').replace(/^\//, '');

    return '/' + this.options.prefix + folder + image.name;
  }
}

module.exports = UpyunAdapter;
