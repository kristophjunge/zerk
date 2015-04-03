/**
 * Sprite Systems
 * 
 * Renders sprites.
 * 
 * @class sprite
 * @namespace zerk.game.engine.system
 * @extends zerk.game.engine.system
 * @module zerk
 **/
zerk.define({
	
	name: 'zerk.game.engine.system.sprite',
	extend: 'zerk.game.engine.system'
	
},{
	
	/**
	 * Name of the system
	 * 
	 * @property _name
	 * @type String
	 * @protected
	 */
	_name: 'sprite',
	
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
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 * @param {zerk.game.engine} engine Game engine
	 * @param {Object} config System configuration
	 **/
	init: function(engine,config) {
		
		zerk.parent('zerk.game.engine.system.sprite').init.apply(
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
		
		return (name=='sprite');
		
	},
	
	/**
	 * Starts the system
	 * 
	 * @method start
	 **/
	start: function() {
		
		zerk.parent('zerk.game.engine.system.sprite').start.apply(
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
		
		zerk.parent('zerk.game.engine.system.sprite').stop.apply(
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
		
		zerk.parent('zerk.game.engine.system.sprite').addEntity.apply(
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
		
		zerk.parent('zerk.game.engine.system.sprite').update.apply(
			this,
			arguments
		);
		
		// Render all entities in the view area
		var entityStates=this._viewport.getEntitiesInViewport();
		
		for (var i=0;i<entityStates.length;i++) {
			
			// Check if this entity has the sprite component
			if (typeof entityStates[i].components.sprite=='undefined') {
				
				continue;
				
			}
			
			if (!entityStates[i].components.sprite.visible) continue;
			
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

		// Render all bodies of the entity
		var bodies=entity.components.sprite._bodyList;
		
		for (var i=0;i<bodies.length;i++) {
			var physicsBody=entity.components.physics.bodies[bodies[i].key];
			this._renderBody(entity,physicsBody,bodies[i]);
		}

	},

	/**
	 * Renders a body onto the game canvas
	 *
	 * @protected
	 **/
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
			this._viewport.toScaleX(bufferSize.width),
			this._viewport.toScaleY(bufferSize.height),
            bodyState.angle
		);
		
	},

    /**
     * Renders a fixture onto the game canvas
     *
     * @protected
     **/
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
	
	/**
	 * Render sprite
	 * 
	 * @method _renderSprite
	 * @param {config.entity} entity Entity state
	 * @param {config.component.physics.fixture} fixture Fixture state
	 * @param {config.component.sprite} sprite
	 * @protected
	 **/
	_renderSprite: function(
		entity,
        physicsBody,
        renderBody,
        physicsFixture,
        renderFixture,
		sprite
	) {

		var image=this._engine._spriteLoader.getSprite(
            sprite.spritesheet,
            sprite.sprite
        );

		this._viewport.drawImage(
			'body',
            image.image,
            zerk.helper.fromMeter(physicsFixture.x+sprite.x),
            zerk.helper.fromMeter(physicsFixture.y+sprite.y),
            image.info.width,
            image.info.height,
            image.info.offsetX,
            image.info.offsetY,
            image.info.width,
            image.info.height,
            physicsFixture.angle+sprite.angle
		);
		
	},

    _renderTexture: function(
        entity,
        physicsBody,
        renderBody,
        physicsFixture,
        renderFixture,
        texture
    ) {

        var image=this._engine._textureLoader.getTexture(
            texture.texture
        );

        switch (physicsFixture.shape) {

            case 'box':
                this._viewport.fillRect(
                    'body',
                    zerk.helper.fromMeter(physicsFixture.x),
                    zerk.helper.fromMeter(physicsFixture.y),
                    zerk.helper.fromMeter(physicsFixture.width),
                    zerk.helper.fromMeter(physicsFixture.height),
                    physicsFixture.angle,
                    image,
                    zerk.helper.fromMeter(texture.x),
                    zerk.helper.fromMeter(texture.y),
                    texture.angle
                );
                break;

            case 'circle':

                this._viewport.fillArc(
                    'body',
                    zerk.helper.fromMeter(physicsFixture.x),
                    zerk.helper.fromMeter(physicsFixture.y),
                    zerk.helper.fromMeter(physicsFixture.radius),
                    0,
                    2*Math.PI,
                    false,
                    image,
                    zerk.helper.fromMeter(texture.x),
                    zerk.helper.fromMeter(texture.y),
                    texture.angle
                );

                break;

            case 'polygon':

                var polygon=[];
                for (var i=0;i<physicsFixture.vertices.length;i++) {
                    polygon.push([
                        zerk.helper.fromMeter(physicsFixture.vertices[i][0]),
                        zerk.helper.fromMeter(physicsFixture.vertices[i][1])
                    ]);
                }

                this._viewport.fillPolygon(
                    'body',
                    zerk.helper.fromMeter(physicsFixture.x),
                    zerk.helper.fromMeter(physicsFixture.y),
                    polygon,
                    physicsFixture.angle,
                    image,
                    zerk.helper.fromMeter(texture.x),
                    zerk.helper.fromMeter(texture.y),
                    texture.angle
                );

                break;
            default:
                zerk.error('Unknown shape "'+physicsFixture.shape+'"');
                break;

        }

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

        var width=0;
        var height=0;

        switch (physicsFixture.shape) {
            case 'box':

                var polygon=zerk.helper.getPolygonOfRectangle(
                    zerk.helper.fromMeter(physicsFixture.width),
                    zerk.helper.fromMeter(physicsFixture.height)
                );

                if (physicsFixture.angle) {
                    polygon=zerk.helper.rotatePolygon(polygon,physicsFixture.angle);
                }

                var boundingBox=zerk.helper.getBoundingBoxOfPolygon(polygon);

                width=boundingBox.width;
                height=boundingBox.height;

                break;

            case 'circle':

                width=zerk.helper.fromMeter(physicsFixture.radius)*2;
                height=zerk.helper.fromMeter(physicsFixture.radius)*2;

                break;
            case 'polygon':

                polygon=[];
                for (c=0;c<physicsFixture.vertices.length;c++) {
                    polygon.push([
                        zerk.helper.fromMeter(physicsFixture.vertices[c][0]),
                        zerk.helper.fromMeter(physicsFixture.vertices[c][1])
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

        var x=zerk.helper.fromMeter(physicsFixture.x);
        var y=zerk.helper.fromMeter(physicsFixture.y);
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

        var x=zerk.helper.fromMeter(physicsFixture.x+sprite.x);
        var y=zerk.helper.fromMeter(physicsFixture.y+sprite.y);
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
                var diagonal=Math.ceil(
                    zerk.helper.fromMeter(
                        Math.sqrt(
                            Math.pow(width,2)
                            +Math.pow(height,2)
                        )
                    )
                );

                return {
                    width: diagonal,
                    height: diagonal
                };

                break;

            case 'circle':

                var diagonal=Math.ceil(
                    zerk.helper.fromMeter(fixture.radius*2)
                );

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

                var diagonal=zerk.helper.fromMeter(maxDistance*2);

                return {
                    width: diagonal,
                    height: diagonal
                };

                break;

        }

    }

});