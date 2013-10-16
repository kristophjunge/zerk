/**
 * Message System
 * 
 * Render message on the display.
 * 
 * @class message
 * @namespace zerk.game.engine.system
 * @extends zerk.game.engine.system
 * @module zerk
 **/
zerk.define({
	
	name: 'zerk.game.engine.system.message',
	extend: 'zerk.game.engine.system',
	require: [
		'zerk.game.engine.system.message.message'
	]
	
},{
	
	/**
	 * Name of the system
	 * 
	 * @property name
	 * @type String
	 **/
	_name: 'message',
	
	/**
	 * Thread that runs this system
	 * 
	 * @property _thread
	 * @type String
	 * @protected
	 **/
	_thread: 'render',
	
	/**
	 * Priority of this system
	 * 
	 * @property _priority
	 * @type Integer
	 * @protected
	 **/
	_priority: 103,
	
	/**
	 * Viewport system instance
	 * 
	 * @property _viewport
	 * @type zerk.game.engine.system.viewport
	 * @protected
	 **/
	_viewport: null,
	
	/**
	 * Text messages
	 * 
	 * @property _messages
	 * @type Array
	 * @protected
	 **/
	_messages: null,
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 * @param {zerk.game.engine} engine Game engine
	 * @param {Object} config System configuration
	 **/
	init: function(engine,config) {
		
		zerk.parent('zerk.game.engine.system.message').init.apply(
			this,
			arguments
		);
		
		this._messages=[];
		
		this._viewport=this._getSystem('viewport');
		
	},
	
	/**
	 * Returns true when the system is interested in given component
	 * 
	 * @method useComponent
	 * @param {String} name Component name
	 * @return {Boolean} True when the system is intereseted in given component
	 **/
	useComponent: function(name) {
		
		// The message system is not interested in entities
		return false;
		
	},
	
	/**
	 * Starts the system
	 * 
	 * @method start
	 **/
	start: function() {
		
		zerk.parent('zerk.game.engine.system.message').start.apply(
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
		
		zerk.parent('zerk.game.engine.system.message').stop.apply(
			this,
			arguments
		);
		
	},
	
	/**
	 * Updates the system
	 * 
	 * @method update
	 **/
	update: function() {
		
		zerk.parent('zerk.game.engine.system.message').update.apply(
			this,
			arguments
		);
		
		this._renderMessages();
		
	},
	
	/**
	 * Registers a message
	 * 
	 * @method registerMessage
	 * @param {zerk.game.engine.system.message.message} message
	 **/
	registerMessage: function(message) {
		
		this._messages.push(message);
		
	},
	
	/**
	 * Unregisters a message
	 * 
	 * @method unregisterMessage
	 * @param {String} id Message id
	 **/
	unregisterMessage: function(id) {
		
		var found=false;
		for (var i=0;i<this._messages.length;i++) {
			if (this._messages[i].id==id) {
				found=true;
				break;
			}
		}
		
		if (!found) return false;
		
		this._messages.splice(i,1);
		return true;
		
	},
	
	/**
	 * Removes all messages
	 * 
	 * @method clearMessages
	 **/
	clearMessages: function() {
		
		this._messages=[];
		
	},
	
	/**
	 * Removes messages that timed out
	 * 
	 * @method _clearMessages
	 * @protected
	 **/
	_clearMessages: function() {
		
		/*
		 * TODO Remove global call, put time method into suitable system
		 */
		var currentTime=zerk.game._engine.getTime();
		
		do {
			
			for (var i=0;i<this._messages.length;i++) {
				
				if (this._messages[i].starttime==null) {
					
					this._messages[i].starttime=currentTime;
					
				} else if (this._messages[i].lifetime>0
				&& (currentTime>=this._messages[i].starttime
				+this._messages[i].lifetime)) {
					
					this._messages.splice(i,1);
					break;
					
				}
				
			}
			
		}
		while (i<this._messages.length);
		
	},
	
	/**
	 * Renders messages
	 * 
	 * @method _renderMessages
	 * @protected
	 **/
	_renderMessages: function() {
		
		this._clearMessages();
		
		for (var i=0;i<this._messages.length;i++) {
			
			this._viewport.drawText(
				'display',
				this._messages[i].text,
				this._messages[i].x,
				this._messages[i].y,
				this._messages[i].font,
				this._messages[i].size,
				this._messages[i].color,
				'center',
				'center'
			);
			
		}
		
	}
	
});