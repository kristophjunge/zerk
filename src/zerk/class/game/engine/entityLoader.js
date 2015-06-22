/**
 * Entity Loader
 *
 * Provides entity defintions.
 *
 * @class entityLoader
 * @namespace zerk.game.engine
 * @module zerk
 **/
zerk.define({

    name: 'zerk.game.engine.entityLoader'

}, {

    /**
     * JSON loader instance
     *
     * @property _jsonLoader
     * @type zerk.jsonLoader
     * @protected
     **/
    _jsonLoader: null,

    /**
     * Entity register
     *
     * @property _entities
     * @type Array
     * @protected
     **/
    _entities: null,

    /**
     * Class constructor
     *
     * @method init
     * @param {zerk.jsonLoader} jsonLoader JSON loader instance
     * @param {zerk.game.engine.componentLoader} componentLoader Component
     *     loader instance
     */
    init: function(jsonLoader) {

        this._jsonLoader = jsonLoader;

        this._entities = {};

    },

    /**
     * Returns a preloaded entity
     *
     * @method getEntity
     * @param {String} name Entity name
     * @return {config.entity} The entity definition
     **/
    getEntity: function(name) {

        if (typeof this._entities[name] == 'undefined') {
            return null;
        }

        return this._entities[name];

    },

    /**
     * Preloads given entities
     *
     * @method loadEntities
     * @param {Array} entities Array of entities
     * @param {Function} successFn Event handler for success
     * @param {Function} errorFn Event handler for error
     * @async
     **/
    loadEntities: function(idList, successFn, errorFn) {

        var me = this;

        this._jsonLoader.require(
            idList,
            function(entities) {
                for (var entityId in entities) {
                    me._entities[entityId] = entities[entityId];
                }
                successFn(me._entities);
            },
            errorFn
        );

    },

    clear: function() {

        var me = this;
        me._entities = {};

    }

});
