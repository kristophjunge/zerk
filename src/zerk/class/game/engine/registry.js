/**
 * Game engine registry
 * 
 * @class zerk.game.engine.registry
 * @module zerk
 */
zerk.define({
	
	name: 'zerk.game.engine.registry'
	
},{
	
	/**
	 * Registry storage
	 * 
	 * @property _data
	 * @type Object
	 * @protected
	 */
	_data: {
		
		// Group for global config values
		game: {
			
		}
		
	},
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 * @param {zerk.game.engine} engine Game engine
	 * @param {Object} data Initial configuration
	 */
	init: function(engine,data) {
		
		this._engine=engine;
		
		// Parse user defined config data
		for (var key in data) {
			
			// If its not an object append it to the global group
			if (typeof data[key]!='object') {
				
				this._data.game[key]=data[key];
				
			} else {
				
				this._data[key]=data[key];
				
			}
			
		}
		
	},
	
	/**
	 * Registers a new configuration group to the registry
	 * 
	 * @method register
	 * @param {String} register Name of the group
	 * @param {Object} defaults Default values
	 * @return {Object} Handle to the registry storage
	 */
	register: function(register,defaults) {
		
		var entry={};
		
		zerk.apply(entry,defaults);
		
		// Look if user defined config data is present already
		if (typeof this._data[register]!='undefined') {
			
			zerk.apply(entry,this._data[register]);
			
		}
		
		this._data[register]=entry;
		
		return this._data[register];
		
	},
	
	/**
	 * Set a value by given key
	 * 
	 * @method setValue
	 * @param {String} key Key
	 * @param {Any} value Value
	 */
	setValue: function(key,value) {
		
		if (!key) return;
		
		var obj=this._data;
		
		var pathArr=key.split('.');
		
		for (var i=0;i<pathArr.length;i++) {
			
			if (typeof obj[pathArr[i]]=='undefined') {
				
				obj[pathArr[i]]={};
				
			}
			
			if (i==pathArr.length-1) {
				
				obj[pathArr[i]]=value;
				
				return true;
				
			}
			
			obj=obj[pathArr[i]];
			
		}
		
	},
	
	/**
	 * Retrieve a value by given key
	 * 
	 * @method getValue
	 * @param {String} key Key
	 * @return {Any} Value
	 */
	getValue: function(key) {
		
		if (!key) return;
		
		var obj=this._data;
			
		var pathArr=key.split('.');
		
		for (var i=0;i<pathArr.length;i++) {
			
			obj=obj[pathArr[i]];
			
		}
		
		return obj;
		
	}
	
});