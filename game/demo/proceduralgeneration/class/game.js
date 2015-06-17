zerk.define({
	
	name: 'proceduralgeneration.game',
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
		'zerk.game.engine.system.debuginfo',
		'zerk.game.engine.system.control'
	]
	
},{
	
	run: function(config) {
		
		if (!zerk.parent('proceduralgeneration.game').run.apply(
			this,
			arguments
		)) {
			
			return;
			
		}
		
		var self=this;
		
		this._engine.loadEntities(
			['proceduralgeneration.entity.circle'],
			function() {
			
				self._generateWorld();
				
			},
			function() {}
		);
		
	},
	
	_generateWorld: function() {
		
		if (!this._engine.start()) {
			
			return;
			
		}
		
		this._engine.addSystem('physics',{});
		this._engine.addSystem('viewport',{});
		this._engine.addSystem('render',{});
		this._engine.addSystem('wireframe',{});
		this._engine.addSystem('debuginfo',{});
		this._engine.addSystem('control',{});
		
		this._engine.startSystems();
		
		var count=10,
			x=0,
			y=0,
			radius=0;
		
		for (var i=0;i<count;i++) {
			
			x=zerk.helper.random(-5,5);
			y=zerk.helper.random(-5,5);
			
			radius=zerk.helper.random(0.3,1);
			
			this._engine.addEntity({
				name: 'proceduralgeneration.entity.circle',
				components: {
					position: {
						x: x,
						y: y
					},
					physics: {
						bodies: {
							main: {
								fixtures: {
									main: {
										radius: radius
									}
								}
							}
						}
					}
				}
			});
			
		}
		
	}
	
});