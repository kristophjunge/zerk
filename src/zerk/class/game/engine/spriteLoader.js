/**
 * Sprite Loader
 * 
 * Loads sprite sheets
 * 
 * @class spriteLoader
 * @namespace zerk.game.engine
 * @module zerk
 **/
zerk.define({
	
	name: 'zerk.game.engine.spriteLoader'
	
},{
	
	/**
	 * JSON loader instance
	 * 
	 * @property _jsonLoader
	 * @type zerk.jsonLoader
	 * @protected
	 **/
	_jsonLoader: null,
	
	_sprites: null,
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 * @param {zerk.jsonLoader} jsonLoader JSON loader instance
	 * @param {zerk.game.engine.componentLoader} componentLoader Component 
	 * 	loader instance
	 */
	init: function(jsonLoader) {
		
		this._jsonLoader=jsonLoader;
		
		this._sprites={};
		
	},
	
	/**
	 * Returns preloaded sprite information
	 * 
	 * @method getSprite
	 * @param {String} sheet Sprite sheet key
	 * @param {String} key Sprite key
	 * @return {config.sprite} Sprite information
	 **/
	getSprite: function(sheet,key) {
		
		if (typeof this._sprites[sheet]=='undefined') return null;
		if (typeof this._sprites[sheet][key]=='undefined') return null;
		
		return this._sprites[sheet][key];
		
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
	loadSprites: function(sprites,successHandler,errorHandler) {
		
		var self=this;
		
		this._jsonLoader.require(
			sprites,
			function() {
				
				self._onLoadSprites(sprites,successHandler,errorHandler);
				
			},
			function (error) {
				
				errorHandler(error);
				
			}
		);
		
	},
	
	_parseSpriteData: function(sprite) {
		
		var result={};
		
		for (var i=0;i<sprite.frames.length;i++) {
			
			var spriteInfo={
				name: sprite.frames[i].filename.replace(/\.[^/.]+$/, ''),
				offsetX: sprite.frames[i].frame.x,
				offsetY: sprite.frames[i].frame.y,
				width: sprite.frames[i].frame.w,
				height: sprite.frames[i].frame.h
			};
			
			result[spriteInfo.name]=spriteInfo;
			
		}
		
		return result;
		
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
	_onLoadSprites: function(sprites,successHandler,errorHandler) {
		
		var componentNames=[];
		
		for (var i=0;i<sprites.length;i++) {
			
			// Get the resource
			var sprite=this._jsonLoader.getResource(sprites[i]);
			
			// Store in entity register
			this._sprites[sprites[i]]=this._parseSpriteData(sprite);
			
		}
		
		successHandler(sprites);
		
	}
	
});