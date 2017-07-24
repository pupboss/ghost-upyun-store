'use strict';

const Promise = require('bluebird');
const yun = require('upyun');
const moment = require('moment');
const util = require('util');
const BaseAdapter = require('ghost-storage-base');

function UpyunAdapter(config) {
  BaseAdapter.call(this);
  this.options = config || {};
}

util.inherits(UpyunAdapter, BaseAdapter);

UpyunAdapter.prototype.save = function (image) {

  const _this = this;

  var upyun = new yun(this.options.bucket, this.options.operator, this.options.password, 'v0.api.upyun.com', {apiVersion: 'v2'});

  return new Promise (function (resolve, reject) {
    var remotePath = _this.getRemotePath(image);
    var remoteURL = _this.options.domain;
    upyun.putFile(remotePath, image.path, null, false, {}, function (err, result) {
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
};

// middleware for serving the files
UpyunAdapter.prototype.serve = function () {
  // a no-op, these are absolute URLs
  return function (req, res, next) {
    next();
  };
};

UpyunAdapter.prototype.exists = function () {
  // Server side will automatically replace the file.
  return false;
};

UpyunAdapter.prototype.delete = function () {
  //For backup and security purposes there is no way to delete files
  //whatever on local or server side through Ghost, please do it manually.
  return true;
};

UpyunAdapter.prototype.getRemotePath = function (image) {
  var folder = moment().format(this.options.folder || 'YYYY/MM/').replace(/^\//, '');

  return '/' + this.options.prefix + folder + image.name;
};

module.exports = UpyunAdapter;
