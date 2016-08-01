'use strict';

const Logger = require('../src');
const Stream = Logger.Stream;

window.singleton = function () {
    let logger = new Logger({

    });

    logger.test1 = new Stream(logger, {
        style: ['blue']
    });

    logger.test2 = new Stream(logger, {
        style: ['green']
    });

    module.exports = logger;


    // Now import this from another buffer

    const console = module.exports; // Replaces require

    console.test1.assert(false, 'Test assert #1');

    console.test2.log('MULTI\nLINE\nTEXT\nLOG');

    console.test2.group('Group test #1');
    console.test1.log('Normal log behavior:', 2, {test: 1});
    console.test2.table({test: 1}, 'Some compatibility fns.');
    console.test1.debug({test: 1}, 'Some alias fns.');

    console.test1.groupCollapsed('Group test #2');
    console.test1.assert(false, 'Test assert #2');
    console.test2.log('In-group log...', {test: 2});
    console.test2.dir({test: 2}, 'Inspect');

    console.test2.groupCollapsed('Group test #3');
    console.test1.assert(false, 'Test assert #3');
    console.test2.log('In-group log...', {test: 2});
    console.test1.dir({test: 2}, 'Inspect');

    // console.clear();
    console.test2.groupEnd();

    function someFunction() {
        console.test2.trace();
        throw new Error('Test error');
    }

    function someFunction2() {
        someFunction();
    }

    try {
        someFunction2();
    } catch (e) {
        console.test1.error(e);
        console.test1.warn(e);
    }

    console.test1.groupEnd();
    console.test2.groupEnd();

    console.test1.info('Info', {test: 1});
    console.test1.debug('Debug', {test: 1});
    console.test2.error('Error', {test: 1});

    console.test2.count('Counter');
    console.test1.count('Counter');
    console.test2.count('Counter');
    console.test1.count('Counter');
    console.test1.count('Counter');

    console.test1.time('Timer #1');
    console.test1.timeEnd('Timer #1');

    console.test2.time('Timer #2');
    setTimeout(() => {
        console.test2.timeEnd('Timer #2');
    }, 1000);
};