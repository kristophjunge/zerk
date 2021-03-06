/*
 * TODO Turn Zerk main object internal members into private scope
 */

/**
 * Zerk Object
 *
 * The Zerk main object and namespace
 *
 * @class zerk
 * @module zerk
 * @static
 **/
var zerk = {

    /**
     * The game engine configuration
     *
     * @property _config
     * @type Object
     * @private
     **/
    _config: {
        bootstrap: {
            log: {
                enabled: true,
                severity: 0, // 0 = All
                groupFilter: null,
                wrapErrors: true
            }
        }
    },
    /**
     * Load state of classes
     *
     * @property _classState
     * @type Object
     * @private
     **/
    _classState: {},

    /**
     * Class name to instance map
     *
     * @property _classMap
     * @type Object
     * @private
     **/
    _classMap: {},

    /**
     * Class name to parent class map
     *
     * @property _parentClassMap
     * @type Object
     * @private
     **/
    _parentClassMap: {},

    emptyFn: function() {},

    /**
     * The main bootstrap method
     *
     * @method init
     * @param {Object} config Configuration object
     **/
    init: function(config) {

        var me = this;

        zerk.apply(me._config, config);

        me._initErrorHandler();

        me.game = zerk.create(
            me._config.bootstrap.game + '.game',
            me._config
        );

    },

    /*--------------------------------------------------------------------------
     | Class System
     *------------------------------------------------------------------------*/

    /**
     * Defines a new class
     *
     *    // Class definition without meta object
     *    zerk.define('myNamespace.myClass',{
     *        // ...
     *    });
     *
     *    // Class definition with meta object
     *    zerk.define({
     *        name: 'myNamespace.myClass',
     *        extend: 'myNamespace.myParentClass'
     *        require: [
     *            'myNamespace.myParentClass'
     *        ]
     *    },{
     *        // ...
     *    });
     *
     * @method define
     * @param {String|Object} name The name of the class or a meta object
     * @param {Object} body The body of the class
     * @param {Function} callback Callback function that fires when the
     *     class definition is done
     * @async
     **/
    define: function(name, body, callback) {

        // Parse meta data
        var meta = this._parseMeta(name);

        this._defineClass(meta, body, callback);

    },

    /**
     * Method for inheritance like parent class calls
     *
     * Use this with the apply method to inject the local scope.
     *
     *    zerk.parent('myClass').myMethod.apply(
     *        this,
     *        arguments
     *    );
     *
     * @method parent
     * @param {String} name The name of the class
     * @return {Object} The parent class
     **/
    parent: function(name) {

        return this._parentClassMap[name];

    },

    /**
     * Creates a class instance
     *
     * All arguments after 'name' are passed to the init method of the class.
     *
     * @method create
     * @param {String} name The name of the class
     * @return {Object} Class instance
     **/
    create: function(name) {

        if (arguments.length == 0) {
            return;
        }

        var args = Array.prototype.slice.call(arguments);
        var parent = args[0];

        var parentClass;

        if (typeof parent === 'string') {
            parentClass = this._classMap[parent];
        } else {
            parentClass = parent;
            parent = 'Object';
        }

        /*
         * TODO Create a useful error handling here
         */
        if (typeof parentClass === 'undefined') {
            zerk.error('Class is undefined "' + parent + '"');
            return null;
        }

        var constructorArguments = args.slice(1);

        /*
         * TODO Check if the _createObject method could be used here
         */
        function f() {}
        if (typeof parentClass == 'object') {
            f.prototype = parentClass;
        }
        var i = new f();

        if (typeof i.init !== 'undefined') {
            i.init.apply(i, constructorArguments);
        }

        return i;

    },

    /**
     * Defines a class
     *
     * @method _defineClass
     * @param {Object} meta Class meta object
     * @param {Object} body Class body
     * @param {Function} callback Callback function that fires after the
     *     class was defined
     * @return {Object} Class definition
     * @private
     * @async
     **/
    _defineClass: function(meta, body, callback) {

        var baseClass = null;

        // Parse class name
        var classNameInfo = this._parseClassName(meta.name);

        if (meta.extend) {
            baseClass = this._classMap[meta.extend];
            if (!zerk.isDefined(baseClass)) {
                zerk.error('Undefined: ' + classNameInfo.parent + ' when loading ' + classNameInfo.path);
            }
        } else {
            baseClass = {};
        }

        var i = this._createObject(baseClass);

        for (var name in body) {
            i[name] = body[name];
        }

        i.$class = classNameInfo.path;

        // Add an entry to the class map
        this._classMap[meta.name] = i;

        // Add an entry to the parent class map
        this._parentClassMap[meta.name] = baseClass;

        if (meta.callback) {
            meta.callback.call();
        }

        this._classState[meta.name] = 'loaded';

        if (typeof callback !== 'undefined') {
            callback();
        }

        return this._classMap[meta.name];

    },

    /**
     * Creates an object from parent object definition
     *
     * This is an implementation of Douglas Crockfords prototypal
     * inheritance in JavaScript.
     *
     * <a href="http://javascript.crockford.com/prototypal.html">
     * http://javascript.crockford.com/prototypal.html</a>
     *
     * @method _createObject
     * @param {Object} parent
     * @return {Object} The created object
     * @private
     **/
    _createObject: function(parent) {

        /*
         * TODO Create a useful error handling here
         */
        if (typeof parent === 'undefined') {
            console.log('Error: Object to create is undefined');
            return null;
        }

        function f() {}

        if (typeof parent == 'object') {
            f.prototype = parent;
        }

        return new f();

    },

    /**
     * Checks if a class is loaded and defined already
     *
     * @method _classLoaded
     * @param {String} className The name of the class
     * @return {Boolean} Returns true if the class is loaded and defined
     *     already
     * @private
     **/
    _classLoaded: function(className) {

        if (typeof this._classState[className] !== 'undefined') {
            return (this._classState[className] == 'loaded');
        }

    },

    /**
     * Returns the url for given class name
     *
     * @method _getClassURL
     * @param {String} className The name of the class
     * @return {String} Class name in object key notation
     * @private
     **/
    _getClassURL: function(className) {

        var segments = className.split('.');

        if (segments.length < 2) {
            return;
        }

        var ns = segments[0];

        segments.splice(0, 1);

        var path = segments.join('/') + '.js';

        return ((ns == 'zerk') ?
            this._config.bootstrap.zerkDir
            : this._config.bootstrap.gameDir) + '/class/' + path;

    },

    /**
     * Normalize meta data
     *
     * @method _parseMeta
     * @param {String|Object} meta A class meta data object or name
     * @return {Object} The parsed meta data object
     * @private
     **/
    _parseMeta: function(meta) {

        var result = {
            name: meta.name,
            extend: ((typeof meta.extend !== 'undefined') ? meta.extend : ''),
            require: ((typeof meta.require !== 'undefined') ? meta.require : [])
        };

        if (result.extend) {

            var extendRequireExisting = false;

            for (var i = 0; i < result.require.length; i++) {

                if (result.require[i] == result.extend) {
                    extendRequireExisting = true;
                    break;
                }

            }

            if (!extendRequireExisting) {
                result.require.push(result.extend);
            }

        }

        return result;

    },

    /**
     * Parses given class name and returns detailed information
     *
     * @method _parseClassName
     * @param {String} className The name of the class
     * @return {Object} An object containing namespace information
     * @private
     **/
    _parseClassName: function(className) {

        var path = className.split('.');
        var parent = path.slice(0, -1);
        var name = path.slice(path.length - 1, path.length);

        return {
            name: name[0],
            parent: parent.join('.'),
            path: className
        };

    },

    /*--------------------------------------------------------------------------
     | Error Handling And Logging
     *------------------------------------------------------------------------*/

    /**
     * Initializes the error handler
     *
     * @method _initErrorHandler
     * @private
     **/
    _initErrorHandler: function() {

        /*
         * TODO Evaluate that the error handler can be used without suppressing
         *     native errors in some browsers
         */

        var self = this;

        // Set error handler
        window.onerror = function(message, file, line) {

            if (self._config.bootstrap.log.enabled) {

                // Shutdown engine threads
                /*
                 * TODO Implement code to interrupt engine
                 */
                console.log(
                    '%c*** Engine Interrupt ***',
                    'background-color: yellow; color: red'
                );

                // Check for exit exception
                if (message.substr(0, 20) == 'Zerk Exit Exception:') {
                    console.log('- EXIT -');
                    // Suppress browser handling
                    return true;
                // Check for error exception
                } else if (message.substr(0, 15) == 'Zerk Exception:' &&
                self._config.bootstrap.log.wrapErrors) {
                    // Suppress browser handling
                    return true;
                } else {
                    /*
                     * TODO Validate that the error handler never suppresses native errors
                     */
                    console.log('E', message);
                    return false;
                }

            } else {
                console.log('E', message);
                return false;
                /*
                 * TODO Implement code to handle errors in production
                 */
                // Suppress browser handling
                //return true;
            }

        };

    },

    /**
     * Log message
     *
     * The message can be specified as object with additional options:
     *
     *     zerk.log({
     *         message: 'Log message',
     *         group: 'Custom Group',
     *         severity: 2
     *     })
     *
     * @method log
     * @param {String|Object} message Log message
     **/
    log: function(message) {

        var config = this._config.bootstrap.log;

        var entry = message || {};

        if (typeof entry == 'string') {
            entry = {message: entry};
        }

        if (typeof entry.severity == 'undefined') {
            entry.severity = 1;
        }

        if (typeof entry.group == 'undefined') {
            entry.group = '';
        }

        var severityCondition = (
            config.severity == 0 ||
            entry.severity <= config.severity
        );

        var filterCondition = true;
        if (config.groupFilter != null) {
            filterCondition = zerk.inArray(
                entry.group,
                config.groupFilter
            );
        }

        if (!config.enabled ||
        !severityCondition ||
        !filterCondition) {
            return;
        }

        var severenityIndicator = '';
        var label = '';

        severenityIndicator = '';

        while (severenityIndicator.length < (entry.severity - 1) * 2) {
            severenityIndicator += '. ';
        }

        label = severenityIndicator +
            ((entry.group) ? entry.group + ':' : '');

        if (label) {
            console.info(label, entry.message);
        } else {
            console.info(entry.message);
        }

    },

    /**
     * Warn message
     *
     * The message can be specified as object with additional options:
     *
     *     zerk.warn({
     *         message: 'Log message',
     *         group: 'Custom Group'
     *     })
     *
     * @method warn
     * @param {String|Object} message Warn message
     **/
    warn: function(message) {

        warning = message || {};

        if (typeof warning == 'string') {
            warning = {message: warning};
        }

        if (typeof warning.group == 'undefined') {
            warning.group = '';
        }

        if (!this._config.bootstrap.log.enabled) {
            return;
        }

        var label = ((warning.group) ? warning.group + ':' : '');

        if (label) {
            console.warn(label, warning.message);
        } else {
            console.warn(warning.message);
        }

    },

    /**
     * Raise error
     *
     * The message can be specified as object with custom data:
     *
     *     zerk.error({
     *         message: 'Log message',
     *         customData: 'Debug me'
     *     })
     *
     * @method error
     * @param {String|Object} message Error message
     **/
    error: function(message) {

        // Force string into object

        var error = message || {};

        if (typeof message == 'string') {
            error = {message: error};
        }

        // Extract class and method names from source property
        if (error.source) {

            var caller = arguments.callee.caller;

            error.sourceClass = error.source.$class;

            for (var member in error.source) {
                if (typeof error.source[member] == 'function' &&
                error.source[member] == caller) {
                    error.sourceMethod = member;
                    break;
                }
            }

            // Delete source to prevent browser crash!?
            delete error.source;

        }

        // Extend native error object

        var zerkException = function(exception) {

            // Force string into object

            data = exception || {};

            if (typeof data == 'string') {
                data = {message: data};
            }

            // Apply properties
            zerk.apply(this, data);

            // Setup error name
            this.name = 'Zerk Exception';

        };

        zerkException.prototype = Error.prototype;

        zerkException.prototype.toString = function() {
            return this.message || '(Empty message)';
        };

        var exception = new zerkException(error);

        if (this._config.bootstrap.log.enabled &&
        this._config.bootstrap.log.wrapErrors) {

            // Display wrapped error message

            // Start group
            console.group('Zerk Error');

            // console.error to render the message with stacktrace
            console.error(exception);

            // Extract meta data
            var meta = {};
            zerk.apply(meta, error);
            delete meta.message;

            // console.dir to display meta data
            console.dir(meta);

            // End group
            console.groupEnd();

        }

        // Throw to halt the execution
        throw exception;

    },

    /**
     * Halt execution
     *
     * Throws an exception to halt the execution. Used for debbuging purposes.
     *
     * @method exit
     **/
    exit: function() {

        // Create exit exception

        var zerkExitException = function() {
            this.name = 'Zerk Exit Exception';
            this.message = 'This is not an error';
        };

        zerkExitException.prototype = Error.prototype;

        throw new zerkExitException();

    },

    /*--------------------------------------------------------------------------
     | Type Check Methods
     *------------------------------------------------------------------------*/

    /**
     * Returns the type of the given variable as string.
     *
     * Possible values are:
     *
     *     "undefined"
     *     "null"
     *     "string"
     *     "number"
     *     "boolean"
     *     "date"
     *     "function"
     *     "object"
     *     "array"
     *     "regexp"
     *     "element"
     *
     * @method typeOf
     * @param {Mixed} value
     * @return {String}
     */
    typeOf: function(value) {

        if (value === null) {
            return 'null';
        }

        var type = typeof value;

        if (type === 'undefined' ||
        type === 'boolean' ||
        type === 'number' ||
        type === 'string') {
            return type;
        }

        switch (Object.prototype.toString.call(value)) {
            case '[object Boolean]': return 'boolean';
            case '[object Number]': return 'number';
            case '[object Date]': return 'date';
            case '[object RegExp]': return 'regexp';
            case '[object Array]': return 'array';
        }

        if (type === 'function') {
            return 'function';
        }

        if (type === 'object') {

            if (value.nodeType !== undefined) {
                return 'element';
            }

            return 'object';

        }

    },

    /**
     * Returns true if the given variable is not undefined.
     *
     * @method isDefined
     * @param {Object} value
     * @return {Boolean}
     */
    isDefined: function(value) {

        return typeof value !== 'undefined';

    },

    /**
     * Returns true if the given variable is boolean.
     *
     * @method isBoolean
     * @param {Object} value
     * @return {Boolean}
     */
    isBoolean: function(value) {

        return typeof value === 'boolean';

    },

    /**
     * Returns true if the given variable is a number.
     *
     * @method isNumber
     * @param {Object} value
     * @return {Boolean}
     */
    isNumber: function(value) {

        return typeof value === 'number' && isFinite(value);

    },

    /**
     * Returns true if the given variable is a string.
     *
     * @method
     * @param {Object} value
     * @return {Boolean}
     */
    isString: function(value) {

        return typeof value === 'string';

    },

    /**
     * Returns true if the given variable is a date.
     *
     * @method isDate
     * @param {Object} value
     * @return {Boolean}
     */
    isDate: function(value) {

        return Object.prototype.toString.call(value) === '[object Date]';

    },

    /**
     * Returns true if the given variable is an array.
     *
     * Link to the native "Array.isArray" method is possible.
     *
     * @method isArray
     * @param {Object} value
     * @return {Boolean}
     */
    isArray: ('isArray' in Array) ? Array.isArray : function(value) {

        return Object.prototype.toString.call(value) === '[object Array]';

    },

    /**
     * Returns true if the given variable is an object.
     *
     * @method isObject
     * @param {Object} value
     * @return {Boolean}
     */
    isObject: function(value) {

        return Object.prototype.toString.call(value) === '[object Object]';

    },

    /**
     * Returns true if the given variable is a function.
     *
     * @method isFunction
     * @param {Object} value
     * @return {Boolean}
     */
    isFunction: function(value) {

        return typeof value === 'function';

    },

    /**
     * Returns true if the given variable a primitive type.
     *
     * Primitive types are boolean, number and string.
     *
     * @method isPrimitiveType
     * @param {Object} value
     * @return {Boolean}
     */
    isPrimitiveType: function(value) {

        var type = typeof value;

        return type === 'string' || type === 'number' || type === 'boolean';

    },

    /*--------------------------------------------------------------------------
     | Value Check methods
     *------------------------------------------------------------------------*/

    /**
     * Returns true if the given variable is empty.
     *
     * Empty means:
     *
     * Null
     * Undefined
     * Empty array
     * Empty string
     *
     * @method isEmpty
     * @param {Object} value
     * @return {Boolean}
     */
    isEmpty: function(value) {

        return (value === null) ||
            (value === undefined) ||
            (value === '') ||
            (this.isArray(value) && value.length === 0);

    },

    /**
     * Returns true if the given variable contains a numeric value.
     *
     * @method isNumeric
     * @param {Object} value
     * @return {Boolean}
     */
    isNumeric: function(value) {

        return !isNaN(parseFloat(value)) && isFinite(value);

    },

    /*--------------------------------------------------------------------------
     | Language Helpers
     *------------------------------------------------------------------------*/

    /**
     * Apply properties to an object/class
     *
     * @method apply
     * @param {Object} obj The object witch the properties should be applied to
     * @param {Object} props A JSON property structure
     */
    /*
     * TODO Rename the method apply to dont collide with native method
     */
    /*
     * TODO Refactor the apply method
     */
    apply: function(obj, props) {

        for (var name in props) {

            if (this.isObject(obj[name]) &&
            this.isObject(props[name])) {
                this.apply(obj[name], props[name]);
            } else {
                obj[name] = this.clone(props[name]);
            }

        }

    },

    /**
     * Clone variable
     *
     * Returns a deep clone of given variable.
     *
     * @method clone
     * @param {Any} value The variable to clone
     **/
    clone: function(value) {

        var item = value;

        var self = this;

        if (!value) {
            return item;
        }

        var types = [Number, String, Boolean];
        var result;

        types.forEach(function(type) {
            if (item instanceof type) {
                result = type(item);
            }
        });

        if (typeof result == 'undefined') {
            if (Object.prototype.toString.call(item) === '[object Array]') {
                result = [];
                item.forEach(function(child, index, array) {
                    result[index] = self.clone(child);
                });
            } else if (typeof item == 'object') {
                if (item.nodeType && typeof item.cloneNode == 'function') {
                    result = item.cloneNode(true);
                } else if (!item.prototype) {
                    if (item instanceof Date) {
                        result = new Date(item);
                    } else {
                        result = {};
                        for (var i in item) {
                            result[i] = self.clone(item[i]);
                        }
                    }
                } else {
                    if (false && item.constructor) {
                        result = new item.constructor();
                    } else {
                        result = item;
                    }
                }
            } else {
                result = item;
            }
        }

        return result;

    },

    /**
     * Removes duplicate values from an array
     *
     * Takes an input array and returns a new array without duplicate values.
     *
     * @method arrayUnique
     * @param {Array} data The input array
     * @return {Array} Returns the filtered array
     **/
    arrayUnique: function(data) {

        var result = [];
        var existing = {};

        for (var i = 0; i < data.length; i++) {
            /*
             * TODO Check if all 'undefined' should be replaced with undefined without quotes
             */
            if (typeof existing[data[i]] == 'undefined') {
                result.push(data[i]);
                existing[data[i]] = true;
            }
        }

        return result;

    },

    /**
     * Return all the values of an object
     *
     * Returns all the values from the input object in an array.
     *
     * @method objectValues
     * @param {Object} data The input object
     * @return {Array} Returns the values of the object as array
     **/
    objectValues: function(data) {

        var result = [];

        for (var key in data) {
            result.push(data[key]);
        }

        return result;

    },

    /**
     * Returns the names of the object members
     *
     * Returns the names of the object members in an array.
     *
     * @method objectKeys
     * @param {Object} data The input object
     * @return {Array} Returns the names of the object members as array
     **/
    objectKeys: function(data) {

        var result = [];

        for (var key in data) {
            result.push(key);
        }

        return result;

    },

    /**
     * Returns the count of the members of given object
     *
     * @method objectCount
     * @param {Object} data The input object
     * @return {Integer} Member count
     **/
    objectCount: function(data) {

        var result = 0;

        for (var member in data) {
            result++;
        }

        return result;

    },

    /**
     * Checks if a value exists in an array
     *
     * Searches haystack for needle using.
     *
     * @method inArray
     * @param {String} needle The searched value
     * @param {Array} haystack The array
     * @return {Boolean} True when needle in contained in haystack
     **/
    inArray: function(needle, haystack) {

        for (var i = 0; i < haystack.length; i++) {
            if (haystack[i] == needle) {
                return true;
            }
        }

        return false;

    },

    removeFromArray: function(needle, haystack) {

        for (var i = 0; i < haystack.length; i++) {
            if (haystack[i] === needle) {
                haystack.splice(i, 1);
                return true;
            }
        }

        return false;

    },

    rtrim: function(value, chars) {

        if (!zerk.isDefined(chars)) {
            chars = [' '];
        }

        var chars = ((zerk.isArray(chars)) ? chars : [chars]);
        var value = String(value);

        var lastChar = value.substr(-1, 1);
        while (zerk.inArray(lastChar, chars)) {
            value = value.substr(0, value.length - 1);
            lastChar = value.substr(-1, 1);
        }

        return value;

    },

    screenshot: function() {

        var canvas = document.getElementById('zerk_canvas_display');

        var data = canvas.toDataURL('image/png');

        window.open(data);

    }

};
