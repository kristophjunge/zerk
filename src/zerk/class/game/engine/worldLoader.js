/**
 * World Loader
 * 
 * Loads world definitions from JSON files.
 * 
 * @class worldLoader
 * @namespace zerk.game.engine
 * @module zerk
 **/
zerk.define({
	
	name: 'zerk.game.engine.worldLoader'
	
},{
	
	/**
	 * JSON loader instance
	 * 
	 * @property _jsonLoader
	 * @type zerk.jsonLoader
	 * @protected
	 **/
	_jsonLoader: null,
	
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
	 * Sprite loader instance
	 * 
	 * @property _spriteLoader
	 * @type zerk.game.engine.spriteLoader
	 * @protected
	 **/
	_spriteLoader: null,
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 * @param {zerk.game.engine} engine Game engine
	 */
	init: function(jsonLoader,componentLoader,entityLoader,spriteLoader) {
		
		this._jsonLoader=jsonLoader;
		this._componentLoader=componentLoader;
		this._entityLoader=entityLoader;
		this._spriteLoader=spriteLoader;
		
	},
	
	/**
	 * Loads a world by given resource id
	 * 
	 * @method loadWorld
	 * @param {String} name World resource id
	 * @param {Function} successHandler Event handler for success
	 * @param {Function} errorHandler Event handler for error
	 * @async
	 **/
	loadWorld: function(name,successHandler,errorHandler) {
		
		var self=this;
		
		this._jsonLoader.loadResource(
			name,
			function(data) {
				
				self._onLoadWorld(data,successHandler,errorHandler);
				
			},
			function(error) {
				
				errorHandler(error);
				
			}
		);
		
	},
	
	/**
	 * Fires when the world is loaded
	 * 
	 * @method _onLoadWorld
	 * @param {Object} world World definition
	 * @param {Function} successHandler Event handler for success
	 * @param {Function} errorHandler Event handler for error
	 * @protected
	 * @async
	 **/
	_onLoadWorld: function(world,successHandler,errorHandler) {
		
		// Load contained entities
		
		var entities=[];
		
		for (var i=0;i<world.entities.length;i++) {
			
			entities.push(world.entities[i].name);
			
		}
		
		entities=zerk.arrayUnique(entities);
		
		this._loadEntities(world,entities,successHandler,errorHandler);
		
	},
	
	/**
	 * Loads given entities
	 * 
	 * @method _loadEntities
	 * @param {Object} world World definition
	 * @param {Array} entities Array of entities
	 * @param {Function} successHandler Event handler for success
	 * @param {Function} errorHandler Event handler for error
	 * @protected
	 * @async
	 **/
	_loadEntities: function(world,entities,successHandler,errorHandler) {
		
		var self=this;
		
		this._entityLoader.loadEntities(
			entities,
			function() {
				
				self._onLoadEntities(world,entities,successHandler,errorHandler);
				
			},
			function(error) {
				
				errorHandler(error);
				
				//console.log('ERROR: Cant load contained entities',error);
				
			}
		);
		
	},
	
	/**
	 * Fires when the entities are loaded
	 * 
	 * @method _onLoadEntities
	 * @param {Object} world World definition
	 * @param {Array} entities Array of entities
	 * @param {Function} successHandler Event handler for success
	 * @param {Function} errorHandler Event handler for error
	 * @protected
	 **/
	_onLoadEntities: function(world,entities,successHandler,errorHandler) {

		var sprites=[
			'sandbox.sprite.demo'
		];
		
		this._loadSprites(world,entities,sprites,successHandler,errorHandler);
		
	},
	
	/**
	 * Loads given sprites
	 * 
	 * @method _loadEntities
	 * @param {Object} world World definition
	 * @param {Array} entities Array of entities
	 * @param {Array} sprites Array of sprites
	 * @param {Function} successHandler Event handler for success
	 * @param {Function} errorHandler Event handler for error
	 * @protected
	 * @async
	 **/
	_loadSprites: function(world,entities,sprites,successHandler,errorHandler) {
		
		var self=this;
		
		this._spriteLoader.loadSprites(
			sprites,
			function() {
				
				self._onLoadSprites(world,entities,sprites,successHandler,errorHandler);
				
			},
			function(error) {
				
				errorHandler(error);
				
			}
		);
		
	},
	
	/**
	 * Fires when the sprites are loaded
	 * 
	 * @method _onLoadSprites
	 * @param {Object} world World definition
	 * @param {Array} entities Array of entities
	 * @param {Array} sprites Array of sprites
	 * @param {Function} successHandler Event handler for success
	 * @param {Function} errorHandler Event handler for error
	 * @protected
	 **/
	_onLoadSprites: function(world,entities,sprites,successHandler,errorHandler) {
		
		successHandler(world);
		
	}
	
});