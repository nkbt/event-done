"use strict";
var expect = require('chai').expect;

var chai = require('chai');
chai.use(require('sinon-chai'));

var sinon = require('sinon');
var uuid = require('uuid');

var EventDone = require('../lib').EventDone;
var EventDoneTimeoutError = require('../lib').EventDoneTimeoutError;

// Set default timout to 100ms
require('../lib').timeout = 10;

describe('EventDone', function () {

	it('Should run callback when listener finishes', function (done) {

		var error,
			event = new EventDone(),

			finishCallback = sinon.spy(function (err) {
				error = err;
			}),

			listenerCallback = sinon.spy(function (data, next) {
				next();
			});

		event.on('test', listenerCallback);
		event.emit('test', 'data', finishCallback);

		setTimeout(function () {
			expect(error).to.not.exist;
			expect(finishCallback).to.be.calledOnce;
			expect(finishCallback).to.be.calledAfter(listenerCallback);
			done();
		}, 1);

	});


	it('Should run callback with EventDoneTimeoutError if listener does not run callback within timeout', function (done) {

		var error,
			event = new EventDone(),

			finishCallback = sinon.spy(function (err) {
				error = err;
			}),

			listenerCallback = sinon.spy(function (data, next) {
				// we do not call `next` here for whatever reason
				return data;
			});

		event.on('test', listenerCallback);
		event.emit('test', 'data', finishCallback);

		setTimeout(function () {
			expect(error).to.exist;
			expect(error).to.be.an.instanceof(EventDoneTimeoutError);

			expect(finishCallback).to.be.calledOnce;
			expect(finishCallback).to.be.calledAfter(listenerCallback);

			done();
		}, 20);

	});


	it('Should run callback only once when all listeners finish', function (done) {

		var error,
			event = new EventDone(),

			finishCallback = sinon.spy(function (err) {
				error = err;
			}),

			listener1Callback = sinon.spy(function (data, next) {
				next();
			}),

			listener2Callback = sinon.spy(function (data, next) {
				next();
			});

		event.on('test', listener1Callback);
		event.on('test', listener2Callback);
		event.emit('test', 'data', finishCallback);

		setTimeout(function () {
			expect(error).to.not.exist;

			expect(finishCallback).to.be.calledOnce;
			expect(finishCallback).to.be.calledAfter(listener1Callback);
			expect(finishCallback).to.be.calledAfter(listener2Callback);

			done();
		}, 1);

	});


	it('Should run callback with Error if any of listeners fails', function (done) {

		var error,
			event = new EventDone(),

			finishCallback = sinon.spy(function (err) {
				error = err;
			}),

			listener1Callback = sinon.spy(function (data, next) {
				next(new Error('OMFG1'));
			}),

			listener2Callback = sinon.spy(function (data, next) {
				next(new Error('OMFG2'));
			}),

			listener3Callback = sinon.spy(function (data, next) {
				next();
			});

		event.on('test', listener1Callback);
		event.on('test', listener2Callback);
		event.on('test', listener3Callback);
		event.emit('test', 'data', finishCallback);

		setTimeout(function () {
			expect(error).to.exist;
			expect(error).to.be.an.instanceof(Error);
			expect(error.message).to.equal('OMFG1');

			expect(finishCallback).to.be.calledOnce;
			expect(finishCallback).to.be.calledAfter(listener1Callback);
			expect(finishCallback).to.be.calledBefore(listener2Callback);
			expect(finishCallback).to.be.calledBefore(listener3Callback);

			done();
		}, 1);

	});

});
