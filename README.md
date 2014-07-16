event-done
==========

Extension of EventEmitter which allows to pass callback that will be invoked when all listeners completed

### Usage

1. We can have multiple listeners attached to the same event, but final callback will be called only once 

	var EventDone = require('event-done').EventDone;
	var event = new EventDone();

	event.on('test', function (data, next) {
		console.log('I am listener one');
		next(null);
	});

	event.on('test', function (data, next) {
		console.log('I am listener two');
		next(null);
	});

	event.on('test', function (data, next) {
		console.log('I am listener three');
		setTimeout(next, 100);
	});

	event.emit('test', {some: 'data'}, function finish(error) {
		console.log('I am called only once after all three listeners');
		console.log('Error is empty:', error);
	});

2. Let's assume that one of listeners did not call it's callback. In this case final callback will be called with error of type EventDoneTimeoutError

	var EventDone = require('event-done').EventDone;
	var EventDoneTimeoutError = require('event-done').EventDoneTimeoutError;
	require('event-done').timeout = 100;
	console.log('Fallback timeout can be set to anything. Default is 30s and we set it to 100ms');
	
	var event = new EventDone();
	
	event.on('test', function (data, next) {
		console.log('I am listener one', 'Oops, I forgot to call "next"');
	});
	
	event.on('test', function (data, next) {
		console.log('I am listener two');
		next(null);
	});
	
	event.emit('test', {some: 'data'}, function finish(error) {
		console.log('I am called after 100ms "fallback" timeout');
		console.log('error is not empty and is instance if EventDoneTimeoutError:', error instanceof EventDoneTimeoutError);
	});

3. In case of any listener fails, final callback is instantly called with that error

	var EventDone = require('event-done').EventDone;
	var event = new EventDone();
	
	event.on('test', function (data, next) {
		console.log('I am listener one');
		next(new Error('OMFG!'));
	});
	
	event.on('test', function (data, next) {
		console.log('I am listener two', 'I will still output this to console, but after final callback');
		next(null);
	});
	
	event.emit('test', {some: 'data'}, function finish(error) {
		console.log('I am called after first listener called');
		console.log('error is not empty and it is "OMFG!":', (error instanceof Error) && error.message === 'OMFG!');
	});

