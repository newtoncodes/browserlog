'use strict';

const Util = require('util');

const original = {
    assert: console.assert.bind(console),
    clear: console.clear.bind(console),
    log: console.log.bind(console),
    info: console.info.bind(console),
    debug: console.debug.bind(console),
    dir: console.dir.bind(console),
    table: console.table ? console.table.bind(console) : console.dir.bind(console),
    error: console.error.bind(console),
    warn: console.warn.bind(console),
    trace: console.trace.bind(console),
    group: console.group.bind(console),
    groupCollapsed: console.groupCollapsed.bind(console),
    groupEnd: console.groupEnd.bind(console),
    count: console.count.bind(console),
    time: console.time.bind(console),
    timeEnd: console.timeEnd.bind(console),
    profile: console.profile.bind(console),
    profileEnd: console.profileEnd.bind(console),
    timeStamp: console.timeStamp.bind(console)
};


class Stream {
    /**
     * @param {Logger} [logger]
     * @param {object} [options]
     * @param {string|Array.<string>} [options.style]
     * @param {boolean} [options.silent]
     * @param {boolean} [options.save]
     * @param {boolean} [options.saveLogger]
     * @param {number} [options.bufferSize]
     * @param {boolean} [options.date]
     * @param {boolean} [options.time]
     * @param {boolean} [options.colors]
     * @param {boolean} [options.colorsFull]
     * @param {string} [options.label]
     */
    constructor(logger, options) {
        if (arguments.length === 1) {
            if (logger.log && logger.assert && (typeof logger.error === 'function')) options = {};
            else {
                options = arguments[0];
                logger = null;
            }
        } else if (arguments.length === 0) {
            options = {};
            logger = null;
        }

        let {
            style,
            silent,
            save,
            saveLogger,
            bufferSize,
            bufferDate,
            bufferTime,
            colors,
            colorsFull,
            label
        } = options;

        if (typeof bufferDate === 'undefined') bufferDate = true;
        if (typeof bufferTime === 'undefined') bufferTime = true;
        if (typeof colors === 'undefined') colors = true;
        if (typeof colorsFull === 'undefined') colorsFull = (colors && !label);

        /**
         * @type {Logger}
         * @protected
         */
        this._logger = logger;

        /**
         * @type {boolean}
         * @protected
         */
        this._save = !!save;

        /**
         * @type {boolean}
         * @protected
         */
        this._saveLogger = !!saveLogger;

        /**
         * @type {number}
         * @protected
         */
        this._bufferSize = bufferSize || 1024 * 1024;

        /**
         * @type {string}
         * @protected
         */
        this._buffer = '';

        /**
         * @type {boolean}
         * @protected
         */
        this._silent = !!silent;

        /**
         * @type {boolean}
         * @protected
         */
        this._colors = !!colors;

        /**
         * @type {boolean}
         * @protected
         */
        this._colorsFull = !!colorsFull;

        /**
         * @type {Array.<string>|string}
         * @protected
         */
        this._style = [];

        /**
         * @type {object}
         * @protected
         */
        this._counters = {};

        /**
         * @type {object}
         * @protected
         */
        this._timers = {};

        /**
         * @type {number}
         * @protected
         */
        this._depth = 0;

        /**
         * @type {boolean}
         * @protected
         */
        this._bufferDate = !!bufferDate;

        /**
         * @type {boolean}
         * @protected
         */
        this._bufferTime = !!bufferTime;

        /**
         * @type {string}
         * @protected
         */
        this._label = label || '';

        /**
         * @type {boolean}
         * @protected
         */
        this._nl = true;

        this.style = style;
        this.colors = colors;
    }

