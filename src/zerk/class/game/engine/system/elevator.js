/**
 * Elevator System
 *
 * Provides elevator like moving entities.
 *
 * @class elevator
 * @namespace zerk.game.engine.system
 * @extends zerk.game.engine.system
 * @module zerk
 **/
zerk.define({

    name: 'zerk.game.engine.system.elevator',
    extend: 'zerk.game.engine.system'

},{

    /**
     * Name of the system
     *
     * @property _name
     * @type String
     * @protected
     **/
    _name: 'elevator',

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

        zerk.parent('zerk.game.engine.system.elevator').init.apply(
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

        return (name=='elevator');

    },

    /**
     * Adds an entity to the system
     *
     * @method addEntity
     * @param {config.entity} entity Entity state
     **/
    addEntity: function(entity) {

        zerk.parent('zerk.game.engine.system.elevator').addEntity.apply(
            this,
            arguments
        );

        var componentPosition=entity.components.position;
        var componentElevator=entity.components.elevator;

        this._physics.setBodySleepingAllowed(entity,'main',false);

        componentElevator.worldOffset=((componentElevator.axis=='vertical')
            ? componentPosition.y
            : componentPosition.x);

        // Set the initial body position if present
        if (componentElevator.position>0) {

            var bodyPosition=this._physics.getBodyPosition(entity,'main');

            if (componentElevator.axis=='vertical') {
                bodyPosition.y+=componentElevator.position;
            } else {
                bodyPosition.x+=componentElevator.position;
            }

            this._physics.setBodyPosition(entity,'main',bodyPosition);

        }

        if (componentElevator.enabled) {
            this.startElevator(entity);
        }

    },

    /**
     * Updates the system
     *
     * @method update
     **/
    update: function() {

        zerk.parent('zerk.game.engine.system.elevator').update.apply(
            this,
            arguments
        );

        for (var i=0;i<this._entities.length;i++) {

            var componentElevator=this._entities[i].components.elevator;
            var componentPosition=this._entities[i].components.position;

            if (componentElevator.enabled) {

                componentElevator.position=
                    ((componentElevator.axis=='vertical') ?
                        componentPosition.y : componentPosition.x)
                    -componentElevator.worldOffset;

                if (componentElevator.turn=='forward'
                && componentElevator.position>=componentElevator.distance) {

                    if (componentElevator.axis=='vertical') {
                        this._physics.setLinearVelocity(
                            this._entities[i],
                            'main',
                            270,
                            componentElevator.speed
                        );
                    } else {
                        this._physics.setLinearVelocity(
                            this._entities[i],
                            'main',
                            180,
                            componentElevator.speed
                        );
                    }

                    componentElevator.turn='backward';

                } else if (componentElevator.turn=='backward'
                && componentElevator.position<=0) {

                    if (componentElevator.axis=='vertical') {
                        this._physics.setLinearVelocity(
                            this._entities[i],
                            'main',
                            90,
                            componentElevator.speed
                        );
                    } else {
                        this._physics.setLinearVelocity(
                            this._entities[i],
                            'main',
                            0,
                            componentElevator.speed
                        );
                    }

                    componentElevator.turn='forward';

                }

            }

        }

    },

    /**
     * Start moving the elevator
     *
     * @method startElevator
     * @param {config.entity} entity Entity state
     **/
    startElevator: function(entity) {

        var componentElevator=entity.components.elevator;

        if (componentElevator.axis=='vertical') {
            if (componentElevator.turn=='forward') {
                this._physics.setLinearVelocity(
                    entity,
                    'main',
                    90,
                    componentElevator.speed
                );
            } else {
                this._physics.setLinearVelocity(
                    entity,
                    'main',
                    270,
                    componentElevator.speed
                );
            }
        } else {
            if (componentElevator.turn=='forward') {
                this._physics.setLinearVelocity(
                    entity,
                    'main',
                    0,
                    componentElevator.speed
                );
            } else {
                this._physics.setLinearVelocity(
                    entity,
                    'main',
                    180,
                    componentElevator.speed
                );
            }
        }

        componentElevator.enabled=true;

    }

});