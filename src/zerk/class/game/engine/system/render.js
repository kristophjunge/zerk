/**
 * Render System
 * 
 * Renders sprites, textures and animations
 * 
 * @class render
 * @namespace zerk.game.engine.system
 * @extends zerk.game.engine.system
 * @module zerk
 **/
zerk.define({
	
	name: 'zerk.game.engine.system.render',
	extend: 'zerk.game.engine.system'
	
},{
	
	/**
	 * Name of the system
	 * 
	 * @property _name
	 * @type String
	 * @protected
	 */
	_name: 'render',
	
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
	_priority: 101,
	
	/**
	 * Viewport system instance
	 * 
	 * @property _viewport
	 * @type zerk.game.engine.system.viewport
	 * @protected
	 **/
	_viewport: null,

    _bufferGap: 1,
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 * @param {zerk.game.engine} engine Game engine
	 * @param {Object} config System configuration
	 **/
	init: function(engine,config) {
		
		zerk.parent('zerk.game.engine.system.render').init.apply(
			this,
			arguments
		);
		
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
		
		return (name=='render');
		
	},
	
	/**
	 * Starts the system
	 * 
	 * @method start
	 **/
	start: function() {
		
		zerk.parent('zerk.game.engine.system.render').start.apply(
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
		
		zerk.parent('zerk.game.engine.system.render').stop.apply(
			this,
			arguments
		);
		
	},
	
	/**
	 * Adds an entity to the system
	 * 
	 * @method addEntity
	 * @param {config.entity} entity Entity state
	 **/
	addEntity: function(entity) {
		
		zerk.parent('zerk.game.engine.system.render').addEntity.apply(
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
		
		zerk.parent('zerk.game.engine.system.render').update.apply(
			this,
			arguments
		);
		
		// Render all entities in the view area
		var entityStates=this._viewport.getEntitiesInViewport();
		
		for (var i=0;i<entityStates.length;i++) {
			
			// Check if this entity has the sprite component
			if (typeof entityStates[i].components.render=='undefined') {
				
				continue;
				
			}
			
			if (!entityStates[i].components.render.visible) continue;
			
			this._renderEntity(entityStates[i]);
		}
		
	},
	
	/**
	 * Renders an entity onto the game canvas
	 * 
	 * @method _renderEntity 
	 * @param {config.entity} entity Entity state
	 * @protected
	 **/
	_renderEntity: function(entity) {

        var position=entity.components.position;
        var render=entity.components.render;


        // Calcuate size of each layer
        var layerSizes=this._getBufferSizeLayers(entity);

        // Calucate buffer
        var bufferSize=this._getBufferSizeEntity(entity,layerSizes);





        /*
        bufferSize={
            x: 721/2,
            y: 721/2,
            width: 721,
            height: 721
        };
        */













        this._viewport.bufferInit(
            'entity',
            bufferSize.width,
            bufferSize.height,
            bufferSize.x,
            bufferSize.y,
            0 // No rotation. Rotation happens during placement
        );




        // Render all layers
        for (var i=0;i<render._layerList.length;i++) {
            this._renderLayer(entity,render._layerList[i]);
        }

        // Entity buffer origin
        /*
        this._viewport.drawArc(
            'entity',
            0,
            0,
            5,
            0,
            360,
            false,
            'rgb(0,255,0)',
            'rgb(0,255,0)',
            0
        );
        */




        // Debug
        /*
        this._viewport.drawRect(
            'display',
            this._viewport._getCanvasX(position.x)-this._viewport.toZoom(10/2),
            this._viewport._getCanvasY(position.y)-this._viewport.toZoom(10/2),
            this._viewport.toZoom(10),
            this._viewport.toZoom(10),
            'rgba(0,255,0,1)',
            null,
            0
        );

        this._viewport.drawRect(
            'entity',
            -(10/2),
            -(10/2),
            10,
            10,
            'rgba(255,0,0,1)',
            null,
            0
        );
        */



        this._viewport.bufferFlush(
            'entity',
            'display',
            this._viewport._getCanvasX(position.x),
            this._viewport._getCanvasY(position.y),
            this._viewport.toZoom(bufferSize.width),
            this._viewport.toZoom(bufferSize.height),
            0, // bodyState.angle,
            this._viewport.toZoom(-bufferSize.x),
            this._viewport.toZoom(-bufferSize.y)
        );

        this._debugDrawEntityBuffers(entity,layerSizes);

	},

    _getBufferSizeLayers: function(entity) {

        var render=entity.components.render;

        var result=[];
        var bufferSize=null;

        for (var i=0;i<render._layerList.length;i++) {

            bufferSize=this._getBufferSizeLayer(entity,render._layerList[i]);

            if (bufferSize) {

                result.push(bufferSize);

            }

        }

        return result;

    },

    _getBufferSizeEntity: function(entity,layerSizes) {

        var mostLeft=0;
        var mostRight=0;
        var mostBottom=0;
        var mostTop=0;

        var boxLeft=0;
        var boxRight=0;
        var boxTop=0;
        var boxBottom=0;

        for (var i=0;i<layerSizes.length;i++) {

            boxLeft=layerSizes[i].x;
            boxRight=layerSizes[i].x+layerSizes[i].width;
            boxTop=layerSizes[i].y;
            boxBottom=layerSizes[i].y+layerSizes[i].height;

            if (boxLeft<mostLeft) {
                mostLeft=boxLeft;
            }

            if (boxRight>mostRight) {
                mostRight=boxRight;
            }

            if (boxTop<mostTop) {
                mostTop=boxTop;
            }

            if (boxBottom>mostBottom) {
                mostBottom=boxBottom;
            }

        }





        // Odd
        var width=mostRight-mostLeft;
        var height=mostBottom-mostTop;

        var left=(mostLeft*-1);
        var top=(mostTop*-1);


        // Even
        /*
        var width=0;
        var height=0;

        if (mostLeft*-1>mostRight) {
            width=mostLeft*-1*2;
        } else {
            width=mostRight*2;
        }

        if (mostTop*-1>mostBottom) {
            height=mostTop*-1*2;
        } else {
            height=mostBottom*2;
        }
        */


        /*
        left+=this._bufferGap;
        top+=this._bufferGap;
        width+=(this._bufferGap*2);
        height+=(this._bufferGap*2);
        */





        if (width % 2) { // Even

        } else { // Odd
            //width+=1;
            //left+=1;
        }

        if (height % 2) { // Even

        } else { // Odd
            //height+=1;
            //top+=1;
        }



        //var max=((width>height) ? width : height);


        width=Math.ceil(width);
        height=Math.ceil(height);


        return {
            x: left,
            y: top,
            width: width,
            height: height
            /*
            x: width/2,
            y: height/2,
            width: width,
            height: height
            */
        };

    },

    _debugDrawEntityBuffers: function(entity,layerSizes) {

        var render=entity.components.render;

        var mostLeft=0;
        var mostRight=0;
        var mostBottom=0;
        var mostTop=0;

        var boxLeft=0;
        var boxRight=0;
        var boxTop=0;
        var boxBottom=0;

        for (var i=0;i<layerSizes.length;i++) {


            this._viewport.drawRect(
                'entity',
                layerSizes[i].x,
                layerSizes[i].y,
                layerSizes[i].width,
                layerSizes[i].height,
                '',
                'rgb(0,255,0)',
                1
            );


            boxLeft=layerSizes[i].x;
            boxRight=layerSizes[i].x+layerSizes[i].width;
            boxTop=layerSizes[i].y;
            boxBottom=layerSizes[i].y+layerSizes[i].height;

            if (boxLeft<mostLeft) {
                mostLeft=boxLeft;
            }

            if (boxRight>mostRight) {
                mostRight=boxRight;
            }

            if (boxTop<mostTop) {
                mostTop=boxTop;
            }

            if (boxBottom>mostBottom) {
                mostBottom=boxBottom;
            }

        }


        var width=0;
        var height=0;

        if (mostLeft*-1>mostRight) {
            width=mostLeft*-1*2;
        } else {
            width=mostRight*2;
        }

        if (mostTop*-1>mostBottom) {
            height=mostTop*-1*2;
        } else {
            height=mostBottom*2;
        }





        /*
        var width=mostRight-mostLeft;
        var height=mostBottom-mostTop;
        */


        /*
        this._viewport.drawRect(
            'entity',
            -(width/2),
            -(height/2),
            width,
            height,
            null,
            'rgb(255,0,0)',
            1
        );
        */


    },

    /**
     * Renders a layer
     *
     * @param entity
     * @param layer
     * @private
     */
    _renderLayer: function(entity,layer) {

        switch (layer.render) {
            case 'texture':
                this._renderLayerTexture(entity,layer);
                break;
            case 'sprite':
                this._renderLayerSprite(entity,layer);
                break;
        }

    },

    /**
     * Renders a texture layer
     *
     * @param entity
     * @param layer
     * @private
     */
    _renderLayerTexture: function(entity,layer) {

        if (layer.body && layer.fixture) {
            this._renderLayerTexturePhysics(entity,layer);
        } else {
            this._renderLayerTextureStandalone(entity,layer);
        }

    },

    _renderLayerTexturePhysics: function(entity,layer) {

        var image=this._engine._textureLoader.getTexture(
            layer.texture
        );

        var physics=entity.components.physics;
        var body=physics.bodies[layer.body];
        var fixture=physics.bodies[layer.body].fixtures[layer.fixture];

        // Calculate texture pattern offset
        var textureOffset=zerk.helper.rotatePosition(
            body.x,
            body.y,
            -body.angle-fixture.angle-layer.angle-layer.textureAngle
        );
        textureOffset.x+=layer.textureOffsetX;
        textureOffset.y+=layer.textureOffsetY;

        // Rotate layer position
        var position=zerk.helper.rotatePosition(
            layer.x,
            layer.y,
            fixture.angle
        );

        // Rotate fixture position
        position=zerk.helper.rotatePosition(
            position.x+fixture.x,
            position.y+fixture.y,
            body.angle
        );

        // Add body position
        position={
            x: position.x+body.x,
            y: position.y+body.y
        };

        var textureAngle=body.angle+fixture.angle+layer.angle+layer.textureAngle;

        var angle=body.angle+fixture.angle+layer.angle;

        switch (fixture.shape) {

            case 'box':
                this._viewport.fillRect(
                    'entity',
                    this._viewport.toPixel(position.x),
                    this._viewport.toPixel(position.y),
                    this._viewport.toPixel(fixture.width),
                    this._viewport.toPixel(fixture.height),
                    angle,
                    image,
                    this._viewport.toPixel(textureOffset.x),
                    this._viewport.toPixel(textureOffset.y),
                    textureAngle
                );
                break;

            case 'circle':

                this._viewport.fillArc(
                    'entity',
                    this._viewport.toPixel(position.x),
                    this._viewport.toPixel(position.y),
                    this._viewport.toPixel(fixture.radius),
                    0,
                    2*Math.PI,
                    false,
                    image,
                    this._viewport.toPixel(textureOffset.x),
                    this._viewport.toPixel(textureOffset.y),
                    textureAngle
                );

                break;

            case 'polygon':

                var polygon=[];
                for (var i=0;i<fixture.vertices.length;i++) {
                    polygon.push([
                        this._viewport.toPixel(fixture.vertices[i][0]),
                        this._viewport.toPixel(fixture.vertices[i][1])
                    ]);
                }

                this._viewport.fillPolygon(
                    'entity',
                    this._viewport.toPixel(position.x),
                    this._viewport.toPixel(position.y),
                    polygon,
                    angle,
                    //body.angle+fixture.angle,
                    image,
                    this._viewport.toPixel(textureOffset.x),
                    this._viewport.toPixel(textureOffset.y),
                    textureAngle
                );

                break;
            default:
                zerk.error('Unknown shape "'+fixture.shape+'"');
                break;

        }

        /*
        this._viewport.drawArc(
            'entity',
            this._viewport.toPixel(position.x),
            this._viewport.toPixel(position.y),
            5,
            0,
            360,
            false,
            'rgb(0,0,255)',
            'rgb(0,0,255)',
            0
        );
        */

    },

    _renderLayerTextureStandalone: function(entity,layer) {

        var image=this._engine._textureLoader.getTexture(
            layer.texture
        );

        var textureOffset={
            x: layer.textureOffsetX,
            y: layer.textureOffsetY
        };

        var position={
            x: layer.x,
            y: layer.y
        };

        var textureAngle=layer.textureAngle;

        var angle=layer.angle;

        this._viewport.fillRect(
            'entity',
            this._viewport.toPixel(position.x),
            this._viewport.toPixel(position.y),
            this._viewport.toPixel(layer.width),
            this._viewport.toPixel(layer.height),
            angle,
            image,
            this._viewport.toPixel(textureOffset.x),
            this._viewport.toPixel(textureOffset.y),
            textureAngle
        );

        /*
        this._viewport.drawArc(
            'entity',
            this._viewport.toPixel(position.x),
            this._viewport.toPixel(position.y),
            5,
            0,
            360,
            false,
            'rgb(0,0,255)',
            'rgb(0,0,255)',
            0
        );
        */

    },

    /**
     * Renders a sprite layer
     *
     * @param entity
     * @param layer
     * @private
     */
    _renderLayerSprite: function(entity,layer) {

        if (layer.body && layer.fixture) {
            this._renderLayerSpritePhysics(entity,layer);
        } else {
            this._renderLayerSpriteStandalone(entity,layer);
        }

    },

    _renderLayerSpritePhysics: function(entity,layer) {

        var physics=entity.components.physics;
        var body=physics.bodies[layer.body];
        var fixture=physics.bodies[layer.body].fixtures[layer.fixture];

        // Rotate layer position
        var position=zerk.helper.rotatePosition(
            layer.x,
            layer.y,
            fixture.angle
        );

        // Rotate fixture position
        position=zerk.helper.rotatePosition(
            position.x+fixture.x,
            position.y+fixture.y,
            body.angle
        );

        // Add body position
        position={
            x: position.x+body.x,
            y: position.y+body.y
        };

        var angle=body.angle+fixture.angle+layer.angle;

        var image=this._engine._spriteLoader.getSprite(
            layer.spritesheet,
            layer.sprite
        );

        this._viewport.drawImage(
            'entity',
            image.image,
            this._viewport.toPixel(position.x),
            this._viewport.toPixel(position.y),
            image.info.width,
            image.info.height,
            image.info.offsetX,
            image.info.offsetY,
            image.info.width,
            image.info.height,
            angle
        );

        /*
        this._viewport.drawArc(
            'entity',
            this._viewport.toPixel(position.x),
            this._viewport.toPixel(position.y),
            5,
            0,
            360,
            false,
            'rgb(0,0,255)',
            'rgb(0,0,255)',
            0
        );
        */

    },

    _renderLayerSpriteStandalone: function(entity,layer) {

        var position={
            x: layer.x,
            y: layer.y
        };

        var angle=layer.angle;

        var image=this._engine._spriteLoader.getSprite(
            layer.spritesheet,
            layer.sprite
        );

        this._viewport.drawImage(
            'entity',
            image.image,
            this._viewport.toPixel(position.x),
            this._viewport.toPixel(position.y),
            image.info.width,
            image.info.height,
            image.info.offsetX,
            image.info.offsetY,
            image.info.width,
            image.info.height,
            angle
        );

        /*
        this._viewport.drawArc(
            'entity',
            this._viewport.toPixel(position.x),
            this._viewport.toPixel(position.y),
            5,
            0,
            360,
            false,
            'rgb(0,0,255)',
            'rgb(0,0,255)',
            0
        );
        */

    },

	/**
	 * Renders a body onto the game canvas
	 *
	 * @protected
	 **/
    /*
	_renderBody: function(entity,physicsBody,renderBody) {
		
		var bodyState=entity.components.physics.bodies[physicsBody.key];
		var position=entity.components.position;
		
		var bufferSize=this._getBufferSizeBody(entity,bodyState,renderBody);

		this._viewport.bufferInit(
			'body',
			bufferSize.width,
			bufferSize.height,
			bufferSize.width/2,
			bufferSize.height/2,
			bodyState.angle
		);

        // Render fixtures
        for (var i=0;i<renderBody._fixtureList.length;i++) {
            var physicsFixture=physicsBody.fixtures[renderBody._fixtureList[i].key];
            this._renderFixture(
                entity,
                physicsBody,
                renderBody,
                physicsFixture,
                renderBody._fixtureList[i]
            );
        }

		// Draw the buffer onto the display
		this._viewport.bufferFlush(
			'body',
			'display',
			this._viewport._getCanvasX(position.x+bodyState.x), // -(bufferSize.width/2)
			this._viewport._getCanvasY(position.y+bodyState.y), // -(bufferSize.height/2)
			this._viewport.toZoom(bufferSize.width),
			this._viewport.toZoom(bufferSize.height),
            bodyState.angle,
            this._viewport.toZoom(-bufferSize.width/2),
            this._viewport.toZoom(-bufferSize.height/2)
		);
		
	},
	*/

    /**
     * Renders a fixture onto the game canvas
     *
     * @protected
     **/
    /*
    _renderFixture: function(entity,physicsBody,renderBody,physicsFixture,renderFixture) {

        for (var i=0;i<renderFixture._renderList.length;i++) {
            switch (renderFixture._renderList[i].render) {
                case 'texture':
                    this._renderTexture(
                        entity,
                        physicsBody,
                        renderBody,
                        physicsFixture,
                        renderFixture,
                        renderFixture._renderList[i]
                    );
                    break;
                case 'sprite':
                    this._renderSprite(
                        entity,
                        physicsBody,
                        renderBody,
                        physicsFixture,
                        renderFixture,
                        renderFixture._renderList[i]
                    );
                    break;
            }
        }

    },
    */

    /*
    _getOriginBody: function(entity) {

        var bodies=entity.components.physics.bodies;

        for (var key in bodies) {
            if (bodies[key].origin) {
                return bodies[key];
            }
        }

        return null;

    },
    */

    _getBufferSizeLayer: function(entity,layer) {

        switch (layer.render) {
            case 'texture':
                return this._getBufferSizeLayerTexture(entity,layer);
                break;
            case 'sprite':
                return this._getBufferSizeLayerSprite(entity,layer);
                break;
        }

    },

    _getBufferSizeLayerTexture: function(entity,layer) {

        if (layer.body && layer.fixture) {
            return this._getBufferSizeLayerTexturePhysics(entity,layer);
        } else {
            return this._getBufferSizeLayerTextureStandalone(entity,layer);
        }

    },

    _getBufferSizeLayerTexturePhysics: function(entity,layer) {

        var physics=entity.components.physics;
        var body=physics.bodies[layer.body];
        var fixture=physics.bodies[layer.body].fixtures[layer.fixture];

        // Rotate layer position
        var position=zerk.helper.rotatePosition(
            layer.x,
            layer.y,
            fixture.angle
        );

        // Rotate fixture position
        position=zerk.helper.rotatePosition(
            position.x+fixture.x,
            position.y+fixture.y,
            body.angle
        );

        // Add body position
        position={
            x: position.x+body.x,
            y: position.y+body.y
        };

        var width=0;
        var height=0;
        var boundingBox=null;


        switch (fixture.shape) {
            case 'box':

                var polygon=zerk.helper.getPolygonOfRectangle(
                    this._viewport.toPixel(fixture.width),
                    this._viewport.toPixel(fixture.height)
                );

                polygon=zerk.helper.rotatePolygon(polygon,body.angle+fixture.angle+layer.angle);

                boundingBox=zerk.helper.getBoundingBoxOfPolygon2(polygon);

                //width=boundingBox.width;
                //height=boundingBox.height;

                //console.log('2:'+width+'x'+height);

                break;

            case 'circle':

                boundingBox={
                    x: this._viewport.toPixel(-fixture.radius),
                    y: this._viewport.toPixel(-fixture.radius),
                    width: this._viewport.toPixel(fixture.radius)*2,
                    height: this._viewport.toPixel(fixture.radius)*2
                };

                break;
            case 'polygon':

                polygon=[];
                for (var c=0;c<fixture.vertices.length;c++) {
                    polygon.push([
                        this._viewport.toPixel(fixture.vertices[c][0]),
                        this._viewport.toPixel(fixture.vertices[c][1])
                    ])
                }

                polygon=zerk.helper.rotatePolygon(polygon,body.angle+fixture.angle+layer.angle);

                boundingBox=zerk.helper.getBoundingBoxOfPolygon2(polygon);

                //width=boundingBox.width;
                //height=boundingBox.height;

                break;
            default:
                zerk.error('Unknown shape "'+fixture.shape+'"');
                break;
        }

        var x=this._viewport.toPixel(fixture.x);
        var y=this._viewport.toPixel(fixture.y);
        /*
        var minX=(x-(width/2))*-1;
        var maxX=x+(width/2);
        var minY=(y-(height/2))*-1;
        var maxY=y+(height/2);
        */

        return {
            x: this._viewport.toPixel(position.x)+boundingBox.x,
            y: this._viewport.toPixel(position.y)+boundingBox.y,
            width: boundingBox.width,
            height: boundingBox.height
            //width: ((minX>maxX) ? minX : maxX),
            //height: ((minY>maxY) ? minY : maxY)
        };

    },

    _getBufferSizeLayerTextureStandalone: function(entity,layer) {

        // Add body position
        var position={
            x: layer.x,
            y: layer.y
        };

        var polygon=zerk.helper.getPolygonOfRectangle(
            this._viewport.toPixel(layer.width),
            this._viewport.toPixel(layer.height)
        );

        polygon=zerk.helper.rotatePolygon(polygon,layer.angle);

        var boundingBox=zerk.helper.getBoundingBoxOfPolygon2(polygon);

        return {
            x: this._viewport.toPixel(position.x)+boundingBox.x,
            y: this._viewport.toPixel(position.y)+boundingBox.y,
            width: boundingBox.width,
            height: boundingBox.height
            //width: ((minX>maxX) ? minX : maxX),
            //height: ((minY>maxY) ? minY : maxY)
        };

    },

    _getBufferSizeLayerSprite: function(entity,layer) {

        if (layer.body && layer.fixture) {
            return this._getBufferSizeLayerSpritePhysics(entity,layer);
        } else {
            return this._getBufferSizeLayerSpriteStandalone(entity,layer);
        }

    },

    _getBufferSizeLayerSpritePhysics: function(entity,layer) {

        var physics=entity.components.physics;
        var body=physics.bodies[layer.body];
        var fixture=physics.bodies[layer.body].fixtures[layer.fixture];

        // Rotate layer position
        var position=zerk.helper.rotatePosition(
            layer.x,
            layer.y,
            fixture.angle
        );

        // Rotate fixture position
        position=zerk.helper.rotatePosition(
            position.x+fixture.x,
            position.y+fixture.y,
            body.angle
        );

        // Add body position
        position={
            x: position.x+body.x,
            y: position.y+body.y
        };

        var spriteInfo=this._engine._spriteLoader.getSprite(
            layer.spritesheet,
            layer.sprite
        );

        var polygon=zerk.helper.getPolygonOfRectangle(spriteInfo.info.width,spriteInfo.info.height);

        polygon=zerk.helper.rotatePolygon(polygon,body.angle+fixture.angle+layer.angle);

        var boundingBox=zerk.helper.getBoundingBoxOfPolygon2(polygon);

        return {
            x: this._viewport.toPixel(position.x)+boundingBox.x,
            y: this._viewport.toPixel(position.y)+boundingBox.y,
            width: boundingBox.width,
            height: boundingBox.height
        };

    },

    _getBufferSizeLayerSpriteStandalone: function(entity,layer) {

        var image=this._engine._spriteLoader.getSprite(
            layer.spritesheet,
            layer.sprite
        );

        var position={
            x: layer.x,
            y: layer.y
        };

        var polygon=zerk.helper.getPolygonOfRectangle(
            image.info.width,
            image.info.height
        );

        polygon=zerk.helper.rotatePolygon(polygon,layer.angle);

        var boundingBox=zerk.helper.getBoundingBoxOfPolygon2(polygon);

        return {
            x: this._viewport.toPixel(position.x)+boundingBox.x,
            y: this._viewport.toPixel(position.y)+boundingBox.y,
            width: boundingBox.width,
            height: boundingBox.height
            //width: ((minX>maxX) ? minX : maxX),
            //height: ((minY>maxY) ? minY : maxY)
        };

    },


    /**
     * Calculate buffer size of a body
     *
     * @method __getBodyBufferSize
     * @param {config.entity} entity Entity state
     * @param {config.component.physics.body} body Body state
     * @return {Object} An object containing width and height
     * @protected
     **/
    _getBufferSizeBody: function(
        entity,
        physicsBody,
        renderBody
    ) {

        var me=this;
        var renderFixture=null;
        var physicsFixture=null;
        var pos=null;
        var x=null;
        var y=null;

        for (var i=0;i<renderBody._fixtureList.length;i++) {

            renderFixture=renderBody._fixtureList[i];
            physicsFixture=physicsBody.fixtures[renderFixture.key];

            pos=me._getBufferSizeFixture(
                entity,
                physicsBody,
                renderBody,
                physicsFixture,
                renderFixture
            );

            if (x==null || pos.x>x) {
                x=pos.x;
            }

            if (y==null || pos.y>y) {
                y=pos.y;
            }

        }

        return {
            width: x*2,
            height: y*2
        }

    },

    _getBufferSizeFixture: function(
        entity,
        physicsBody,
        renderBody,
        physicsFixture,
        renderFixture
    ) {

        var me=this;
        var renderItem=null;
        var pos=null;
        var x=null;
        var y=null;

        for (var i=0;i<renderFixture._renderList.length;i++) {

            renderItem=renderFixture._renderList[i];

            switch (renderItem.render) {
                case 'texture':

                    pos=me._getBufferSizeFixtureTexture(
                        entity,
                        physicsBody,
                        renderBody,
                        physicsFixture,
                        renderFixture,
                        renderItem
                    );

                    break;

                case 'sprite':

                    pos=me._getBufferSizeFixtureSprite(
                        entity,
                        physicsBody,
                        renderBody,
                        physicsFixture,
                        renderFixture,
                        renderItem
                    );

                    break;

                default:
                    zerk.error('Unknown render type "'+renderItem.render+'"');
                    break;

            }

            if (x==null || pos.x>x) {
                x=pos.x;
            }

            if (y==null || pos.y>y) {
                y=pos.y;
            }

        }

        return {
            x: x,
            y: y
        }

    },

    _getBufferSizeFixtureTexture: function(
        entity,
        physicsBody,
        renderBody,
        physicsFixture,
        renderFixture,
        texture
    ) {

        var me=this;

        var width=0;
        var height=0;

        switch (physicsFixture.shape) {
            case 'box':

                var polygon=zerk.helper.getPolygonOfRectangle(
                    me._viewport.toPixel(physicsFixture.width),
                    me._viewport.toPixel(physicsFixture.height)
                );

                if (physicsFixture.angle) {
                    polygon=zerk.helper.rotatePolygon(polygon,physicsFixture.angle);
                }

                var boundingBox=zerk.helper.getBoundingBoxOfPolygon(polygon);

                width=boundingBox.width;
                height=boundingBox.height;

                break;

            case 'circle':

                width=me._viewport.toPixel(physicsFixture.radius)*2;
                height=me._viewport.toPixel(physicsFixture.radius)*2;

                break;
            case 'polygon':

                polygon=[];
                for (c=0;c<physicsFixture.vertices.length;c++) {
                    polygon.push([
                        me._viewport.toPixel(physicsFixture.vertices[c][0]),
                        me._viewport.toPixel(physicsFixture.vertices[c][1])
                    ])
                }

                if (physicsFixture.angle) {
                    polygon=zerk.helper.rotatePolygon(polygon,physicsFixture.angle);
                }

                var boundingBox=zerk.helper.getBoundingBoxOfPolygon(polygon);

                width=boundingBox.width;
                height=boundingBox.height;

                break;
            default:
                zerk.error('Unknown shape "'+physicsFixture.shape+'"');
                break;
        }

        var x=me._viewport.toPixel(physicsFixture.x);
        var y=me._viewport.toPixel(physicsFixture.y);
        var minX=(x-(width/2))*-1;
        var maxX=x+(width/2);
        var minY=(y-(height/2))*-1;
        var maxY=y+(height/2);

        return {
            x: ((minX>maxX) ? minX : maxX),
            y: ((minY>maxY) ? minY : maxY)
        };

    },

    _getBufferSizeFixtureSprite: function(
        entity,
        physicsBody,
        renderBody,
        physicsFixture,
        renderFixture,
        sprite
    ) {

        var me=this;

        var width=0;
        var height=0;

        var spriteInfo=this._engine._spriteLoader.getSprite(
            sprite.spritesheet,
            sprite.sprite
        );

        if (physicsFixture.angle || sprite.angle) {

            var polygon=zerk.helper.getPolygonOfRectangle(spriteInfo.info.width,spriteInfo.info.height);

            if (physicsFixture.angle) {
                polygon=zerk.helper.rotatePolygon(polygon,physicsFixture.angle);
            }
            if (sprite.angle) {
                polygon=zerk.helper.rotatePolygon(polygon,sprite.angle);
            }

            var boundingBox=zerk.helper.getBoundingBoxOfPolygon(polygon);

            width=boundingBox.width;
            height=boundingBox.height;

        } else {

            width=spriteInfo.info.width;
            height=spriteInfo.info.height;

        }

        var x=me._viewport.toPixel(physicsFixture.x+sprite.x);
        var y=me._viewport.toPixel(physicsFixture.y+sprite.y);
        var minX=(x-(width/2))*-1;
        var maxX=x+(width/2);
        var minY=(y-(height/2))*-1;
        var maxY=y+(height/2);

        return {
            x: ((minX>maxX) ? minX : maxX),
            y: ((minY>maxY) ? minY : maxY)
        };

    },

    /**
     * Calculate buffer size of a fixture
     *
     * @method _getFixtureBufferSize
     * @param {config.entity} entity Entity state
     * @param {config.component.physics.body} body Body state
     * @param {config.component.physics.fixture} fixture Fixture state
     * @return {Object} An object containing width and height
     * @protected
     **/
    _getFixtureBufferSize: function(entity,body,fixture) {

        var me=this;

        /*
         TODO Remove method if unused
         */

        switch (fixture.type) {

            case 'box':

                /*
                 * TODO Remove the possibility of making relative sized rectangle fixtures
                 */
                var width=((typeof fixture.width=='string')
                    ? (body.width/100)*parseInt(fixture.width)
                    : fixture.width);

                var height=((typeof fixture.height=='string')
                    ? (body.height/100)*parseInt(fixture.height)
                    : fixture.height);

                /*
                 * TODO Check if ceil is really needed here
                 */
                var diagonal=//Math.ceil(
                    me._viewport.toPixel(
                        Math.sqrt(
                            Math.pow(width,2)
                            +Math.pow(height,2)
                        )
                    //)
                );

                return {
                    width: diagonal,
                    height: diagonal
                };

                break;

            case 'circle':

                var diagonal=//Math.ceil(
                    me._viewport.toPixel(fixture.radius*2);
                //);

                return {
                    width: diagonal,
                    height: diagonal
                };

                break;

            case 'polygon':

                var maxDistance=0;

                var center=zerk.helper.getCenterOfPolygon(fixture.vertices);

                for (var i=0;i<fixture.vertices.length;i++) {

                    var distance=zerk.helper.calculateDistance(
                        center.x,
                        center.y,
                        fixture.vertices[i][0],
                        fixture.vertices[i][1]
                    );

                    if (distance>maxDistance) {
                        maxDistance=distance;
                    }

                }

                var diagonal=me._viewport.toPixel(maxDistance*2);

                return {
                    width: diagonal,
                    height: diagonal
                };

                break;

        }

    }

});