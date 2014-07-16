"use strict";

module.exports = process.env.EVENT_DONE_COV ? require('./lib-cov') : require('./lib');
