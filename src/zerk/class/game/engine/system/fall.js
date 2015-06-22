/**
 * Fall System
 *
 * Enabled entities to fall suddenly.
 *
 * @class fall
 * @namespace zerk.game.engine.system
 * @extends zerk.game.engine.system
 * @module zerk
 **/
zerk.define({

    name: 'zerk.game.engine.system.fall',
    extend: 'zerk.game.engine.system'

},{

    /**
     * Name of the system
     *
     * @property _name
     * @type String
     * @protected
     **/
    _name: 'fall',

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

        zerk.parent('zerk.game.engine.system.fall').init.apply(
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

        return (name=='fall');

    },

    /**
     * Starts the system
     *
     * @method start
     **/
    start: function() {

        zerk.parent('zerk.game.engine.system.fall').start.apply(
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
     * Stops the system
     *
     * @method stop
     **/
    stop: function() {

        zerk.parent('zerk.game.engine.system.fall').stop.apply(
            this,
            arguments
        );

        this._physics.un(
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
    _onContactBegin: function(source,target) {

        if (!zerk.isDefined(target.entity.components.fall)) {
            return true;
        }

        var self=this;

        window.setTimeout(
            function() {
                self._physics.setBodyMoveable(target.entity,'main',true);
            },
            target.entity.components.fall.releaseDelay
        );

    }

});