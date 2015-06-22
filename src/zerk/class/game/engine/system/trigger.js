/**
 * Trigger System
 *
 * Enables entities to act as trigger area.
 *
 * @class trigger
 * @namespace zerk.game.engine.system
 * @extends zerk.game.engine.system
 * @module zerk
 **/
zerk.define({

    name: 'zerk.game.engine.system.trigger',
    extend: 'zerk.game.engine.system'

}, {

    /**
     * Name of the system
     *
     * @property _name
     * @type String
     * @protected
     **/
    _name: 'trigger',

    /**
     * Thread that runs this system
     *
     * @property _thread
     * @type String
     * @protected
     **/
    _thread: 'simulation',

    /**
     * Physics system instance
     *
     * @property _physics
     * @type zerk.game.engine.system.physics
     * @protected
     **/
    _physics: null,

    /**
     * Class constructor
     *
     * @method init
     * @param {zerk.game.engine} engine Game engine
     * @param {Object} config System configuration
     **/
    init: function(engine, config) {

        zerk.parent('zerk.game.engine.system.trigger').init.apply(
            this,
            arguments
        );

        this._physics = this._getSystem('physics');

    },

    /**
     * Returns true when the system is interested in given component
     *
     * @method useComponent
     * @param {String} name Component name
     * @return {Boolean} True when the system is intereseted in given component
     **/
    useComponent: function(name) {

        return (name == 'trigger');

    },

    /**
     * Starts the system
     *
     * @method start
     **/
    start: function() {

        zerk.parent('zerk.game.engine.system.trigger').start.apply(
            this,
            arguments
        );

        this._physics.on(
            'contactbegin',
            this._onContactBegin,
            this
        );

    },

    /**
     * Fires when two fixtures start colliding
     *
     * @method _onContactBegin
     * @param {Object} sourceInfo Contact source information
     * @param {Object} targetInfo Contact target information
     * @protected
     **/
    _onContactBegin: function(sourceInfo, targetInfo) {

        if (typeof targetInfo.entity.components.trigger == 'undefined') {
            return true;
        }

        var componentTrigger = targetInfo.entity.components.trigger;

        if (!componentTrigger.targetEntityTag) {
            console.log('No target entity specified');
            return;
        }

        if (!componentTrigger.targetSystem) {
            console.log('No target system specified');
            return;
        }

        if (!componentTrigger.targetMethod) {
            console.log('No target method specified');
            return;
        }

        var system = this._engine.getSystem(
            componentTrigger.targetSystem
        );

        var entities = this._engine.getEntitiesByTags(
            componentTrigger.targetEntityTag
        );

        for (var i = 0; i < entities.length; i++) {

            system[componentTrigger.targetMethod](entities[i]);

        }

    }

});