    /**
     * @param {boolean|*} assertion
     * @param {string|*} msg
     * @param {...*} [param]
     */
    assert(assertion, msg, param) {
        if (assertion) return;

        let args = [].filter.call(arguments, (arg, i) => i > 0);

        if (typeof args[0] === 'string') args[0] = 'Assertion failed: ' + args[0];
        else args.unshift('Assertion failed:');

        let stack = '';
        let text = Util.format.apply(this, args);

        this.writeBuffer('[ERROR] ' + text + '\n');

        !this._silent && original.assert.apply(original, arguments);
    }

    /**
     *
     */
    clear() {
        this.clearConsole();
        this.clearBuffer();
    }

    /**
     * @param {...*} [param]
     */
    log(param) {
        let text = (arguments.length === 1 && typeof param === 'string') ? param : Util.format.apply(this, arguments);
        this.writeConsole('log', [].map.call(arguments, a => a));
        this.writeBuffer(text + '\n');
    }

    /**
     * @param {...*} [param]
     */
    info(param) {
        this.log.apply(this, arguments);
    }

    /**
     * @param {...*} [param]
     */
    debug(param) {
        this.log.apply(this, arguments);
    }

    /**
     * @param {*} object
     * @param {string} title
     * @param {object} [options]
     */
    dir(object, title, options) {
        if (arguments.length === 2) {
            if (typeof arguments[1] === 'object') {
                options = arguments[1];
                title = '';
            }
        }

        title = title ? title + ': ' : '';
        let params = [];
        if (title) params.push(title + '\n ');
        params.push(object);

        let text = title + Util.inspect(object, options);
        this.writeBuffer(text + '\n');
        this.writeConsole('log', params);
    }

    /**
     * @param {*} object
     * @param {string} title
     * @param {object} [options]
     */
    table(object, title, options) {
        //noinspection JSCheckFunctionSignatures
        this.dir(...arguments);
    }

    /**
     * @param {...*} [error]
     */
    error(error) {
        let stack = '';
        let text = Util.format.apply(this, arguments);
        this.writeBuffer('[ERROR] ' + text + '\n');

        if (!isFirefox && arguments.length === 1 && error instanceof Error) {
            stack = (error.stack || '').replace(/Error[^\n]+/, '');
            this.writeConsole('error', [error, ' \n' + stack.replace('\n', '')]);
            return;
        }

        this.writeConsole('error', [].map.call(arguments, a => a));
    }

    /**
     * @param {...*} [warning]
     */
    warn(warning) {
        let stack = '';
        let text = Util.format.apply(this, arguments);
        this.writeBuffer('[WARN] ' + text + '\n');

        if (!isFirefox && arguments.length === 1 && warning instanceof Error) {
            stack = (warning.stack || '').replace(/Error[^\n]+/, '');
            this.writeConsole('warn', [warning, ' \n' + stack.replace('\n', '')]);
            return;
        }

        this.writeConsole('warn', [].map.call(arguments, a => a));
    }

    /**
     *
     */
    trace(text) {
        let stack = ((new Error()).stack || '').replace(/Error[^\w]+/, '').replace(/(?:\s*(?:at\s+|trace@)[A-Za-z.:\/]+(?:\.trace\s*\(.*\.js.?:\d+:\d+\)|\?:\d+:\d+))+/, '');
        this.writeBuffer('[TRACE] ' + stack + '\n');
        this.writeConsole('warn', ['[TRACE] ' + stack + '\n']);
    }

    /**
     * @param {...*} [param]
     */
    group(param) {
        this.writeBuffer(Util.format.apply(this, arguments) + '\n', true);
        this.writeConsole('group', [].map.call(arguments, a => a));
        this._depth ++;
    }

    /**
     * @param {...*} [param]
     */
    groupCollapsed(param) {
        this.writeBuffer(Util.format.apply(this, arguments) + '\n', true);
        this.writeConsole('groupCollapsed', [].map.call(arguments, a => a));
        this._depth ++;
    }

    /**
     *
     */
    groupEnd() {
        this._depth = Math.max(this._depth - 1, 0);
        !this._silent && original.groupEnd.apply(original, arguments);
    }

