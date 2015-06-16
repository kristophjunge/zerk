/**
 * Game Engine
 * 
 * The game engine main class
 * 
 * @class engine
 * @namespace zerk.game
 * @extends zerk.observable
 * @module zerk
 */
zerk.define({
	
	name: 'zerk.game.engine',
	extend: 'zerk.observable',
	require: [
		'zerk.game.engine.registry',
		'zerk.game.engine.entityLoader',
		'zerk.game.engine.componentLoader',
		'zerk.game.engine.worldLoader',
		'zerk.game.engine.spriteLoader',
        'zerk.game.engine.textureLoader'
	]
	
},{
	
	/**
	 * Game engine registry
	 * 
	 * @property _registry
	 * @type zerk.game.engine.registry
	 * @protected
	 **/
	_registry: null,
	
	/**
	 * JSON loader instance
	 * 
	 * @property _jsonLoader
	 * @type zerk.jsonLoader
	 * @protected
	 **/
	_jsonLoader: null,

    /**
     * Image loader instance
     *
     * @property _imageLoader
     * @type zerk.imageLoader
     * @protected
     **/
    _imageLoader: null,
	
	/**
	 * Component loader instance
	 * 
	 * @property _componentLoader
	 * @type zerk.game.engine.componentLoader
	 * @protected
	 **/
	_componentLoader: null,
	
	/**
	 * Entity loader instance
	 * 
	 * @property _entityLoader
	 * @type zerk.game.engine.entityLoader
	 * @protected
	 **/
	_entityLoader: null,
	
	/**
	 * World loader instance
	 * 
	 * @property _worldLoader
	 * @type zerk.game.engine.worldLoader
	 * @protected
	 **/
	_worldLoader: null,
	
	/**
	 * Sprite loader instance
	 * 
	 * @property _spriteLoader
	 * @type zerk.game.engine.spriteLoader
	 * @protected
	 **/
	_spriteLoader: null,

    /**
     * Texture loader instance
     *
     * @property _textureLoader
     * @type zerk.game.engine.textureLoader
     * @protected
     **/
    _textureLoader: null,
	
	/**
	 * Engine configuration
	 * 
	 * @property _config
	 * @type Object
	 * @protected
	 **/
	_config: null,
	
	/**
	 * Total world runtime
	 * 
	 * @property _time
	 * @type Integer
	 * @protected
	 **/
	_time: 0,
	
	/**
	 * World timer interval
	 * 
	 * @property _worldInterval
	 * @type Float
	 * @protected
	 **/
	/*
	 * TODO Make the world interval configurable
	 */
	_worldInterval: 1000/60,
	
	/**
	 * World timer
	 * 
	 * @property _timer
	 * @type DOMTimer
	 * @protected
	 **/
	_timer: null,
	
	/**
	 * Indicates that the engine is running
	 * 
	 * @property _running
	 * @type Boolean
	 * @protected
	 **/
	_running: false,
	
	/**
	 * Indicates that the world is unloading
	 * 
	 * @property _unloadingWorld
	 * @type Boolean
	 * @protected
	 * @deprecated
	 **/
	_unloadingWorld: false,
	
	/**
	 * Entities register
	 * 
	 * @property _entities
	 * @type Array
	 * @protected
	 **/
	_entities: null,
	
	/**
	 * Entity id map
	 * 
	 * @property _entityIdMap
	 * @type Object
	 * @protected
	 **/
	_entityIdMap: null,
	
	/**
	 * System register
	 * 
	 * @property _system
	 * @type Object
	 * @protected
	 **/
	_system: null,
	
	/**
	 * Entities grouped by threads for fast access
	 * 
	 * @property _threadMap
	 * @type Object
	 * @protected
	 **/
	_threadMap: null,
	
	/**
	 * Map of systems by names
	 * 
	 * @property _systemMap
	 * @type Object
	 * @protected
	 **/
	_systemMap: null,
	
	/**
	 * Last used entity id
	 * 
	 * Used to generate the next entity id.
	 * 
	 * @property _lastEntityId
	 * @type Integer
	 * @protected
	 **/
	_lastEntityId: 0,
	
	
	/* --- ENGINE --- */
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 * @param {zerk.jsonLoader} jsonLoader A JSON Loader instance
	 * @param {Object} config Game configuration
	 **/
	init: function(jsonLoader,imageLoader,config) {
		
		zerk.parent('zerk.game.engine').init.apply(
			this,
			arguments
		);
		
		this._entityIdMap={};
		this._entities=[];
		this._system={};
		this._threadMap={};
		this._systemMap={};
		
		this._jsonLoader=jsonLoader;

        this._imageLoader=imageLoader;
		
		this._registry=zerk.create(
			'zerk.game.engine.registry',
			config // Feed up the registry with the initial user config object
		);
		
		this._config={
			componentMap: {},
			systemMap: {},
			defaultSystems: [],
			version: '0.1.0'
		};
		
		this._config=this._registry.register('engine',this._config);
		
		// Setup loaders
		this._componentLoader=zerk.create(
			'zerk.game.engine.componentLoader',
			this._jsonLoader,
			this._config.componentMap
		);
		
		this._entityLoader=zerk.create(
			'zerk.game.engine.entityLoader',
			this._jsonLoader
		);
		
		this._spriteLoader=zerk.create(
			'zerk.game.engine.spriteLoader',
			this._jsonLoader,
            this._imageLoader
		);

        this._textureLoader=zerk.create(
            'zerk.game.engine.textureLoader',
            this._imageLoader
        );

		this._worldLoader=zerk.create(
			'zerk.game.engine.worldLoader',
			this._jsonLoader,
            this._imageLoader,
			this._componentLoader,
			this._entityLoader,
			this._spriteLoader,
            this._textureLoader
		);
		
		// Setup renderer thread
		
		// Setup crossbrowser requestAnimationFrame
		zerk.browser.setupRequestAnimationFrame();
		
		var self=this;
		
		(function animloop() {
			
			requestAnimationFrame(animloop);
			
			self._render();
			
		})();
		
		this._log('Init');
		
	},
	
	/**
	 * Start game engine
	 * 
	 * @method start
	 **/
	start: function() {
		
		this._log('Started');
		
		this._running=true;
		
		this._tick(); // Run the first tick
		
		this._startTimer();
		
		return true;
		
	},
	
	/**
	 * Stop game engine
	 * 
	 * @method stop
	 **/
	stop: function() {
		
		if (!this._running) return;
		
		this._log('Stopping');
		
		this._stopTimer();
		
		this._running=false;
		
		this.reset();
		
		this._log('Stopped (Time '+this._time+')');
		
		return true;
		
	},
	
	/**
	 * Pause game engine
	 * 
	 * @method pause
	 **/
	pause: function() {
		
		this._stopTimer();
		
		this._running=false;
		
		this._log('Game paused (Time '+this._time+')');
		
		return true;
		
	},
	
	/**
	 * Loads a world
	 * 
	 * @method loadWorld
	 * @param {String} worldClass Resource id of the world to be loaded
	 * @param {Function} successHandler Event handler for success
	 * @param {Function} errorHandler Event handler for error
	 * @async
	 **/
	loadWorld: function(name,successHandler,errorHandler) {
		
		var self=this;
		
		this._log('Loading world "'+name+'"');
		
		this._log('Loading world resources',2);
		
		this._worldLoader.loadWorld(
			name,
			function (data) {
				self._onLoadWorld(data,successHandler,errorHandler);
			},
			function (error) {
				errorHandler(error);
			}
		);
		
	},

    loadWorldConfig: function(config,successHandler,errorHandler) {

        var self=this;

        this._log('Loading world by config');

        this._log('Loading world resources',2);

        this._worldLoader.loadWorldConfig(
            config,
            function (data) {
                self._onLoadWorld(data,successHandler,errorHandler);
            },
            function (error) {
                errorHandler(error);
            }
        );

    },
	
	/**
	 * Reset the engine
	 * 
	 * @method reset
	 **/
	reset: function() {
		
		this._log('Unloading world');
		
		this._log('Clear entities',2);
		
		this.clearEntities();
		
		this._log('Stop systems',2);
		
		this.stopSystems();
		
		this._log('Clear systems',2);
		
		this.clearSystems();
		
		this._unloadingWorld=false;
		
		this.fireEvent('worldunloaded');
		
	},
	
	/**
	 * Save world state
	 * 
	 * @method saveWorld
	 * @return {String} World state as JSON string
	 **/
	saveWorld: function() {
		
		/*
		 * TODO Recreate save method
		 */
		
		/*
		var data={};
		
		data.worldConfig=this.world._config;
		data.entities=[];
		
		for (var i=0;i<this._entities.length;i++) {
			
			data.entities.push({
				name: this._entities[i].name,
				config: this._entities[i].config
			});
			
		}
		
		var json=JSON.stringify(data);
		
		return json;
		*/
		
	},
	
	/**
	 * Returns true if the game engine is running
	 * 
	 * @method isRunning
	 * @return {Boolean} True if the game engine is running
	 **/
	isRunning: function() {
		
		return this._running;
		
	},
	
	/**
	 * Returns current world time
	 * 
	 * @method getTime
	 * @return {Integer} World time
	 **/
	getTime: function() {
		
		return this._time;
		
	},
	
	/**
	 * Returns the game engine registry
	 * 
	 * @method getRegistry
	 * @return {zerk.game.engine.registry} Returns the registry instance
	 **/
	getRegistry: function() {
		
		return this._registry;
		
	},
	
	/**
	 * Loads given entities
	 * 
	 * @method loadEntities
	 * @param {Array} entities An array of entity resource ids
	 * @param {Function} successHandler Event handler for success
	 * @param {Function} errorHandler Event handler for error
	 * @async
	 **/
	loadEntities: function(entities,successHandler,errorHandler) {
		
		return this._entityLoader.loadEntities(
			entities,
			successHandler,
			errorHandler
		);
		
	},
	
	
	
	/* --- ENTITY MANAGER --- */
	
	/**
	 * Creates a new entity instance with given configuration
	 *
	 * @method addEntity
	 * @param {config.entity} config Entity configuration
	 **/
	addEntity: function(config) {
		
		/**
		 * *** THIS IS NOT A CLASS! ITS A CONFIGURATION OBJECT. ***
		 * 
		 * Entity configuration.
		 * 
		 * Used by {{#crossLink "zerk.game.engine"}}{{/crossLink}}
		 * 
		 * @class config.entity
		 **/
		var extendedConfig={
			
			/**
			 * Unqiue entity id
			 * 
			 * @property id
			 * @type Integer
			 **/
			id: null,
			
			/**
			 * Name of the entity
			 * 
			 * @property name
			 * @type String
			 **/
			name: '',
			
			/**
			 * Tags assigned to this entity
			 * 
			 * @property tags
			 * @type Array
			 **/
			tags: [],
			
			/**
			 * Components contained in the entity
			 * 
			 * @property components
			 * @type Object
			 **/
			components: {}
		};
		
		zerk.apply(extendedConfig,config);
		
		// Entity definition
		var definition=this._entityLoader.getEntity(extendedConfig.name);
		
		if (!definition) {
			
			zerk.error({
				message: 'Entity is not loaded "'+extendedConfig.name+'"'
			});
			
		}
		
		// Local config
		var entity=this._componentLoader.buildComponents(definition,extendedConfig);
		
		// Generate ID
		this._lastEntityId++;
		entity.id=this._lastEntityId;
		
		// Get list of systems intereste in this entity
		var systemList=this.getEntitySystemList(entity);
		
		// Add the entity to related systems
		for (var i=0;i<systemList.length;i++) {
			
			this._system[systemList[i]].addEntity(entity);
			
		}
		
		// Add entity to the world register
		this._entities.push(entity);
		
		// Create ID map entry
		this._entityIdMap['id'+entity.id]=entity;
		
		this._log('Spawned "'+entity.name+'"'+' id "'+entity.id+'"',4);
		
	},
	
	/**
	 * Removes given entity instance from the world
	 * 
	 * @for zerk.game.engine
	 * @method removeEntity
	 * @param {config.entity} Entity state
	 * @return {Boolean} Returns true on success
	 **/
	removeEntity: function(entity) {
		
		// Get list of systems intereste in this entity
		var systemList=this.getEntitySystemList(entity);
		
		for (var i=0;i<systemList.length;i++) {
			
			this._system[systemList[i]].removeEntity(entity);
			
		}
		
		
		delete this._entityIdMap['id'+entity.id];
		
		for (var i=0;i<this._entities.length;i++) {
			
			if (this._entities[i].id==entity.id) {
				
				this._entities.splice(i,1);
				
				this._log('Destroyed "'+entity.id+'"',4);
				
				return true;
			}
			
		}
		
		return false;
		
	},
	
	/**
	 * Returns entity instance by given id
	 * 
	 * @method getEntityById
	 * @param {String} id Entity id
	 * @return {null|config.entity} Entity or null
	 **/
	getEntityById: function(id) {
		
		if (!zerk.isDefined(this._entityIdMap['id'+id])) return null;
		
		return this._entityIdMap['id'+id];
		
	},
	
	/**
	 * Returns entites that contain all given tags
	 * 
	 * @method getEntitiesByTags
	 * @param {Array} tags Array of tags
	 * @return {Array} Array of entities
	 **/
	/*
	 * TODO Find performant way to query entities by tags
	 */
	getEntitiesByTags: function(tags) {
		
		// Force into array
		if (!zerk.isArray(tags)) {
			
			tags=[tags];
			
		}
		
		var result=[];
		
		for (var i=0;i<this._entities.length;i++) {
			
			if (zerk.isDefined(this._entities[i].tags)
			&& zerk.isArray(this._entities[i].tags)
			&& !zerk.isEmpty(this._entities[i].tags)) {
				
				var match=true;
				
				for (var c=0;c<tags.length;c++) {
					
					if (!zerk.inArray(tags[c],this._entities[i].tags)) {
						
						match=false;
						break;
						
					}
					
				}
				
				if (match) {
					
					result.push(this._entities[i]);
					
				}
				
			}
			
		}
		
		return result;
		
	},
	
	/**
	 * Removes all entities from the world
	 * 
	 * @method clearEntities
	 **/
	clearEntities: function() {
		
		this._log('Clear');
		
		while (this._entities.length>0) {
			
			this.removeEntity(this._entities[0],true);
			
		}
		
		// Reset ID counter
		this._lastEntityId=0;
		
	},
	
	
	
	/* --- SYSTEM MANAGER --- */
	
	/**
	 * Adds a system to the engine
	 * 
	 * @method addSystem
	 * @param {String} name Name of the system. Not the class name.
	 * @param {Object} config Initial config for the system
	 * @return {Boolean} True on success
	 **/
	addSystem: function(name,config) {
		
		this._log('Add system "'+name+'"');
		
		if (this.isSystemRegistered(name)) return;
		
		var systemClass=this._getSystemClass(name);
		
		var system=zerk.create(
			systemClass,
			this,
			config
		);

		var thread=system.getThread();
		
		// Register the system under its name
		this._system[system.getName()]=system;
		
		// Create a thread map entry
		if (typeof this._threadMap[thread]=='undefined') {
			this._threadMap[thread]=[];
		}
		
		var inserted=false;
		
		for (var i=0;i<this._threadMap[thread];i++) {
			
			if (this._threadMap[thread][i].getPriority()<system.getPriority()) {
				
				this._threadMap[thread].splice(i-1,0,system);
				inserted=true;
				
			}
			
		}
		
		if (!inserted) {
			
			this._threadMap[thread].push(system);
			
		}
		
		return system;
		
	},
	
	/**
	 * Removes a system from the engine
	 * 
	 * @method removeSystem
	 * @param {String} name Name of the system. Not the class name.
	 * @return {Boolean} True on success
	 **/
	removeSystem: function(name) {
		
		this._log('Remove system "'+name+'"');
		
		if (!this.isSystemRegistered(name)) return;
		
		var system=this.getSystem(name);
		
		var thread=system.getThread();
		
		// Remove register entry
		for (var key in this._system) {
			
			if (key==name) {
				
				delete this._system[key];
				break;
				
			}
			
		}
		
		// Remove thread map entry
		for (var i=0;i<this._threadMap[thread].length;i++) {
			
			if (this._threadMap[thread][i].getName()==name) {
				
				this._threadMap[thread].splice(i,1);
				break;
				
			}
			
		}
		
		return true;
		
	},
	
	/**
	 * Removes all system from the engine
	 * 
	 * @method clearSystems
	 **/
	clearSystems: function() {
		
		this._log('Clearing...');
		
		for (var system in this._system) {
			
			this.removeSystem(system);
			
		}
		
		this._log('Cleared');
		
	},
	
	/**
	 * Starts all systems
	 * 
	 * @method startSystems
	 **/
	startSystems: function() {
		
		var i=0;
		
		for (var thread in this._threadMap) {
			
			for (i=0;i<this._threadMap[thread].length;i++) {
				
				this._threadMap[thread][i].start();
				
			}
			
		}
		
	},
	
	/**
	 * Stops all systems
	 * 
	 * @method stopSystems
	 **/
	stopSystems: function() {
		
		var i=0;
		
		for (var thread in this._threadMap) {
			
			for (i=this._threadMap[thread].length-1;i>=0;i--) {
				
				this._threadMap[thread][i].stop();
				
			}
			
		}
		
	},
	
	/**
	 * Returns a list of systems interested in given entity
	 * 
	 * @method getEntitySystemList
	 * @param {config.entity} entity Entity state
	 * @return {Array} Array of systems
	 **/
	getEntitySystemList: function(entity) {
		
		var keys={};
		
		for (var component in entity.components) {
			
			for (var system in this._system) {
				
				if (this._system[system].useComponent(component)) {
					keys[system]=true;
				}
				
			}
			
		}
		
		var result=[];
		
		for (var system in keys) {
			
			result.push(system);
			
		}
		
		return result;
		
	},
	
	/**
	 * Returns a system instance
	 * 
	 * @method getSystem
	 * @param {String} name System name. Not the class name.
	 * @return {zerk.game.engine.system} System instance
	 **/
	getSystem: function(name) {

		if (!zerk.isDefined(this._system[name])) {
			
			return false;
			
		}
		
		return this._system[name];
		
	},
	
	/**
	 * Returns true when given system is loaded in the engine
	 * 
	 * @method isSystemRegistered
	 * @param {String} name System name. Not the class name.
	 * @return {Boolean} True when the system is loaded
	 **/
	isSystemRegistered: function(name) {
		
		return (typeof this._system[name]!='undefined');
		
	},
	
	/**
	 * Updates all systems in given thread
	 * 
	 * @method _updateSystems
	 * @param {String} thread Thread name
	 * @protected
	 **/
	_updateSystems: function(thread) {
		
		if (typeof this._threadMap[thread]=='undefined') return;
		
		//console.log('UPDATE '+thread);
		
		// Process all systems in given thread register
		for (var i=0;i<this._threadMap[thread].length;i++) {
			
			this._threadMap[thread][i].update();
			
		}
		
	},
	
	/**
	 * Returns the class name for given system name
	 * 
	 * @method _getSystemClass
	 * @param {String} name System name. Not the class name.
	 * @return {String} Class name of the system
	 * @protected
	 **/
	_getSystemClass: function(name) {
		
		if (typeof this._config.systemMap[name]=='undefined') return false;
		
		return this._config.systemMap[name];
		
	},
	
	/**
	 * Fires when the world definition is laoded
	 * 
	 * @method _onLoadWorld
	 * @param {Object} world World definition
	 * @param {Function} successHandler Event handler for success
	 * @param {Function} errorHandler Event handler for error
	 * @protected
	 **/
	_onLoadWorld: function(world,successHandler,errorHandler) {
		
		// Merge list of default systems with world systems
		
		var systems=[];
		
		var defaultSystems=this._config.defaultSystems;
		
		for (var i=0;i<defaultSystems.length;i++) {
			
			systems.push(defaultSystems[i]);
			
		}
		
		for (var system in world.config.systems) {
			
			systems.push(system);
			
		}
		
		systems=zerk.arrayUnique(systems);
		
		
		// Add systems
		
		this._log('Loading systems ('+systems.length+')',2);
		
		var systemConfig=null;
		
		for (var i=0;i<systems.length;i++) {
			
			systemConfig={};
			
			if (typeof world.config.systems[systems[i]]!='undefined') {
				
				systemConfig=world.config.systems[systems[i]];
				
			}
			
			this.addSystem(systems[i],systemConfig);
			
		}
		
		
		// Start systems
		
		this._log('Starting systems',2);
		
		this.startSystems();
		
		
		// Add entities
		
		this._log('Loading entities ('+world.entities.length+')',2);
		
		for (var i=0;i<world.entities.length;i++) {
			
			/*
			 * TODO Check why world is modified in here
			 */
			this.addEntity(world.entities[i]);
			
		}
		
		
		
		// Execute callback
		
		successHandler();
		
		this._log('Loaded world');
		
	},
	
	/**
	 * Starts the engine timer
	 * 
	 * @method _startTimer
	 * @protected
	 **/
	_startTimer: function() {
		
		var self=this;
		
		this._timer=window.setInterval(
			function() {
				
				self._tick();
				
			},
			this._worldInterval
		);
		
	},
	
	/**
	 * Stops the engine timer
	 * 
	 * @method _stopTimer
	 * @protected
	 **/
	_stopTimer: function() {
		
		window.clearInterval(this._timer);
		
	},
	
	/**
	 * Game engine simulation tick
	 * 
	 * @method _tick
	 * @protected
	 **/
	_tick: function() {
		
		this._time++;
		
		this._updateSystems('simulation');
		
	},
	
	/**
	 * Game engine render tick
	 * 
	 * @method _render
	 * @protected
	 **/
	_render: function() {
		
		if (!this._running) return;
		
		this._updateSystems('render');
		
	},
	
	/**
	 * Local log method
	 * 
	 * @method _log
	 * @param {String} message Log message
	 * @param {Integer} severity Log severity
	 * @protected
	 **/
	_log: function(message,severity) {
		
		zerk.log({
			message: message,
			group: 'Engine',
			severity: severity
		});
		
	}
	
});