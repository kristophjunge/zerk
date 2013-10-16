/**
 * JSON Loader
 * 
 * Loads JSON resources via Ajax.
 * 
 * @class jsonLoader
 * @namespace zerk
 * @module zerk
 **/
/*
 * TODO Ensure its possible to use comments inside the JSON files
 */
zerk.define({
	
	name: 'zerk.jsonLoader',
	require: [
		'zerk.network.ajax'
	]
	
},{
	
	/**
	 * Register of loaded resources
	 * 
	 * @property _data
	 * @type Object
	 * @protected
	 **/
	_data: {},
	
	/**
	 * Namespace configuration
	 * 
	 * @property _namespace
	 * @type Object
	 * @protected
	 **/
	_namespace: {},
	
	/**
	 * AJAX interface to load the resources
	 * 
	 * @property _ajax
	 * @type zerk.network.ajax
	 * @protected
	 **/
	_ajax: null,
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 * @param {Object} config Configuration object
	 **/
	init: function(config) {
		
		if (config) {
			this.setConfig(config);
		}
		
		this._ajax=zerk.create('zerk.network.ajax');
		
	},
	
	/**
	 * Loads one resource
	 * 
	 * Fires successHandler when the resource is loaded.
	 * 
	 * @method loadResource
	 * @param {String} resource Resource id
	 * @param {Function} successHandler Event handler for success
	 * @param {Function} errorHandler Event handler for error
	 * @async
	 **/
	/*
	 * TODO Should this method really be public? Isnt it kind of duplicat of 
	 * 	require?
	 */
	loadResource: function(resource,successHandler,errorHandler) {
		
		if (this.isLoaded(resource)) {
			
			if (zerk.isFunction(successHandler)) {
				
				successHandler(zerk.clone(this._data[resource]));
				
				
			}
			
			return true;
			
		}
		
		var path=this._getResourcePath(resource);
		
		var target=path+'?r='+Math.random();
		
		var self=this;
		
		this._ajax.request(
			target,
			false,
			function (request) {
				
				/*
				 * TODO Reactivate syntax error handling
				 */
				//try {
					
					var jsondata=JSON5.parse(request.responseText);
					
					self._data[resource]=jsondata;
					
					if (zerk.isFunction(successHandler)) {
						
						successHandler(zerk.clone(self._data[resource]));
						
					}
					
				//} catch(e) {
					
					/*
					console.log(
						'Parse error "'+e.message+'" at position '+e.at
					);
					console.log(e.text);
					
					if (typeof error=='function') {
						
						error({
							at: e.at,
							message: e.message,
							text: e.text
						});
						
					}
					*/
					
				//}
				
			},
			function (request) {
				
				errorHandler({
					resource: resource,
					path: path,
					message: 'Couldnt load',
					status: request.status
				});
				
			}
		);
		
	},
	
	/**
	 * Loads multiple resources
	 * 
	 * Fires successHandler when all resources are loaded.
	 * 
	 * @method require
	 * @param {Array} resources Array of resource id's
	 * @param {Function} successHandler Event handler for success
	 * @param {Function} errorHandler Event handler for error
	 * @async
	 **/
	require: function(resources,successHandler,errorHandler) {
		
		var completed=[];
		
		unloadedResources=resources;
		
		var unloadedResources=[];
		
		for (var i=0;i<resources.length;i++) {
			
			if (!this.isLoaded(resources[i])) {
				
				unloadedResources.push(resources[i]);
				
			}
			
		}
		
		// Instant success if we got no resources
		if (unloadedResources.length==0) {
			
			if (zerk.isFunction(successHandler)) {
				
				successHandler();
				
			}
			
		}
		
		for (var i=0;i<unloadedResources.length;i++) {
			
			this.loadResource(
				unloadedResources[i],
				function(data) {
					
					completed.push(unloadedResources[i]);
					
					if (completed.length==unloadedResources.length 
					&& typeof successHandler=='function') {
							
						successHandler();
						
					}
					
				},
				function(error) {
					
					if (typeof errorHandler=='function') {
						
						errorHandler(error);
						
					}
					
					return;
					
				}
				
			);
			
		}
		
	},
	
	/**
	 * Returns a preloaded resource
	 * 
	 * @method getResource
	 * @param {String} id Resource id
	 * @return {Object} The resource data
	 **/
	getResource: function(id) {
		
		if (typeof this._data[id]=='undefined') return;
		
		return zerk.clone(this._data[id]);
		
	},
	
	/**
	 * Sets the namespace configuration
	 * 
	 * @method setConfig
	 * @param {Object} config Configuration object
	 **/
	setConfig: function(config) {
		
		for (var i=0;i<config.length;i++) {
			
			this._namespace[config[i].namespace]=config[i].path;
			
		}
		
	},
	
	/**
	 * Returns true when resource is loaded already
	 * 
	 * @method isLoaded
	 * @param {String} id Resource id
	 * @return {Boolean} True when the resource is loaded already
	 **/
	isLoaded: function(id) {
		
		return zerk.isDefined(this._data[id]);
		
	},
	
	/**
	 * Returns the path for given resource id
	 * 
	 * This method is using the namespace configuration.
	 * 
	 * @method _getResourcePath
	 * @param {String} id Resource id
	 * @return {String} Path to resource
	 * @protected
	 **/
	_getResourcePath: function(id) {
		
		for (var ns in this._namespace) {
			
			if (ns.length>id.length) continue;
			
			if (ns==id.substr(0,ns.length)) {
				
				var localPart = id.substr(ns.length+1);
				
				localPart=localPart.replace(/\./g,'/');
				
				return this._namespace[ns]+'/'+localPart+'.json';
				
			}
			
		}
		
		return false;
		
	}
	
});