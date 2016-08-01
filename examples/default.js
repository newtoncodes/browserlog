'use strict';

const Logger = require('../src');


window.default = function () {
    let console = new Logger({
        style: ['bgBlue', 'white'],
        silent: false,
        save: true,
        bufferSize: null,
        bufferDate: true,
        bufferTime: true,
        colors: true,
        colorsFull: false,
        label: 'TEST'
    });

    console.assert(false, 'Test assert #1');

    console.log('MULTI\nLINE\nTEXT\nLOG', 2, 'MULTI\nLINE\nTEXT\nLOG');
    console.log('MULTI\nLINE\nTEXT\nLOG', 'MULTI\nLINE\nTEXT\nLOG');
    console.log({test: 1});

    console.group('Group test #1');
    console.log('Normal log behavior:', 2, {test: 1});
    console.table({test: 1}, 'Some compatibility fns.');
    console.debug({test: 1}, 'Some alias fns.');

    console.groupCollapsed('Group test #2');
    console.assert(false, 'Test assert #2');
    console.log('In-group log...', {test: 2});
    console.dir({test: 2}, 'Inspect');

    console.groupCollapsed('Group test #3');
    console.assert(false, 'Test assert #3');
    console.log('In-group log...', {test: 2});
    console.dir({test: 2}, 'Inspect');

    // console.clear();
    console.groupEnd();

    function someFunction() {
        console.trace();
        throw new Error('Test error');
    }

    function someFunction2() {
        someFunction();
    }

    try {
        someFunction2();
    } catch (e) {
        console.error(e);
        console.warn(e);
    }

    console.groupEnd();
    console.groupEnd();

    console.info('Info', {test: 1});
    console.debug('Debug', {test: 1});
    console.error('Error', {test: 1});

    console.count('Counter');
    console.count('Counter');
    console.count('Counter');
    console.count('Counter');
    console.count('Counter');

    console.time('Timer #1');
    console.timeEnd('Timer #1');

    console.time('Timer #2');

    setTimeout(() => {
        console.timeEnd('Timer #2');
        console.original.log(console.buffer);
    }, 1000);
};