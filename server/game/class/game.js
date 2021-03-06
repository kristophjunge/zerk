zerk.define({

    name: 'gameserver.game',
    extend: 'zerk.game',
    require: [
        'zerk.game.engine.component.physics',
        'zerk.game.engine.component.position',
        'zerk.game.engine.component.render',
        'zerk.game.engine.component.player',
        'zerk.game.engine.component.damager',
        'zerk.game.engine.component.fall',
        'zerk.game.engine.component.trigger',
        'zerk.game.engine.component.elevator',

        'zerk.game.engine.system.physics.box2d',
        'zerk.game.engine.system.viewport.canvas',
        'zerk.game.engine.system.render',
        'zerk.game.engine.system.wireframe',
        'zerk.game.engine.system.message',
        'zerk.game.engine.system.debuginfo',
        'zerk.game.engine.system.control',
        'zerk.game.engine.system.player',
        'zerk.game.engine.system.damager',
        'zerk.game.engine.system.fall',
        'zerk.game.engine.system.elevator',
    ]

}, {

    init: function() {
        console.log('start game')
    },

    run: function(config) {
        var me = this;

        if (!me._engine.start()) {
            return;
        }

        me._engine.loadWorldConfig(
            {
                name: 'empty',
                config: {
                    systems: {
                        physics: {
                            gravityX: 0,
                            gravityY: 0
                        }
                    }
                },
                entities: [
                    {
                        name: 'monstertruck.entity.monstertruck',
                        //name: sandbox.entity.crate,
                        tags: [
                            'editor'
                        ],
                        components: {
                            position: {
                                x: 0,
                                y: 0
                            }
                        }
                    }
                ]
            },
            function() {

                me._engine.getSystem('physics').setEnabled(false);

                var control = me._engine.getSystem('control');

            },
            function(error) {

                console.log(error);

            }
        );

    }

});
