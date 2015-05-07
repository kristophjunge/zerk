zerk.define({

	name: 'sandbox.game',
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
		'zerk.game.engine.system.trigger',
		'zerk.game.engine.system.elevator'
	]

},{

    _systemControl: null,

    _systemMessage: null,

    _demoWorldIndex: 0,

    _demoWorlds: [
        'sandbox.world.crates',
        'sandbox.world.balls',
        'sandbox.world.stones',
        'sandbox.world.shapes'
    ],

	run: function(config) {

        var me=this;

		if (!zerk.parent('sandbox.game').run.apply(
                me,
			arguments
		)) {
			return;
		}

		if (!me._engine.start()) {
			return;
		}

        me._engine.loadWorld(
			'sandbox.world.rendertest',
			function() {

                me._onLoadWorld();

            },
			function(error) {

				console.log(error);

			}
		);

	},

    _onLoadWorld: function() {

        this._startGame();

    },

    _startGame: function() {

        this._systemControl=this._engine.getSystem('control');

        this._systemMessage=this._engine.getSystem('message');

        this._systemControl.keyboard.on(
            'keypress',
            this._onKeyPress,
            this
        );

    },

    _onKeyPress: function(event) {

        var me=this;

        if (event.keyCode==43) {

            me._demoWorldIndex++;
            if (me._demoWorldIndex>me._demoWorlds.length-1) {
                me._demoWorldIndex=0;
            }

            me.loadDemo(me._demoWorlds[me._demoWorldIndex]);

        } else if (event.keyCode==45) {

            me._demoWorldIndex--;
            if (me._demoWorldIndex<0) {
                me._demoWorldIndex=me._demoWorlds.length-1;
            }

            me.loadDemo(me._demoWorlds[me._demoWorldIndex]);

        } else if (event.keyCode==115) {

            zerk.screenshot();

        }

    },

	loadDemo: function(world) {

		this._engine.reset();

		this._engine.loadWorld(
			world,
			function() {

			},
			function(error) {

				console.log(error);

			}
		);

	}

});