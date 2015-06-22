/**
 * Component
 *
 * Base class for components. All components should inherit from here.
 *
 * @class component
 * @namespace zerk.game.engine
 * @module zerk
 **/
zerk.define({

    name: 'zerk.game.engine.component'

},{

    /**
     * Name of the component
     *
     * @property _name
     * @type String
     * @protected
     **/
    _name: '',

    /**
     * Class constructor
     *
     * @method init
     **/
    init: function() {



    },

    /**
     * Build the state of this component for an entity
     *
     * @method build
     * @param {Object} config Component configuration
     * @return {Object} Component state
     **/
    build: function(config) {



    }

});