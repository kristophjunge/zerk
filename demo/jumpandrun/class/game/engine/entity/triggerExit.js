zerk.define({
	
	name: 'jumpandrun.game.engine.entity.triggerExit',
	extend: 'zerk.game.engine.entity'
	
},{
	
	name: 'triggerExit',
	width: 0,
	height: 0,
	
	init: function(engine,config) {
		
		zerk.parent('jumpandrun.game.engine.entity.triggerExit').init.apply(
			this,
			arguments
		);
		
		zerk.apply(
			this.config,
			{
				width: 5,
				height: 5
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
				width: this.config.width,
				height: this.config.height,
				angle: 0,
				moveable: false,
				origin: true,
				fixtures: [{
					shape: 'box',
					x: 0,
					y: 0,
					angle: 0,
					width: this.config.width,
					height: this.config.height,
					isSensor: true
				}]
			}
		];
		
		zerk.parent('jumpandrun.game.engine.entity.triggerExit').setup.apply(
			this,
			arguments
		);
		
	},
	
	_onContactBegin: function(sourceFixture,targetFixture) {
		
		if (sourceFixture.body._entity.name!='player') return;
		
		this._engine.game.playerWin();
		
	}
	
});