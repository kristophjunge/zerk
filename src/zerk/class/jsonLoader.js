/**
 * JSON Loader
 *
 * Loads JSON resources via Ajax.
 *
 * @class jsonLoader
 * @namespace zerk
 * @module zerk
 **/
/*
 * TODO Ensure its possible to use comments inside the JSON files
 */
zerk.define({

    name: 'zerk.jsonLoader',
    require: [
        'zerk.network.ajax'
    ]

}, {

    /**
     * Register of loaded resources
     *
     * @property _data
     * @type Object
     * @protected
     **/
    _data: {},

    /**
     * Namespace configuration
     *
     * @property _namespace
     * @type Object
     * @protected
     **/
    _namespace: {},

    /**
     * AJAX interface to load the resources
     *
     * @property _ajax
     * @type zerk.network.ajax
     * @protected
     **/
    _ajax: null,

    /**
     * Class constructor
     *
     * @method init
     * @param {Object} config Configuration object
     **/
    init: function(config) {

        if (config) {
            this.setConfig(config);
        }

        this._ajax = zerk.create('zerk.network.ajax');

    },

    /**
     * Loads one resource
     *
     * Fires successFn when the resource is loaded.
     *
     * @method loadResource
     * @param {String} resource Resource id
     * @param {Function} successFn Event handler for success
     * @param {Function} errorFn Event handler for error
     * @protected
     * @async
     **/
    _loadJSON: function(id, successFn, errorFn) {

        var path = this._getResourcePath(id);
        if (!path) {
            zerk.error('Resource not found "' + id + '"');
        }

        var self = this;

        this._ajax.request(
            path,
            false,
            function(request) {

                try {

                    var jsondata = JSON5.parse(request.responseText);

                } catch (e) {

                    console.log(
                        'Parse error "' + e.message + '" at position ' + e.at
                    );
                    console.log(e.text);

                    if (typeof error == 'function') {

                        error({
                            at: e.at,
                            message: e.message,
                            text: e.text
                        });

                    }

                }

                self._data[id] = jsondata;

                if (zerk.isFunction(successFn)) {
                    successFn(id, zerk.clone(self._data[id]));
                }

            },
            function(request) {

                errorFn({
                    resource: id,
                    path: path,
                    message: 'Couldnt load',
                    status: request.status
                });

            }
        );

    },

    /**
     * Loads multiple resources
     *
     * Fires successFn when all resources are loaded.
     *
     * @method require
     * @param {Array} resources Array of resource id's
     * @param {Function} successFn Event handler for success
     * @param {Function} errorFn Event handler for error
     * @async
     **/
    require: function(idList, successFn, errorFn) {

        var me = this;

        if (!zerk.isDefined(successFn)) {
            successFn = zerk.emptyFn();
        }
        if (!zerk.isDefined(errorFn)) {
            errorFn = zerk.emptyFn();
        }

        var completed = [];
        var unloaded = [];
        var result = {};

        for (var i = 0; i < idList.length; i++) {
            if (this.isLoaded(idList[i])) {
                result[idList[i]] = me.getResource(idList[i]);
            } else {
                unloaded.push(idList[i]);
            }
        }

        if (unloaded.length == 0) {
            successFn(result);
        }

        for (var i = 0; i < unloaded.length; i++) {
            this._loadJSON(
                unloaded[i],
                function(id, data) {
                    completed.push(unloaded[i]);
                    result[id] = data;
                    if (completed.length == unloaded.length) {
                        successFn(result);
                    }
                },
                errorFn
            );
        }

    },

    clear: function() {

        var me = this;
        me._data = {};

    },

    /**
     * Returns a preloaded resource
     *
     * @method getResource
     * @param {String} id Resource id
     * @return {Object} The resource data
     **/
    getResource: function(id) {

        if (typeof this._data[id] == 'undefined') {
            return;
        }

        return zerk.clone(this._data[id]);

    },

    /**
     * Sets the namespace configuration
     *
     * @method setConfig
     * @param {Object} config Configuration object
     **/
    setConfig: function(config) {

        for (var i = 0; i < config.length; i++) {

            this._namespace[config[i].namespace] = config[i].path;

        }

    },

    /**
     * Returns true when resource is loaded already
     *
     * @method isLoaded
     * @param {String} id Resource id
     * @return {Boolean} True when the resource is loaded already
     **/
    isLoaded: function(id) {

        return zerk.isDefined(this._data[id]);

    },

    /**
     * Returns the path for given resource id
     *
     * This method is using the namespace configuration.
     *
     * @method _getResourcePath
     * @param {String} id Resource id
     * @return {String} Path to resource
     * @protected
     **/
    _getResourcePath: function(id) {

        for (var ns in this._namespace) {

            if (ns.length > id.length) {
                continue;
            }

            if (ns == id.substr(0, ns.length)) {

                var localPart = id.substr(ns.length + 1);

                localPart = localPart.replace(/\./g, '/');

                return this._namespace[ns] + '/' + localPart + '.json?r=' + Math.random();

            }

        }

        return false;

    },

    addNamespace: function(ns, path) {

        this._namespace[ns] = path;

    }

});
