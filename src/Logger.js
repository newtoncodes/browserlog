'use strict';

const Stream = require('./Stream');


class Logger {
    /**
     * @param {object} [options]
     * @param {string|Array.<string>} [options.style]
     * @param {string} [options.file]
     * @param {boolean} [options.silent]
     * @param {boolean} [options.date]
     * @param {boolean} [options.time]
     */
    constructor(options = {}) {
        options = options || {};
        options['saveLogger'] = false;

        this.__default = new Stream(this, options);
    }

    /**
     * @param {boolean|*} assertion
     * @param {string|*} msg
     * @param {...*} [param]
     */
    assert(assertion, msg, param) {
        this.__default.assert.apply(this.__default, arguments);
    }

    /**
     *
     */
    clear() {
        this.__default.clear.apply(this.__default, arguments);
    }

    /**
     *
     */
    clearBuffer() {
        this.__default.clearBuffer.apply(this.__default, arguments);
    }

    /**
     *
     */
    clearConsole() {
        this.__default.clearConsole.apply(this.__default, arguments);
    }

    /**
     * @param {...*} [param]
     */
    write(param) {
        this.__default.write.apply(this.__default, arguments);
    }

    /**
     * @param {...*} [param]
     */
    log(param) {
        this.__default.log.apply(this.__default, arguments);
    }

    /**
     * @param {...*} [param]
     */
    info(param) {
        this.__default.info.apply(this.__default, arguments);
    }

    /**
     * @param {...*} [param]
     */
    debug(param) {
        this.__default.debug.apply(this.__default, arguments);
    }

    /**
     * @param {*} object
     * @param {string} title
     * @param {object} [options]
     */
    dir(object, title, options) {
        this.__default.dir.apply(this.__default, arguments);
    }

    /**
     * @param {...*} [param]
     */
    table(param) {
        this.__default.table.apply(this.__default, arguments);
    }

    /**
     * @param {...*} [error]
     */
    error(error) {
        this.__default.error.apply(this.__default, arguments);
    }

    /**
     * @param {...*} [warning]
     */
    warn(warning) {
        this.__default.warn.apply(this.__default, arguments);
    }

    /**
     *
     */
    trace(text) {
        this.__default.trace.apply(this.__default, arguments);
    }

    /**
     * @param {...*} [param]
     */
    group(param) {
        this.__default.group.apply(this.__default, arguments);
    }

    /**
     * @param {...*} [param]
     */
    groupCollapsed(param) {
        this.__default.groupCollapsed.apply(this.__default, arguments);    }

    /**
     *
     */
    groupEnd() {
        this.__default.groupEnd.apply(this.__default, arguments);
    }

    /**
     * @param {string} key
     */
    count(key) {
        this.__default.count.apply(this.__default, arguments);
    }

    /**
     * @param {string} key
     */
    time(key) {
        this.__default.time.apply(this.__default, arguments);
    }

    /**
     * @param {string} key
     */
    timeEnd(key) {
        this.__default.timeEnd.apply(this.__default, arguments);
    }

    /**
     * Not implemented
     * @deprecated
     */
    profile() {
        //noinspection JSDeprecatedSymbols
        this.__default.profile.apply(this.__default, arguments);
    }

    /**
     * Not implemented
     * @deprecated
     */
    profileEnd() {
        //noinspection JSDeprecatedSymbols
        this.__default.profileEnd.apply(this.__default, arguments);
    }

    /**
     * Not implemented
     * @deprecated
     */
    timeStamp() {
        //noinspection JSDeprecatedSymbols
        this.__default.timeStamp.apply(this.__default, arguments);
    }

    /**
     * @param {string} name
     * @param {Object} options
     * @param {string|Array.<string>} [options.style]
     * @param {string} [options.file]
     * @param {boolean} [options.silent]
     * @param {boolean} [options.useStderr]
     */
    add(name, options) {
        this[name] = new Stream(this, options);
    }

    /**
     * @param {string} name
     */
    remove(name) {
        if (this[name] && (this[name] instanceof Stream)) delete this[name];
    }

    /**
     *
     */
    muteAll() {
        Object.keys(this).forEach(key => {
            if (this[key] instanceof Stream) this[key].silent = true;
        })
    }

    /**
     *
     */
    unmuteAll() {
        Object.keys(this).forEach(key => {
            if (this[key] instanceof Stream) this[key].silent = false;
        })
    }

    /**
     *
     */
    __addLog() {
        this.__default.__addLog.apply(this.__default, arguments);
    }

    /**
     * @param {Array.<string>|string} style
     */
    set style(style) {
        this.__default.style = style;
    }

    /**
     * @param {boolean} silent
     */
    set silent(silent) {
        this.__default.silent = silent;
    }

    /**
     * @param {boolean} save
     */
    set save(save) {
        this.__default.save = save;
    }

    /**
     * @param {number} bufferSize
     */
    set bufferSize(bufferSize) {
        this.__default.bufferSize = bufferSize;
    }

    /**
     * @param {boolean} date
     */
    set bufferDate(date) {
        this.__default.bufferDate = date;
    }

    /**
     * @param {boolean} time
     */
    set bufferTime(time) {
        this.__default.bufferTime = time;
    }

    /**
     * @param {boolean} colors
     */
    set colors(colors) {
        this.__default.colors = colors;
    }

    /**
     * @param {boolean} colorsFull
     */
    set colorsFull(colorsFull) {
        this.__default.colorsFull = colorsFull;
    }

    /**
     * @param {string} label
     */
    set label(label) {
        this.__default.label = label;
    }

    /** @return {Array.<string>|string} */
    get style() {
        return this.__default.style;
    }

    /** @return {boolean} */
    get silent() {
        return this.__default.silent;
    }

    /** @return {boolean} */
    get save() {
        return this.__default.save;
    }

    /** @return {string} */
    get buffer() {
        return this.__default.buffer;
    }

    /** @return {number} */
    get bufferSize() {
        return this.__default.bufferSize;
    }

    /** @return {boolean} */
    get bufferDate() {
        return this.__default.bufferDate;
    }

    /** @return {boolean} */
    get bufferTime() {
        return this.__default.bufferTime;
    }

    /** @return {boolean} */
    get colors() {
        return this.__default.colors;
    }

    /** @return {boolean} */
    get colorsFull() {
        return this.__default.colorsFull;
    }

    /** @return {string} */
    get label() {
        return this.__default.label;
    }

    /**
     * @returns {{assert: function, clear, log: function, info: function, debug: function, dir: function, table: function, error: function, warn: function, trace: function, group: function, groupCollapsed: function, groupEnd: function, count: function, time: function, timeEnd: function, profile: function, profileEnd: function, timeStamp: function}}
     */
    get original() {
        return this.__default.original;
    }
}


module.exports = Logger;