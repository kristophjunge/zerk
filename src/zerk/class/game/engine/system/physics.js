/**
 * Physics System
 * 
 * Provides physics simulations.
 * 
 * Physics system base class. All physics systems should inherit from here.
 * 
 * @class physics
 * @namespace zerk.game.engine.system
 * @extends zerk.game.engine.system
 * @module zerk
 **/
zerk.define({
	
	name: 'zerk.game.engine.system.physics',
	extend: 'zerk.game.engine.system'
	
},{
	
	/**
	 * Name of the system
	 * 
	 * @property _name
	 * @type String
	 * @protected
	 **/
	_name: 'physics',
	
	/**
	 * Thread that runs this system
	 * 
	 * @property _thread
	 * @type String
	 * @protected
	 **/
	_thread: 'simulation',
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 * @param {zerk.game.engine} engine Game engine
	 * @param {Object} config System configuration
	 **/
	init: function(engine,config) {
		
		zerk.parent('zerk.game.engine.system.physics').init.apply(
			this,
			arguments
		);
		
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
			gravityX: 0,
			gravityY: 0,
			debugDraw: false,
			enableMouseJoint: false
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
		
		return (name=='position' || name=='physics');
		
	},
	
	/**
	 * Starts the system
	 * 
	 * @method start
	 **/
	start: function() {
		
		zerk.parent('zerk.game.engine.system.physics').start.apply(
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
		
		zerk.parent('zerk.game.engine.system.physics').stop.apply(
			this,
			arguments
		);
		
	},
	
	/**
	 * Adds an entity to the system
	 * 
	 * @method addEntity
	 * @param {config.entity} entity Entity state
	 **/
	addEntity: function(entity) {
		
		zerk.parent('zerk.game.engine.system.physics').addEntity.apply(
			this,
			arguments
		);
		
		this._createPhysics(entity);
		
	},
	
	/**
	 * Removes an entity from the system
	 * 
	 * @method removeEntity
	 * @param {config.entity} entity Entity state
	 **/
	removeEntity: function(entity) {
		
		zerk.parent('zerk.game.engine.system.physics').removeEntity.apply(
			this,
			arguments
		);
		
		this._removePhysics(entity);
		
	},
	
	/**
	 * Updates the system
	 * 
	 * @method update
	 **/
	update: function() {
		
		zerk.parent('zerk.game.engine.system.physics').update.apply(
			this,
			arguments
		);
		
		// Run physics tick
		this._tick();
		
		for (var i=0;i<this._entities.length;i++) {
			
			// Sync entity physics data
			this._syncEntityPhysics(
				this._entities[i]
			);
			
		}
		
	},
	
	/**
	 * Fires every tick
	 * 
	 * @method _tick
	 * @protected
	 **/
	_tick: function() {},
	
	/**
	 * Creates the physics representation for given entity
	 * 
	 * @method _createPhysics
	 * @param {config.entity} entity Entity state
	 * @protected
	 **/
	_createPhysics: function(entity) {},
	
	/**
	 * Removes the physics representation for given entity
	 * 
	 * @method _removePhysics
	 * @param {config.entity} entity Entity state
	 * @protected
	 **/
	_removePhysics: function(entity) {}
	
	/*
	 * TODO Define missing physics interface methods that every physics system 
	 * 	should implement 
	 */
	
});