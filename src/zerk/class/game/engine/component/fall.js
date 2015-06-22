/**
 * Fall Component
 *
 * CLASS_DESCRIPTION
 *
 * @class fall
 * @namespace zerk.game.engine.component
 * @extends zerk.game.engine.component
 * @module zerk
 **/
zerk.define({

    name: 'zerk.game.engine.component.fall',
    extend: 'zerk.game.engine.component'

},{

    _name: 'fall',

    build: function(entityConfig,worldConfig) {

        var defaultConfig={
            releaseDelay: 500
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