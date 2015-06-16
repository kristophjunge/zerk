/**
 * Debug Info System
 * 
 * Renders debug info such as FPS, position and zoom on the display.
 * 
 * @class debuginfo
 * @namespace zerk.game.engine.system
 * @extends zerk.game.engine.system
 * @module zerk
 **/
zerk.define({
	
	name: 'zerk.game.engine.system.debuginfo',
	extend: 'zerk.game.engine.system'
	
},{
	
	/**
	 * Name of the system
	 * 
	 * @property _name
	 * @type String
	 * @protected
	 **/
	_name: 'debuginfo',
	
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
	_priority: 104,
	
	/**
	 * Viewport system instance
	 * 
	 * @property _viewport
	 * @type zerk.game.engine.system.viewport
	 * @protected
	 **/
	_viewport: null,
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 * @param {zerk.game.engine} engine Game engine
	 * @param {Object} config System configuration
	 **/
	init: function(engine,config) {
		
		zerk.parent('zerk.game.engine.system.debuginfo').init.apply(
			this,
			arguments
		);
		
		this._viewport=this._getSystem('viewport');
		
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
			showViewCenterIndicator: false,
			showFPS: false,
			showZoom: false,
			showPosition: false,
            showViewportSize: false
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
		
		return false;
		
	},
	
	/**
	 * Starts the system
	 * 
	 * @method start
	 **/
	start: function() {
		
		zerk.parent('zerk.game.engine.system.debuginfo').start.apply(
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
		
		zerk.parent('zerk.game.engine.system.debuginfo').stop.apply(
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
		
		zerk.parent('zerk.game.engine.system.debuginfo').update.apply(
			this,
			arguments
		);
		
		if (this._config.showViewCenterIndicator) {
			this._renderViewCenterIndicator();
		}
		
		this._renderDebugInfo();
		
	},
	
	/**
	 * Renders debug information onto the game canvas
	 * 
	 * @method _renderDebugInfo
	 * @protected
	 **/
	_renderDebugInfo: function() {

        var me=this;

		if (me._config.showFPS) {

            me._renderDebugInfoLine(me._viewport.getFPS()+' FPS',1);
			
		}
		
		if (me._config.showZoom) {

            me._renderDebugInfoLine(
				zerk.helper.formatPercent(me._viewport.getZoom(),2),
				2
			);
			
		}
		
		var offsetX=zerk.helper.round(
            me._viewport.fromPixel(me._viewport.getX()),
			1
		);
		var offsetY=zerk.helper.round(
            me._viewport.fromPixel(me._viewport.getY()),
			1
		);
		
		if (me._config.showPosition) {

            me._renderDebugInfoLine(offsetX+':'+offsetY,3);
			
		}

        if (me._config.showViewportSize) {

            me._renderDebugInfoLine(me._viewport.getWidth()+':'+me._viewport.getHeight(),4);

        }
		
	},
	
	/**
	 * Renders a line of debug information onto the game canvas
	 * 
	 * @method _renderDebugInfoLine
	 * @param {String} text Text to be rendered
	 * @param {Integer} line Row number
	 * @protected
	 **/
	_renderDebugInfoLine: function(text,line) {
		
		this._viewport.drawText(
			'display',
			text,
			(this._viewport._width/2)-2,
			-(this._viewport._height/2)+(10*line)-7,
			'sans-serif',
			10,
			'rgb(0,255,0)',
			'right',
			'top'
		);
		
	},
	
	/**
	 * Renders the view center indicator
	 * 
	 * @method _renderViewCenterIndicator
	 * @protected
	 **/
	_renderViewCenterIndicator: function() {
		
		this._viewport.drawLines(
			'display',
			[
				[
					(this._viewport._width/2)-10,
					(this._viewport._height/2),
					(this._viewport._width/2)+10,
					(this._viewport._height/2)
				],
				[
					(this._viewport._width/2),
					(this._viewport._height/2)-10,
					(this._viewport._width/2),
					(this._viewport._height/2)+10
				]
			],
			'rgb(0,200,200)'
		);
		
	}
	
});