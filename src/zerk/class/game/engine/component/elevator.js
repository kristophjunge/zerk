/**
 * Elevator Component
 *
 * CLASS_DESCRIPTION
 *
 * @class elevator
 * @namespace zerk.game.engine.component
 * @extends zerk.game.engine.component
 * @module zerk
 **/
zerk.define({

    name: 'zerk.game.engine.component.elevator',
    extend: 'zerk.game.engine.component'

},{

    _name: 'elevator',

    build: function(entityConfig,worldConfig) {

        var defaultConfig={
            enabled: true,
            distance: 2.5,
            position: 0,
            turn: 'forward',
            speed: 1,
            axis: 'vertical',
            worldOffset: 1.5
        };

        // Create new state
        var state={};

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