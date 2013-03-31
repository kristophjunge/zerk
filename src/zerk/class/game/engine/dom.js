/**
 * DOM interface
 * 
 * @class zerk.game.engine.dom
 * @module zerk
 */
zerk.define({
	
	name: 'zerk.game.engine.dom'
	
},{
	
	/**
	 * Game canvas DOM element
	 * 
	 * @property _canvasGame
	 * @type DOMElement
	 * @protected
	 */
	_canvasGame: null,
	
	/**
	 * Body buffer canvas DOM element
	 * 
	 * @property _canvasBodyBuffer
	 * @type DOMElement
	 * @protected
	 */
	_canvasBodyBuffer: null,
	
	/**
	 * Fixture buffer canvas DOM element
	 * 
	 * @property __canvasFixtureBuffer
	 * @type DOMElement
	 * @protected
	 */
	_canvasFixtureBuffer: null,
	
	/**
	 * Physics debug canvas DOM element
	 * 
	 * @property __canvasPhysicsDebug
	 * @type DOMElement
	 * @protected
	 */
	_canvasPhysicsDebug: null,
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 */
	init: function() {
		
		/*
		 * TODO Make the canvas size configurable
		 */
		this._canvasGame=this._createCanvas('zerk_canvas_main',640,480,true);
		
		this._canvasBodyBuffer=this._createCanvas(
			'zerk_canvas_body_buffer',
			null,
			null,
			false
		);
		
		this._canvasFixtureBuffer=this._createCanvas(
			'zerk_canvas_fixture_buffer',
			null,
			null,
			false
		);
		
	},
	
	/**
	 * Returns the game canvas DOM element
	 * 
	 * @method getCanvasGame
	 * @return {DOMElement} Game canvas DOM element
	 */
	getCanvasGame: function() {
		
		return this._canvasGame;
		
	},
	
	/**
	 * Returns the body buffer canvas DOM element
	 * 
	 * @method getCanvasBodyBuffer
	 * @return {DOMElement} Body buffer canvas DOM element
	 */
	getCanvasBodyBuffer: function() {
		
		return this._canvasBodyBuffer;
		
	},
	
	/**
	 * Returns the fixture buffer canvas DOM element
	 * 
	 * @method getCanvasFixtureBuffer
	 * @return {DOMElement} Fixture buffer canvas DOM element
	 */
	getCanvasFixtureBuffer: function() {
		
		return this._canvasFixtureBuffer;
		
	},
	
	/**
	 * Returns the physics debug canvas DOM element
	 * 
	 * @method getCanvasPhysicsDebug
	 * @return {DOMElement} Physics debug canvas DOM element
	 */
	getCanvasPhysicsDebug: function() {
		
		// Create canvas on first usage
		if (!this._canvasPhysicsDebug) {
			this._canvasPhysicsDebug=this._createCanvas(
				'zerk_canvas_physics_debug',
				650,
				450,
				true
			);
		}
		
		return this._canvasPhysicsDebug;
		
	},
	
	/**
	 * Returns the position of the game canvas DOM element
	 * 
	 * @method getCanvasGamePosition
	 * @return {Object} Offset
	 */
	getCanvasGamePosition: function() {
		
		return this._getElementPosition(this._canvasGame);
		
	},
	
	/**
	 * Returns the DOM document
	 * 
	 * @method getDocument
	 * @return {DOMDocument} DOM document
	 */
	getDocument: function() {
		
		return document;
		
	},
	
	/**
	 * Returns the body DOM element
	 * 
	 * @method getBody
	 * @return {DOMElement}
	 */
	getBody: function() {
		
		return document.getElementsByTagName('body')[0];
		
	},
	
	/**
	 * Registers a callback function to a DOM element event
	 * 
	 * @method registerEvent
	 * @param {DOMElement} element DOM element
	 * @param {String} eventName Event name
	 * @param {Function} callback Callback function
	 */
	registerEvent: function(element,eventName,callback) {
		
		if (typeof(element)=='string') {
			
			element=document.getElementById(element);
			
		}
		
		if (element==null) return;
		
		if (element.addEventListener) {
			
			if (eventName=='mousewheel') {
				
				element.addEventListener('DOMMouseScroll',callback,false);
				
			}
			
			element.addEventListener(eventName,callback,false);
			
		} else if (element.attachEvent) {
			
			element.attachEvent(
				'on'+eventName,
				callback
			);
			
		}
		
	},
	
	/**
	 * Unregisters a callback function from a DOM element event
	 * 
	 * @method unregisterEvent
	 * @param {DOMElement} element DOM element
	 * @param {String} eventName Event name
	 * @param {Function} callback Callback function
	 */
	unregisterEvent: function(element,eventName,callback) {
		
		if (typeof(element)=='string') {
			
			element=document.getElementById(element);
			
		}
		
		if (element==null) return;
		
		if (element.removeEventListener) {
			
			if (eventName=='mousewheel') {
				
				element.removeEventListener('DOMMouseScroll',callback,false);
				
			}
			
			element.removeEventListener(eventName,callback,false);
			
		} else if (element.detachEvent) {
			
			element.detachEvent(
				'on'+eventName,
				callback
			);
			
		}
		
	},
	
	/**
	 * Cancel DOM event
	 * 
	 * @method cancelEvent
	 * @param {DOMEvent} event DOM event
	 * @return {Boolean} Returns false
	 */
	cancelEvent: function(event) {
		
		event=((event) ? event : window.event);
		
		if (event.stopPropagation) event.stopPropagation();
		if (event.preventDefault) event.preventDefault();
		
		event.cancelBubble=true;
		event.cancel=true;
		event.returnValue=false;
		
		return false;
		
	},
	
	/**
	 * Returns the position of given DOM element
	 * 
	 * @method _getElementPosition
	 * @param {DOMElement} element DOM element
	 * @return {Object} Offset
	 * @protected
	 */
	_getElementPosition: function(element) {
		
		var tagname="";
		var left=0;
		var top=0;
		var node=element;
		
		while (typeof(node)==='object' && typeof(node.tagName)!=='undefined') {
			
			left+=node.offsetLeft;
			top+=node.offsetTop;
			tagname=node.tagName.toLowerCase();
			
			if (tagname==='body') {
				
				node=0;
				
			}
			
			if (typeof(node)==='object') {
				
				if (typeof(node.offsetParent)==='object') {
					
					node=node.offsetParent;
					
				}
				
			}
			
		}
		
		return {
			left: left,
			top: top
		};
		
	},
	
	/**
	 * Creates a canvas DOM element
	 * 
	 * @method _createCanvas
	 * @param {String} id DOM id
	 * @param {Integer} width Canvas width
	 * @param {Integer} height Canvas height
	 * @param {Boolean} visible Canvas visibility
	 * @return {DOMElement} Canvas DOM element
	 * @protected
	 */
	_createCanvas: function(id,width,height,visible) {
		
		var canvas=document.createElement('canvas');
		
		canvas.id=id;
		
		if (width) {
			
			canvas.width=width;
			
		}
		if (height) {
			
			canvas.height=height;
			
		}
		
		if (!visible) {
			
			canvas.style.display='none';
			
		}
		
		var body=document.getElementsByTagName('body')[0];
		
		return body.appendChild(canvas);
		
	}
	
});