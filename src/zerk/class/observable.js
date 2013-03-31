/**
 * Observable class
 * 
 * This class implements the observer pattern.
 * 
 * All observable classes should inherit from here.
 * 
 * @class zerk.observable
 * @module zerk
 */
zerk.define({
	
	name: 'zerk.observable'
	
},{
	
	/**
	 * List of event handlers
	 * 
	 * @property _eventListeners
	 * @type Array
	 * @protected
	 */
	_eventListeners: null,
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 */
	init: function() {
		
		this._eventListeners={};
		
	},
	
	/**
	 * Register event handler
	 * 
	 * @method on
	 * @param {String} event Event name
	 * @param {Function} callback Callback function. Return false to cancel 
	 * event bubble.
	 * @param {Object} scope Scope to be used in callback function
	 */
	on: function(event,callback,scope) {
		
		if (typeof callback==='undefined') {
			
			console.error(
				'Cannot register event handler, callback is undefined'
			);
			
			return;
			
		} else if (typeof scope==='undefined') {
			
			console.error(
				'Cannot register event handler, scope is undefined'
			);
			
			return;
			
		}
		
		if (typeof this._eventListeners[event]==='undefined') {
			
			this._eventListeners[event]=[];
			
		}
		
		this._eventListeners[event].push({
			callback: callback,
			scope: scope
		});
		
	},
	
	/**
	 * Unregister event handler
	 * 
	 * @method un
	 * @param {String} event Event name
	 * @param {Function} callback Callback function
	 * @return {Boolen} Returns true on success
	 */
	un: function(event,callback) {
		
		if (this._eventListeners==null
		|| typeof this._eventListeners[event]==='undefined') {
			
			return;
			
		}
		
		for (var i=0;i<this._eventListeners[event].length;i++) {
			
			if (this._eventListeners[event][i].callback===callback) {
				
				this._eventListeners[event].splice(i,1);
				return true;
				
			}
			
		}
		
		return false;
		
	},
	
	/**
	 * Fire event
	 * 
	 * @method fireEvent
	 * @param {String} event Event name
	 * @return {Boolen} Returns false when the bubble was canceled
	 */
	fireEvent: function(event) {
		
		if (this._eventListeners==null
		|| typeof this._eventListeners[event]==='undefined') {
			
			return;
			
		}
		
		var args=Array.prototype.slice.call(arguments);
		args.splice(0,1);
		
		for (var i=0;i<this._eventListeners[event].length;i++) {
			
			if (this._eventListeners[event][i].callback.apply(
				this._eventListeners[event][i].scope,
				args
			)===false) {
				
				return false;
				
			}
			
		}
		
		return true;
		
	}

});