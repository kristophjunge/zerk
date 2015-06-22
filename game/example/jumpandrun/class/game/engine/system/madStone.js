/**
 * Falling stone System
 *
 * @class jumpandrun.game.engine.system.madStone
 * @extends zerk.game.engine.system
 * @module zerk
 */
zerk.define({

    name: 'jumpandrun.game.engine.system.madStone',
    extend: 'zerk.game.engine.system'

}, {

    /**
     * Name of the system
     *
     * @property name
     * @type String
     */
    _name: 'madStone',

    _thread: 'simulation',

    _physics: null,

    _player: null,

    /**
     * Class constructor
     *
     * @method init
     * @param {zerk.game.engine} engine Game engine
     * @param {Object} config Entity configuration
     */
    init: function(engine, config) {

        zerk.parent('jumpandrun.game.engine.system.madStone').init.apply(
            this,
            arguments
        );

        this._physics = this._getSystem('physics');

        this._player = this._getSystem('player');

    },

    useComponent: function(name) {

        return (name == 'madStone');

    },

    start: function() {

        zerk.parent('jumpandrun.game.engine.system.madStone').start.apply(
            this,
            arguments
        );

        this._physics.on(
            'contactbegin',
            this._onContactBegin,
            this
        );

    },

    addEntity: function(entity) {

        zerk.parent('jumpandrun.game.engine.system.madStone').addEntity.apply(
            this,
            arguments
        );

        this._physics.setBodySleepingAllowed(entity, 'main', false);

        entity.components.madStone.worldOffset = entity.components.position.y;

    },

    update: function() {

        zerk.parent('jumpandrun.game.engine.system.madStone').update.apply(
            this,
            arguments
        );

        for (var i = 0; i < this._entities.length; i++) {

            var madStone = this._entities[i].components.madStone;
            var position = this._entities[i].components.position;

            if (madStone.status == 'moving_back') {

                madStone.position = position.y - madStone.worldOffset;

                if (madStone.position <= 0) {

                    this._physics.setBodyMoveable(
                        this._entities[i],
                        'main',
                        false
                    );

                    madStone.status = 'wait_to_fall';

                }

            }

        }

    },

    _onContactBegin: function(sourceInfo, targetInfo) {

        if (typeof sourceInfo.entity.components.madStone == 'undefined' &&
        typeof targetInfo.entity.components.madStone == 'undefined') {
            return true;
        }

        if (targetInfo.entity.name == 'jumpandrun.entity.player' &&
        sourceInfo.entity.name == 'jumpandrun.entity.madStone' &&
        sourceInfo.body == 'main'
        ) {

            this._player.dead(targetInfo.entity);

        } else if (sourceInfo.entity.name == 'jumpandrun.entity.player' &&
        targetInfo.entity.name == 'jumpandrun.entity.madStone' &&
        targetInfo.body == 'main') {

            this._player.dead(targetInfo.entity);

        } else if (sourceInfo.entity.name == 'jumpandrun.entity.madStone') {

            sourceInfo.entity.components.madStone.status = 'wait_to_move_back';

            var self = this;

            window.setTimeout(
                function() {

                    self._physics.setBodyKinematic(
                        sourceInfo.entity,
                        'main'
                    );

                    self._physics.setLinearVelocity(
                            sourceInfo.entity,
                        'main',
                        270,
                        sourceInfo.entity.components.madStone.speed
                    );

                    sourceInfo.entity.components.madStone.status = 'moving_back';

                },
                1500
            );

        }

    },

    release: function(entity) {

        var componentFallingStone = entity.components.madStone;

        if (componentFallingStone.status != 'wait_to_fall') {
            return;
        }

        var self = this;

        window.setTimeout(
            function() {

                self._physics.setBodyMoveable(entity, 'main', true);

                componentFallingStone.status = 'falling';

            },
            componentFallingStone.releaseDelay
        );

    }

});
