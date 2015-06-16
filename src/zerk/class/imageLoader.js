/**
 * Image Loader
 * 
 * Loads images via html tags
 * 
 * @class imageLoader
 * @namespace zerk
 * @module zerk
 **/
zerk.define({
	
	name: 'zerk.imageLoader'
	
},{
	
	/**
	 * Register of loaded resources
	 * 
	 * @property _images
	 * @type Object
	 * @protected
	 **/
	_images: {},
	
	/**
	 * Namespace configuration
	 * 
	 * @property _namespace
	 * @type Object
	 * @protected
	 **/
	_namespace: {},
	
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

	},
	
	/**
	 * Loads one resource
	 * 
	 * Fires successFn when the resource is loaded.
	 * 
	 * @method loadResource
	 * @param {String} resource Resource id
	 * @param {Function} successFn Event handler for success
	 * @param {Function} errorFn Event handler for error
	 * @async
	 **/
	_loadImage: function(id,successFn,errorFn) {

        var me=this;

		if (me.isLoaded(id)) {
			if (zerk.isFunction(successFn)) {
				successFn(zerk.clone(me._images[id]));
			}
			return true;
		}
		
		var path=me._getResourcePath(id);
        if (!path) {
            zerk.error('Resource not found "'+id+'"');
        }

        var image=new Image();
        image.id='zerk-image-'+id;
        image.src=path;
        image.addEventListener('load',function() {
            me._images[id]=image;
            if (zerk.isFunction(successFn)) {
                successFn(id,image);
            }
        });

        image.addEventListener('error',function() {
            zerk.error('Cannot load image "'+path+'" for resource "'+id+'"');
        });

        var container=document.getElementById('zerk-images');

        if (!container) {
            zerk.error('Image container not found \'zerk-images\'');
        }

        container.appendChild(image);

	},
	
	/**
	 * Loads multiple resources
	 * 
	 * Fires successFn when all resources are loaded.
	 * 
	 * @method require
	 * @param {Array} resources Array of resource id's
	 * @param {Function} successFn Event handler for success
	 * @param {Function} errorFn Event handler for error
	 * @async
	 **/
	require: function(idList,successFn,errorFn) {
		
        if (!zerk.isDefined(successFn)) {
            successFn=zerk.emptyFn();
        }
        if (!zerk.isDefined(errorFn)) {
            errorFn=zerk.emptyFn();
        }
        
        var me=this;
		var completed=[];
        var unloaded=[];
        var result={};
		
		for (var i=0;i<idList.length;i++) {
			if (this.isLoaded(idList[i])) {
                result[idList[i]]=me.getResource(idList[i]);
			} else {
                unloaded.push(idList[i]);
            }
		}

		if (unloaded.length==0) {
            successFn(result);
		}
		
		for (var i=0;i<unloaded.length;i++) {
			this._loadImage(
				unloaded[i],
				function(id,image) {
					completed.push(unloaded[i]);
                    result[id]=image;
					if (completed.length==unloaded.length) {
						successFn(result);
					}
				},
				errorFn
			);
		}
		
	},

    clear: function() {

        var me=this;
        var image=null;
        var container=document.getElementById('zerk-images');

        for (var imageId in me._images) {
            me._images[imageId]=null;
            image=document.getElementById('zerk-image-'+imageId);
            container.removeChild(image);
        }

        me._images={};

    },
	
	/**
	 * Returns a preloaded resource
	 * 
	 * @method getResource
	 * @param {String} id Resource id
	 * @return {Object} The resource data
	 **/
	getResource: function(id) {
		
		if (!zerk.isDefined(this._images[id])) {
            return;
        }
		
		return this._images[id];
		
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
		
		return zerk.isDefined(this._images[id]);
		
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
				return this._namespace[ns]+'/'+localPart+'.png?r='+Math.random();
			}
		}
		
		return false;
		
	},

    addNamespace: function(ns,path) {

        this._namespace[ns]=path;

    }
	
});