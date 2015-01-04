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
		
		/*
		var componentSprite=entity.components.sprite;
		
		if (componentSprite.width==0) {
			
			zerk.error({
				message: 'Sprite property "width" cannot be zero.'
					+'Setup sprite with in entity configuration.',
				source: this,
				entity: entity.name
			})
			
		}
		
		if (componentSprite.height==0) {
			
			zerk.error({
				message: 'Sprite property "height" cannot be zero.'
					+'Setup sprite height in entity configuration.',
				source: this,
				entity: entity.name
			})
			
		}
		*/
		
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
		
		//console.log(entity);
		//return;
		
		// Render all sprites of the entity
		/*
		var render=entity.components.sprite._renderList;
		
		for (var i=0;i<render.length;i++) {
			
			switch (render[i].type) {
				case 'texture':
					//this._renderTexture(entity,render[i]);
					break;
				case 'sprite':
					this._renderSprite(entity,render[i]);
					break;
			}
			
			//this._renderBody(entity,sprites[i]);
			
		}
		*/
		
		
		// Render all bodies of the entity
		
		var bodies=entity.components.sprite._bodyList;
		
		for (var i=0;i<bodies.length;i++) {
			
			var physicsBody=entity.components.physics.bodies[bodies[i].key];
			
			this._renderBody(entity,physicsBody,bodies[i]);
			
		}
		
	},

	/*
	_renderTexture: function(entity,texture) {

		console.log('render texture');

		var body=entity.components.physics.bodies[texture.body];
		var fixture=body.fixtures[texture.fixture];

		var bufferSize=this._getFixtureBufferSize(entity,body,fixture);

		this._viewport.bufferInit(
			'fixture',
			bufferSize.width,
			bufferSize.height,
			bufferSize.width/2,
			bufferSize.height/2,
			fixture.angle
		);

		this._renderFixtureBoundingShape(entity,body,fixture);

		this._viewport.bufferFlush(
			'fixture',
			'body',
			zerk.helper.fromMeter(fixture.x)-(bufferSize.width/2),
			zerk.helper.fromMeter(fixture.y)-(bufferSize.height/2),
			bufferSize.width,
			bufferSize.height
		);

	},
	*/

	/**
	 * Renders a body onto the game canvas
	 * 
	 * @method _renderBody
	 * @param {config.entity} entity Entity state
	 * @param {config.component.physics.body} body Body state
	 * @protected
	 **/
	_renderBody: function(entity,body,render) {
		
		var bodyState=entity.components.physics.bodies[body.key];
		var position=entity.components.position;
		
		var bufferSize=this._getBodyBufferSize(entity,bodyState,render);

        //console.log('BS',bufferSize);

		this._viewport.bufferInit(
			'body',
			bufferSize.width,
			bufferSize.height,
			bufferSize.width/2,
			bufferSize.height/2,
			bodyState.angle
		);

		for (var i=0;i<render._renderList.length;i++) {
			this._renderSprite(entity,body,render._renderList[i]);
		}

		// Draw the buffer onto the display
		this._viewport.bufferFlush(
			'body',
			'display',
			this._viewport._getCanvasX(position.x+bodyState.x,-(bufferSize.width/2)),
			this._viewport._getCanvasY(position.y+bodyState.y,-(bufferSize.height/2)),
			this._viewport.toScaleX(bufferSize.width),
			this._viewport.toScaleY(bufferSize.height)
		);
		
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
        body,
		sprite
	) {

		var spriteInfo=this._engine._spriteLoader.getSprite(sprite.sheet,sprite.key);

		var image=document.getElementById('sprite');

		this._viewport.drawImage(
			'body',
			image,
            zerk.helper.fromMeter(sprite.x)-(spriteInfo.width/2),
            zerk.helper.fromMeter(sprite.y)-(spriteInfo.height/2),
			spriteInfo.width,
			spriteInfo.height,
			spriteInfo.offsetX,
			spriteInfo.offsetY,
			spriteInfo.width,
			spriteInfo.height,
            sprite.angle
		);
		
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
    _getBodyBufferSize: function(entity,body,render) {

        /*
        TODO Create the closest buffer possible
         */

        var min=null;
        var max=null;
        var fixtureMinX=0;
        var fixtureMaxX=0;
        var fixtureMinY=0;
        var fixtureMaxY=0;

        for (var i=0;i<render._renderList.length;i++) {

            var sprite=render._renderList[i];

            var spriteInfo=this._engine._spriteLoader.getSprite(sprite.sheet,sprite.key);

            fixtureMinX=zerk.helper.fromMeter(sprite.x)-(spriteInfo.width/2);
            fixtureMaxX=zerk.helper.fromMeter(sprite.x)+(spriteInfo.width/2);

            if (min==null || fixtureMinX<min) {
                min=fixtureMinX;
            }
            if (max==null || fixtureMaxX>max) {
                max=fixtureMaxX;
            }

            fixtureMinY=zerk.helper.fromMeter(sprite.y)-(spriteInfo.height/2);
            fixtureMaxY=zerk.helper.fromMeter(sprite.y)+(spriteInfo.height/2);

            if (min==null || fixtureMinY<min) {
                min=fixtureMinY;
            }
            if (max==null || fixtureMaxY>max) {
                max=fixtureMaxY;
            }

        }

        var size=Math.ceil(
            Math.sqrt(
                Math.pow(((min*-1>max) ? min*-1 : max)*2,2)*2
            )
        );

        return {
            width: size,
            height: size
        }

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
                        //0,
                        //0,
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