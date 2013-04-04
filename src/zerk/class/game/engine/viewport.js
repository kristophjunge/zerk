/**
 * Viewport
 * 
 * This class is responsible for rendering the world on a canvas.
 * 
 * @class zerk.game.engine.viewport
 * @module zerk
 */
zerk.define({
	
	name: 'zerk.game.engine.viewport',
	require: [
		'zerk.game.engine.viewport.message'
	]
	
},{
	
	/**
	 * Game canvas
	 * 
	 * @property _canvas
	 * @type DOMElement
	 * @protected
	 */
	_canvas: null,
	
	/**
	 * Context of the main canvas
	 * 
	 * @property _context
	 * @type Object
	 * @protected
	 */
	_context: null,
	
	/**
	 * Buffer to render full bodies
	 * 
	 * @property _bufferBody
	 * @type DOMElement
	 * @protected
	 */
	_bufferBody: null,
	
	/**
	 * Context of the body buffer
	 * 
	 * @property _bufferBodyContext
	 * @type Object
	 * @protected
	 */
	_bufferBodyContext: null,
	
	/**
	 * Buffer for rendering of single fixtures
	 * 
	 * @property _bufferFixture
	 * @type DOMElement
	 * @protected
	 */
	_bufferFixture: null,
	
	/**
	 * Context of the fixture buffer
	 * 
	 * @property _bufferFixtureContext
	 * @type Object
	 * @protected
	 */
	_bufferFixtureContext: null,
	
	/**
	 * Rendering timer
	 * 
	 * @property _timer
	 * @type DOMTimer
	 * @protected
	 */
	_timer: null,
	
	/**
	 * Inidcates if the viewport is running
	 * 
	 * @property _running
	 * @type Boolean
	 * @protected
	 */
	_running: false,
	
	/**
	 * The total number of frames rendered
	 * 
	 * @property _frameCount
	 * @type Integer
	 * @protected
	 */
	_frameCount: 0,
	
	/**
	 * Counter used to calculate FPS
	 * 
	 * @property _fpsCounter
	 * @type Integer
	 * @protected
	 */
	_fpsCounter: 0,
	
	/**
	 * Stores the second of the last FPS measuring
	 * 
	 * @property _fpsSecond
	 * @type Integer
	 * @protected
	 */
	_fpsSecond: 0,
	
	/**
	 * The number of rendered frames per second
	 * 
	 * @property _fps
	 * @type Integer
	 * @protected
	 */
	_fps: 0,
	
	/**
	 * Zoom factor
	 * 
	 * @property _zoom
	 * @type Float
	 * @protected
	 */
	_zoom: 100,
	
	/*
	 * TODO Validate x,y,offsetX,offsetY to be named convenient
	 */
	
	/**
	 * Horizontal view position in pixels
	 * 
	 * @property _x
	 * @type Float
	 * @protected
	 */
	_x: 0,
	
	/**
	 * Vertical view position in pixels
	 * 
	 * @property _y
	 * @type Float
	 * @protected
	 */
	_y: 0,
	
	/**
	 * Horizontal view position in meters
	 * 
	 * @property _offsetX
	 * @type Float
	 * @protected
	 */
	_offsetX: 0,
	
	/**
	 * Vertical view position in meters
	 * 
	 * @property _offsetY
	 * @type Float
	 * @protected
	 */
	_offsetY: 0,
	
	/**
	 * Width of the viewport in pixels
	 * 
	 * @property _width
	 * @type Integer
	 * @protected
	 */
	_width: 0,
	
	/**
	 * Height of the viewport in pixels
	 * 
	 * @property _height
	 * @type Integer
	 * @protected
	 */
	_height: 0,
	
	/**
	 * Text messages
	 * 
	 * @property _messages
	 * @type Array
	 * @protected
	 */
	_messages: null,
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 * @param {zerk.game.engine} engine Game engine
	 */
	init: function(engine) {
		
		this._engine=engine;
		
		this._messages=[];
		
		// Set default config values
		this._config={
			showBodyBuffer: false,
			showFixtureBuffer: false,
			showGrid: false,
			showFPS: false,
			showZoom: false,
			showPosition: false,
			showEntityBoundingBox: false,
			showEntityOriginIndicator: false,
			showFixtureBoundingBox: false,
			showBodyAngleIndicator: false,
			showWorldCenterIndicator: false,
			showViewCenterIndicator: false,
			trackPlayer: true,
			// How many 1m boxes will be drawn on the grid
			gridOuterWidth: 50,
			gridOuterHeight: 50
		};
		
		// Get a handle in the registry
		this._config=this._engine.registry.register('viewport',this._config);
		
		// Setup the game canvas
		
		this._canvas=this._engine.dom.getCanvasGame();
		
		if (!this._canvas.getContext) {
			
			this._log('Cannot create canvas 2d context');
			
		} else {
			
			this._context=this._canvas.getContext('2d');
			
		}
		
		// Setup the buffer for body rendering
		
		this._bufferBody=this._engine.dom.getCanvasBodyBuffer();
		
		if (this._config.showBodyBuffer) {
			
			this._bufferBody.style.display='';
			
		}
		
		if (!this._bufferBody.getContext) {
			
			this._log('Cannot create body buffer 2d context');
			
		} else {
			
			this._bufferBodyContext=this._bufferBody.getContext('2d');
			
		}
		
		// Setup the buffer for fixture rendering
		
		this._bufferFixture=this._engine.dom.getCanvasFixtureBuffer();
		
		if (this._config.showFixtureBuffer) {
			
			this._bufferFixture.style.display='';
			
		}
		
		if (!this._bufferFixture.getContext) {
			
			this._log('Cannot create fixture buffer 2d context');
			
		} else {
			
			this._bufferFixtureContext=this._bufferFixture.getContext('2d');
			
		}
		
		// Auto scale canvas to parent container size
		// this.autoScale();
		
		// Sync viwport with canvas size
		this._width=this._canvas.width;
		this._height=this._canvas.height;
		
		this._log(
			'Scale '
			+this._x+':'+this._y
			+' at '
			+this._width+'x'+this._height
		);
		
		// Setup crossbrowser requestAnimationFrame
		this._setupRequestAnimationFrame();
		
		var me=this;
		
		(function animloop() {
			
			requestAnimationFrame(animloop);
			
			me.render();
			
		})();
		
		this._log('Init');
		
	},
	
	/**
	 * Scale the viewport size to the game canvas size
	 * 
	 * @method autoScale
	 */
	autoScale: function() {
		
		var canvasParent=$('#canvas_game').parent();
		
		this._canvas.width=canvasParent.width();
		this._canvas.height=canvasParent.height();
		
	},
	
	/**
	 * Start the viewport
	 * 
	 * @method start
	 */
	start: function() {
		
		this._log('Started');
		
		this._running=true;
		
	},
	
	/**
	 * Stop the viewport
	 * 
	 * @method stop
	 */
	stop: function() {
		
		this._running=false;
		
		this._log('Stopped ('+this._frameCount+' Frames)');
		
		this.reset();
		
	},
	
	/**
	 * Reset the viewport
	 * 
	 * @method reset
	 */
	reset: function() {
		
		this._frameCount=0;
		
	},
	
	/**
	 * Clear the viewport
	 * 
	 * @method clear
	 */
	clear: function() {
		
		this._canvas.width=this._canvas.width;
		
	},
	
	/**
	 * Renders the current world state onto the game canvas
	 * 
	 * @method render
	 */
	render: function() {
		
		if (!this._running) return;
		
		this.clear();
		
		// Sync view with player entity
		if (this._config.trackPlayer) {
			
			if (this._engine.world!=null
			&& typeof this._engine.world._mapEntity.player!='undefined') {
				
				this._setViewPosition(
					this._engine.world._mapEntity.player.config.x,
					this._engine.world._mapEntity.player.config.y
				);
				
			}
			
		}
		
		if (this._config.showGrid) {
			this._debugDrawGrid();
		}
		
		if (this._config.showWorldCenterIndicator) {
			this._renderWorldCenterIndicator();
		}
		
		// Render all entities in the view area
		var entities=this._getEntitiesInViewport();
		
		for (var i=0;i<entities.length;i++) {
			this._renderEntity(entities[i]);
		}
		
		if (this._config.showViewCenterIndicator) {
			this._renderViewCenterIndicator();
		}
		
		this._renderMessages();
		
		this._renderDebugInfo();
		
		// Increase frame counter
		this._frameCount++;
		
		// Calculate FPS
		var date=new Date();
		var second=date.getSeconds();
		
		if (second!=this._fpsSecond) {
			this._fps=this._fpsCounter;
			this._fpsCounter=0;
		}
		
		this._fpsSecond=second;
		
		this._fpsCounter++;
		
	},
	
	/**
	 * Registers a message
	 * 
	 * @method registerMessage
	 * @param {zerk.game.engine.viewport.message} message
	 */
	registerMessage: function(message) {
		
		this._messages.push(message);
		
	},
	
	/**
	 * Unregisters a message
	 * 
	 * @method unregisterMessage
	 * @param {String} id Message id
	 */
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
	 */
	clearMessages: function() {
		
		this._messages=[];
		
	},
	
	/**
	 * Returns the horizontal view position in pixels
	 * 
	 * @method getX
	 * @return Float
	 */
	getX: function() {
		
		return this._x;
		
	},

	/**
	 * Returns the vertical view position in pixels
	 * 
	 * @method getY
	 * @return Float
	 */
	getY: function() {
		
		return this._y;
		
	},
	
	/**
	 * Sets the horizontal view position in pixels
	 * 
	 * @method setX
	 * @return Float
	 */
	setX: function(value) {
		
		this._x=value;
		
	},

	/**
	 * Sets the vertical view position in pixels
	 * 
	 * @method setY
	 * @return Float
	 */
	setY: function(value) {
		
		this._y=value;
		
	},
	
	/**
	 * Returns the horizontal view position in meters
	 * 
	 * @method getOffsetX
	 * @return Float
	 */
	getOffsetX: function() {
		
		return this._offsetX;
		
	},

	/**
	 * Returns the vertical view position in meters
	 * 
	 * @method getOffsetY
	 * @return Float
	 */
	getOffsetY: function() {
		
		return this._offsetY;
		
	},
	
	/**
	 * Returns the width of the viewport in pixels
	 * 
	 * @method getWidth
	 * @return Integer
	 */
	getWidth: function() {
		
		return this._width;
		
	},
	
	/**
	 * Returns the height of the viewport in pixels
	 * 
	 * @method getHeight
	 * @return Integer
	 */
	getHeight: function() {
		
		return this._height;
		
	},
	
	/**
	 * Scales given value by current zoom factor
	 * 
	 * @method toScaleX
	 * @param {Float} value Value
	 * @return {Float} Scaled value
	 */
	toScaleX: function(value) {
		
		return (value/100)*this._zoom;
		
	},
	
	/**
	 * Scales given value by current zoom factor
	 * 
	 * @method toScaleY
	 * @param {Float} value Value
	 * @return {Float} Scaled value
	 */
	toScaleY: function(value) {
		
		return (value/100)*this._zoom;
		
	},

	/**
	 * Un-scales given value by current zoom factor
	 * 
	 * @method fromScaleX
	 * @param {Float} value Value
	 * @return {Float} Scaled value
	 */
	fromScaleX: function(value) {
		
		return (value/this._zoom)*100;
		
	},

	/**
	 * Un-scales given value by current zoom factor
	 * 
	 * @method fromScaleY
	 * @param {Float} value Value
	 * @return {Float} Scaled value
	 */
	fromScaleY: function(value) {
		
		return (value/this._zoom)*100;
		
	},
	
	/**
	 * Increases current zoom factor by factor 10
	 * 
	 * @method zoomIn
	 */
	zoomIn: function() {
		
		this._zoom+=10;
		
	},

	/**
	 * Decreases current zoom factor by factor 10
	 * 
	 * @method zoomOut
	 */
	zoomOut: function() {
		
		this._zoom-=10;
		
	},
	
	/**
	 * Returns a list of all entities currently visible in the viewport
	 * 
	 * @method _getEntitiesInViewport
	 * @return {Array} Entity list
	 * @protected
	 */
	_getEntitiesInViewport: function() {
		
		var x1=this._engine.helper.toMeter(
			this._x+this.fromScaleX(0-(this._width/2))
		);
		
		var y1=this._engine.helper.toMeter(
			this._y+this.fromScaleY(0-(this._height/2))
		);
		
		var x2=this._engine.helper.toMeter(
			this._x+this.fromScaleX(this._width-(this._width/2))
		);
		
		var y2=this._engine.helper.toMeter(
			this._y+this.fromScaleY(this._height-(this._height/2))
		);
		
		return this._engine.physics.getEntitiesInArea(x1,y1,x2,y2);
		
	},
	
	/**
	 * Crossbrowser requestAnimationFrame
	 * 
	 * <a href="http://paulirish.com/2011/requestanimationframe-for-smart-animating/">
	 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/</a>
	 * 
	 * <a href="http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating">
	 * http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating</a>
	 * 
	 * requestAnimationFrame polyfill by Erik Möller
	 * 
	 * fixes from Paul Irish and Tino Zijdel
	 * 
	 * @method _setupRequestAnimationFrame
	 * @protected
	 */
	_setupRequestAnimationFrame: function() {
		
		var lastTime=0;
		
		var vendors=[
			'ms',
			'moz',
			'webkit',
			'o'
		];
		
		for (var x=0; x<vendors.length && !window.requestAnimationFrame; ++x) {
			
			window.requestAnimationFrame
				=window[vendors[x]+'RequestAnimationFrame'];
			window.cancelAnimationFrame
				=window[vendors[x]+'CancelAnimationFrame']
				|| window[vendors[x]+'CancelRequestAnimationFrame'];
			
		}
		
		if (!window.requestAnimationFrame) {
			
			window.requestAnimationFrame=function(callback,element) {
				
				var currTime=new Date().getTime();
				var timeToCall=Math.max(0,16-(currTime-lastTime));
				var id=window.setTimeout(
					function() {
						
						callback(currTime+timeToCall); 
						
					},
					timeToCall
				);
				lastTime=currTime+timeToCall;
				return id;
				
			};
			
		}
	 
		if (!window.cancelAnimationFrame) {
			
			window.cancelAnimationFrame=function(id) {
				
				clearTimeout(id);
				
			};
			
		}
		
	},
	
	/**
	 * Removes messages that timed out
	 * 
	 * @method _clearMessages
	 * @protected
	 */
	_clearMessages: function() {
		
		do {
			
			for (var i=0;i<this._messages.length;i++) {
				
				if (this._messages[i].starttime==null) {
					
					this._messages[i].starttime=this._engine.getTime();
					
				} else if (this._messages[i].lifetime>0
				&& (this._engine.getTime()>=this._messages[i].starttime
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
	 */
	_renderMessages: function() {
		
		this._clearMessages();
		
		for (var i=0;i<this._messages.length;i++) {
			
			this._renderText(
				this._messages[i].text,
				this._messages[i].x,
				this._messages[i].y,
				this._messages[i].font,
				this._messages[i].size,
				this._messages[i].color
			);
			
		}
		
	},
	
	/**
	 * Render text onto the game canvas
	 * 
	 * @method _renderText
	 * @param {String} text
	 * @param {Integer} x
	 * @param {Integer} y
	 * @param {String} font
	 * @param {Integer} size
	 * @param {String} color
	 * @protected
	 */
	_renderText: function(text,x,y,font,size,color) {
		
		if (typeof font=='undefined') {
			
			font='sans-serif';
			
		}
		
		if (typeof size=='undefined') {
			
			size=20;
			
		}
		
		if (typeof color=='undefined') {
			
			color='rgb(0,255,0)';
			
		}
		
		this._context.font=size+'pt '+font;
		this._context.fillStyle=color;
		
		var measure=this._context.measureText(text);
		
		this._context.fillText(
			text,
			(this._width/2)-(measure.width/2)+x,
			(this._height/2)+(size/2)+y
		);
		
	},
	
	/**
	 * Renders debug information onto the game canvas
	 * 
	 * @method _renderDebugInfo
	 * @protected
	 */
	_renderDebugInfo: function() {
		
		this._context.font="10pt sans-serif";
		this._context.fillStyle="rgb(0,255,0)";
		
		if (this._config.showFPS) {
			
			this._renderDebugInfoLine(this._fps+' FPS',1);
			
		}
		
		if (this._config.showZoom) {
			
			this._renderDebugInfoLine(
				this._engine.helper.formatPercent(this._zoom),
				2
			);
			
		}
		
		var offsetX=this._engine.helper.round(
			this._engine.helper.toMeter(this._x),
			1
		);
		var offsetY=this._engine.helper.round(
			this._engine.helper.toMeter(this._y),
			1
		);
		
		if (this._config.showPosition) {
			
			this._renderDebugInfoLine(offsetX+':'+offsetY,3);
			
		}
		
	},
	
	/**
	 * @method _getCanvasX
	 * @param {Float} meter
	 * @param {Integer} pixel
	 * @return {Integer}
	 * @protected
	 */
	/*
	 * TODO Document mehtod '_getCanvasX'
	 */
	_getCanvasX: function(meter,pixel) {
		
		if (typeof meter==='undefined') {
			
			meter=0;
			
		}
		
		if (typeof pixel==='undefined') {
			
			pixel=0;
			
		}
		
		var value=this.toScaleX(
			this._engine.helper.fromMeter(meter)+pixel-this._x
		);
		
		return ~~(0.5+value+(this._width/2));
		
	},
	
	/**
	 * @method _getCanvasY
	 * @param {Float} meter
	 * @param {Integer} pixel
	 * @return {Integer}
	 * @protected
	 */
	/*
	 * TODO Document mehtod '_getCanvasY'
	 */
	_getCanvasY: function(meter,pixel) {
		
		if (typeof meter==='undefined') {
			
			meter=0;
			
		}
		
		if (typeof pixel==='undefined') {
			
			pixel=0;
			
		}
		
		var value=this.toScaleX(
			this._engine.helper.fromMeter(meter)+pixel-this._y
		);
		
		return ~~(0.5+value+(this._height/2));
		
	},
	
	/**
	 * Set the view position to a given world position
	 * 
	 * @method _setViewPosition
	 * @param {Float} x
	 * @param {Float} y
	 * @protected
	 */
	_setViewPosition: function(x,y) {
		
		this._x=this._engine.helper.fromMeter(x);
		this._y=this._engine.helper.fromMeter(y);
		
	},
	
	/**
	 * Renders a line of debug information onto the game canvas
	 * 
	 * @method _renderDebugInfoLine
	 * @param {String} text Text to be rendered
	 * @param {Integer} line Row number
	 * @protected
	 */
	_renderDebugInfoLine: function(text,line) {
		
		var measure=this._context.measureText(text);
		this._context.fillText(text,this._width-measure.width-2,12*line);
		
	},
	
	/**
	 * Renders an entity onto the game canvas
	 * 
	 * @method _renderEntity 
	 * @param {zerk.game.engine.entity} entity Entity
	 * @protected
	 */
	_renderEntity: function(entity) {
		
		// Render all bodies of the entity
		
		for (var index in entity.bodies) {
			this._renderBody(entity,entity.bodies[index]);
		}
		
	},
	
	/**
	 * Renders a body onto the game canvas
	 * 
	 * @method _renderBody
	 * @param {zerk.game.engine.entity} entity Entity
	 * @param {zerk.game.engine.physics.body} body Body
	 * @protected
	 */
	_renderBody: function(entity,body) {
		
		var position=entity.config.bodies[body.key];
		
		var diagonal=
			Math.ceil(
				Math.sqrt(
					(this._engine.helper.fromMeter(body.width)
					*this._engine.helper.fromMeter(body.width))
					+(this._engine.helper.fromMeter(body.height)
					*this._engine.helper.fromMeter(body.height)
				)
			)
		);
		
		this._bufferBody.width=diagonal;
		this._bufferBody.height=diagonal;
		
		var x=this._bufferBody.width/2;
		var y=this._bufferBody.height/2;
		
		this._bufferBodyContext.translate(x,y);
		
		this._bufferBodyContext.rotate(position.angle);
		
		// Render all the fixtures of the body
		for (var i=0;i<body.fixtures.length;i++) {
			
			this._renderFixture(entity,body,body.fixtures[i]);
			
		}
		
		if (this._config.showEntityBoundingBox) {
			
			this._renderEntityBoundingBody(entity,body);
			
		}
		if (this._config.showBodyAngleIndicator) {
			
			this._renderBodyAngleIndicator(entity,body);
			
		}
		
		// Draw the buffer onto the display
		
		this._context.drawImage(
			this._bufferBody,
			0,
			0,
			diagonal,
			diagonal,
			this._getCanvasX(position.x,-(diagonal/2)),
			this._getCanvasY(position.y,-(diagonal/2)),
			this.toScaleX(diagonal),
			this.toScaleY(diagonal)
		);
		
		if (this._config.showEntityOriginIndicator) {
			
			this._renderEntityOriginIndicator(entity);
			
		}
		
	},
	
	/**
	 * Renders a fixture onto the body buffer canvas
	 * 
	 * @method _renderFixture
	 * @param {zerk.engine.entity.entity} entity Entity
	 * @param {zerk.engine.physics.body.body} body Body
	 * @param {zerk.engine.physics.fixture.fixture} fixture Fixture
	 * @protected
	 */
	_renderFixture: function(entity,body,fixture) {
		
		var diagonal=0;
		
		// Calculate buffer size
		
		if (fixture.shape=='circle') {
			
			diagonal=this._engine.helper.fromMeter(fixture.radius);
			
		} else {
			
			diagonal=Math.ceil(
				Math.sqrt(
					(this._engine.helper.fromMeter(fixture.width)
					*this._engine.helper.fromMeter(fixture.width))
					+(this._engine.helper.fromMeter(fixture.height)
					*this._engine.helper.fromMeter(fixture.height))
				)
			);
			
		}
		
		// Set buffer size
		this._bufferFixture.width=diagonal;
		this._bufferFixture.height=diagonal;
		
		// Translate the buffers coordinate systems origin to center
		this._bufferFixtureContext.translate(
			this._bufferFixture.width/2,
			this._bufferFixture.height/2
		);
		
		// Rotate the whole buffer before drawing
		this._bufferFixtureContext.rotate(fixture.angle);
		
		// Render all sprites of the fixture
		for (var i=0;i<fixture.sprites.length;i++) {
			
			this._renderSprite(entity,body,fixture,fixture.sprites[i]);
			
		}
		
		if (this._config.showFixtureBoundingBox) {
			
			this._renderFixtureBoundingShape(entity,body,fixture);
			
		}
		
		this._bufferBodyContext.drawImage(
			this._bufferFixture,
			0,
			0,
			diagonal,
			diagonal,
			this._engine.helper.fromMeter(fixture.x)-(diagonal/2),
			this._engine.helper.fromMeter(fixture.y)-(diagonal/2),
			diagonal,
			diagonal
		);
		
	},
	
	/**
	 * Renders a shape indicating the bounding area of a fixture
	 * 
	 * Delegate method for the fixture bounding shape methods
	 * 
	 * @method _renderFixtureBoundingShape
	 * @param {zerk.game.engine.entity} entity Entity
	 * @param {zerk.game.engine.physics.body} body Body
	 * @param {zerk.game.engine.physics.fixture} fixture Fixture
	 * @protected
	 */
	_renderFixtureBoundingShape: function(entity,body,fixture) {
		
		switch (fixture.shape) {
			case 'box':
				this._renderFixtureBoundingBox(entity,body,fixture);
				break;
			case 'circle':
				this._renderFixtureBoundingCircle(entity,body,fixture);
				break;
			case 'polygon':
				this._renderFixtureBoundingPolygon(entity,body,fixture);
				break;
		}
		
	},
	
	/**
	 * Renders the bounding area for a box shaped fixture
	 * 
	 * @method _renderFixtureBoundingShape
	 * @param {zerk.game.engine.entity} entity Entity
	 * @param {zerk.game.engine.physics.body} body Body
	 * @param {zerk.game.engine.physics.fixture} fixture Fixture
	 * @protected
	 */
	_renderFixtureBoundingBox: function(entity,body,fixture) {
		
		this._bufferFixtureContext.beginPath();
		
		if (fixture.isSensor) {
			
			this._bufferFixtureContext.strokeStyle="rgb(255,0,0)";
			
		} else {
			
			this._bufferFixtureContext.strokeStyle="rgb(0,255,0)";
			
		}
		
		this._bufferFixtureContext.strokeRect(
			this._engine.helper.fromMeter(-(fixture.width/2)),
			this._engine.helper.fromMeter(-(fixture.height/2)),
			this._engine.helper.fromMeter(fixture.width),
			this._engine.helper.fromMeter(fixture.height)
		);
		
	},
	
	/**
	 * Renders the bounding area for a circle shaped fixture
	 * 
	 * @method _renderFixtureBoundingCircle
	 * @param {zerk.game.engine.entity} entity Entity
	 * @param {zerk.game.engine.physics.body} body Body
	 * @param {zerk.game.engine.physics.fixture} fixture Fixture
	 * @protected
	 */
	_renderFixtureBoundingCircle: function(entity,body,fixture) {
		
		this._bufferBodyContext.beginPath();
		this._bufferBodyContext.strokeStyle="rgb(0,255,0)";
		this._bufferBodyContext.arc(
			0,
			0,
			this._engine.helper.fromMeter(fixture.radius),
			0,
			Math.PI*2,
			true
		);
		this._bufferBodyContext.closePath();
		this._bufferBodyContext.stroke();
		
	},
	
	/**
	 * Renders the bounding area for a polygon shaped fixture
	 * 
	 * @method _renderFixtureBoundingPolygon
	 * @param {zerk.game.engine.entity} entity Entity
	 * @param {zerk.game.engine.physics.body} body Body
	 * @param {zerk.game.engine.physics.fixture} fixture Fixture
	 * @protected
	 */
	_renderFixtureBoundingPolygon: function(entity,body,fixture) {
		
		this._bufferBodyContext.beginPath();
		this._bufferBodyContext.strokeStyle="rgb(0,255,0)";
		
		for (var i=0;i<fixture.vertices.length;i++) {
			
			if (i==0) {
				
				this._bufferBodyContext.moveTo(
					this._engine.helper.fromMeter(fixture.vertices[i][0]),
					this._engine.helper.fromMeter(fixture.vertices[i][1])
				);
				
			} else {
				
				this._bufferBodyContext.lineTo(
					this._engine.helper.fromMeter(fixture.vertices[i][0]),
					this._engine.helper.fromMeter(fixture.vertices[i][1])
				);
				
			}
			
		}
		
		this._bufferBodyContext.closePath();
		this._bufferBodyContext.stroke();
		
	},
	
	/**
	 * Renders a bounding box for a body
	 * 
	 * @method _renderEntityBoundingBody
	 * @param {zerk.game.engine.entity} entity Entity
	 * @param {zerk.game.engine.physics.body} body Body
	 * @protected
	 */
	_renderEntityBoundingBody: function(entity,body) {
		
		this._bufferBodyContext.beginPath();
		this._bufferBodyContext.strokeStyle="rgb(160,32,240)";
		this._bufferBodyContext.strokeRect(
			-(this._engine.helper.fromMeter(body.width)/2),
			-(this._engine.helper.fromMeter(body.height)/2),
			this._engine.helper.fromMeter(body.width),
			this._engine.helper.fromMeter(body.height)
		);
		
	},
	
	/**
	 * Render sprite
	 * 
	 * @method _renderSprite
	 * @param {zerk.game.engine.entity} entity
	 * @param {zerk.game.engine.physics.body} body
	 * @param {zerk.game.engine.physics.fixture} fixture
	 * @param {zerk.game.engine.viewport.sprite} sprite
	 * @protected
	 */
	_renderSprite: function(
		entity,
		body,
		fixture,
		sprite
	) {
		
		/*
		 * TODO Reactivate sprite rendering
		 */
		
	},
	
	/**
	 * Renders an angle indicator for each body of the entity
	 * 
	 * @method _renderBodyAngleIndicator
	 * @param {zerk.game.engine.entity} entity Entity
	 * @param {zerk.game.engine.physics.body} body Body
	 * @protected
	 */
	_renderBodyAngleIndicator: function(entity,body,fixture) {
		
		var x=0,y=0;
		
		this._bufferBodyContext.beginPath();
		this._bufferBodyContext.strokeStyle="rgb(255,0,0)";
		
		if (body.shape!='polygon') {
			
			x=this._engine.helper.fromMeter(-body.width/2);
			y=this._engine.helper.fromMeter(-body.height/2);
			
		}
		
		this._bufferBodyContext.moveTo(x+0,y+10);
		this._bufferBodyContext.lineTo(x+10,y+10);
		this._bufferBodyContext.moveTo(x+10,y+0);
		this._bufferBodyContext.lineTo(x+10,y+10);
		this._bufferBodyContext.stroke();
		
		/*
		 * TODO Create drawEntityName config value
		 */
		// Draw entity name
		/*
		 * this._bufferBodyContext.fillStyle="rgb(0,255,0)";
		 * this._bufferBodyContext.fillText(entity.name,x+15,y+8);
		 */
		
	},
	
	/**
	 * Renders the entity origin indicator
	 * 
	 * @method _renderEntityOriginIndicator
	 * @param {zerk.game.engine.entity} entity Entity
	 * @protected
	 */
	_renderEntityOriginIndicator: function(entity) {
		
		this._context.beginPath();
		this._context.strokeStyle="rgb(255,0,0)";
		
		this._context.moveTo(
			this._getCanvasX(entity.config.x-0.2),
			this._getCanvasY(entity.config.y)
		);
		this._context.lineTo(
			this._getCanvasX(entity.config.x+0.2),
			this._getCanvasY(entity.config.y)
		);
		this._context.moveTo(
			this._getCanvasX(entity.config.x),
			this._getCanvasY(entity.config.y-0.2)
		);
		this._context.lineTo(
			this._getCanvasX(entity.config.x),
			this._getCanvasY(entity.config.y+0.2)
		);
		
		this._context.stroke();
		
	},
	
	/**
	 * Renders the world center indicator
	 * 
	 * @method _renderWorldCenterIndicator
	 * @protected
	 */
	_renderWorldCenterIndicator: function() {
		
		this._context.beginPath();
		this._context.strokeStyle="rgb(0,0,255)";
		
		this._context.moveTo(this._getCanvasX(-0.5),this._getCanvasY());
		this._context.lineTo(this._getCanvasX(0.5),this._getCanvasY());
		this._context.moveTo(this._getCanvasX(),this._getCanvasY(-0.5));
		this._context.lineTo(this._getCanvasX(),this._getCanvasY(0.5));
		
		this._context.stroke();
		
	},
	
	/**
	 * Renders the view center indicator
	 * 
	 * @method _renderViewCenterIndicator
	 * @protected
	 */
	_renderViewCenterIndicator: function() {
		
		this._context.beginPath();
		this._context.strokeStyle="rgb(0,200,200)";
		
		this._context.moveTo((this._width/2)-10,(this._height/2));
		this._context.lineTo((this._width/2)+10,(this._height/2));
		this._context.moveTo((this._width/2),(this._height/2)-10);
		this._context.lineTo((this._width/2),(this._height/2)+10);
		
		this._context.stroke();
		
	},
	
	/**
	 * Renders the grid
	 * 
	 * @method _debugDrawGrid
	 * @protected
	 */
	/*
	 * TODO Rename method '_debugDrawGrid' more convenient
	 */
	_debugDrawGrid: function() {
		
		var coord=0;
		var width=this._config.gridOuterWidth;
		var height=this._config.gridOuterHeight;
		var offsetX=-(this._config.gridOuterWidth/2);
		var offsetY=-(this._config.gridOuterHeight/2);
		
		// Draw grid
		this._context.beginPath();
		this._context.strokeStyle="#111111";
		this._context.lineWidth=1;
		
		for (var i=1;i<=this._config.gridOuterWidth;i++) {
			
			coord=i*1;
			this._context.moveTo(
				this._getCanvasX(offsetX+coord),
				this._getCanvasY(offsetY)
			);
			this._context.lineTo(
				this._getCanvasX(offsetX+coord),
				this._getCanvasY(offsetY+height)
			);
			this._context.stroke();
			
		}
		
		for (var i=1;i<=this._config.gridOuterHeight;i++) {
			
			coord=i*1;
			this._context.moveTo(
				this._getCanvasX(offsetX),
				this._getCanvasY(offsetY+coord)
			);
			this._context.lineTo(
				this._getCanvasX(offsetX+width),
				this._getCanvasY(offsetY+coord)
			);
			this._context.stroke();
			
		}
		
		// Draw axis
		
		this._context.beginPath();
		this._context.strokeStyle="#111111";
		this._context
			.moveTo(this._getCanvasX(offsetX),this._getCanvasY(offsetY));
		this._context.lineTo(
			this._getCanvasX(offsetX+width),
			this._getCanvasY(offsetY)
		);
		this._context
			.moveTo(this._getCanvasX(offsetX),this._getCanvasY(offsetY));
		this._context.lineTo(
			this._getCanvasX(offsetX),
			this._getCanvasY(offsetY+height)
		);
		this._context.stroke();
		
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
			msg,this._engine.debug.GROUP_VIEWPORT
		);
		
	}
	
});