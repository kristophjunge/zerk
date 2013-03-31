zerk.define({

	name: 'jumpandrun.game.engine.entity.player',
	extend: 'zerk.game.engine.entity'

},{

	name: 'player',
	width: 1,
	height: 2,
	
	_contactCount: 0,
	
	_keyReleased: true,
	
	init: function() {
		
		zerk.parent('jumpandrun.game.engine.entity.player').init.apply(
			this,
			arguments
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
		
		this.on(
			'contactend',
			this._onContactEnd,
			this
		);
		
		this._engine.control.keyboard.on(
			'keydown',
			this._onKeyDown,
			this
		);
		
		this._engine.control.keyboard.on(
			'keyup',
			this._onKeyUp,
			this
		);
		
	},
	
	destroy: function() {
		
		zerk.parent('jumpandrun.game.engine.entity.player').destroy.apply(
			this,
			arguments
		);
		
		this._engine.control.keyboard.un(
			'keydown',
			this._onKeyDown
		);
		
		this._engine.control.keyboard.un(
			'keyup',
			this._onKeyUp
		);
		
	},
	
	setup: function() {
		
		zerk.apply(this.config,{
			jumping: false,
			landed: false,
			jumpCounter: 0,
			enableControl: false,
			grounded: false
		});
		
		this.bodies=[
			{
				key: 'body1',
				x: 0,
				y: 0,
				width: 1,
				height: 2,
				angle: 0,
				moveable: true,
				origin: true,
				fixedRotation: true,
				fixtures: [
					{
						key: 'torso',
						shape: 'box',
						x: 0,
						y: 0,
						angle: 0,
						width: 1,
						height: 2,
						friction: 0.2
					},
					{
						key: 'foot',
						shape: 'box',
						x: 0,
						y: 1,
						angle: 0,
						width: 0.9,
						height: 0.25,
						isSensor: true
					}
				]
			}
		];
		
		zerk.parent('jumpandrun.game.engine.entity.player').setup.apply(
			this,
			arguments
		);
		
	},

	kill: function() {
		
		this._setBodyMoveable('body1',false);
		
		this._engine.game.playerDead();
		
	},
	
	_onContactBegin: function(sourceFixture,targetFixture) {
		
		if (sourceFixture.key=='foot' || targetFixture.key=='foot') {
			
			this._contactCount++;
			
			if (this._contactCount>0) {
				
				this.config.grounded=true;
				
				this.config.jumping=false;
				
				this.config.jumpCounter=0;
				
			}
			
		}
		
	},
	
	_onContactEnd: function(sourceFixture,targetFixture) {
		
		if (sourceFixture.key=='foot' || targetFixture.key=='foot') {
			
			this._contactCount--;
			
			if (this._contactCount==0) {
				
				this.config.grounded=false;
				
			}
			
		}
		
	},
	
	_onKeyDown: function(event) {
		
		if (!this.config.enableControl) return;
		
		if (event.keyCode==32) {
			
			if (this.config.grounded && this._keyReleased) {
				
				this.config.jumping=true;
				
			}
			
			this._keyReleased=false;
			
		}
		
	},
	
	_onKeyUp: function(event) {
		
		if (!this.config.enableControl) return;
		
		if (event.keyCode==32) {
			
			this._keyReleased=true;
			
			this.config.jumping=false;
			
		}
		
	},
	
	_actionJump: function() {
		
		if (!this.config.jumping) return;
		
		var maxPower=13;
		var steps=5;
		
		if (this.config.jumpCounter==steps) return;
		
		var power=(100-(this.config.jumpCounter*(100/steps)))
			*(maxPower/100);
		
		this._bodyApplyImpulse('body1',270,power);
		
		this.config.jumpCounter++;
		
	},
	
	_onTick: function() {
		
		if (!this.config.enableControl) return;
		
		if (this._engine.control.keyboard.pressedSpace) {
			this._actionJump();
		}
		
		if (this._engine.control.keyboard.pressedArrowLeft) {
			this._actionWalkLeft();
		}
		
		if (this._engine.control.keyboard.pressedArrowRight) {
			this._actionWalkRight();
		}
		
	},
	
	_actionWalkLeft: function() {
		
		var velocity=this._getBodyLinearVelocity('body1');
		
		if (velocity.x<=-7) return;
		
		var power=1;
		
		if (this.config.jumping) {
			power=0.75;
		}
		
		this._bodyApplyImpulse('body1',180,power);
		
	},
	
	_actionWalkRight: function() {
		
		var velocity=this._getBodyLinearVelocity('body1');
		
		if (velocity.x>=7) return;
		
		var power=1;
		
		if (this.config.jumping) {
			power=0.75;
		}
		
		this._bodyApplyImpulse('body1',0,power);
		
	}
	
});