    /**
     * @param {string} key
     */
    count(key) {
        this._counters[key] = this._counters[key] || 0;
        this._counters[key] ++;
        this.log(key + ': ' + this._counters[key]);
    }

    /**
     * @param {string} key
     */
    time(key) {
        this._timers[key] = this._timers[key] || Date.now();
    }

    /**
     * @param {string} key
     */
    timeEnd(key) {
        let delta = 0;
        if (this._timers[key]) {
            delta = Date.now() - this._timers[key];
            delete this._timers[key];
        }

        this.log(key + ': ' + delta + 'ms');
    }

    /**
     *
     */
    profile() {
        !this._silent && original.profile.apply(original, arguments);
    }

    /**
     *
     */
    profileEnd() {
        !this._silent && original.profileEnd.apply(original, arguments);
    }

    /**
     *
     */
    timeStamp() {
        !this._silent && original.timeStamp.apply(original, arguments);
    }

    /**
     *
     * @param {string} text
     * @param {boolean} [startGroup]
     * @protected
     */
    writeBuffer(text, startGroup) {
        if (!this._save && !this._saveLogger) return;

        let nl = (text.slice(-1) === '\n');
        text = text.replace(/\n$/, '');

        if (!this._nl) {
            text = indentGroup(text, this._depth, null, true);

            if (text.indexOf('\n') !== -1) {
                text = indentLabel(text, this._label);
                text = indentDate(text, this._bufferDate, this._bufferTime);
            }
        } else {
            if (startGroup) text = appendGroup(text, this._depth + 1, ['grey']);
            text = indentGroup(text, this._depth);
            text = appendLabel(text, this._label);
            text = appendDate(text, this._bufferDate, this._bufferTime);
        }

        if (nl) text += '\n';
        this._nl = nl;

        if (this._save) {
            this._buffer += text;
            if (this._buffer.length > this._bufferSize) this._buffer = this._buffer.slice(0, this._bufferSize);
        }

        if (this._logger && this._saveLogger) this._logger.__addLog(text);
    }

    /**
     * @param {string} [stream='stdout']
     * @param {Array} [params]
     * @protected
     */
    writeConsole(stream = 'log', params) {
        if (this._silent) return;

        original[stream].apply(original, buildStyle(this._label, this._colors && !(stream.indexOf('group') === 0 && isFirefox), this._colorsFull, this._style, params));
    }

    /**
     *
     */
    clearBuffer() {
        if (!this._save) return;
        this._buffer = '';
    }

    /**
     *
     */
    clearConsole() {
        !this._silent && original.clear();
    }

    /**
     *
     */
    __addLog(text) {
        this._buffer += text;
        if (this._buffer.length > this._bufferSize) this._buffer = this._buffer.slice(0, this._bufferSize);
    }

    /**
     * @param {Array.<string>|string} style
     */
    set style(style) {
        if (style) {
            if (typeof style === 'string') style = [style].filter(s => STYLES.indexOf(s) !== -1);
            else if (Array.isArray(style)) style = style.filter(s => STYLES.indexOf(s) !== -1);
            else style = [];
        }

        this._style = style || [];
    }

    /**
     * @param {boolean} silent
     */
    set silent(silent) {
        this._silent = !!silent;
    }

    /**
     * @param {boolean} save
     */
    set save(save) {
        this._save = !!save;
    }

    /**
     * @param {boolean} save
     */
    set saveLogger(save) {
        this._saveLogger = !!saveLogger;
    }

    /**
     * @param {number} bufferSize
     */
    set bufferSize(bufferSize) {
        this._bufferSize = bufferSize;
    }

    /**
     * @param {boolean} date
     */
    set bufferDate(date) {
        this._bufferDate = !!date;
    }

    /**
     * @param {boolean} time
     */
    set bufferTime(time) {
        this._bufferTime = !!time;
    }

    /**
     * @param {boolean} colors
     */
    set colors(colors) {
        this._colors = (!!colors && (isChrome || isFirefox || isSafari || isBlink));
    }

