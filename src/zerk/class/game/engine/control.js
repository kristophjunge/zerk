/**
 * Controls
 * 
 * @class zerk.game.engine.control
 * @module zerk
 */
zerk.define({
	
	name: 'zerk.game.engine.control',
	require: [
		'zerk.game.engine.control.keyboard',
		'zerk.game.engine.control.mouse'
	]
	
},{
	
	/**
	 * Keyboard interface
	 * 
	 * @property keyboard
	 * @type zerk.game.engine.control.keyboard
	 */
	keyboard: null,
	
	/**
	 * Mouse interface
	 * 
	 * @property mouse
	 * @type zerk.game.engine.control.mouse
	 */
	mouse: null,
	
	/**
	 * Controls configuration
	 * 
	 * @property _config
	 * @type Object
	 */
	_config: null,
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 * @param {zerk.game.engine} engine Game engine
	 */
	init: function(engine) {
		
		this._engine=engine;
		
		this._config={
			mouse: {
				enableWheelZoom: false,
				enableJoint: false
			}
		};
		
		// Get a handle in the registry
		this._config=this._engine.registry.register(
			'control',
			this._config
		);
		
		this.keyboard=zerk.create(
			'zerk.game.engine.control.keyboard',
			this._engine,
			this
		);
		
		this.mouse=zerk.create(
			'zerk.game.engine.control.mouse',
			this._engine,
			this
		);
		
		this._log('Init');
		
	},
	
	/**
	 * Local log method
	 * 
	 * @method _log
	 * @param {String} msg Log message
	 * @protected
	 */
	_log: function(msg) {
		
		// Redirect to global log
		this._engine.debug.log(
			msg,
			this._engine.debug.GROUP_CONTROL
		);
		
	}
	
});