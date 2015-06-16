/**
 * System
 * 
 * Base class for systems. All systems should inherit from here.
 * 
 * @class system
 * @namespace zerk.game.engine
 * @extends zerk.observable
 * @module zerk
 **/
zerk.define({
	
	name: 'zerk.game.engine.system',
	extend: 'zerk.observable'
	
},{
	
	/**
	 * Name of the system
	 * 
	 * @property _name
	 * @type String
	 * @protected
	 **/
	/*
	 * TODO Check if system name really needs to be stored here
	 */
	_name: '',
	
	/**
	 * Thread that runs this system
	 * 
	 * Can be:  
	 * - simulation  
	 * - render  
	 * - none  
	 * 
	 * @property _thread
	 * @type String
	 * @protected
	 **/
	_thread: '',
	
	/**
	 * Priority of this system
	 * 
	 * Priorities handle the order in which systems are processed.
	 * 
	 * @property _priority
	 * @type Integer
	 * @protected
	 **/
	_priority: 1,
	
	/**
	 * Engine instance
	 * 
	 * Back reference to the engine instance.
	 * 
	 * @property _engine
	 * @type zerk.game.engine
	 * @protected
	 **/
	_engine: null,
	
	/**
	 * Entities register
	 * 
	 * Entities that this system is interested in.
	 * 
	 * @property _entities
	 * @type Array
	 * @protected
	 **/
	_entities: null,
	
	/**
	 * System configuration
	 * 
	 * @property _config
	 * @type Object
	 * @protected
	 **/
	_config: null,
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 * @param {zerk.game.engine} engine Engine instance
	 * @param {Object} config System configuration
	 **/
	init: function(engine,config) {
		
		zerk.parent('zerk.game.engine.system').init.apply(
			this,
			arguments
		);
		
		this._entities=[];
		
		this._engine=engine;
		
		// Get a handle in the registry
		this._config=this._engine.getRegistry().register(
			'engine.systems.'+this._name,
			this._getConfigDefaults()
		);
		
		zerk.apply(this._config,config);

		this._log('Init');
		
	},
	
	/**
	 * Returns the thread the systems runs in
	 * 
	 * @method getThread
	 * @return {String} Thread name
	 **/
	getThread: function() {
		
		return this._thread;
		
	},
	
	/**
	 * Returns the name of the system
	 * 
	 * @method getName
	 * @return {String} System name
	 **/
	getName: function() {
		
		return this._name;
		
	},
	
	/**
	 * Returns the priority of the system
	 * 
	 * @method getPriority
	 * @return {Integer} System priority
	 **/
	getPriority: function() {
		
		return this._priority;
		
	},
	
	/**
	 * Adds an entity to the system
	 * 
	 * @method addEntity
	 * @param {config.entity} entity Entity state
	 **/
	addEntity: function(entity) {
		
		this._entities.push(entity);
		
	},
	
	/**
	 * Removes an entity from the system
	 * 
	 * @method removeEntity
	 * @param {config.entity} entity Entity state
	 **/
	removeEntity: function(entity) {
		
		for (var i=0;i<this._entities.length;i++) {
			
			if (this._entities[i].id==entity.id) {
				
				this._entities.splice(i,1);
				
				return true;
			}
			
		}
		
		return false;
		
	},
	
	/**
	 * Starts the system
	 * 
	 * @method start
	 **/
	start: function() {},
	
	/**
	 * Stops the system
	 * 
	 * @method stop
	 **/
	stop: function() {},
	
	/**
	 * Updates the system
	 * 
	 * Fired every tick.
	 * 
	 * @method update
	 **/
	update: function() {},
	
	/**
	 * Returns true when the system is interested in given component
	 * 
	 * This method is used by the engine to decide whether entities containing 
	 * this component should be added to the system.
	 * 
	 * @method useComponent
	 * @param {String} name Component name
	 * @return {Boolean} True when the system is intereseted in given component
	 **/
	useComponent: function(name) {},
	
	/**
	 * Returns the configuration defaults of the system
	 * 
	 * @method _getConfigDefaults
	 * @return {Object} Default configuration
	 * @protected
	 **/
	_getConfigDefaults: function() {},
	
	/**
	 * Returns system by given name
	 * 
	 * This method is used to communicate with other systems.
	 * 
	 * @method _getSystem
	 * @param {String} name System name
	 * @return {zerk.game.engine.system} System instance
	 * @protected
	 **/
	_getSystem: function(name) {
		
		return this._engine.getSystem(name);
		
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
		
		if (!zerk.isDefined(severity)) {
			
			severity=0;
			
		}
		
		severity+=4;
		
		zerk.log({
			message: message,
			group: 'System ['+this._name+']',
			severity: severity
		});
		
	}
	
});