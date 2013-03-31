zerk.define({
	
	name: 'jumpandrun.game.engine.entity.elevatorPlatform',
	extend: 'zerk.game.engine.entity'
	
},{
	
	name: 'elevatorPlatform',
	
	width: 4,
	
	height: 0.5,
	
	init: function(engine,config) {
		
		zerk.parent('jumpandrun.game.engine.entity.elevatorPlatform')
			.init.apply(
				this,
				arguments
			);
		
		zerk.apply(
			this.config,
			{
				enabled: true,
				distance: 5,
				position: 0,
				turn: 'forward',
				speed: 1,
				axis: 'vertical',
				worldOffset: 1.5
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
				kinematic: true,
				origin: true,
				fixedRotation: true,
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
			}
		];
		
		zerk.parent('jumpandrun.game.engine.entity.elevatorPlatform')
			.setup.apply(
				this,
				arguments
			);
		
	},
	
	_onSpawn: function() {
		
		this._setBodySleepingAllowed('body1',false);
		
		this.config.worldOffset=((this.config.axis=='vertical') 
			? this.config.y
			: this.config.x);
			
		// Set the initial body position if present
		if (this.config.position>0) {
			
			var bodyPosition=this._getBodyPosition('body1');
			
			if (this.config.axis=='vertical') {
				bodyPosition.y+=this.config.position;
			} else {
				bodyPosition.x+=this.config.position;
			}
			
			this._setBodyPosition('body1',bodyPosition);
			
		}
		
		if (this.config.enabled) {
			this.startElevator();
		}
		
	},
	
	startElevator: function() {
		
		if (this.config.axis=='vertical') {
			if (this.config.turn=='forward') {
				this._setLinearVelocity('body1',90,this.config.speed);
			} else {
				this._setLinearVelocity('body1',270,this.config.speed);
			}
		} else {
			if (this.config.turn=='forward') {
				this._setLinearVelocity('body1',0,this.config.speed);
			} else {
				this._setLinearVelocity('body1',180,this.config.speed);
			}
		}
		
		this.config.enabled=true;
		
	},
	
	_onTick: function() {
		
		if (this.config.enabled) {
			
			this.config.position=
				((this.config.axis=='vertical') ? 
					this.config.y : this.config.x)
				-this.config.worldOffset;
				
			if (this.config.turn=='forward'
			&& this.config.position>=this.config.distance) {
					
				if (this.config.axis=='vertical') {
					this._setLinearVelocity('body1',270,this.config.speed);
				} else {
					this._setLinearVelocity('body1',180,this.config.speed);
				}
				
				this.config.turn='backward';
				
			} else if (this.config.turn=='backward'
			&& this.config.position<=0) {
				
				if (this.config.axis=='vertical') {
					this._setLinearVelocity('body1',90,this.config.speed);
				} else {
					this._setLinearVelocity('body1',0,this.config.speed);
				}
				
				this.config.turn='forward';
				
			}
			
		}

	}
	
});