zerk.define({
	
	name: 'jumpandrun.game.engine.entity.fallingStone',
	extend: 'zerk.game.engine.entity'
	
},{
	
	name: 'fallingStone',
	width: 3,
	height: 3,
	
	init: function(engine,config) {
		
		zerk.parent('jumpandrun.game.engine.entity.fallingStone').init.apply(
			this,
			arguments
		);
		
		zerk.apply(
			this.config,
			{
				speed: 1.5,
				releaseDelay: 250,
				status: 'wait_to_fall'
			}
		);
		
		this.on(
			'spawn',
			this._onSpawn,
			this
		);
		
		this.on(
			'tick',
			this._onTick,
			this
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
				width: 3,
				height: 3,
				angle: 0,
				moveable: false,
				origin: true,
				fixedRotation: true,
				fixtures: [{
					shape: 'box',
					x: 0,
					y: 0,
					angle: 0,
					width: 3,
					height: 3
				}]
			},
			{
				key: 'body2',
				x: 0,
				y: -2,
				width: 5,
				height: 1,
				angle: 0,
				moveable: false,
				fixtures: [{
					shape: 'box',
					x: 0,
					y: 0,
					angle: 0,
					width: 5,
					height: 1
				}]
			},
			{
				key: 'body3',
				x: -2,
				y: -0.5,
				width: 1,
				height: 2,
				angle: 0,
				moveable: false,
				fixtures: [{
					shape: 'box',
					x: 0,
					y: 0,
					angle: 0,
					width: 1,
					height: 2
				}]
			},
			{
				key: 'body4',
				x: 2,
				y: -0.5,
				width: 1,
				height: 2,
				angle: 0,
				moveable: false,
				fixtures: [{
					shape: 'box',
					x: 0,
					y: 0,
					angle: 0,
					width: 1,
					height: 2
				}]
			}
		];
		
		zerk.parent('jumpandrun.game.engine.entity.fallingStone').setup.apply(
			this,
			arguments
		);
		
	},
	
	release: function() {
		
		if (this.config.status!='wait_to_fall') return;
		
		var me=this;
		
		window.setTimeout(
			function() {
				
				me._setBodyMoveable('body1',true);
				
				me.config.status='falling';
				
			},
			this.config.releaseDelay
		);
		
	},
	
	_onSpawn: function() {
		
		this._setBodySleepingAllowed('body1',false);
		
		this.config.worldOffset=this.config.y;
		
	},
	
	_onContactBegin: function(sourceFixture,targetFixture) {
		
		if (targetFixture.body._entity.name=='player'
		&& sourceFixture.body._entity.name=='fallingStone'
		&& sourceFixture.body.key=='body1'
		) {
			
			targetFixture.body._entity.kill();
			
		} else if (sourceFixture.body._entity.name=='player' 
		&& targetFixture.body._entity.name=='fallingStone'
		&& targetFixture.body.key=='body1') {
			
			sourceFixture.body._entity.kill();
			
		} else if (sourceFixture.body._entity.name=='fallingStone') {
			
			this.config.status='wait_to_move_back';
			
			var me=this;
			
			window.setTimeout(
				function() {
					
					me._setBodyKinematic('body1');
					
					me._setLinearVelocity('body1',270,me.config.speed);
					
					me.config.status='moving_back';
					
				},
				1500
			);
			
		}
		
	},
	
	_onTick: function() {
		
		if (this.config.status=='moving_back') {
			
			this.config.position=this.config.y-this.config.worldOffset;
			
			if (this.config.position<=0) {
				
				this._setBodyMoveable('body1',false);
				
				this.config.status='wait_to_fall';
				
			}
			
		}
		
	}
	
});