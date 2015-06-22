/*
 * TODO Evaluate that this should really be a sepearte object
 */

/**
 * Component Loader
 *
 * Builds component states.
 *
 * @class componentLoader
 * @namespace zerk.game.engine
 * @module zerk
 **/
zerk.define({

    name: 'zerk.game.engine.componentLoader'

},{

    /**
     * JSON loader instance
     *
     * @property _jsonLoader
     * @type zerk.jsonLoader
     * @protected
     **/
    _jsonLoader: null,

    /**
     * Component register
     *
     * @property _component
     * @type Object
     * @protected
     **/
    _component: {},

    /**
     * Component name to class map
     *
     * @property _componentMap
     * @type Object
     * @protected
     **/
    _componentMap: {},

    /**
     * Class constructor
     *
     * @method init
     * @param {zerk.jsonLoader} jsonLoader JSON loader instance
     * @param {Object} componentMap Component name to class map
     **/
    init: function(jsonLoader,componentMap) {

        this._jsonLoader=jsonLoader;
        this._componentMap=componentMap;

    },

    /**
     * Preloads given components
     *
     * @method loadComponents
     * @param {Array} components Array of component names
     * @param {Function} successHandler Event handler for success
     * @param {Function} errorHandler Event handler for error
     * @async
     **/
    loadComponents: function(components,successHandler,errorHandler) {

        var self=this;

        var componentResources={};

        for (var i=0;i<components.length;i++) {

            if (typeof this._componentMap[components[i]]=='undefined') {

                zerk.error({
                    message: 'Component "'+components[i]+'" could not be'
                        +' resolved to resource. Create a componentMap entry in'
                        +' engine configuration.',
                    source: this,
                    componentName: components[i]
                });

            }

            var componentClass=this._componentMap[components[i]];

            this._component[components[i]]=zerk.create(componentClass);

        }

        successHandler();

    },

    /**
     * Build the component states of an entity
     *
     * @method buildComponents
     * @param {config.entity} entity Entity definition
     * @param {config.entity} config World configuration
     * @return {config.entity} The final entity state
     **/
    buildComponents: function(entity,config) {

        for (var component in entity.components) {

            config.components[component]=this._component[component].build(
                entity.components[component],
                config.components[component]
            );

        }

        return config;

    },

    clear: function() {

        var me=this;
        me._component={};

    }

});