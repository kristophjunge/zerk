/**
 * Debug
 * 
 * @class zerk.game.engine.debug
 * @module zerk
 */
/*
 * TODO Change log group system so that each group can be activated seperate
 */
zerk.define({
	
	name: 'zerk.game.engine.debug'
	
},{
	
	/**
	 * Log group for game messages
	 * 
	 * @property GROUP_GAME
	 * @type Integer
	 * @readOnly
	 */
	GROUP_GAME: 3,
	
	/**
	 * Log group for engine messages
	 * 
	 * @property GROUP_ENGINE
	 * @type Integer
	 * @readOnly
	 */
	GROUP_ENGINE: 4,
	
	/**
	 * Log group for physics messages
	 * 
	 * @property GROUP_PHYSICS
	 * @type Integer
	 * @readOnly
	 */
	GROUP_PHYSICS: 5,
	
	/**
	 * Log group for viewport messages
	 * 
	 * @property GROUP_VIEWPORT
	 * @type Integer
	 * @readOnly
	 */
	GROUP_VIEWPORT: 6,
	
	/**
	 * Log group for world messages
	 * 
	 * @property GROUP_WORLD
	 * @type Integer
	 * @readOnly
	 */
	GROUP_WORLD: 7,
	
	/**
	 * Log group for control messages
	 * 
	 * @property GROUP_CONTROL
	 * @type Integer
	 * @readOnly
	 */
	GROUP_CONTROL: 8,
	
	/**
	 * Log group for event messages
	 * 
	 * @property GROUP_EVENT
	 * @type Integer
	 * @readOnly
	 */
	GROUP_EVENT: 9,
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 * @param {zerk.game.engine} engine Game engine
	 */
	init: function(engine) {
		
		this._engine=engine;
		
		// Set default config values
		this._config={
			logEnabled: false 
		};
		
		// Get a handle in the registry
		this._config=this._engine.registry.register(
			'debug',
			this._config
		);
		
	},
	
	/**
	 * Returns the name of a log group by given log group constant
	 * 
	 * @method getLogGroupName
	 * @param {Integer} level Log group constant
	 * @return {String} Log group name
	 */
	getLogGroupName: function(level) {
		
		switch (level) {
			case this.GROUP_GAME: return 'Game';
			case this.GROUP_ENGINE: return 'Engine';
			case this.GROUP_PHYSICS: return 'Physics Engine';
			case this.GROUP_VIEWPORT: return 'Viewport';
			case this.GROUP_WORLD: return 'World';
			case this.GROUP_CONTROL: return 'Control';
			case this.GROUP_EVENT: return 'Event';
			default: return 'GROUPNAME';
		}
		
	},
	
	/**
	 * Creates a log message
	 * 
	 * @method log
	 * @param {String} msg Log message
	 * @param {Integer} group Log group
	 */
	log: function(msg,group) {
		
		if (!this._config.logEnabled) return;
		
		var groupName=this.getLogGroupName(group);
		
		console.log('__ '+groupName+': '+msg);
		
	}
	
});