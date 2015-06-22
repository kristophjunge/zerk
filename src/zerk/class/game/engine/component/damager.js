/**
 * Damager Component
 *
 * CLASS_DESCRIPTION
 *
 * @class damager
 * @namespace zerk.game.engine.component
 * @extends zerk.game.engine.component
 * @module zerk
 **/
zerk.define({

    name: 'zerk.game.engine.component.damager',
    extend: 'zerk.game.engine.component'

}, {

    _name: 'damager',

    build: function(entityConfig, worldConfig) {

        var defaultConfig = {};

        // Create new state
        var state = {};

        // Apply default configuration
        zerk.apply(
            state,
            defaultConfig
        );

        // Apply enitity configuration
        zerk.apply(
            state,
            entityConfig
        );

        // Apply world configuration
        zerk.apply(
            state,
            worldConfig
        );

        return state;

    }

});
