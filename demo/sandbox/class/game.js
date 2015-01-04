zerk.define({
	
	name: 'sandbox.game',
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
		'zerk.game.engine.system.elevator'
	]
	
},{
	
	run: function(config) {
		
		if (!zerk.parent('sandbox.game').run.apply(
			this,
			arguments
		)) {
			
			return;
			
		}
		
		if (!this._engine.start()) {
			
			return;
			
		}
		
		//this.loadDemo('sandbox.world.shapes');
		//this.loadDemo('sandbox.world.worm');
		//this.loadDemo('sandbox.world.hotrod');
		
		this._engine.loadWorld(
			'sandbox.world.spritetest',
			function() {
				
			},
			function(error) {
				
				console.log(error);
				
			}
		);
		
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