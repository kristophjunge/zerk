/**
 * Control System
 * 
 * Provides mouse and keyboard inputs.
 * 
 * @class control
 * @namespace zerk.game.engine.system
 * @extends zerk.game.engine.system
 * @module zerk
 **/
zerk.define({
	
	name: 'zerk.game.engine.system.control',
	extend: 'zerk.game.engine.system',
	require: [
		'zerk.game.engine.system.control.keyboard',
		'zerk.game.engine.system.control.mouse'
	]
	
},{
	
	/**
	 * Keyboard interface
	 * 
	 * @property keyboard
	 * @type zerk.game.engine.system.control.keyboard
	 **/
	keyboard: null,
	
	/**
	 * Mouse interface
	 * 
	 * @property mouse
	 * @type zerk.game.engine.system.control.mouse
	 **/
	mouse: null,
	
	/**
	 * Name of the system
	 * 
	 * @property _name
	 * @type String
	 * @protected
	 **/
	_name: 'control',
	
	/**
	 * Thread that runs this system
	 * 
	 * @property _thread
	 * @type String
	 * @protected
	 **/
	_thread: 'none',
	
	/**
	 * Viewport system instance
	 * 
	 * @property _viewport
	 * @type zerk.game.engine.system.viewport
	 * @protected
	 **/
	_viewport: null,
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 * @param {zerk.game.engine} engine Game engine
	 * @param {Object} config System configuration
	 **/
	init: function(engine,config) {
		
		zerk.parent('zerk.game.engine.system.control').init.apply(
			this,
			arguments
		);
		
		this._viewport=this._getSystem('viewport');
		
		this.keyboard=zerk.create(
			'zerk.game.engine.system.control.keyboard',
			this
		);
		
		this._log('Keyboard loaded',1);
		
		this.mouse=zerk.create(
			'zerk.game.engine.system.control.mouse',
			this,
			this._viewport,
			this._config.mouse
		);
		
		this._log('Mouse loaded',1);
		
		this._log('Ready');
		
	},
	
	/**
	 * Returns the configuration defaults of the system
	 * 
	 * @method _getConfigDefaults
	 * @return {Object} Default configuration
	 * @protected
	 **/
	_getConfigDefaults: function() {
		
		return {
			mouse: {
				zoomSpeed: 1,
				enableWheelZoom: false,
				enableJoint: false
			}
		};
		
	},
	
	/**
	 * Returns true when the system is interested in given component
	 * 
	 * @method useComponent
	 * @param {String} name Component name
	 * @return {Boolean} True when the system is intereseted in given component
	 **/
	useComponent: function(name) {
		
		// The message system is not interested in entities
		return false;
		
	},
	
	/**
	 * Starts the system
	 * 
	 * @method start
	 **/
	start: function() {
		
		zerk.parent('zerk.game.engine.system.control').start.apply(
			this,
			arguments
		);
		
	},
	
	/**
	 * Stops the system
	 * 
	 * @method stop
	 **/
	stop: function() {
		
		zerk.parent('zerk.game.engine.system.control').stop.apply(
			this,
			arguments
		);
		
	},
	
	/**
	 * Updates the system
	 * 
	 * @method update
	 **/
	update: function() {
		
		zerk.parent('zerk.game.engine.system.control').update.apply(
			this,
			arguments
		);
		
	}
	
});