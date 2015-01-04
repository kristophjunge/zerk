/**
 * Entity Loader
 * 
 * Provides entity defintions.
 * 
 * @class entityLoader
 * @namespace zerk.game.engine
 * @module zerk
 **/
zerk.define({
	
	name: 'zerk.game.engine.entityLoader'
	
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
	 * Entity register
	 * 
	 * @property _entities
	 * @type Array
	 * @protected
	 **/
	_entities: null,
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 * @param {zerk.jsonLoader} jsonLoader JSON loader instance
	 * @param {zerk.game.engine.componentLoader} componentLoader Component 
	 * 	loader instance
	 */
	init: function(jsonLoader,componentLoader) {
		
		this._jsonLoader=jsonLoader;
		
		this._componentLoader=componentLoader;
		
		this._entities={};
		
	},
	
	/**
	 * Returns a preloaded entity
	 * 
	 * @method getEntity
	 * @param {String} name Entity name
	 * @return {config.entity} The entity definition
	 **/
	getEntity: function(name) {
		
		if (typeof this._entities[name]=='undefined') return null;
		
		return this._entities[name];
		
	},
	
	/**
	 * Returns a list of components contained in the entity
	 * 
	 * @method getComponentList
	 * @param {config.entity} entity Entity state
	 * @return {Array} Array of components
	 **/
	getComponentList: function(entity) {
		
		var result=[];
		
		for (var component in entity.components) {
			
			result.push(component);
			
		}
		
		return result;
		
	},
	
	/**
	 * Preloads given entities
	 * 
	 * @method loadEntities
	 * @param {Array} entities Array of entities
	 * @param {Function} successHandler Event handler for success
	 * @param {Function} errorHandler Event handler for error
	 * @async
	 **/
	loadEntities: function(entities,successHandler,errorHandler) {
		
		var self=this;
		
		this._jsonLoader.require(
			entities,
			function() {
				
				self._onLoadEntities(entities,successHandler,errorHandler);
				
			},
			function (error) {
				
				errorHandler(error);
				
			}
		);
		
	},
	
	/**
	 * Fires when entities are loaded
	 * 
	 * @method _onLoadEntities
	 * @param {Array} entities Array of entities
	 * @param {Function} successHandler Event handler for success
	 * @param {Function} errorHandler Event handler for error
	 * @protected
	 * @async
	 **/
	_onLoadEntities: function(entities,successHandler,errorHandler) {
		
		var componentNames=[];
		
		for (var i=0;i<entities.length;i++) {
			
			// Get the resource
			var entity=this._jsonLoader.getResource(entities[i]);
			
			// Store in entity register
			this._entities[entities[i]]=entity;
			
			// Append to list of contained components
			for (var component in entity.components) {
				
				componentNames.push(component);
				
			}
			
		}
		
		// Remove duplicates
		componentNames=zerk.arrayUnique(componentNames);
		
		// Load contained components
		this._loadComponents(entities,componentNames,successHandler,errorHandler);
		
	},
	
	/**
	 * Loads the given components
	 * 
	 * @method _loadComponents
	 * @param {Array} entities Array of entities
	 * @param {Array} components Array of components
	 * @param {Function} successHandler Event handler for success
	 * @param {Function} errorHandler Event handler for error
	 * @protected
	 * @async
	 **/
	_loadComponents: function(entities,components,successHandler,errorHandler) {
		
		var self=this;
		
		this._componentLoader.loadComponents(
			components,
			function() {
				
				successHandler(entities);
				
			},
			function(error) {
				
				errorHandler(error);
				
			}
		);
		
	}
	
});