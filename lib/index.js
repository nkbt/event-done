"use strict";

var util = require('util');
var EventEmitter = require('events').EventEmitter;

exports.timeout = 30000;

function EventDoneTimeoutError(msg, constructor) {
	Error.captureStackTrace(this, constructor || this);
	this.message = msg || 'Timeout';
}
util.inherits(EventDoneTimeoutError, Error);
EventDoneTimeoutError.prototype.name = 'EventDoneTimeoutError';


var EventDone = function (uuid) {
	this.uuid = uuid;
};
util.inherits(EventDone, EventEmitter);

EventDone.prototype._emit = EventDone.prototype.emit;

EventDone.prototype.emit = function (eventName, data, callback) {
	var _this = this,
		timeout = setTimeout(function () {
			return callback(new EventDoneTimeoutError());
		}, exports.timeout);

	function finish(done) {
		var count = EventEmitter.listenerCount(_this, eventName);
		return function (error, data) {
			if (timeout === null) {
				return null;
			}
			if (error) {
				clearTimeout(timeout);
				timeout = null;
				return done(error, data);
			}
			count = count - 1;
			if (count) {
				return null;
			}
			clearTimeout(timeout);
			timeout = null;
			return done(null, data);
		};
	}

	return this._emit(eventName, data, finish(callback));
};


exports.EventDone = EventDone;
exports.EventDoneTimeoutError = EventDoneTimeoutError;
