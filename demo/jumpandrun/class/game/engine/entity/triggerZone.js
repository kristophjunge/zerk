zerk.define({
	
	name: 'jumpandrun.game.engine.entity.triggerZone',
	extend: 'zerk.game.engine.entity'
	
},{
	
	name: 'triggerZone',
	width: 0,
	height: 0,
	
	init: function(engine,config) {
		
		zerk.parent('jumpandrun.game.engine.entity.triggerZone').init.apply(
			this,
			arguments
		);
		
		zerk.apply(
			this.config,
			{
				width: 5,
				height: 5,
				targetEntityId: ''
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
		
		zerk.parent('jumpandrun.game.engine.entity.triggerZone').setup.apply(
			this,
			arguments
		);
		
	},
	
	_onContactBegin: function(sourceFixture,targetFixture) {
		
		var bodySource=sourceFixture.body;
		var bodyTarget=targetFixture.body;
		
		if (bodySource._entity.name!='player') return;
		
		var targetEntity=this._engine.world.getEntityById(
			this.config.targetEntityId
		);
		
		targetEntity.release();
		
	}
	
});