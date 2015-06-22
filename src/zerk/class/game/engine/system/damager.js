/**
 * Damager System
 *
 * Damages or destroys entites.
 *
 * @class damager
 * @namespace zerk.game.engine.system
 * @extends zerk.game.engine.system
 * @module zerk
 **/
zerk.define({

    name: 'zerk.game.engine.system.damager',
    extend: 'zerk.game.engine.system'

},{

    /**
     * Name of the system
     *
     * @property _name
     * @type String
     * @protected
     **/
    _name: 'damager',

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
    init: function(engine,config) {

        zerk.parent('zerk.game.engine.system.damager').init.apply(
            this,
            arguments
        );

        this._physics=this._getSystem('physics');

    },

    /**
     * Returns true when the system is interested in given component
     *
     * @method useComponent
     * @param {String} name Component name
     * @return {Boolean} True when the system is intereseted in given component
     **/
    useComponent: function(name) {

        return (name=='damager');

    },

    /**
     * Starts the system
     *
     * @method start
     **/
    start: function() {

        zerk.parent('zerk.game.engine.system.damager').start.apply(
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
     * Fires when two fixtures collide
     *
     * @method _onContactBegin
     * @param {Object} sourceInfo Contact source information
     * @param {Object} targetInfo Contact target information
     * @protected
     **/
    _onContactBegin: function(sourceInfo,targetInfo) {

        if (typeof sourceInfo.entity.components.damager=='undefined'
        && typeof targetInfo.entity.components.damager=='undefined') {
            return true;
        }

        /*
         * TODO Move entity specific code into event handlers and/or health system
         */
        if (sourceInfo.entity.name=='jumpandrun.entity.player') {

            var player=this._getSystem('player');

            player.dead(sourceInfo.entity);

        } else if (sourceInfo.entity.name=='jumpandrun.entity.balancePlatform') {

            this._physics.destroyBody(sourceInfo.entity,sourceInfo.body);

        } else {

            this._engine.removeEntity(sourceInfo.entity);

        }

    }

});