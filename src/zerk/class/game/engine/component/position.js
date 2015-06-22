/**
 * Position Component
 *
 * CLASS_DESCRIPTION
 *
 * @class position
 * @namespace zerk.game.engine.component
 * @extends zerk.game.engine.component
 * @module zerk
 **/
zerk.define({

    name: 'zerk.game.engine.component.position',
    extend: 'zerk.game.engine.component'

}, {

    _name: 'position',

    build: function(entityConfig, worldConfig) {

        var defaultConfig = {
            x: 0,
            y: 0,
            angle: 0
        };

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
