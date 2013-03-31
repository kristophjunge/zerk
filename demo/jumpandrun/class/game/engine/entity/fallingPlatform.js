zerk.define({
	
	name: 'jumpandrun.game.engine.entity.fallingPlatform',
	extend: 'zerk.game.engine.entity'
	
},{
	
	name: 'fallingPlatform',
	width: 4,
	height: 0.5,
	
	init: function(engine,config) {
		
		zerk.parent('jumpandrun.game.engine.entity.fallingPlatform').init.apply(
			this,
			arguments
		);
		
		zerk.apply(
			this.config,
			{
				releaseDelay: 500
			}
		);
		
		this.on(
			'contactbegin',
			this._onContactBegin,
			this
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
				moveable: false,
				origin: true,
				fixedRotation: true,
				fixtures: [{
					shape: 'box',
					x: 0,
					y: 0,
					angle: 0,
					width: 4,
					height: 0.5,
					friction: 0.2
				}]
			}
		];
		
		zerk.parent('jumpandrun.game.engine.entity.fallingPlatform')
			.setup.apply(
				this,
				arguments
			);
		
	},
	
	kill: function() {
		
		this.destroy();
		
	},
	
	_onContactBegin: function(sourceFixture,targetFixture) {
		
		var me=this;
		
		window.setTimeout(
			function() {
				
				me._setBodyMoveable('body1',true);
				
			},
			this.config.releaseDelay
		);
		
	}
	
});