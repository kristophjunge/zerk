zerk.define({
	
	name: 'jumpandrun.game.engine.entity.balancePlatform',
	extend: 'zerk.game.engine.entity'
	
},{
	
	name: 'balancePlatform',
	width: 4,
	height: 0.5,
	
	init: function(engine,config) {
		
		zerk.parent('jumpandrun.game.engine.entity.balancePlatform').init.apply(
			this,
			arguments
		);
		
		zerk.apply(
			this.config,
			{}
		);
		
	},
	
	setup: function() {
		
		this.bodies=[
			{
				key: 'body1',
				x: 0,
				y: 0,
				width: 4,
				height: 0.5,
				angle: 0,
				moveable: true,
				origin: true,
				fixedRotation: false,
				fixtures: [
					{
						shape: 'box',
						x: 0,
						y: 0,
						angle: 0,
						width: 4,
						height: 0.5,
						friction: 0.2
					}
				]
			},
			{
				key: 'body2',
				x: 0,
				y: 0.7,
				width: 1,
				height: 1,
				angle: 0,
				moveable: false,
				origin: false,
				fixtures: [
					{
						shape: 'circle',
						x: 0,
						y: 0,
						angle: 0,
						radius: 0.5,
						density: 3
					}
				]
			}
		];
		
		zerk.parent('jumpandrun.game.engine.entity.balancePlatform')
			.setup.apply(
				this,
				arguments
			);
		
	},
	
	kill: function() {
		
		this._destroyBody('body1');
		
	}
	
});