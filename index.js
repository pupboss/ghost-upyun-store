'use strict';

var Promise = require('bluebird');
var UPYUN = require('upyun');
var moment = require('moment');
var util = require('util');
var BaseAdapter = require('ghost-storage-base');


function UpyunAdapter(config) {
	BaseAdapter.call(this);
	this.options = config || {};
}

util.inherits(UpyunAdapter, BaseAdapter);

// ### Save
// Saves the image to Upyun
// - image is the express image object
// - returns a promise which ultimately returns the full url to the uploaded image
UpyunAdapter.prototype.save = function(image) {
	var _this = this;

	var upyun = new UPYUN (this.options.bucket, this.options.operator, this.options.password, 'v0.api.upyun.com', {apiVersion: 'v2'});

	return new Promise (function (resolve, reject) {
		var remotePath = _this.getRemotePath(image);
		var remoteURL = _this.options.domain;
		upyun.putFile(remotePath, image.path, null, false, {}, function (err, result) {
			if (err || result.statusCode != 200) {
				reject('[' + result.data.code + '] ' + result.data.msg);
			} else {
				if (_this.options.imageVersion != undefined) {
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
	return;
};

UpyunAdapter.prototype.delete = function (target) {
	//For backup and security purposes there is no way to delete files
	//whatever on local or server side through Ghost, please do it manually.
	return;
};

UpyunAdapter.prototype.getRemotePath = function (image) {
	var folder = moment().format(this.options.folder || 'YYYY/MM/').replace(/^\//, '');

	return '/' + this.options.prefix + folder + image.name;
};

module.exports = UpyunAdapter;
