/**
 * Canvas Viewport System
 * 
 * Visualization implementation for HTML Canvas.
 * 
 * @class canvas
 * @namespace zerk.game.engine.system.viewport
 * @extends zerk.game.engine.system.viewport
 * @module zerk
 **/
zerk.define({
	
	name: 'zerk.game.engine.system.viewport.canvas',
	extend: 'zerk.game.engine.system.viewport'
	
},{
	
	/**
	 * Register for canvas references
	 * 
	 * @property _canvas
	 * @type Object
	 * @protected
	 **/
	_canvas: {},
	
	/**
	 * Register for canvas context references
	 * 
	 * @property _context
	 * @type Object
	 * @protected
	 **/
	_context: {},
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 * @param {zerk.game.engine} engine Game engine
	 * @param {Object} config System configuration
	 **/
	init: function(engine,config) {
		
		zerk.parent('zerk.game.engine.system.viewport.canvas').init.apply(
			this,
			arguments
		);
		
	},
	
	/**
	 * Creates multiple buffers
	 * 
	 * @method createBuffers
	 * @param {Object} buffers A list of buffers to be created
	 * @deprecated
	 **/
	createBuffers: function(buffers) {
		
		for (var buffer in buffers) {
			
			var canvas=this._createCanvas(
				'zerk_canvas_'+buffer,
				buffers[buffer].width,
				buffers[buffer].height,
				buffers[buffer].visible
			);

            canvas.style.backgroundColor=this._config.backgroundColor;
			
			this._canvas[buffer]=canvas;
			this._context[buffer]=canvas.getContext('2d');
			
		}
		
	},
	
	/**
	 * Returns a canvas position relative to its parent HTML document
	 * 
	 * @method getCanvasPosition
	 * @param {String} buffer Buffer id
	 * @return {Object} An object containing x and y
	 **/
	getCanvasPosition: function(buffer) {
		
		var canvas=this._getCanvas(buffer);
		
		return zerk.browser.getElementPosition(canvas);
		
	},
	
	/**
	 * Return a canvas element for given buffer id
	 * 
	 * @method getCanvasElement
	 * @param {String} buffer Buffer id
	 * @return {DOMElement} Canvas element
	 **/
	getCanvasElement: function(buffer) {
		
		return this._getCanvas(buffer);
		
	},
	
	/**
	 * Returns the size of the buffer by given id
	 * 
	 * @method getBufferSize
	 * @param {String} buffer Buffer id
	 * @return {Object} An object containing with and height
	 **/
	getBufferSize: function(buffer) {
		
		var canvas=this._getCanvas(buffer);
		
		return {
			width: canvas.width,
			height: canvas.height
		};
		
	},

    setBufferSize: function(buffer,width,height) {

        var canvas=this._getCanvas(buffer);

        canvas.width=width;
        canvas.height=height;

    },
	
	/**
	 * Initializes a buffer for drawing
	 * 
	 * @method bufferInit
	 * @param {String} buffer Buffer id
	 * @param {Float} width Width
	 * @param {Float} height Height
	 * @param {Float} x Center x
	 * @param {Float} y Center y
	 * @param {Float} angle Angle
	 **/
	bufferInit: function(buffer,width,height,x,y,angle) {
		
		var canvas=this._getCanvas(buffer);
		var context=this._getContext(buffer);
		
		canvas.width=width;
		canvas.height=height;
		
		context.translate(x,y);
		//context.rotate(angle);
		
	},
	
	/**
	 * Flush a buffers content onto another buffer
	 * 
	 * @method bufferFlush
	 * @param {String} source Source buffer id
	 * @param {String} target Target buffer id
     * @param {Float} x Target horizontal position
     * @param {Float} y Target vertical position
	 * @param {Float} width Target width
	 * @param {Float} height Target height
     * @param {Float} angle Rotation angle
	 **/
	bufferFlush: function(
        source,
        target,
        x,
        y,
        width,
        height,
        angle
    ) {
		
		var sourceCanvas=this._getCanvas(source);
		var targetContext=this._getContext(target);

        if (angle) {

            targetContext.save();
            targetContext.translate(x,y);
            targetContext.rotate(angle);
            targetContext.drawImage(
                sourceCanvas,
                0,
                0,
                sourceCanvas.width,
                sourceCanvas.height,
                -width/2,
                -height/2,
                width,
                height
            );

            targetContext.restore();

        } else {

            targetContext.drawImage(
                sourceCanvas,
                0,
                0,
                sourceCanvas.width,
                sourceCanvas.height,
                x-width/2,
                y-height/2,
                width,
                height
            );

        }

	},
	
	/**
	 * Clear a buffer by given buffer id
	 * 
	 * @method bufferClear
	 * @param {String} buffer Buffer id
	 **/
	bufferClear: function(buffer) {
		
		var canvas=this._getCanvas(buffer);
		
		canvas.width=canvas.width;
		
	},
	
	/**
	 * Draw lines
	 * 
	 * @method drawLines
	 * @param {String} buffer Buffer id
	 * @param {Object} lines Two dimensional array containing the lines
	 * @param {String} color RGB color
	 * @param {Float} lineWidth Width of the lines
	 **/
	drawLines: function(buffer,lines,color,lineWidth) {
		
		var context=this._getContext(buffer);
		
		context.save();
		
		context.beginPath();
		context.strokeStyle=color;
		context.lineWidth=lineWidth;
		
		for (var i=0;i<lines.length;i++) {
			
			context.moveTo(
				lines[i][0],
				lines[i][1]
			);
			
			context.lineTo(
				lines[i][2],
				lines[i][3]
			);
			
		}
		
		context.stroke();
		
		context.restore();
		
	},
	
	/**
	 * Draw rectangle
	 * 
	 * @method drawRect
	 * @param {Boolean|Integer|Float|String|Object|Array|Function|Mixed|Any|CLASS_NAME} PARAM_NAME PARAM_DESCRIPTION
	 * @return {Boolean|Integer|Float|String|Object|Array|Function|Mixed|Any|CLASS_NAME} RETURN_DESCRIPTION
	 **/
	drawRect: function(
		buffer,
		x,
		y,
		width,
		height,
		fillColor,
		strokeColor,
		lineWidth
	) {
		
		var context=this._getContext(buffer);
		
		context.save();
		
		if (zerk.isDefined(fillColor)) {
			
			context.fillStyle=fillColor;
			
			context.strokeRect(
				x,
				y,
				width,
				height
			);
			
		}
		
		if (zerk.isDefined(strokeColor)) {
			
			context.strokeStyle=strokeColor;
			context.lineWidth=lineWidth;
			
			context.strokeRect(
				x,
				y,
				width,
				height
			);
			
		}
		
		context.restore();
		
	},
	
	/**
	 * Fill rectangle
	 * 
	 * @method fillRect
	 * @param {String} buffer Buffer id
     * @param {Float} x Horizontal position
     * @param {Float} y Vertical position
     * @param {Float} width Width
     * @param {Float} height Height
     * @param {Float} angle Rotation angle
     * @param {Object} image Image
     * @param {Float} textureX Texture offset x
     * @param {Float} textureY Texture offset y
     * @param {Float} textureAngle Texture rotation angle
	 **/
	fillRect: function(
        buffer,
        x,
        y,
        width,
        height,
        angle,
        image,
        textureX,
        textureY,
        textureAngle
    ) {

        var vertices=zerk.helper.getPolygonOfRectangle(width,height);

        this.fillPolygon(
            buffer,
            x,
            y,
            vertices,
            angle,
            image,
            textureX,
            textureY,
            textureAngle
        );
		
	},
	
	/**
	 * Draw arc
	 * 
	 * @method drawArc
	 * @param {String} buffer Buffer id
     * @param {Float} x Horizontal position
     * @param {Float} y Vertical position
     * @param {Float} radius Radius
     * @param {Float} startAngle Start angle
     * @param {Float} endAngle End angle
     * @param {Boolean} anticlockwise Draw the circle in anticlockwise order
     * @param {String} fillColor Fill color
     * @param {String} strokeColor Stroke color
     * @param {Float} lineWidth Stroke line width
	 **/
	drawArc: function(
		buffer,
		x,
		y,
		radius,
		startAngle,
		endAngle,
		anticlockwise,
		fillColor,
		strokeColor,
		lineWidth
	) {
		
		var context=this._getContext(buffer);
		
		context.save();
		
		context.beginPath();
		
		context.arc(
			x,
			y,
			radius,
			startAngle,
			endAngle,
			anticlockwise
		);
		context.closePath();
		
		if (zerk.isDefined(strokeColor)) {
			
			context.strokeStyle=strokeColor;
			context.lineWidth=lineWidth;
			context.stroke();
			
		}
		
		if (zerk.isDefined(fillColor)) {
			
			context.fillStyle=fillColor;
			context.fill();
			
		}
		
		context.restore();
		
	},
	
	/**
	 * Fill arc
	 * 
	 * @method fillArc
     * @param {String} buffer Buffer id
     * @param {Float} x Horizontal position
     * @param {Float} y Vertical position
     * @param {Float} radius Radius
     * @param {Float} startAngle Start angle
     * @param {Float} endAngle End angle
     * @param {Boolean} anticlockwise Draw the circle in anticlockwise order
     * @param {Object} image Image
     * @param {Float} textureX Texture offset x
     * @param {Float} textureY Texture offset y
     * @param {Float} textureAngle Texture rotation angle
	 **/
	fillArc: function(
		buffer,
		x,
		y,
		radius,
		startAngle,
		endAngle,
		anticlockwise,
		image,
        textureX,
        textureY,
        textureAngle
	) {

		var context=this._getContext(buffer);
		
		var pattern=context.createPattern(image,'repeat');
		
		context.save();
		
		context.beginPath();
		context.fillStyle=pattern;
		context.arc(
			x,
			y,
			radius,
			startAngle,
			endAngle,
			anticlockwise
		);
		context.closePath();

        if (textureAngle) {
            context.rotate(textureAngle);
        }

        if (zerk.isDefined(textureX) && zerk.isDefined(textureY)) {
            context.translate(textureX,textureY);
        }

		context.fill();
		
		context.restore();
		
	},
	
	/**
	 * Draw polygon
	 * 
	 * @method drawPolygon
	 * @param {String} buffer Buffer id
     * @param {Array} vertices Array of vertices
     * @param {String} fillColor Fill color
     * @param {String} strokeColor Stroke color
     * @param {Float} lineWidth Stroke line width
	 **/
	drawPolygon: function(
		buffer,
		vertices,
		fillColor,
		strokeColor,
		lineWidth
	) {
		
		var context=this._getContext(buffer);
		
		context.save();
		
		context.beginPath();
		
		for (var i=0;i<vertices.length;i++) {
			
			if (i==0) {
				
				context.moveTo(
					vertices[i][0],
					vertices[i][1]
				);
				
			} else {
				
				context.lineTo(
					vertices[i][0],
					vertices[i][1]
				);
				
			}
			
		}
		
		context.closePath();
		
		if (zerk.isDefined(strokeColor)) {
			
			context.strokeStyle=strokeColor;
			context.lineWidth=lineWidth;
			context.stroke();
			
		}
		
		if (zerk.isDefined(fillColor)) {
			
			context.fillStyle=fillColor;
			context.fill();
			
		}
		
		context.restore();
		
	},
	
	/**
	 * Fill polygon
	 * 
	 * @method fillPolygon
     * @param {String} buffer Buffer id
     * @param {Float} x Horizontal position
     * @param {Float} y Vertical position
     * @param {Array} vertices Array of vertices
     * @param {Float} angle Rotation angle
     * @param {Object} image Image
     * @param {Float} textureX Texture offset x
     * @param {Float} textureY Texture offset y
     * @param {Float} textureAngle Texture rotation angle
	 **/	
	fillPolygon: function(
        buffer,
        x,
        y,
        vertices,
        angle,
        image,
        textureX,
        textureY,
        textureAngle
    ) {

		var context=this._getContext(buffer);
		
		var pattern=context.createPattern(image,'repeat');
		
		context.save();
		context.beginPath();
		context.fillStyle=pattern;

        var rotatedVertice=null;
		for (var i=0;i<vertices.length;i++) {

            rotatedVertice=zerk.helper.rotatePosition(
                vertices[i][0],
                vertices[i][1],
                angle
            );

			if (i==0) {
				
				context.moveTo(
					x+rotatedVertice.x,
					y+rotatedVertice.y
				);
				
			} else {
				
				context.lineTo(
                    x+rotatedVertice.x,
                    y+rotatedVertice.y
				);
				
			}
			
		}
		
		context.closePath();

        if (textureAngle) {
            context.rotate(textureAngle);
        }

        if (zerk.isDefined(textureX) && zerk.isDefined(textureY)) {
            context.translate(textureX,textureY);
        }

		context.fill();
		
		context.restore();
		
	},
	
	/**
	 * PUBLIC_METHOD_DESCRIPTION
	 * 
	 * @method drawText
	 * @param {Boolean|Integer|Float|String|Object|Array|Function|Mixed|Any|CLASS_NAME} PARAM_NAME PARAM_DESCRIPTION
	 * 	SECOND_LINE
	 * @return {Boolean|Integer|Float|String|Object|Array|Function|Mixed|Any|CLASS_NAME} RETURN_DESCRIPTION
	 **/
	drawText: function(
		buffer,
		text,
		x,
		y,
		font,
		size,
		color,
		horizontalAlign,
		verticalAlign
	) {
		
		var context=this._getContext(buffer);
		var canvas=this._getCanvas(buffer);
		
		context.save();
		
		if (typeof font=='undefined') {
			
			font='sans-serif';
			
		}
		
		if (typeof size=='undefined') {
			
			size=20;
			
		}
		
		if (typeof color=='undefined') {
			
			color='rgb(0,255,0)';
			
		}
		
		context.font=size+'pt '+font;
		context.fillStyle=color;
		
		var measure=context.measureText(text);
		
		var posX=0,posY=0;
		
		if (horizontalAlign=='left') {
			
			posX=(canvas.width/2)+x;
			
		} else if (horizontalAlign=='right') {
			
			posX=(canvas.width/2)-measure.width+x;
			
		} else {
			
			posX=(canvas.width/2)-(measure.width/2)+x;
			
		}
		
		if (verticalAlign=='top') {
			
			posY=(canvas.height/2)+size+y;
			
		} else if (verticalAlign=='bottom') {
			
			posY=(canvas.height/2)+y;
			
		} else {
			
			posY=(canvas.height/2)+(size/2)+y;
			
		}
		
		context.fillText(
			text,
			posX,
			posY
		);
		
		context.restore();
		
	},
	
	drawImage: function(
        buffer,
        image,
        targetX,
        targetY,
        targetWidth,
        targetHeight,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        angle
    ) {
		
		var context=this._getContext(buffer);

        if (angle) { // Rotated image

            context.save();

            context.translate(targetX,targetY);
            context.rotate(angle);

            context.drawImage(
                image,
                sourceX,
                sourceY,
                sourceWidth,
                sourceHeight,
                -targetWidth/2,
                -targetHeight/2,
                targetWidth,
                targetHeight
            );

            context.restore();

        } else {

            context.drawImage(
                image,
                sourceX,
                sourceY,
                sourceWidth,
                sourceHeight,
                targetX-(targetWidth/2),
                targetY-(targetHeight/2),
                targetWidth,
                targetHeight
            );

        }

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
	 **/
	_createCanvas: function(id,width,height,visible) {
		
		var canvas=document.getElementById(id);
		
		if (canvas) {
			
			return canvas;
			
		}
		
		canvas=document.createElement('canvas');
		
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
		
		var container;
		
		if (this._config.canvasContainerId) {
			
			container=document.getElementById(this._config.canvasContainerId);
			
			if (!container) {
				
				zerk.error({
					message: 'Could not find element for canvasContainerId "'
						+this._config.canvasContainerId+'"'
				});
				
			}
			
		} else {
			
			container=document.getElementsByTagName('body')[0];
			
		}
		
		return container.appendChild(canvas);
		
	},
	
	/**
	 * PROTECTED_METHOD_DESCRIPTION
	 * 
	 * @method _getCanvas
	 * @param {Boolean|Integer|Float|String|Object|Array|Function|Mixed|Any|CLASS_NAME} PARAM_NAME PARAM_DESCRIPTION
	 * 	SECOND_LINE
	 * @return {Boolean|Integer|Float|String|Object|Array|Function|Mixed|Any|CLASS_NAME} RETURN_DESCRIPTION
	 * @protected
	 * @async
	 * @deprecated
	 **/
	_getCanvas: function(buffer) {
		
		return this._canvas[buffer];
		
	},
	
	/**
	 * PROTECTED_METHOD_DESCRIPTION
	 * 
	 * @method _getContext
	 * @param {Boolean|Integer|Float|String|Object|Array|Function|Mixed|Any|CLASS_NAME} PARAM_NAME PARAM_DESCRIPTION
	 * 	SECOND_LINE
	 * @return {Boolean|Integer|Float|String|Object|Array|Function|Mixed|Any|CLASS_NAME} RETURN_DESCRIPTION
	 * @protected
	 * @async
	 * @deprecated
	 **/
	_getContext: function(buffer) {
		
		return this._context[buffer];
		
	},

    /**
     * Returns the physics debug canvas DOM element
     *
     * @method getCanvasPhysicsDebug
     * @return {DOMElement} Physics debug canvas DOM element
     **/
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

    }
	
});