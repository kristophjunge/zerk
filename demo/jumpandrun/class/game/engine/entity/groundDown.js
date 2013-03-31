zerk.define({

	name: 'jumpandrun.game.engine.entity.groundDown',
	extend: 'zerk.game.engine.entity'
	
},{
	
	name: 'groundDown',
	width: 5,
	height: 5,
	
	init: function(engine,config) {
		
		zerk.parent('jumpandrun.game.engine.entity.groundDown').init.apply(
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
				width: 10,
				height: 5,
				angle: 0,
				origin: true,
				moveable: false,
				fixtures: [
					{
						shape: 'polygon',
						x: 0,
						y: 0,
						width: 10,
						height: 5,
						angle: 0,
						vertices: [
							[-5, 0.5],
							[-5, -0.5],
							[5, 4.5],
							[5, 5.5]
						]
					}
				]	
			}
		];
		
		zerk.parent('jumpandrun.game.engine.entity.groundDown').setup.apply(
			this,
			arguments
		);
		
	}
	
});