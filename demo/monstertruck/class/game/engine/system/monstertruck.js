/**
 * monstertruck System
 * 
 * Provides monstertruck controls for jump and run style games.
 * 
 * @class monstertruck
 * @namespace zerk.game.engine.system
 * @extends zerk.game.engine.system
 * @module zerk
 **/
zerk.define({
	
	name: 'monstertruck.game.engine.system.monstertruck',
	extend: 'zerk.game.engine.system'
	
},{
	
	/**
	 * Name of the system
	 * 
	 * @property _name
	 * @type String
	 * @protected
	 */
	_name: 'snakebot',
	
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


    _keyRailMiddleLeftUp: 81,
    _keyRailMiddleLeftDown: 65,

    _keyRailLeftRightUp: 69,
    _keyRailLeftRightDown: 68,

    _keyMotorLeftUp: 87,
    _keyMotorLeftDown: 83,



	/**
	 * Class constructor
	 * 
	 * @method init
	 * @param {zerk.game.engine} engine Game engine
	 * @param {Object} config System configuration
	 */
	init: function(engine,config) {
		
		zerk.parent('monstertruck.game.engine.system.monstertruck').init.apply(
			this,
			arguments
		);
		
		this._keyboard=this._getSystem('control').keyboard;
		
		this._physics=this._getSystem('physics');
		
		if (!this._physics) {
			
			console.log('snakebot system need physics system to be active');
			
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
		
		return (name=='snakebot');
		
	},
	
	/**
	 * Adds an entity to the system
	 * 
	 * @method addEntity
	 * @param {config.entity} entity Entity state
	 **/
	addEntity: function(entity) {

		zerk.parent('monstertruck.game.engine.system.monstertruck').addEntity.apply(
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
		
		zerk.parent('monstertruck.game.engine.system.monstertruck').start.apply(
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
		
		zerk.parent('monstertruck.game.engine.system.monstertruck').stop.apply(
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
		
		zerk.parent('monstertruck.game.engine.system.monstertruck').update.apply();
		
		for (var i=0;i<this._entities.length;i++) {
			
			if (!this._entities[i].components.snakebot.enableControl) return;

            /*
			if (this._keyboard.pressedSpace) {
				this.actionJump(this._entities[i]);
			}
			*/
			
			if (this._keyboard.pressedArrowLeft) {
				this.actionWalkLeft(this._entities[i]);
			}
			
			if (this._keyboard.pressedArrowRight) {
				this.actionWalkRight(this._entities[i]);
			}
			
		}
		
	},
	
	/**
	 * Makes given snakebot win
	 * 
	 * @method win
	 * @param {config.entity} entity Entity state
	 **/
	win: function(entity) {
		
		this.fireEvent('win',entity);
		
	},
	
	/**
	 * Makes given snakebot die
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

			var componentState=this._entities[i].components.snakebot;

			if (!componentState.enableControl) continue;

            switch (event.keyCode) {
                case this._keyMotorLeftUp:
                    this._physics.jointSetMotorSpeed(this._entities[i],'motorLeft',20);
                    break;
                case this._keyMotorLeftDown:
                    this._physics.jointSetMotorSpeed(this._entities[i],'motorLeft',-20);
                    break;

                case this._keyRailMiddleLeftUp:
                    this._physics.jointSetMotorSpeed(this._entities[i],'railMiddleLeft',2);
                    break;
                case this._keyRailMiddleLeftDown:
                    this._physics.jointSetMotorSpeed(this._entities[i],'railMiddleLeft',-2);
                    break;

                case this._keyRailLeftRightUp:
                    this._physics.jointSetMotorSpeed(this._entities[i],'railLeftRight',2);
                    break;
                case this._keyRailLeftRightDown:
                    this._physics.jointSetMotorSpeed(this._entities[i],'railLeftRight',-2);
                    break;

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
			
			var componentState=this._entities[i].components.snakebot;
			
			if (!componentState.enableControl) continue;

            switch (event.keyCode) {
                case this._keyMotorLeftUp:
                case this._keyMotorLeftDown:
                    this._physics.jointSetMotorSpeed(this._entities[i],'motorLeft',0);
                    break;

                case this._keyRailMiddleLeftUp:
                case this._keyRailMiddleLeftDown:
                    this._physics.jointSetMotorSpeed(this._entities[i],'railMiddleLeft',0);
                    break;

                case this._keyRailLeftRightUp:
                case this._keyRailLeftRightDown:
                    this._physics.jointSetMotorSpeed(this._entities[i],'railLeftRight',0);
                    break;

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
		
		if (typeof sourceInfo.entity.components.snakebot=='undefined'
		&& typeof targetInfo.entity.components.snakebot=='undefined') {
			return true;
		}
		
		var info=((typeof sourceInfo.entity.components.snakebot!='undefined')
			? sourceInfo
			: targetInfo);
		
		var entity=info.entity;
		
		var componentState=entity.components.snakebot;
		
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
		
		if (typeof sourceInfo.entity.components.snakebot=='undefined'
		&& typeof targetInfo.entity.components.snakebot=='undefined') {
			return true;
		}
		
		var info=((typeof sourceInfo.entity.components.snakebot!='undefined')
			? sourceInfo
			: targetInfo);
		
		var entity=info.entity;
		
		var componentState=entity.components.snakebot;
		
		if (info.fixture=='foot') {
			
			componentState.contactCount--;
			
			if (componentState.contactCount==0) {
				
				componentState.grounded=false;
				
			}
			
		}
		
	},
	
	/**
	 * Makes given snakebot walk left
	 * 
	 * @method actionWalkLeft
	 * @param {config.entity} entity Entity state
	 **/
	actionWalkLeft: function(entity) {
		
		var componentState=entity.components.snakebot;
		
		var velocity=this._physics.getBodyLinearVelocity(entity,'main');
		
		if (velocity.x<=-6) return;
		
		var power=0.3;
		
		if (componentState.jumping) {
			power=0.75;
		}
		
		this._physics.bodyApplyImpulse(entity,'main',180,power);
		
	},
	
	/**
	 * Makes given snakebot walk right
	 *
	 * @method actionWalkRight
	 * @param {config.entity} entity Entity state
	 **/
	actionWalkRight: function(entity) {
		
		var componentState=entity.components.snakebot;
		
		var velocity=this._physics.getBodyLinearVelocity(entity,'main');
		
		if (velocity.x>=6) return;
		
		var power=0.3;
		
		if (componentState.jumping) {
			power=0.75;
		}
		
		this._physics.bodyApplyImpulse(entity,'main',0,power);
		
	}
	
});