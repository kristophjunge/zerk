zerk.define({

	name: 'snakebot.game',
	extend: 'zerk.game',
	require: [
		'zerk.game.engine.component.physics',
		'zerk.game.engine.component.position',
		'zerk.game.engine.component.sprite',
		'zerk.game.engine.component.player',
		'zerk.game.engine.component.damager',
		'zerk.game.engine.component.fall',
		'zerk.game.engine.component.trigger',
		'zerk.game.engine.component.elevator',
        'snakebot.game.engine.component.snakebot',

		'zerk.game.engine.system.physics.box2d',
		'zerk.game.engine.system.viewport.canvas',
		'zerk.game.engine.system.sprite',
		'zerk.game.engine.system.wireframe',
		'zerk.game.engine.system.message',
		'zerk.game.engine.system.debuginfo',
		'zerk.game.engine.system.control',
		'zerk.game.engine.system.player',
		'zerk.game.engine.system.damager',
		'zerk.game.engine.system.fall',
		'zerk.game.engine.system.trigger',
		'zerk.game.engine.system.elevator',
        'snakebot.game.engine.system.snakebot'
	]

},{

	run: function(config) {

		if (!zerk.parent('snakebot.game').run.apply(
			this,
			arguments
		)) {
			return;
		}

		if (!this._engine.start()) {
			return;
		}

		this._engine.loadWorld(
			'snakebot.world.world',
			function() {

			},
			function(error) {

				console.log(error);

			}
		);

	}

});