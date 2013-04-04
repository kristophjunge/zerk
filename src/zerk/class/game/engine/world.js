/**
 * World
 * 
 * This class represents the world.
 * 
 * All world classes should inherit from here.
 * 
 * @class zerk.game.engine.world
 * @module zerk
 */
zerk.define({
	
	name: 'zerk.game.engine.world'
	
},{
	
	/**
	 * Entities array
	 * 
	 * @property entities
	 * @type Array
	 */
	entities: null,
	
	/**
	 * World configuration
	 * 
	 * @property _config
	 * @type Object
	 * @protected
	 */
	_config: null,
	
	/**
	 * Entity id to instance map
	 * 
	 * @property _mapEntity
	 * @type Object
	 * @protected
	 */
	_mapEntity: null,
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 * @param {zerk.game.engine} engine Game engine
	 */
	init: function(engine) {
		
		this._engine=engine;
		
		this._mapEntity={};
		
		this.entities=[];
		
		// Set default config values
		this._config={};
		
		// Get a handle in the registry
		this._config=this._engine.registry.register(
			'world',
			this._config
		);
		
		this._setup();
		
		this._log('Ready ('+this.entities.length+' Entities)');
		
	},
	
	/**
	 * Removes given entity from the world
	 * 
	 * @method destroy
	 * @param {zerk.game.engine.entity} entity
	 * @return {Boolean} Returns true on success
	 */
	destroy: function(entity) {
		
		this._log('Destroyed "'+entity.config.id+'"');
		
		this._engine.physics.removePhysics(entity);
		
		delete this._mapEntity[entity.config.id];
		
		for (var i=0;i<this.entities.length;i++) {
			
			if (this.entities[i].config.id==entity.config.id) {
				
				this.entities.splice(i,1);
				
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
	 * @return {null|zerk.game.engine.entity} Entity or null
	 */
	getEntityById: function(id) {
		
		if (typeof this._mapEntity[id]=='undefined') return null;
		
		return this._mapEntity[id];
		
	},
	
	/**
	 * Defines the initial world state
	 * 
	 * @method _setup
	 * @protected
	 */
	_setup: function() {
		
	},
	
	/**
	 * Creates a new entity instance with given configuration
	 *
	 * @method _spawn
	 * @param {zerk.game.engine.entity} entity
	 * @param {Object} config Entity configuration
	 * @protected
	 */
	_spawn: function(entity,config) {
		
		if (typeof this._mapEntity[config.id]!='undefined') {
			console.error('Entity id already in use "'+config.id+'"');
			return;
		}
		
		var newEntity=zerk.create(
			entity,
			this._engine
		);
		
		newEntity.applyConfig(config);
		
		newEntity.setup();
		
		this._engine.physics.createPhysics(newEntity);
		
		this.entities.push(newEntity);
		
		this._mapEntity[config.id]=newEntity;
		
		this._log(
			'Spawned "'+newEntity.name+'"'+
			' id "'+newEntity.config.id+'"'+
			' at '+newEntity.config.x+':'+newEntity.config.y
		);
		
		newEntity.fireEvent('spawn');
		
	},
	
	/**
	 * Removes all entities from the world
	 * 
	 * @method clear
	 */
	clear: function() {
		
		while (this.entities.length>0) {
			
			this.destroy(this.entities[0],true);
			
		}
		
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
			this._engine.debug.GROUP_WORLD
		);
		
	}
	
});