'use strict';

const Promise = require('bluebird');
const yun = require('upyun');
const moment = require('moment');
const BaseAdapter = require('ghost-storage-base');


class UpyunAdapter extends BaseAdapter {

  constructor(options) {
    super(options);
    this.options = options || {};
  }

  exists() {
  	return false;
  }

  save(image) {

		const _this = this;
		const upyun = new yun(this.options.bucket, this.options.operator, this.options.password, 'v0.api.upyun.com', {apiVersion: 'v2'});

		return new Promise (function(resolve, reject) {
			const remotePath = _this.getRemotePath(image);
			const remoteURL = _this.options.domain;
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
  }

  getRemotePath(image) {
    const folder = moment().format(this.options.folder || 'YYYY/MM/').replace(/^\//, '');
    return '/' + this.options.prefix + folder + image.name;
  }

  serve() {
    return function(req, res, next) {
      next();
    };
  }

  delete() {
  	return true;
  }
}

module.exports = UpyunAdapter;
