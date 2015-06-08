/**
 * Wireframe System
 * 
 * Render the world as wireframes for debugging purposes.
 * 
 * @class wireframe
 * @namespace zerk.game.engine.system
 * @extends zerk.game.engine.system
 * @module zerk
 **/
zerk.define({
	
	name: 'zerk.game.engine.system.wireframe',
	extend: 'zerk.game.engine.system'
	
},{
	
	/**
	 * Name of the system
	 * 
	 * @property _name
	 * @type String
	 * @protected
	 **/
	_name: 'wireframe',
	
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
	_priority: 102,
	
	/**
	 * Viewport system instance
	 * 
	 * @property _viewport
	 * @type zerk.game.engine.system.viewport
	 * @protected
	 **/
	_viewport: null,
	
	/**
	 * Physics system instance
	 * 
	 * @property _physics
	 * @type zerk.game.engine.system.physics
	 * @protected
	 **/
	_physics: null,
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 * @param {zerk.game.engine} engine Game engine
	 * @param {Object} config System configuration
	 **/
	init: function(engine,config) {

        var me=this;

		zerk.parent('zerk.game.engine.system.wireframe').init.apply(
			me,
			arguments
		);

        me._showBodyAngleIndicator=me._config.showBodyAngleIndicator;
        me._showEntityOriginIndicator=me._config.showEntityOriginIndicator;
        me._showFixtureBoundingBox=me._config.showFixtureBoundingBox;
        me._showBodyOriginIndicator=me._config.showBodyOriginIndicator;
        me._showFixtureOriginIndicator=me._config.showFixtureOriginIndicator;

		this._viewport=this._getSystem('viewport');
		
		this._physics=this._getSystem('physics');
		
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
			showBodyAngleIndicator: true,
			showEntityOriginIndicator: false,
			showFixtureBoundingBox: true,
            showBodyOriginIndicator: false,
            showFixtureOriginIndicator: false,
			style: {
				bodyActive: {
					strokeColor: 'rgba(127,127,76,1)',
					fillColor: 'rgba(127,127,76,0.4)'
				},
				bodyStatic: {
					strokeColor: 'rgba(127,229,127,1)',
					fillColor: 'rgba(127,229,127,0.4)'
				},
				bodyKinematic: {
					strokeColor: 'rgba(127,127,229,1)',
					fillColor: 'rgba(127,127,229,0.4)'
				},
				bodyAwake: {
					strokeColor: 'rgba(153,153,153,1)',
					fillColor: 'rgba(153,153,153,0.4)'
				},
				bodyDefault: {
					strokeColor: 'rgba(229,178,178,1)',
					fillColor: 'rgba(229,178,178,0.4)'
				},
				fixtureSensor: {
					strokeColor: 'rgba(255,0,0,0.5)',
					fillColor: 'rgba(255,0,0,0.1)'
				}
			}
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
		
		return (name=='physics');
		
	},
	
	/**
	 * Starts the system
	 * 
	 * @method start
	 **/
	start: function() {
		
		zerk.parent('zerk.game.engine.system.wireframe').start.apply(
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
		
		zerk.parent('zerk.game.engine.system.wireframe').stop.apply(
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
		
		zerk.parent('zerk.game.engine.system.wireframe').update.apply(
			this,
			arguments
		);
		
		// Render all entities in the view area
		var entityStates=this._viewport.getEntitiesInViewport();
		
		for (var i=0;i<entityStates.length;i++) {
			
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

        var me=this;

		// Render all bodies of the entity
		
		var bodies=entity.components.physics._bodyList;
		
		for (var i=0;i<bodies.length;i++) {
			
			this._renderBody(entity,bodies[i]);
			
		}

		if (me._showEntityOriginIndicator) {

			this._renderEntityOriginIndicator(entity);
			
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

        var me=this;

		// Render all the fixtures of the body
		for (var i=0;i<body._fixtureList.length;i++) {

            me._renderFixture(entity,body,body._fixtureList[i]);

		}

		if (me._showBodyAngleIndicator && body.moveable) {

            me._renderBodyAngleIndicator(entity,body);

		}

        if (me._showBodyOriginIndicator) {
            me._renderBodyOriginIndicator(entity,body);
        }

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

        var me=this;

		if (me._showFixtureBoundingBox) {
			me._renderFixtureBoundingShape(entity,body,fixture);
		}

        if (me._showFixtureOriginIndicator) {
            me._renderFixtureOriginIndicator(entity,body,fixture);
        }

	},
	
	/**
	 * Renders a shape indicating the bounding area of a fixture
	 * 
	 * Delegate method for the fixture bounding shape methods
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
	 * Returns the style of a fixture bounding shape
	 * 
	 * @method _getFixtureBoundingStyle
	 * @param {config.entity} entity Entity state
	 * @param {config.component.physics.body} body Body state
	 * @param {config.component.physics.fixture} fixture Fixture state
	 * @return {Object} An object containing strokeColor, fillColor and 
	 * 	lineWidth
	 * @protected
	 **/
	_getFixtureBoundingStyle: function(entity,body,fixture) {
		
		var result={};
		
		var style='';
		
		if (fixture.isSensor) {
			
			style=this._config.style.fixtureSensor;
			
		} else if (!this._physics.isBodyActive(body)) {
			
			style=this._config.style.bodyActive;
			
		} else if (this._physics.isBodyStatic(body)) {
			
			style=this._config.style.bodyStatic;
			
		} else if (this._physics.isBodyKinematic(body)) {
			
			style=this._config.style.bodyKinematic;
			
		} else if (!this._physics.isBodyAwake(body)) {
			
			style=this._config.style.bodyAwake;
			
		} else {
			
			style=this._config.style.bodyDefault;
			
		}
		
		result.strokeColor=style.strokeColor;
		result.fillColor=style.fillColor;
		result.lineWidth=1;
		
		return result;
		
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
		
		var style=this._getFixtureBoundingStyle(entity,body,fixture);
		
		var position=entity.components.position;
		var bodyState=entity.components.physics.bodies[body.key];
		var fixtureState=bodyState.fixtures[fixture.key];
		
		if (!bodyState) return;
		if (!fixtureState) return;

		var fixtureWidth=fixture.width;
		var fixtureHeight=fixture.height;
		
		// Tranform rectangle into polygon

        var rectangleVertices=zerk.helper.getPolygonOfRectangle(fixtureWidth,fixtureHeight);

		var vertices=[];
		
		for (var i=0;i<rectangleVertices.length;i++) {

            // Rotate with fixture angle
            var rotatedVertice=zerk.helper.rotatePosition(
                rectangleVertices[i][0],
                rectangleVertices[i][1],
                fixtureState.angle
            );

            // Add fixture offset
            rotatedVertice.x+=+fixtureState.x;
            rotatedVertice.y+=fixtureState.y;

            // Rotate with body angle
			rotatedVertice=zerk.helper.rotatePosition(
                rotatedVertice.x,
                rotatedVertice.y,
				bodyState.angle
			);

			var x=this._viewport._getCanvasX(
				position.x
				+bodyState.x
				+rotatedVertice.x
			);
			var y=this._viewport._getCanvasY(
				position.y
				+bodyState.y
				+rotatedVertice.y
			);
			
			vertices.push([
				x,
				y
			]);
			
		}
		
		this._viewport.drawPolygon(
			'display',
			vertices,
			style.fillColor,
			style.strokeColor,
			style.lineWidth
		);
		
		/*
		this._viewport.drawLines(
			'display',
			[
				[vertices[0][0],vertices[0][1],vertices[2][0],vertices[2][1]],
				[vertices[1][0],vertices[1][1],vertices[3][0],vertices[3][1]]
			],
			style.color,
			style.lineWidth
		);
		*/
		
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

        var me=this;

		var style=me._getFixtureBoundingStyle(entity,body,fixture);
		
		var position=entity.components.position;
		var bodyState=entity.components.physics.bodies[body.key];
		var fixtureState=bodyState.fixtures[fixture.key];
		
		if (!bodyState) return;
		if (!fixtureState) return;

        var fixturePosition={
            x: fixtureState.x,
            y: fixtureState.y
        };

        // Rotate with body angle
        fixturePosition=zerk.helper.rotatePosition(
            fixturePosition.x,
            fixturePosition.y,
            bodyState.angle
        );

		var x=me._viewport._getCanvasX(
			position.x
			+bodyState.x
			+fixturePosition.x
		);
		var y=me._viewport._getCanvasY(
			position.y
			+bodyState.y
			+fixturePosition.y
		);

        me._viewport.drawArc(
			'display',
			x,
			y,
            me._viewport.toZoom(me._viewport.toPixel(fixture.radius)),
			0,
			Math.PI*2,
			true,
			style.fillColor,
			style.strokeColor,
			style.lineWidth
		);

		var rotatedAngleIndicator=zerk.helper.rotatePosition(
			fixtureState.x,
			fixtureState.y-fixtureState.radius,
			bodyState.angle
		);
		
		var angleIndicatorX=me._viewport._getCanvasX(
			position.x
			+bodyState.x
			+rotatedAngleIndicator.x
		);
		var angleIndicatorY=me._viewport._getCanvasY(
			position.y
			+bodyState.y
			+rotatedAngleIndicator.y
		);

        me._viewport.drawLines(
			'display',
			[[angleIndicatorX,angleIndicatorY,x,y]],
			style.strokeColor,
			style.lineWidth
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
		
		var style=this._getFixtureBoundingStyle(entity,body,fixture);
		
		var position=entity.components.position;
		var bodyState=entity.components.physics.bodies[body.key];
		var fixtureState=bodyState.fixtures[fixture.key];
		
		if (!bodyState) return;
		if (!fixtureState) return;
		
		var vertices=[];
		
		for (var i=0;i<fixture.vertices.length;i++) {

			var rotatedVertice=zerk.helper.rotatePosition(
                fixture.vertices[i][0],
                fixture.vertices[i][1],
                fixture.angle
			);

            rotatedVertice=zerk.helper.rotatePosition(
                fixture.x+rotatedVertice.x,
                fixture.y+rotatedVertice.y,
                bodyState.angle
            );

			var x=this._viewport._getCanvasX(
				position.x
				+bodyState.x
				+rotatedVertice.x
			);
			var y=this._viewport._getCanvasY(
				position.y
				+bodyState.y
				+rotatedVertice.y
			);
			
			vertices.push([
				x,
				y
			]);
			
		}
		
		this._viewport.drawPolygon(
			'display',
			vertices,
			style.fillColor,
			style.strokeColor,
			style.lineWidth
		);
		
	},
	
	/**
	 * Renders an angle indicator for each body of the entity
	 * 
	 * @method _renderBodyAngleIndicator
	 * @param {config.entity} entity Entity state
	 * @param {config.component.physics.body} body Body state
	 * @protected
	 **/
	_renderBodyAngleIndicator: function(entity,body,fixture) {
		
		var position=entity.components.position;
		var bodyState=entity.components.physics.bodies[body.key];
		
		var x=position.x+bodyState.x;
		var y=position.y+bodyState.y;
		
		var size=0.35;
		
		var positions=[
			{
				x: -size,
				y: 0
			},
			{
				x: 0,
				y: 0
			},
			{
				x: 0,
				y: -size
			},
			{
				x: 0,
				y: 0
			}
		];
		
		for (i=0;i<positions.length;i++) {
			
			positions[i]=zerk.helper.rotatePosition(
				positions[i].x,
				positions[i].y,
				bodyState.angle
			);
			
		}
		
		this._viewport.drawLines(
			'display',
			[
				[
					this._viewport._getCanvasX(x+positions[0].x),
					this._viewport._getCanvasY(y+positions[0].y),
					this._viewport._getCanvasX(x+positions[1].x),
					this._viewport._getCanvasY(y+positions[1].y)
				]
			],
			'rgb(255,0,0)'
		);
		
		this._viewport.drawLines(
			'display',
			[
				[
					this._viewport._getCanvasX(x+positions[2].x),
					this._viewport._getCanvasY(y+positions[2].y),
					this._viewport._getCanvasX(x+positions[3].x),
					this._viewport._getCanvasY(y+positions[3].y)
				]
			],
			'rgb(0,255,0)'
		);
		
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
	 * @param {config.entity} entity Entity state
	 * @protected
	 **/
	_renderEntityOriginIndicator: function(entity) {

        var me=this;

		var position=entity.components.position;

        var size=0.2;

		this._viewport.drawLines(
			'display',
			[
				[
                    me._viewport._getCanvasX(position.x)-me._viewport.toPixel(size),
                    me._viewport._getCanvasY(position.y),
                    me._viewport._getCanvasX(position.x)+me._viewport.toPixel(size),
                    me._viewport._getCanvasY(position.y)
				],
				[
                    me._viewport._getCanvasX(position.x),
                    me._viewport._getCanvasY(position.y)-me._viewport.toPixel(size),
                    me._viewport._getCanvasX(position.x),
                    me._viewport._getCanvasY(position.y)+me._viewport.toPixel(size)
				]
			],
			'rgb(255,0,0)'
		);
		
	},

    _renderBodyOriginIndicator: function(entity,body) {

        var me=this;

        var position=entity.components.position;

        var size=0.2;

        var bodyPosition={
            x: position.x+body.x,
            y: position.y+body.y
        };

        this._viewport.drawLines(
            'display',
            [
                [
                    me._viewport._getCanvasX(bodyPosition.x)-me._viewport.toPixel(size),
                    me._viewport._getCanvasY(bodyPosition.y),
                    me._viewport._getCanvasX(bodyPosition.x)+me._viewport.toPixel(size),
                    me._viewport._getCanvasY(bodyPosition.y)
                ],
                [
                    me._viewport._getCanvasX(bodyPosition.x),
                    me._viewport._getCanvasY(bodyPosition.y)-me._viewport.toPixel(size),
                    me._viewport._getCanvasX(bodyPosition.x),
                    me._viewport._getCanvasY(bodyPosition.y)+me._viewport.toPixel(size)
                ]
            ],
            'rgb(0,0,255)'
        );

    },

    _renderFixtureOriginIndicator: function(entity,body,fixture) {

        var me=this;

        var position=entity.components.position;

        var size=0.2;

        var fixturePosition={
            x: position.x+body.x,
            y: position.y+body.y
        };

        /*
        // Rotate with body angle
        fixturePosition=zerk.helper.rotatePosition(
            fixturePosition.x,
            fixturePosition.y,
            body.angle
        );
        */

        fixturePosition.x+=fixture.x;
        fixturePosition.y+=fixture.y;

        this._viewport.drawLines(
            'display',
            [
                [
                    me._viewport._getCanvasX(fixturePosition.x)-me._viewport.toPixel(size),
                    me._viewport._getCanvasY(fixturePosition.y),
                    me._viewport._getCanvasX(fixturePosition.x)+me._viewport.toPixel(size),
                    me._viewport._getCanvasY(fixturePosition.y)
                ],
                [
                    me._viewport._getCanvasX(fixturePosition.x),
                    me._viewport._getCanvasY(fixturePosition.y)-me._viewport.toPixel(size),
                    me._viewport._getCanvasX(fixturePosition.x),
                    me._viewport._getCanvasY(fixturePosition.y)+me._viewport.toPixel(size)
                ]
            ],
            'rgb(0,255,0)'
        );

    }
	
});