    /**
     * @param {boolean} colorsFull
     */
    set colorsFull(colorsFull) {
        this._colorsFull = !!colorsFull;
    }

    /**
     * @param {string} label
     */
    set label(label) {
        this._label = label;
    }

    /** @return {Array.<string>|string} */
    get style() {
        return this._style;
    }

    /** @return {boolean} */
    get silent() {
        return this._silent;
    }

    /** @return {boolean} */
    get save() {
        return this._save;
    }

    /** @return {boolean} */
    get saveLogger() {
        return this._saveLogger;
    }

    /** @return {string} */
    get buffer() {
        return this._buffer;
    }

    /** @return {number} */
    get bufferSize() {
        return this._bufferSize;
    }

    /** @return {boolean} */
    get bufferDate() {
        return this._bufferDate;
    }

    /** @return {boolean} */
    get bufferTime() {
        return this._bufferTime;
    }

    /** @return {boolean} */
    get colors() {
        return this._colors;
    }

    /** @return {boolean} */
    get colorsFull() {
        return this._colorsFull;
    }

    /** @return {string} */
    get label() {
        return this._label;
    }

    /**
     * @returns {{assert: function, clear, log: function, info: function, debug: function, dir: function, table: function, error: function, warn: function, trace: function, group: function, groupCollapsed: function, groupEnd: function, count: function, time: function, timeEnd: function, profile: function, profileEnd: function, timeStamp: function}}
     */
    get original() {
        return original;
    }
}

// Opera 8.0+
const isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
// Firefox 1.0+
const isFirefox = typeof InstallTrigger !== 'undefined';
// At least Safari 3+: "[object HTMLElementConstructor]"
const isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
// Internet Explorer 6-11
//noinspection PointlessBooleanExpressionJS
const isIE = /*@cc_on!@*/false || !!document.documentMode;
// Edge 20+
const isEdge = !isIE && !!window.StyleMedia;
// Chrome 1+
const isChrome = !!window.chrome && !!window.chrome.webstore;
// Blink engine detection
const isBlink = (isChrome || isOpera) && !!window.CSS;

if (!String.prototype.repeat) {
    String.prototype.repeat = function(count) {
        'use strict';
        if (this == null) throw new TypeError('can\'t convert ' + this + ' to object');
        let str = '' + this;
        count = +count;
        if (count != count) count = 0;
        if (count < 0) throw new RangeError('repeat count must be non-negative');
        if (count == Infinity) {
            throw new RangeError('repeat count must be less than infinity');
        }
        count = Math.floor(count);
        if (str.length == 0 || count == 0) return '';

        if (str.length * count >= 1 << 28) throw new RangeError('repeat count must not overflow maximum string size');

        let rpt = '';
        for (;;) {
            if ((count & 1) == 1) {
                rpt += str;
            }
            count >>>= 1;
            if (count == 0) {
                break;
            }
            str += str;
        }

        return rpt;
    }
}


const STYLES = [
    'black',
    'red',
    'green',
    'yellow',
    'blue',
    'magenta',
    'cyan',
    'white',
    'gray',
    'grey',
    'bgBlack',
    'bgRed',
    'bgGreen',
    'bgYellow',
    'bgBlue',
    'bgMagenta',
    'bgCyan',
    'bgWhite',
    'reset',
    'bold',
    'italic',
    'underline'
];

