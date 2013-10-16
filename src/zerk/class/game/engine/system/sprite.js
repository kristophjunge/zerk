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
		
		// Render all bodies of the entity
		
		var bodies=entity.components.physics._bodyList;
		
		for (var i=0;i<bodies.length;i++) {
			
			this._renderBody(entity,bodies[i]);
			
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
	_getBodyBufferSize: function(entity,body) {
		
		// Check for primitive body
		if (zerk.objectCount(entity.bodies)>1) {
			
			// Use static configuration, we currently dont calculate that
			
			var sprite=entity.components.sprite;
			
			return {
				width: sprite.combinedWidth,
				height: sprite.combinedHeight
			};
			
		} else {
			
			// Get first fixture
			
			var fixture;
			
			for (var key in body.fixtures) {
				
				/*
				 * TODO Replace this with index access [0]
				 */
				fixture=body.fixtures[key];
				break;
				
			}
			
			return this._getFixtureBufferSize(entity,body,fixture);
		
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
		
		switch (fixture.shape) {
			
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
				
				
				if (true) { // Rotateable
					
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
					
				} else {
					
					return {
						width: width,
						height: height
					};
					
				}
				
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
				
				if (true) { // Rotateable
					
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
					
				} else {
					
					/*
					 * TODO Implement code for non rotatable polygons
					 */
					
				}
				
				break;
				
		}
		
	},
	
	/**
	 * Renders a body onto the game canvas
	 * 
	 * @method _renderBody
	 * @param {config.entity} entity Entity state
	 * @param {config.component.physics.body} body Body state
	 * @protected
	 **/
	_renderBody: function(entity,body) {
		
		var bodyState=entity.components.physics.bodies[body.key];
		var position=entity.components.position;
		
		var bufferSize=this._getBodyBufferSize(entity,bodyState);
		
		this._viewport.bufferInit(
			'body',
			bufferSize.width,
			bufferSize.height,
			bufferSize.width/2,
			bufferSize.height/2,
			bodyState.angle
		);
		
		// Render all the fixtures of the body
		for (var i=0;i<body._fixtureList.length;i++) {
			
			this._renderFixture(entity,body,body._fixtureList[i]);
			
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
	 * Renders a fixture onto the body buffer canvas
	 * 
	 * @method _renderFixture
	 * @param {config.entity} entity Entity state
	 * @param {config.component.physics.body} body Body state
	 * @param {config.component.physics.fixture} fixture Fixture state
	 * @protected
	 **/
	_renderFixture: function(entity,body,fixture) {
		
		if (fixture.isSensor) return;
		
		var bufferSize=this._getFixtureBufferSize(entity,body,fixture);
		
		this._viewport.bufferInit(
			'fixture',
			bufferSize.width,
			bufferSize.height,
			bufferSize.width/2,
			bufferSize.height/2,
			fixture.angle
		);
		
		// Render all sprites of the fixture
		
		for (var i=0;i<fixture.sprites.length;i++) {
			
			this._renderSprite(entity,body,fixture,fixture.sprites[i]);
			
		}
		
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
	
	/**
	 * Renders a shape indicating the bounding area of a fixture
	 * 
	 * Delegate method for the fixture bounding shape methods.
	 * 
	 * @method _renderFixtureBoundingShape
	 * @param {config.entity} entity Entity state
	 * @param {config.component.physics.body} body Body state
	 * @param {config.component.physics.fixture} fixture Fixture state
	 * @protected
	 **/
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
	 * @param {config.entity} entity Entity state
	 * @param {config.component.physics.body} body Body state
	 * @param {config.component.physics.fixture} fixture Fixture state
	 * @protected
	 **/
	_renderFixtureBoundingBox: function(entity,body,fixture) {
		
		var width=((typeof fixture.width=='string') 
			? (body.width/100)*parseInt(fixture.width)
			: fixture.width);
		
		var height=((typeof fixture.height=='string') 
			? (body.height/100)*parseInt(fixture.height)
			: fixture.height);
			
		if (fixture.isSensor) {
			
			var style='rgb(255,0,0)';
			
		} else {
			
			var style='rgb(0,255,0)';
			
		}
		
		this._viewport.fillRect(
			'fixture',
			zerk.helper.fromMeter(-(width/2)),
			zerk.helper.fromMeter(-(height/2)),
			zerk.helper.fromMeter(width),
			zerk.helper.fromMeter(height),
			null
		);
		
	},
	
	/**
	 * Renders the bounding area for a circle shaped fixture
	 * 
	 * @method _renderFixtureBoundingCircle
	 * @param {config.entity} entity Entity state
	 * @param {config.component.physics.body} body Body state
	 * @param {config.component.physics.fixture} fixture Fixture state
	 * @protected
	 **/
	_renderFixtureBoundingCircle: function(entity,body,fixture) {
		
		this._viewport.fillArc(
			'body',
			0,
			0,
			zerk.helper.fromMeter(fixture.radius),
			0,
			Math.PI*2,
			true,
			null
		);
		
	},
	
	/**
	 * Renders the bounding area for a polygon shaped fixture
	 * 
	 * @method _renderFixtureBoundingPolygon
	 * @param {config.entity} entity Entity state
	 * @param {config.component.physics.body} body Body state
	 * @param {config.component.physics.fixture} fixture Fixture state
	 * @protected
	 **/
	_renderFixtureBoundingPolygon: function(entity,body,fixture) {
		
		var vertices=[];
		
		for (var i=0;i<fixture.vertices.length;i++) {
			
			vertices.push([
				zerk.helper.fromMeter(fixture.vertices[i][0]),
				zerk.helper.fromMeter(fixture.vertices[i][1])
			]);
			
		}
		
		this._viewport.fillPolygon(
			'fixture',
			vertices,
			null
		);
		
	},
	
	/**
	 * Render sprite
	 * 
	 * @method _renderSprite
	 * @param {config.entity} entity Entity state
	 * @param {config.component.physics.body} body Body state
	 * @param {config.component.physics.fixture} fixture Fixture state
	 * @param {config.component.sprite} sprite
	 * @protected
	 **/
	_renderSprite: function(
		entity,
		body,
		fixture,
		sprite
	) {
		
		/*
		 * TODO Create code for fixture oriented sprite rendering
		 */
		
	}
	
});