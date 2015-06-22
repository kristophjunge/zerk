zerk.define({

	name: 'stones.game',
	extend: 'zerk.game',
	require: [
		'zerk.game.engine.component.physics',
		'zerk.game.engine.component.position',
		'zerk.game.engine.component.render',
		'zerk.game.engine.system.physics.box2d',
		'zerk.game.engine.system.viewport.canvas',
		'zerk.game.engine.system.render',
		'zerk.game.engine.system.wireframe',
		'zerk.game.engine.system.message',
		'zerk.game.engine.system.debuginfo',
		'zerk.game.engine.system.control'
	]

},{

	run: function(config) {

        var me=this;

		if (!zerk.parent('stones.game').run.apply(
            me,
			arguments
		)) {
			return;
		}

		if (!me._engine.start()) {
			return;
		}

        me._engine.loadWorld(
			'stones.world.stones',
			function() {

                me._startGame();

            },
			function(error) {

				console.log(error);

			}
		);

	}

});