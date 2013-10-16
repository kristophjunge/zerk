/**
 * Player System
 * 
 * Provides player controls for jump and run style games.
 * 
 * @class player
 * @namespace zerk.game.engine.system
 * @extends zerk.game.engine.system
 * @module zerk
 **/
zerk.define({
	
	name: 'zerk.game.engine.system.player',
	extend: 'zerk.game.engine.system'
	
},{
	
	/**
	 * Name of the system
	 * 
	 * @property _name
	 * @type String
	 * @protected
	 */
	_name: 'player',
	
	/**
	 * Thread that runs this system
	 * 
	 * @property _thread
	 * @type String
	 * @protected
	 **/
	_thread: 'simulation',
	
	/**
	 * Physics system instance
	 * 
	 * @property _physics
	 * @type zerk.game.engine.system.physics
	 * @protected
	 **/
	_physics: null,
	
	/**
	 * Keyboard interface
	 * 
	 * @property _keyboard
	 * @type zerk.game.engine.system.control.keyboard
	 * @protected
	 **/
	_keyboard: null,
	
	/**
	 * Indicates that the jump key is not pressed
	 * 
	 * @property _keyReleased
	 * @type Boolean
	 * @protected
	 **/
	_keyReleased: true,
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 * @param {zerk.game.engine} engine Game engine
	 * @param {Object} config System configuration
	 */
	init: function(engine,config) {
		
		zerk.parent('zerk.game.engine.system.player').init.apply(
			this,
			arguments
		);
		
		this._keyboard=this._getSystem('control').keyboard;
		
		this._physics=this._getSystem('physics');
		
		if (!this._physics) {
			
			console.log('Player system need physics system to be active');
			
		}
		
	},
	
	/**
	 * Returns true when the system is interested in given component
	 * 
	 * @method useComponent
	 * @param {String} name Component name
	 * @return {Boolean} True when the system is intereseted in given component
	 **/
	useComponent: function(name) {
		
		return (name=='player');
		
	},
	
	/**
	 * Adds an entity to the system
	 * 
	 * @method addEntity
	 * @param {config.entity} entity Entity state
	 **/
	addEntity: function(entity) {
		
		zerk.parent('zerk.game.engine.system.player').addEntity.apply(
			this,
			arguments
		);
		
	},
	
	/**
	 * Starts the system
	 * 
	 * @method start
	 **/
	start: function() {
		
		zerk.parent('zerk.game.engine.system.player').start.apply(
			this,
			arguments
		);
		
		this._physics.on(
			'contactbegin',
			this._onContactBegin,
			this
		);
		
		this._physics.on(
			'contactend',
			this._onContactEnd,
			this
		);
		
		this._keyboard.on(
			'keydown',
			this._onKeyDown,
			this
		);
		
		this._keyboard.on(
			'keyup',
			this._onKeyUp,
			this
		);
		
	},
	
	/**
	 * Stops the system
	 * 
	 * @method stop
	 **/
	stop: function() {
		
		zerk.parent('zerk.game.engine.system.player').stop.apply(
			this,
			arguments
		);
		
		this._physics.un(
			'contactbegin',
			this._onContactBegin
		);
		
		this._physics.un(
			'contactend',
			this._onContactEnd
		);
		
		this._keyboard.un(
			'keydown',
			this._onKeyDown
		);
		
		this._keyboard.un(
			'keyup',
			this._onKeyUp
		);
		
	},
	
	/**
	 * Updates the system
	 * 
	 * @method update
	 **/
	update: function() {
		
		zerk.parent('zerk.game.engine.system.player').update.apply();
		
		for (var i=0;i<this._entities.length;i++) {
			
			if (!this._entities[i].components.player.enableControl) return;
			
			if (this._keyboard.pressedSpace) {
				this.actionJump(this._entities[i]);
			}
			
			if (this._keyboard.pressedArrowLeft) {
				this.actionWalkLeft(this._entities[i]);
			}
			
			if (this._keyboard.pressedArrowRight) {
				this.actionWalkRight(this._entities[i]);
			}
			
		}
		
	},
	
	/**
	 * Makes given player win
	 * 
	 * @method win
	 * @param {config.entity} entity Entity state
	 **/
	win: function(entity) {
		
		this.fireEvent('win',entity);
		
	},
	
	/**
	 * Makes given player die
	 * 
	 * @method dead
	 * @param {config.entity} entity Entity state
	 **/
	dead: function(entity) {
		
		this._physics.setBodyMoveable(entity,'main',false);
		
		this.fireEvent('dead',entity);
		
	},
	
	/**
	 * Fires when a key is pressed down
	 * 
	 * @method _onKeyDown
	 * @param {DOMEvent} event Event information
	 * @protected
	 **/
	_onKeyDown: function(event) {
		
		for (var i=0;i<this._entities.length;i++) {
			
			var componentState=this._entities[i].components.player;
			
			if (!componentState.enableControl) continue;
			
			if (event.keyCode==32) {
				
				if (componentState.grounded && this._keyReleased) {
					
					componentState.jumping=true;
					
				}
				
				this._keyReleased=false;
				
			}
			
		}
		
	},
	
	/**
	 * Fires when a key is released
	 * 
	 * @method _onKeyUp
	 * @param {DOMEvent} event Event information
	 * @protected
	 **/
	_onKeyUp: function(event) {
		
		for (var i=0;i<this._entities.length;i++) {
			
			var componentState=this._entities[i].components.player;
			
			if (!componentState.enableControl) continue;
			
			if (event.keyCode==32) {
				
				this._keyReleased=true;
				
				componentState.jumping=false;
				
			}
			
		}
		
	},
	
	/**
	 * Fires when two fixtures start colliding
	 * 
	 * @method _onContactBegin
	 * @param {Object} sourceInfo Contact source information
	 * @param {Object} targetInfo Contact target information
	 * @protected
	 **/
	_onContactBegin: function(sourceInfo,targetInfo) {
		
		if (typeof sourceInfo.entity.components.player=='undefined' 
		&& typeof targetInfo.entity.components.player=='undefined') {
			return true;
		}
		
		var info=((typeof sourceInfo.entity.components.player!='undefined')
			? sourceInfo
			: targetInfo);
		
		var entity=info.entity;
		
		var componentState=entity.components.player;
		
		if (info.fixture=='foot') {
			
			componentState.contactCount++;
			
			if (componentState.contactCount>0) {
				
				componentState.grounded=true;
				
				componentState.jumping=false;
				
				componentState.jumpCounter=0;
				
			}
			
		}
		
	},
	
	/**
	 * Fires when two fixtures stop colliding
	 * 
	 * @method _onContactEnd
	 * @param {Object} sourceInfo Contact source information
	 * @param {Object} targetInfo Contact target information
	 * @protected
	 **/
	_onContactEnd: function(sourceInfo,targetInfo) {
		
		if (typeof sourceInfo.entity.components.player=='undefined' 
		&& typeof targetInfo.entity.components.player=='undefined') {
			return true;
		}
		
		var info=((typeof sourceInfo.entity.components.player!='undefined')
			? sourceInfo
			: targetInfo);
		
		var entity=info.entity;
		
		var componentState=entity.components.player;
		
		if (info.fixture=='foot') {
			
			componentState.contactCount--;
			
			if (componentState.contactCount==0) {
				
				componentState.grounded=false;
				
			}
			
		}
		
	},
	
	/**
	 * Makes given player jump
	 * 
	 * @method actionJump
	 * @param {config.entity} entity Entity state
	 **/
	actionJump: function(entity) {
		
		var componentState=entity.components.player;
		
		if (!componentState.jumping) return;
		
		var maxPower=15;
		var steps=5;
		
		if (componentState.jumpCounter==steps) return;
		
		var power=(100-(componentState.jumpCounter*(100/steps)))
			*(maxPower/100);
		
		this._physics.bodyApplyImpulse(entity,'main',270,power);
		
		componentState.jumpCounter++;
		
	},
	
	/**
	 * Makes given player walk left
	 * 
	 * @method actionWalkLeft
	 * @param {config.entity} entity Entity state
	 **/
	actionWalkLeft: function(entity) {
		
		var componentState=entity.components.player;
		
		var velocity=this._physics.getBodyLinearVelocity(entity,'main');
		
		if (velocity.x<=-7) return;
		
		var power=1;
		
		if (componentState.jumping) {
			power=0.75;
		}
		
		this._physics.bodyApplyImpulse(entity,'main',180,power);
		
	},
	
	/**
	 * Makes given player walk right
	 * 
	 * @method actionWalkRight
	 * @param {config.entity} entity Entity state
	 **/
	actionWalkRight: function(entity) {
		
		var componentState=entity.components.player;
		
		var velocity=this._physics.getBodyLinearVelocity(entity,'main');
		
		if (velocity.x>=7) return;
		
		var power=1;
		
		if (componentState.jumping) {
			power=0.75;
		}
		
		this._physics.bodyApplyImpulse(entity,'main',0,power);
		
	}
	
});