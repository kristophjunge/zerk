/**
 * The game engine main class
 * 
 * @class zerk.game.engine
 * @extends zerk.observable
 * @module zerk
 */
zerk.define({
	
	name: 'zerk.game.engine',
	extend: 'zerk.observable',
	require: [
		'zerk.game.engine.registry',
		'zerk.game.engine.helper',
		'zerk.game.engine.debug',
		'zerk.game.engine.dom',
		'zerk.game.engine.control',
		'zerk.game.engine.viewport',
		'zerk.game.engine.physics',
		'zerk.game.engine.world',
		'zerk.game.engine.entity'
	]
	
},{
	
	/**
	 * Game engine registry
	 * 
	 * @property registry
	 * @type zerk.game.engine.registry
	 */
	registry: null,
	
	/**
	 * Global helpers
	 * 
	 * @property helper
	 * @type zerk.game.engine.helper
	 */
	helper: null,
	
	/**
	 * Debugger
	 * 
	 * @property debug
	 * @type zerk.game.engine.debug
	 */
	debug: null,
	
	/**
	 * DOM interface
	 * 
	 * @property dom
	 * @type zerk.game.engine.dom
	 */
	dom: null,
	
	/**
	 * Human input controls
	 * 
	 * @property control
	 * @type zerk.game.engine.control
	 */
	control: null,
	
	/**
	 * Grafical presentation
	 * 
	 * @property viewport
	 * @type zerk.game.engine.viewport
	 */
	viewport: null,
	
	/**
	 * Physics simulation
	 * 
	 * @property physics
	 * @type zerk.game.engine.physics
	 */
	physics: null,
	
	/**
	 * Back reference to the game class
	 * 
	 * @property game
	 * @type zerk.game
	 */
	game: null,
	
	/**
	 * World register
	 * 
	 * @property world
	 * @type zerk.game.engine.world
	 */
	world: null,
	
	/**
	 * Engine configuration
	 * 
	 * @property _config
	 * @type Null|Object
	 * @protected
	 */
	_config: null,
	
	/**
	 * Total world runtime
	 * 
	 * @property _time
	 * @type Integer
	 * @protected
	 */
	_time: 0,
		
	/**
	 * World timer interval
	 * 
	 * @property _worldInterval
	 * @type Integer
	 * @protected
	 */
	_worldInterval: 1000/60,
	
	/**
	 * World timer
	 * 
	 * @property _timer
	 * @type Null|Timer
	 * @protected
	 */
	_timer: null,
	
	/**
	 * Indicates that the engine is running
	 * 
	 * @property _running
	 * @type Boolean
	 * @protected
	 */
	_running: false,
	
	/**
	 * Indicates that the world is unloading
	 * 
	 * @property _unloadingWorld
	 * @type Boolean
	 * @protected
	 */
	_unloadingWorld: false,
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 * @param {Object} config Game configuration
	 */
	init: function(game,config) {
		
		zerk.parent('zerk.game.engine').init.apply(
			this,
			arguments
		);
		
		this.game=game;
		
		this.registry=zerk.create(
			'zerk.game.engine.registry',
			this,
			config // Feed up the registry with the initial user config object
		);
		
		this._config={
			/*
			 * Mode setting
			 * 
			 * Possible values are:
			 *    default
			 *    debug
			 *    benchmark
			 */
			mode: 'default'
		};
		
		this._config=this.registry.register('engine',this._config);
		
		this.helper=zerk.create(
			'zerk.game.engine.helper',
			this
		);
		
		this.debug=zerk.create(
			'zerk.game.engine.debug',
			this
		);
		
		this.dom=zerk.create(
			'zerk.game.engine.dom',
			this
		);
		
		this.control=zerk.create(
			'zerk.game.engine.control',
			this
		);
		
		this.viewport=zerk.create(
			'zerk.game.engine.viewport',
			this
		);
		
		this.physics=zerk.create(
			'zerk.game.engine.physics',
			this
		);
		
		var me=this;
		
		window.onerror=function() {
			
			me.stop();
			
		};
		
		this._log('Init');
		
	},
	
	/**
	 * Start game engine
	 * 
	 * @method start
	 */
	start: function() {
		
		var me=this;
		
		this.viewport.start();
		
		this._running=true;
		
		this._log('Game started');
		
		this._tick(); // Run the first tick
		
		this._timer=window.setInterval(
			function() {
				
				me._tick();
				
			},
			this._worldInterval
		);
		
	},
	
	/**
	 * Stop game engine
	 * 
	 * @method stop
	 */
	stop: function() {
		
		if (!this._running) return;
		
		this.world.clear();
		
		this.viewport.stop();
		
		this._running=false;
		
		window.clearInterval(this._timer);
		
		this._log('Game stopped (Time '+this._time+')');
		
	},
	
	/**
	 * Pause game engine
	 * 
	 * @method pause
	 */
	pause: function() {
		
		window.clearInterval(this._timer);
		
		this._running=false;
		
		this._log('Game paused (Time '+this._time+')');
		
	},
	
	/**
	 * Loads a world
	 * 
	 * @method loadWorld
	 * @param {String} worldClass Class name of the world to be loaded
	 */
	loadWorld: function(worldClass) {
		
		this.world=zerk.create(worldClass,this);
		
	},
	
	/**
	 * Unloads the world
	 * 
	 * @method unloadWorld
	 */
	unloadWorld: function() {
		
		this.world.clear();
		
		this.world=null;
		
		this._unloadingWorld=true;
		
	},
	
	/**
	 * Save world state
	 * 
	 * @method saveWorld
	 * @return {String} World state as JSON string
	 */
	saveWorld: function() {
		
		var data={};
		
		data.worldConfig=this.world._config;
		data.entities=[];
		
		for (var i=0;i<this.world.entities.length;i++) {
			
			data.entities.push({
				name: this.world.entities[i].name,
				config: this.world.entities[i].config
			});
			
		}
		
		var json=JSON.stringify(data);
		
		return json;
		
	},
	
	/**
	 * Returns true if the game engine is running
	 * 
	 * @method isRunning
	 * @return {Boolean} True if the game engine is running
	 */
	isRunning: function() {
		
		return this._running;
		
	},
	
	/**
	 * Returns current world time
	 * 
	 * @method getTime
	 * @return {Integer} World time
	 */
	getTime: function() {
		
		return this._time;
		
	},
	
	/**
	 * Game engine tick
	 * 
	 * @method _tick
	 * @protected
	 */
	_tick: function() {
		
		this._time++;
		
		// Run physics tick
		this.physics.tick();
		
		// Process world unloading
		if (this._unloadingWorld) {
			
			this._unloadingWorld=false;
			
			/**
			 * Fires after the world is unloaded
			 * 
			 * @event worldunloaded 
			 */
			this.fireEvent('worldunloaded');
			
		}
		
		/**
		 * Fires every world simulation tick
		 * 
		 * @event tick 
		 */
		this.fireEvent('tick');
		
		if (this.world!=null) {
			
			for (var i=0;i<this.world.entities.length;i++) {
				
				// Sync entity physics data
				this.physics.syncEntityPhysics(
					this.world.entities[i]
				);
				
				// Process entity ticks
				this.world.entities[i].fireEvent('tick');
				
			}
		}
		
	},
	
	/**
	 * Local log method
	 * 
	 * @method _log
	 * @param {String} msg
	 * @protected
	 */
	_log: function(msg) {
		
		// Redirect to global log
		return this.debug.log(msg,this.debug.GROUP_ENGINE);
		
	}
	
});