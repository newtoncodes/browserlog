# browserlog

Browser console log utility.

## Installation

`npm install --save browserlog`

The UMD build is in the dist directory.

## Description

This logger is compatible with the known console api of chrome and firefox (and the others).

Supports timers, counters and groups. Also colors.

[Twin brother for the server: serverlog](https://github.com/newtoncodes/serverlog)


### Default logger
~~~js
'use strict';

const Logger = require('../index');

// All options are optional!

let console = new Logger({
    style: ['blue'],         // List of all styles
    silent: false,           // Mute console output
    save: false,             // Save buffer for later use (send to server or something)
    saveLogger: false,       // Save current buffer to the main logger too
    bufferSize: 1024 * 1024, // Saved buffere size limit in bytes
    bufferDate: true,        // Display date in saved buffer
    bufferTime: false,       // Display time in saved buffer
    colors: true,            // Display colors and styles in console
    colorsFull: false,       // If label is set, only it will be colorful
                             // To make the whole log colorful, set this to true
    label: ''                // Label to be displayed next to each message
});

console.log('Test.');
~~~

####Available styles:
`black`
`red`
`green`
`yellow`
`blue`
`magenta`
`cyan`
`white`
`gray`
`grey`
`bgBlack`
`bgRed`
`bgGreen`
`bgYellow`
`bgBlue`
`bgMagenta`
`bgCyan`
`bgWhite`
`reset`
`bold`
`italic`
`underline`


### Multiple streams
~~~javascript
'use strict';

const Logger = require('../index');

let console = new Logger({
    'label': 'APP'
});

console.add('stream1', {
    style: ['blue'],
    label: 'STREAM 1'
});

console.log('Test default.');
console.stream1.log('Test stream.');
~~~


### Multiple streams singleton (IntelliSense support)
~~~js
'use strict';

const Logger = require('../index');
const Stream = Logger.Stream;

let logger = new Logger();

logger.test1 = new Stream({
    style: ['blue'],
    label: 'TEST 1'
});

logger.test2 = new Stream({
    style: ['green'],
    label: 'TEST 2'
});

module.exports = logger;

// Now we import the logger from other files. It can replace console:
const console = require('./LocalLogger.js');

console.log('Test default.');
console.test1.log('Test stream 1.');
console.test2.log('Test stream 2.');
~~~

### Examples
```js
console.assert(false, 'Test assert #1');

console.log('MULTI\nLINE\nTEXT\nLOG');

console.group('Group test #1');
console.log('Normal log behavior:', 2, {test: 1});
console.table({test: 1}, 'Some compatibility fns.');
console.debug({test: 1}, 'Some alias fns.');

console.groupCollapsed('Group test #2');
console.assert(false, 'Test assert #2');
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
    someFunction();
} catch (e) {
    console.error(e);
    console.warn(e);
}

console.groupEnd();

console.info('Info', {test: 1});
console.debug('Debug', {test: 1});
console.error('Error', {test: 1});

console.count('Counter');
console.count('Counter');
console.count('Counter');

console.time('Timer #1');
console.timeEnd('Timer #1');

console.time('Timer #2');
setTimeout(() => {
    console.timeEnd('Timer #2');
    console.log(console.buffer);
}, 1000);
```