const STYLES_MAP = {
    'black': 'color: black;',
    'red': 'color: red;',
    'green': 'color: green;',
    'yellow': 'color: yellow;',
    'blue': 'color: blue;',
    'magenta': 'color: magenta;',
    'cyan': 'color: cyan;',
    'white': 'color: white;',
    'gray': 'color: gray;',
    'grey': 'color: grey;',
    'bgBlack': 'background-color: black;',
    'bgRed': 'background-color: read;',
    'bgGreen': 'background-color: green;',
    'bgYellow': 'background-color: yellow;',
    'bgBlue': 'background-color: blue;',
    'bgMagenta': 'background-color: magenta;',
    'bgCyan': 'background-color: cyan;',
    'bgWhite': 'background-color: white;',
    'reset': 'color: inherit; background-color: inherit; font-weight: inherit; font-style: inherit;',
    'reset2': 'color: inherit; background-color: inherit; font-style: inherit;',
    'bold': 'font-weight: bold;',
    'italic': 'font-style: italic;',
    'underline': 'text-decoration: underline'
};

function getDate(date, time) {
    if (!date && !time) return '';

    let t = new Date();
    let d = t.getFullYear().toString().slice(-2) + '-' + ('0' + t.getMonth()).slice(-2) + '-' + ('0' + t.getDate()).slice(-2);
    let h = ('0' + t.getHours()).slice(-2) + ':' + ('0' + t.getMinutes()).slice(-2) + ':' + ('0' + t.getSeconds()).slice(-2);

    if (date && !time) return d;
    if (!date && time) return h;

    return d + ' ' + h;
}

function indent(text, str) {
    return (text || '').replace(/^(.|$)/gm, (s, a) => str + a);
}

function appendDate(text, date, time) {
    let d = getDate(date, time);
    if (d) d = d + '  ';
    else d = '';
    let r = ' '.repeat(d.length);

    return (text || '').replace(/^(.|$)/gm, (s, a) => r + a).replace(r, d);
}

function indentDate(text, date, time) {
    let d = getDate(date, time);
    if (d) d = d + '  ';
    else d = '';
    let r = ' '.repeat(d.length);

    return indent(text || '', r).replace(r, '');
}

function appendLabel(text, label) {
    if (!label) return text;

    label = '[' + label + '] ';
    let r = ' '.repeat(label.length);

    return label + indent(text, r).replace(r, '');
}

function appendGroup(text, depth) {
    if (depth <= 0) return text;

    let r = '  '.repeat(depth);

    return (text || '').replace(/^(.|$)/gm, (s, a) => r + a).replace(r, '+ ');
}

function indentLabel(text, label) {
    if (!label) return text;

    label = '[' + label + '] ';
    let r = ' '.repeat(label.length);

    return indent(text, r).replace(r, '');
}

function indentGroup(text, depth, cut) {
    if (depth <= 0) return text;

    let r = ':  '.repeat(depth);

    let t = (text || '').replace(/^(.|$)/gm, (s, a) => r + a);
    if (cut) t = t.replace(r, '');

    return t;
}


function combineStrings(params) {
    let newParams = [];
    let nonString = false;
    let string = '';

    params.forEach(param => {
        if (typeof param === 'string') {
            if (!nonString) string += (string ? ' ' : '') + param;
            else newParams.push(param);
        } else {
            nonString = true;
            newParams.push(param);
        }
    });

    if (string) newParams.unshift(string);

    return newParams;
}

function buildStyle(label, colors, colorsFull, styles, params) {
    params = params.slice(0);

    let prefix = '';
    let reset = (label && colors && !colorsFull);
    if (label) label = '[' + label + ']';

    if (label) {
        prefix = label;

        if (colors) {
            prefix = '%c' + prefix;
            if (!colorsFull) prefix += '%c';
        }
    } else if (colors) {
        prefix = '%c';
    }

    if (prefix) params.unshift(prefix);
    params = combineStrings(params);

    let found = false;
    params = params.map(param => {
        if (typeof param === 'string') {
            let r = ' '.repeat(label.length + 1);
            return indent(param, r).replace(r, '');
        }

        return param;
    });

    if (colors && typeof params[0] === 'string') {
        params.splice(1, 0, styles.reduce((current, style) => current + STYLES_MAP[style], ''));
        if (reset) params.splice(2, 0, STYLES_MAP['reset']);
    }

    return params;
}


module.exports = Stream;