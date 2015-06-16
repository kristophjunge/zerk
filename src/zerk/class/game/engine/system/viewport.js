/**
 * Viewport System
 * 
 * Provides the interface for visualization.
 * 
 * @class viewport
 * @namespace zerk.game.engine.system
 * @extends zerk.game.engine.system
 * @module zerk
 **/
zerk.define({
	
	name: 'zerk.game.engine.system.viewport',
	extend: 'zerk.game.engine.system'
	
},{
	
	/**
	 * Name of the system
	 * 
	 * @property _name
	 * @type String
	 * @protected
	 **/
	_name: 'viewport',
	
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
	_priority: 100,
	
	/**
	 * Rendering timer
	 * 
	 * @property _timer
	 * @type DOMTimer
	 * @protected
	 **/
	/*
	 * TODO Can "_timer" be removed or is it used in requestAnimationFrame 
	 * 	fallback?
	 */
	_timer: null,
	
	/**
	 * The total number of frames rendered
	 * 
	 * @property _frameCount
	 * @type Integer
	 * @protected
	 **/
	_frameCount: 0,
	
	/**
	 * Counter used to calculate FPS
	 * 
	 * @property _fpsCounter
	 * @type Integer
	 * @protected
	 **/
	_fpsCounter: 0,
	
	/**
	 * Stores the second of the last FPS measuring
	 * 
	 * @property _fpsSecond
	 * @type Integer
	 * @protected
	 **/
	_fpsSecond: 0,
	
	/**
	 * The number of rendered frames per second
	 * 
	 * @property _fps
	 * @type Integer
	 * @protected
	 **/
	_fps: 0,
	
	/**
	 * Zoom factor
	 * 
	 * @property _zoom
	 * @type Float
	 * @protected
	 **/
	_zoom: 100,

    /**
     * World scale factor
     *
     * @property _worldScale
     * @type Float
     * @protected
     **/
    _worldScale: 120,

	/*
	 * TODO Validate x,y,offsetX,offsetY to be named convenient
	 */
	
	/**
	 * Horizontal view position in pixels
	 * 
	 * @property _x
	 * @type Float
	 * @protected
	 **/
	_x: 0,
	
	/**
	 * Vertical view position in pixels
	 * 
	 * @property _y
	 * @type Float
	 * @protected
	 **/
	_y: 0,
	
	/**
	 * Horizontal view position in meters
	 * 
	 * @property _offsetX
	 * @type Float
	 * @protected
	 * @deprecated
	 **/
	_offsetX: 0,
	
	/**
	 * Vertical view position in meters
	 * 
	 * @property _offsetY
	 * @type Float
	 * @protected
	 * @deprecated
	 **/
	_offsetY: 0,
	
	/**
	 * Width of the viewport in pixels
	 * 
	 * @property _width
	 * @type Integer
	 * @protected
	 **/
	_width: 0,
	
	/**
	 * Height of the viewport in pixels
	 * 
	 * @property _height
	 * @type Integer
	 * @protected
	 **/
	_height: 0,


    _autoSize: 0,
    _maxWidth: 0,
    _maxHeight: 0,
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 * @param {zerk.game.engine} engine Game engine
	 * @param {Object} config System configuration
	 **/
	init: function(engine,config) {

        var me=this;

		zerk.parent('zerk.game.engine.system.viewport').init.apply(
            me,
			arguments
		);

        me._worldScale=me._config.worldScale;
        me._zoom=me._config.zoomDefault;

        me._maxWidth=me._config.maxWidth;
        me._maxHeight=me._config.maxHeight;
        me._autoSize=me._config.autoSize;

        me.createBuffers({
			display: {
                width: me._config.width,
                height: me._config.height,
				visible: true
			},
            entity: {
                width: 1,
                height: 1,
                visible: me._config.showEntityBuffer
            },
			body: {
				width: 1,
				height: 1,
				visible: me._config.showBodyBuffer
			},
			fixture: {
				width: 1,
				height: 1,
				visible: me._config.showFixtureBuffer
			}
		});

        if (me._autoSize) {
            me.autoSizeViewport();
            zerk.browser.registerEvent(window,'resize',function(e) {
                me.autoSizeViewport(e);
            });
        } else {
            me.setViewportSize(me._config.width,me._config.height);
        }

        me._log('Ready');
		
	},

    autoSizeViewport: function(e) {

        var me=this;
        var windowSize=zerk.browser.getViewportSize();

        me.setViewportSize(windowSize.width,windowSize.height);

    },

    setViewportSize: function(width,height) {

        //var viewportSize=me.getBufferSize('display');
        var me=this;

        if (me._maxWidth>0 && width>me._maxWidth) {
            width=me._maxWidth;
        }

        if (me._maxHeight>0 && height>me._maxHeight) {
            height=me._maxHeight;
        }

        me._width=width;
        me._height=height;

        me.setBufferSize('display',width,height);

        me._log(
            'Scale '
            +me._x+':'+me._y
            +' at '
            +me._width+'x'+me._height
        );

    },

	/**
	 * Returns the configuration defaults of the system
	 * 
	 * @method _getConfigDefaults
	 * @return {Object} Default configuration
	 * @protected
	 **/
	_getConfigDefaults: function() {
		
		return {
            autoSize: false,
            width: 1280,
            height: 720,
            maxWidth: 0,
            maxHeight: 0,
            zoomDefault: 50,
            zoomMin: 1,
            zoomMax: 100,
            showEntityBuffer: false,
			showBodyBuffer: false,
			showFixtureBuffer: false,
			showGrid: false,
			showWorldCenterIndicator: false,
			trackPlayer: false,
			// How many 1m boxes will be drawn on the grid
			gridOuterWidth: 50,
			gridOuterHeight: 50,
			canvasContainerId: 'zerk-canvas',
            backgroundColor: 'rgb(0,0,0)',
            // How much pixels should be used to draw 1 meter at 100% zoom
            worldScale: 120
		};
		
	},
	
	/**
	 * Returns true when the system is interested in given component
	 * 
	 * @method useComponent
	 * @param {String} name Component name
	 * @return {Boolean} True when the system is intereseted in given component
	 **/
	useComponent: function(name) {
		
		// The viewport is not interested in entities itself
		return false;
		
	},
	
	/**
	 * Starts the system
	 * 
	 * @method start
	 **/
	start: function() {
		
		zerk.parent('zerk.game.engine.system.viewport').start.apply(
			this,
			arguments
		);
		
		this._log('Started');
		
	},
	
	/**
	 * Stops the system
	 * 
	 * @method stop
	 **/
	stop: function() {
		
		zerk.parent('zerk.game.engine.system.viewport').stop.apply(
			this,
			arguments
		);
		
		this._log('Stopped ('+this._frameCount+' Frames)');
		
		this.reset();
		
	},
	
	/**
	 * Updates the system
	 * 
	 * @method update
	 **/
	update: function() {
		
		zerk.parent('zerk.game.engine.system.viewport').update.apply(
			this,
			arguments
		);
		
		this.bufferClear('display');


        /*
        var bg=document.getElementById('bg');


        this.drawImage(
            'display',
            bg,
            300,
            300,
            1920,
            1080,
            0,
            0,
            1920,
            1080,
            0
        );
        */




		// Sync view with player entity
		if (this._config.trackPlayer) {
			
			var players=this._engine.getEntitiesByTags('player');
			
			if (players.length>0) {
				
				this._setViewPosition(
					players[0].components.position.x,
					players[0].components.position.y
				);
				
			}
			
		}
		
		if (this._config.showGrid) {
			this._debugDrawGrid();
		}
		
		if (this._config.showWorldCenterIndicator) {
			this._renderWorldCenterIndicator();
		}
		
		
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
	 * Reset the viewport
	 * 
	 * @method reset
	 **/
	reset: function() {
		
		this._frameCount=0;
		
	},
	
	/**
	 * Returns the horizontal view position in pixels
	 * 
	 * @method getX
	 * @return Float
	 **/
	getX: function() {
		
		return this._x;
		
	},

	/**
	 * Returns the vertical view position in pixels
	 * 
	 * @method getY
	 * @return Float
	 **/
	getY: function() {
		
		return this._y;
		
	},
	
	/**
	 * Sets the horizontal view position in pixels
	 * 
	 * @method setX
	 * @return Float
	 **/
	setX: function(value) {
		
		this._x=value;
		
	},

	/**
	 * Sets the vertical view position in pixels
	 * 
	 * @method setY
	 * @return Float
	 **/
	setY: function(value) {
		
		this._y=value;
		
	},
	
	/**
	 * Returns the horizontal view position in meters
	 * 
	 * @method getOffsetX
	 * @return Float
	 * @deprecated
	 **/
	getOffsetX: function() {
		
		return this._offsetX;
		
	},

	/**
	 * Returns the vertical view position in meters
	 * 
	 * @method getOffsetY
	 * @return Float
	 * @deprecated
	 **/
	getOffsetY: function() {
		
		return this._offsetY;
		
	},
	
	/**
	 * Returns the width of the viewport in pixels
	 * 
	 * @method getWidth
	 * @return Integer
	 **/
	getWidth: function() {
		
		return this._width;
		
	},
	
	/**
	 * Returns the height of the viewport in pixels
	 * 
	 * @method getHeight
	 * @return Integer
	 **/
	getHeight: function() {
		
		return this._height;
		
	},

    /**
     * Scales given value by current zoom factor
     *
     * @method toZoom
     * @param {Float} value Value
     * @return {Float} Scaled value
     **/
    toZoom: function(value) {

        return (value/100)*this._zoom;

    },

    /**
     * Un-scales given value by current zoom factor
     *
     * @method fromZoom
     * @param {Float} value Value
     * @return {Float} Scaled value
     **/
    fromZoom: function(value) {

        return (value/this._zoom)*100;

    },

    /**
     * Converts pixels into world meters
     *
     * @method fromPixel
     * @param {Float} value Value in pixels
     * @return {Float} Value in meters
     **/
    fromPixel: function(value) {

        var me=this;

        if (typeof value==='undefined' || value==0) return 0;
        return value/me._worldScale;

    },

    /**
     * Converts world meters into pixels
     *
     * @method toPixel
     * @param {Float} value Value in meters
     * @return {Float} Value in pixels
     **/
    toPixel: function(value) {

        var me=this;

        if (typeof value==='undefined' || value==0) return 0;
        return value*me._worldScale;

    },

	/**
	 * Increases current zoom factor by factor 10
	 * 
	 * @method zoomIn
	 **/
	zoomIn: function() {

        //var value=this._zoom+10;
		var value=this._zoom+(10*(this._zoom/100));

        value=Math.ceil(value);

        if (value>=this._config.zoomMax) {
            this._zoom=this._config.zoomMax;
        } else {
            this._zoom=value;
        }

	},

	/**
	 * Decreases current zoom factor by factor 10
	 * 
	 * @method zoomOut
	 **/
	zoomOut: function() {

        //var value=this._zoom-10;
        var value=this._zoom-(10*(this._zoom/100));

        value=Math.ceil(value);

        if (value<=this._config.zoomMin) {
            this._zoom=this._config.zoomMin;
        } else {
            this._zoom=value;
        }
		
	},
	
	/**
	 * Returns the current count of frames drawn per second
	 * 
	 * @method getFPS
	 * @return {Integer} FPS
	 **/
	getFPS: function() {
		
		return this._fps;
		
	},
	
	/**
	 * Return the current zoom factor
	 * 
	 * @method getZoom
	 * @return {Float} Zoom factor
	 **/
	getZoom: function() {
		
		return this._zoom;
		
	},
	
	/**
	 * Returns a list of all entities currently visible in the viewport
	 * 
	 * @method _getEntitiesInViewport
	 * @return {Array} Entity list
	 * @protected
	 **/
	getEntitiesInViewport: function() {

        var me=this;

		var x1=me.fromPixel(
			this._x+this.fromZoom(0-(this._width/2))
		);
		
		var y1=me.fromPixel(
			this._y+this.fromZoom(0-(this._height/2))
		);
		
		var x2=me.fromPixel(
			this._x+this.fromZoom(this._width-(this._width/2))
		);
		
		var y2=me.fromPixel(
			this._y+this.fromZoom(this._height-(this._height/2))
		);
		
		return this._getSystem('physics').getEntitiesInArea(x1,y1,x2,y2);
		
	},
	
	/**
	 * @method _getCanvasX
	 * @param {Float} meter
	 * @param {Integer} pixel
	 * @return {Integer}
	 * @protected
	 **/
	/*
	 * TODO Document mehtod '_getCanvasX'
	 */
	_getCanvasX: function(meter,pixel) {

        var me=this;

		if (typeof meter==='undefined') {
			
			meter=0;
			
		}
		
		if (typeof pixel==='undefined') {
			
			pixel=0;
			
		}
		
		var value=this.toZoom(
            me.toPixel(meter)+pixel-this._x
		);

        //return Math.ceil(value+(this._width/2));

        return value+(this._width/2);
		//return ~~(0.5+value+(this._width/2));
		
	},
	
	/**
	 * @method _getCanvasY
	 * @param {Float} meter
	 * @param {Integer} pixel
	 * @return {Integer}
	 * @protected
	 **/
	/*
	 * TODO Document mehtod '_getCanvasY'
	 */
	_getCanvasY: function(meter,pixel) {

        var me=this;

		if (typeof meter==='undefined') {
			
			meter=0;
			
		}
		
		if (typeof pixel==='undefined') {
			
			pixel=0;
			
		}
		
		var value=this.toZoom(
            me.toPixel(meter)+pixel-this._y
		);

        //return Math.ceil(value+(this._height/2));
        return value+(this._height/2);
		//return ~~(0.5+value+(this._height/2));
		
	},
	
	/**
	 * Set the view position to a given world position
	 * 
	 * @method _setViewPosition
	 * @param {Float} x
	 * @param {Float} y
	 * @protected
	 **/
	_setViewPosition: function(x,y) {

        var me=this;

		this._x=me.toPixel(x);
		this._y=me.toPixel(y);
		
	},
	
	/**
	 * Renders the world center indicator
	 * 
	 * @method _renderWorldCenterIndicator
	 * @protected
	 **/
	_renderWorldCenterIndicator: function() {
		
		this.drawLines(
			'display',
			[
				[
					this._getCanvasX(-0.5),
					this._getCanvasY(0),
					this._getCanvasX(0.5),
					this._getCanvasY(0)
				],
				[
					this._getCanvasX(0),
					this._getCanvasY(-0.5),
					this._getCanvasX(0),
					this._getCanvasY(0.5)
				]
			],
			'rgb(0,0,255)'
		);
		
	},

    /**
	 * Renders the grid
	 * 
	 * @method _debugDrawGrid
	 * @protected
	 **/
	/*
	 * TODO Rename method '_debugDrawGrid' more convenient
	 */
	_debugDrawGrid: function() {
		
		/*
		 * TODO Reactivate draw grid code
		 */
		
		/*
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
		*/
		
	}
	
});