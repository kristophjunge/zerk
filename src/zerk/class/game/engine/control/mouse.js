/**
 * Mouse interface
 * 
 * @class zerk.game.engine.control.mouse
 * @extends zerk.observable
 * @module zerk
 */
/*
 * TODO Use DOM interface instead of native code
 */
zerk.define({
	
	name: 'zerk.game.engine.control.mouse',
	extend: 'zerk.observable'
	
},{
	
	/**
	 * Horizontal cursor position
	 * 
	 * @property mouseX
	 * @type Integer
	 */
	mouseX: null,
	
	/**
	 * Vertical cursor position
	 * 
	 * @property mouseX
	 * @type Integer
	 */
	mouseY: null,
	
	/**
	 * State of the left mouse button
	 * 
	 * @property mouseLeftDown
	 * @type Boolean
	 */
	mouseLeftDown: false,
	
	/**
	 * State of the right mouse button
	 * 
	 * @property mouseRightDown
	 * @type Boolean
	 */
	mouseRightDown: false,
	
	/**
	 * Coordinates of the last mouse position
	 * 
	 * @property _lastMousePosition
	 * @type {Object}
	 * @protected
	 */
	_lastMousePosition: null,
	
	/**
	 * State of the mouse joint
	 * 
	 * @property _mouseJointActive
	 * @type Boolean
	 * @protected
	 */
	_mouseJointActive: false,
	
	/**
	 * Game engine
	 * 
	 * @property _engine
	 * @type zerk.game.engine
	 * @protected
	 */
	_engine: null,
	
	/**
	 * Back reference to control class
	 * 
	 * @property _control
	 * @type zerk.game.engine.control
	 * @protected
	 */
	_control: null,
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 * @param {zerk.game.engine} engine
	 */
	init: function(engine,control) {
		
		zerk.parent('zerk.game.engine.control.mouse').init.apply(
			this,
			arguments
		);
		
		this._engine=engine;
		
		this._control=control;
		
		var me=this;
		
		var canvas=this._engine.dom.getCanvasGame();
		
		canvas.addEventListener(
			'mousedown',
			function(event) {
				
				return me._onMouseDown(event);
				
			}
		);
		
		canvas.addEventListener(
			'mouseup',
			function(event) {
				
				return me._onMouseUp(event);
				
			}
		);
		
		canvas.addEventListener(
			'mousemove',
			function(event) {
				
				return me._onMouseMove(event);
				
			}
		);
		
		canvas.addEventListener(
			'contextmenu',
			function(event) {
				
				return me._onContextMenu(event);
				
			},
			false
		);
		
		var doc=this._engine.dom.getDocument();
		
		this._engine.dom.registerEvent(
			doc,
			'mousewheel',
			function(event) {
				
				me._onMouseScroll(event);
				
			}
		);
		
		this._log('Mouse loaded');
		
	},
	
	/**
	 * Returns the position of the cursor by given mouse event
	 * 
	 * @method _getCursorPosition
	 * @param {event} event Native mouse event
	 * @return {Object} Coordinate object
	 * @protected
	 */
	_getCursorPosition: function(event) {
		
		var position=zerk.game.engine.dom.getCanvasGamePosition();
		
		return {
			x: event.clientX-position.left,
			y: event.clientY-position.top
		};
		
	},
	
	/**
	 * Context menu event handler
	 * 
	 * @method _onContextMenu
	 * @param {event} event Native event
	 * @return {Boolean} Returns false
	 * @protected
	 */
	_onContextMenu: function(event) {
		
		event.preventDefault();
		
		return false;
		
	},
	
	/**
	 * Mouse down event handler
	 * 
	 * @method _onMouseDown
	 * @param {event} event Native event
	 * @return {Boolean}
	 * @protected
	 */
	_onMouseDown: function(event) {
		
		if (event.button==0) {  
			
			this.mouseLeftDown=true;
			
			/*
			 * Trigger the mouse move event to interact 
			 * directly on click position
			 */
			this._onMouseMove(event);	
			
		} else if (event.button==2) {
			
			this.mouseRightDown=true;
			
		}
		
		/**
		 * Fires when a mouse button is pressed
		 * 
		 * @param {DOMEvent} event
		 * @event mousedown 
		 */
		this.fireEvent('mousedown',event);
		
		return false;
		
	},
	
	/**
	 * Mouse up event handler
	 * 
	 * @method _onMouseUp
	 * @param {event} event Native event
	 * @return {Boolean} Returns false
	 * @protected
	 */
	_onMouseUp: function(event) {
		
		if (event.button==0) {  
			
			this.mouseLeftDown=false;
			
		} else if (event.button==2) {
			
			this.mouseRightDown=false;	
			
		}
		
		/**
		 * Fires when a mouse button is released
		 * 
		 * @param {DOMEvent} event
		 * @event mouseup
		 */
		this.fireEvent('mouseup',event);
		
		return false;
		
	},
	
	/**
	 * Mouse move event handler
	 * 
	 * @method _onMouseMove
	 * @param {event} event Native event
	 * @protected
	 */
	_onMouseMove: function(event) {
		
		var position=this._getCursorPosition(event);
		
		if (this.mouseRightDown) {
			
			zerk.game.engine.viewport.setX(
				zerk.game.engine.viewport.getX()
				-position.x-this._lastMousePosition.x
			);
				
			zerk.game.engine.viewport.setY(
				zerk.game.engine.viewport.getY()
				-position.y-this._lastMousePosition.y
			);
			
		}
		
		this.mouseX=this._engine.helper.toMeter(zerk.game.engine.viewport.getX()
			+this._engine.viewport.fromScaleX(
				position.x-(this._engine.viewport.getWidth()/2))
			);
			
		this.mouseY=this._engine.helper.toMeter(zerk.game.engine.viewport.getY()
			+this._engine.viewport.fromScaleY(
				position.y-(this._engine.viewport.getHeight()/2))
			);
		
		this._lastMousePosition=this._getCursorPosition(event);
		
	},
	
	/**
	 * Mouse scroll event handler
	 * 
	 * @method _onMouseScroll
	 * @param {event} event Native event
	 * @protected
	 */
	_onMouseScroll: function(event) {
		
		event=((event) ? event : window.event);
		var delta=((event.detail) ? event.detail : event.wheelDelta*-1);
		
		if (this._engine.registry.getValue('control.mouse.enableWheelZoom')) {
			
			if (delta<0) {
				
				zerk.game.engine.viewport.zoomIn();
				
			} else {
				
				zerk.game.engine.viewport.zoomOut();
				
			}
			
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
			this._engine.debug.GROUP_CONTROL
		);
		
	}
	
});