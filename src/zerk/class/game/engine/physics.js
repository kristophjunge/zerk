/**
 * Physics engine interface
 * 
 * Box2dWeb implementation.
 * 
 * @class zerk.game.engine.physics
 * @extends zerk.observable
 * @module zerk
 */
/*
 * TODO Give the Box2dWeb related properties their real types 
 */
zerk.define({
	
	name: 'zerk.game.engine.physics',
	extend: 'zerk.observable',
	require: [
		'zerk.game.engine.physics.body',
		'zerk.game.engine.physics.fixture.circle',
		'zerk.game.engine.physics.fixture.polygon',
		'zerk.game.engine.physics.fixture.rectangle',
		'zerk.game.engine.physics.joint.distance',
		'zerk.game.engine.physics.joint.revolute'
	]
	
},{
	
	/**
	 * Physics configuration
	 * 
	 * @property _config
	 * @type Object 
	 * @protected
	 */
	_config: null,
	
	/**
	 * Game engine
	 * 
	 * @property _engine
	 * @type zerk.game.engine
	 * @protected
	 */
	_engine: null,
	
	/**
	 * Box2D world
	 * 
	 * @property _world
	 * @type Box2D.Dynamics.b2World
	 * @protected
	 */
	_world: null,
	
	/**
	 * Handle for the mouse joint
	 * 
	 * @property _mouseJoint
	 * @type Object
	 * @protected
	 */
	_mouseJoint: null,
	
	/**
	 * Stores a vector for the mouse joint function
	 * 
	 * @property _mouseJointVec
	 * @type Object
	 * @protected
	 */
	_mouseJointVec: null,
	
	/**
	 * Stores the last selected body
	 * 
	 * @property _selectedBody
	 * @type Object
	 * @protected
	 */
	_selectedBody: null,
	
	/**
	 * List of bodies to be destroyed after current simulation tick
	 * 
	 * @property _destroyBodyList
	 * @type Array
	 * @protected
	 */
	_destroyBodyList: null,
	
	/**
	 * List of joints to be destroyed after current simulation tick
	 * 
	 * @property __destroyJointList
	 * @type Array
	 * @protected
	 */
	_destroyJointList: null,
	
	/**
	 * Shortcut for Box2D.Common.Math.b2Vec2
	 * 
	 * @property _b2Vec2
	 * @type Object
	 * @protected
	 */
	_b2Vec2: Box2D.Common.Math.b2Vec2,
	
	/**
	 * Shortcut for Box2D.Collision.b2AABB
	 * 
	 * @property _b2AABB
	 * @type Object
	 * @protected
	 */
	_b2AABB: Box2D.Collision.b2AABB,
	
	/**
	 * Shortcut for Box2D.Dynamics.b2BodyDef
	 * 
	 * @property _b2BodyDef
	 * @type Object
	 * @protected
	 */
	_b2BodyDef: Box2D.Dynamics.b2BodyDef,
	
	/**
	 * Shortcut for Box2D.Dynamics.b2Body
	 * 
	 * @property _b2Body
	 * @type Object
	 * @protected
	 */
	_b2Body: Box2D.Dynamics.b2Body,
	
	/**
	 * Shortcut for Box2D.Dynamics.b2FixtureDef
	 * 
	 * @property _b2FixtureDef
	 * @type Object
	 * @protected
	 */
	_b2FixtureDef: Box2D.Dynamics.b2FixtureDef,
	
	/**
	 * Shortcut for Box2D.Dynamics.b2World
	 * 
	 * @property _b2World
	 * @type Object
	 * @protected
	 */
	_b2World: Box2D.Dynamics.b2World,
	
	/**
	 * Shortcut for Box2D.Collision.Shapes.b2PolygonShape
	 * 
	 * @property _b2PolygonShape
	 * @type Object
	 * @protected
	 */
	_b2PolygonShape: Box2D.Collision.Shapes.b2PolygonShape,
	
	/**
	 * Shortcut for Box2D.Collision.Shapes.b2CircleShape
	 * 
	 * @property _b2CircleShape
	 * @type Object
	 * @protected
	 */
	_b2CircleShape: Box2D.Collision.Shapes.b2CircleShape,
	
	/**
	 * Shortcut for Box2D.Dynamics.b2DebugDraw
	 * 
	 * @property _b2DebugDraw
	 * @type Object
	 * @protected
	 */
	_b2DebugDraw: Box2D.Dynamics.b2DebugDraw,
	
	/**
	 * Shortcut for Box2D.Dynamics.Joints.b2MouseJointDef
	 * 
	 * @property _b2MouseJointDef
	 * @type Object
	 * @protected
	 */
	_b2MouseJointDef: Box2D.Dynamics.Joints.b2MouseJointDef,
	
	/**
	 * Shortcut for Box2D.Dynamics.Joints.b2RevoluteJointDef
	 * 
	 * @property _b2RevoluteJointDef
	 * @type Object
	 * @protected
	 */
	_b2RevoluteJointDef: Box2D.Dynamics.Joints.b2RevoluteJointDef,
	
	/**
	 * Shortcut for Box2D.Dynamics.Joints.b2DistanceJointDef
	 * 
	 * @property _b2DistanceJointDef
	 * @type Object
	 * @protected
	 */
	_b2DistanceJointDef: Box2D.Dynamics.Joints.b2DistanceJointDef,
	
	/**
	 * Shortcut for Box2D.Dynamics.b2ContactListener
	 * 
	 * @property _b2ContactListener
	 * @type Object
	 * @protected
	 */
	_b2ContactListener: Box2D.Dynamics.b2ContactListener,
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 * @param {zerk.game.engine} engine Game engine
	 */
	init: function(engine) {
		
		zerk.parent('zerk.game.engine.physics').init.apply(
			this,
			arguments
		);
		
		this._engine=engine;
		
		this._destroyBodyList=[];
			
		this._destroyJointList=[];
		
		// Set default config values
		this._config={
			gravityX: 0,
			gravityY: 30,
			debugDraw: false
		};
		
		// Get a handle in the registry
		this._config=this._engine.registry.register(
			'physics',
			this._config
		);
		
		this._world=new this._b2World(
			new this._b2Vec2(
				this._config.gravityX,
				this._config.gravityY
			), // Setup gravity
			true // allow sleep
		);
		
		// Box2D debug draw
		
		if (this._config.debugDraw) {
			
			this.canvas=this._engine.dom.getCanvasPhysicsDebug();
			
			/*
			 * TODO Sync the view position with the game viewport
			 * 
			 * this.canvas.getContext("2d").translate(200,200);
			 */
			
			var debugDraw = new this._b2DebugDraw();
			debugDraw.SetSprite(this.canvas.getContext("2d"));
			debugDraw.SetDrawScale(30.0);
			debugDraw.SetFillAlpha(0.5);
			debugDraw.SetLineThickness(1.0);
			debugDraw.SetFlags(
				this._b2DebugDraw.e_shapeBit | this._b2DebugDraw.e_jointBit
			);
			
			this._world.SetDebugDraw(debugDraw);
			
		}
		
		this._addContactListener();
		
		this._log('Init');
		
	},
	
	/**
	 * Physics engine tick
	 * 
	 * @method tick
	 */
	tick: function() {
		
		this._processMouseJoint();
		
		/*
		 * TODO Make world step settings configurable
		 */
		
		// World step 
		this._world.Step(
			1/60, // Frame rate
			10, // Velocity iterations
			10 // Position iterations
		);
		
		if (this._config.debugDraw) {
			this._world.DrawDebugData();
		}
		
		this._world.ClearForces();
		
		this._cleanup();
		
	},
	
	/**
	 * Destroy bodies and joints schedules to be removed from the world
	 * 
	 * @method _cleanup
	 * @protected
	 */
	_cleanup: function() {
		
		for (var i=0;i<this._destroyJointList.length;i++) {
			
			this._destroyJoint(this._destroyJointList[i]);
			this._destroyJointList[i]=null;
			
		}
		
		this._destroyJointList=[];
		
		for (var i=0;i<this._destroyBodyList.length;i++) {
			
			this._destroyBody(this._destroyBodyList[i]);
			this._destroyBody[i]=null;
			
		}
		
		this._destroyBodyList=[];
		
	},
	
	/**
	 * Schedules a body to be destroyed after current simulation tick
	 * 
	 * @method scheduleDestroyBody
	 * @param {zerk.game.engine.entity} entity
	 * @param {zerk.game.engine.physics.body} body
	 */
	scheduleDestroyBody: function(entity,body) {
		
		this._destroyBodyList.push(body.physicsHandle);
		
	},
	
	/**
	 * Schedules a join to be destroyed after current simulation tick
	 * 
	 * @method scheduleDestroyJoint
	 * @param {zerk.game.engine.entity} entity
	 * @param {zerk.game.engine.physics.join} body
	 */
	scheduleDestroyJoint: function(entity,joint) {
		
		this._destroyJointList.push(joint.physicsHandle);
		
	},
	
	/**
	 * Destroys a body
	 * 
	 * @method _destroyBody
	 * @param {zerk.game.engine.entity} entity Entity
	 * @param {zerk.game.engine.physics.body} body Body
	 * @protected
	 */
	_destroyBody: function(physicsHandle) {
		
		if (this._world.IsLocked()) {
			
			console.error('Cannot destroy body, world is locked');
			
		}
		
		this._world.DestroyBody(physicsHandle);
		
	},
	
	/**
	 * Destroys a joint
	 * 
	 * @method _destroyJoint
	 * @param {zerk.game.engine.entity} entity Entity
	 * @param {zerk.game.engine.physics.joint} joint Joint
	 * @protected
	 */
	_destroyJoint: function(physicsHandle) {

		if (this._world.IsLocked()) {
			
			console.error('Cannot destroy joint, world is locked');
			
		}
		
		this._world.DestroyJoint(physicsHandle);
		
	},
	
	/**
	 * Create the physics engine representation for an entity
	 * 
	 * @method createPhysics
	 * @param {zerk.game.engine.entity} entity Entity
	 */
	createPhysics: function(entity) {
		
		for (var i=0;i<entity.bodies.length;i++) {
			
			this._createBody(entity,entity.bodies[i]);
			
		}
		
		for (var i=0;i<entity.joints.length;i++) {
			
			this._createJoint(entity,entity.joints[i]);
			
		}
		
	},
	
	/**
	 * Removes the physics engine representation for an entity
	 * 
	 * @method removePhysics
	 * @param {zerk.game.engine.entity} entity Entity
	 */
	removePhysics: function(entity) {
		
		for (var i=0;i<entity.joints.length;i++) {
			
			this.scheduleDestroyJoint(entity,entity.joints[i]);
			
		}
		
		for (var i=0;i<entity.bodies.length;i++) {
			
			this.scheduleDestroyBody(entity,entity.bodies[i]);
			
		}
		
	},
	
	/**
	 * Returns body at current cursor position if present
	 * 
	 * @method getBodyAtMouse
	 * @return {Object} Box2D body
	 */
	getBodyAtMouse: function() {
		
		this._mouseJointVec=new this._b2Vec2(
			this._engine.control.mouse.mouseX,
			this._engine.control.mouse.mouseY
		);
		
		var aabb=new this._b2AABB();
		
		aabb.lowerBound.Set(
			this._engine.control.mouse.mouseX-0.001,
			this._engine.control.mouse.mouseY-0.001
		);
		
		aabb.upperBound.Set(
			this._engine.control.mouse.mouseX+0.001,
			this._engine.control.mouse.mouseY+0.001
		);
		
		this._selectedBody=null;
		
		this._world.QueryAABB(this._getBodyAtMouseCallback,aabb);
		
		return this._selectedBody;
		
	},
	
	/**
	 * Returns an array of entities inside given area
	 * 
	 * @method getEntitiesInArea
	 * @param {Float} x1
	 * @param {Float} y1
	 * @param {Float} x2
	 * @param {Float} y2
	 * @return {Array} Entities inside given area
	 */
	getEntitiesInArea: function(x1,y1,x2,y2) {
		
		var aabb=new this._b2AABB();
		
		aabb.lowerBound.Set(x1,y1);
		aabb.upperBound.Set(x2,y2);
		
		var entitiesById={};
		
		this._world.QueryAABB(
			function (fixture) {
				
				var entity=fixture.GetBody().GetUserData()._entity;
				
				if (typeof entitiesById[entity.config.id]
				=='undefined') {
					
					entitiesById[entity.config.id]=entity;
					
				}
				
				return true;
				
			},
			aabb
		);
		
		var result=[];
		
		for (var id in entitiesById) {
			
			if (this._engine.world!=null) {
				
				if (this._engine.world.getEntityById(id)!=null) {
					
					result.push(entitiesById[id]);
					
				}
				
			}
			
		}
		
		return result;
	},
	
	/**
	 * Synchronize the physic simulation properties of an entity
	 * 
	 * @method syncEntityPhysics
	 * @param {zerk.game.engine.entity} entity Entity
	 */
	syncEntityPhysics: function(entity) {
		
		for (var index in entity.bodies) {
			
			if (entity.bodies[index].physicsHandle) {
				
				entity.config.bodies[entity.bodies[index].key].x=
					entity.bodies[index].physicsHandle.GetPosition().x;
					
				entity.config.bodies[entity.bodies[index].key].y=
					entity.bodies[index].physicsHandle.GetPosition().y;
					
				entity.config.bodies[entity.bodies[index].key].angle=
					entity.bodies[index].physicsHandle.GetAngle();
				
				if (entity.bodies[index].origin) {
					
					entity.config.x=
						entity.bodies[index].physicsHandle.GetPosition().x;
						
					entity.config.y=
						entity.bodies[index].physicsHandle.GetPosition().y;
					
				}
				
			}
			
		}
		
	},
	
	/**
	 * Dumps elements currently contained in physics simulation to console
	 * 
	 * @method dumpPhysicsData
	 */
	dumpPhysicsData: function() {
		
		var body=this._world.GetBodyList();
		
		console.log('--- Elements in physics simulation ---');
		
		while (body!=null) {
			
			var zerkBody=body.GetUserData();
			
			if (zerkBody) {
				
				console.log('BODY: '+zerkBody._entity.config.id);
				
			} else {
				
				console.log('UNKNOWN BODY',body);
				
			}
			
			body=body.GetNext();
			
		}
		
	},
	
	/**
	 * Contact begin event handler
	 * 
	 * @method _onContactBegin
	 * @param {Object} contact Contact information
	 * @protected
	 */
	_onContactBegin: function(contact) {
		
		var sourceFixture=contact.GetFixtureA().GetUserData();
		var targetFixture=contact.GetFixtureB().GetUserData();
		
		var sourceEntity=sourceFixture.body._entity;
		var targetEntity=targetFixture.body._entity;
		
		if (this._engine.world!=null) {
			
			/**
			 * Fires when two fixtures start colliding
			 * 
			 * @event contactbegin
			 * @param {zerk.game.engine.physics.fixture} sourceFixture Source fixture
			 * @param {zerk.game.engine.physics.fixture} targetFixture Target fixture
			 * @return {Boolean} Return false to Cancel bubble
			 */
			this.fireEvent(
				'contactbegin',
				sourceFixture,
				targetFixture
			);
			
			// Trigger entity events
			
			if (sourceEntity!=null) {
				
				sourceEntity.fireEvent(
					'contactbegin',
					sourceFixture,
					targetFixture
				);
				
			}
			
			if (targetEntity!=null) {
				
				targetEntity.fireEvent(
					'contactbegin',
					sourceFixture,
					targetFixture
				);
				
			}
			
		}
		
	},
	
	/**
	 * Contact end event handler
	 * 
	 * @method _onContactEnd
	 * @param {Object} contact Contact information
	 * @protected
	 */
	_onContactEnd: function(contact) {
		
		var sourceFixture=contact.GetFixtureA().GetUserData();
		var targetFixture=contact.GetFixtureB().GetUserData();
		
		var sourceEntity=sourceFixture.body._entity;
		var targetEntity=targetFixture.body._entity;
		
		if (this._engine.world!=null) {
			
			/**
			 * Fires when two fixtures stop colliding
			 * 
			 * @event contactend
			 * @param {zerk.game.engine.physics.fixture} sourceFixture Source 
			 * fixture
			 * @param {zerk.game.engine.physics.fixture} targetFixture Target 
			 * fixture
			 * @return {Boolean} Return false to Cancel bubble
			 */
			this.fireEvent(
				'contactend',
				sourceFixture,
				targetFixture
			);
			
			// Trigger entity events
			
			if (sourceEntity!=null) {
				
				sourceEntity.fireEvent(
					'contactend',
					sourceFixture,
					targetFixture
				);
				
			}
			
			if (targetEntity!=null) {
				
				targetEntity.fireEvent(
					'contactend',
					sourceFixture,
					targetFixture
				);
				
			}
			
		}
		
	},
	
	/**
	 * Contact post solve event handler
	 * 
	 * @method _onContactPostSolve
	 * @param {Object} contact Contact information
	 * @param {Object} impulse Impulse information
	 * @protected
	 */
	_onContactPostSolve: function(contact,impulse) {
		
		var sourceFixture=contact.GetFixtureA().GetUserData();
		var targetFixture=contact.GetFixtureB().GetUserData();
		
		var sourceEntity=sourceFixture.body._entity;
		var targetEntity=targetFixture.body._entity;
		
		if (this._engine.world!=null) {
			
			/**
			 * Fires before two fixtures start colliding
			 * 
			 * @event contactpostsolve
			 * @param {zerk.game.engine.physics.fixture} sourceFixture Source fixture
			 * @param {zerk.game.engine.physics.fixture} targetFixture Target fixture
			 * @param {Object} impulse
			 * @return {Boolean} Return false to Cancel bubble
			 */
			this.fireEvent(
				'contactpostsolve',
				sourceFixture,
				targetFixture,
				impulse
			);
			
			// Trigger entity events
			
			if (sourceEntity!=null) {
				
				sourceEntity.fireEvent(
					'contactpostsolve',
					sourceFixture,
					targetFixture,
					impulse
				);
				
			}
			
			if (targetEntity!=null) {
				
				targetEntity.fireEvent(
					'contactpostsolve',
					sourceFixture,
					targetFixture,
					impulse
				);
				
			}
			
		}
		
	},
	
	/**
	 * Contact pre solve event handler
	 * 
	 * @method _onContactPreSolve
	 * @param {Object} contact Contact information
	 * @param {Object} oldManifold
	 * @protected
	 */
	_onContactPreSolve: function(contact,oldManifold) {
		
		/*
		 * TODO Implement ContactPreSolve event
		 */
		
	},
	
	/**
	 * Registers the contact listener event handlers
	 * 
	 * @method _addContactListener
	 * @protected
	 */
	_addContactListener: function() {
		
		var listener=new this._b2ContactListener();
		
		var me=this;
		
		listener.BeginContact=function(contact) {
			
			me._onContactBegin(contact);
			
		};
		
		listener.EndContact=function(contact) {
			
			me._onContactEnd(contact);
			
		};
		
		listener.PostSolve=function(contact,impulse) {
			
			me._onContactPostSolve(contact,impulse);
			
		};
		
		listener.PreSolve=function(contact,oldManifold) {
			
			me._onContactPreSolve(contact,oldManifold);
			
		};
		
		this._world.SetContactListener(listener);
		
	},
	
	/**
	 * Creates a body
	 * 
	 * @method _createBody
	 * @param {zerk.game.engine.entity} entity Entity
	 * @param {zerk.game.engine.physics.body} body Body
	 * @return {Object} Body handle
	 * @protected
	 */
	_createBody: function(entity,body) {
		
		var bodyDef=new this._b2BodyDef;
		
		if (typeof body.moveable!='undefined' && body.moveable) {
			
			bodyDef.type=this._b2Body.b2_dynamicBody;
			
		} else if (typeof body.kinematic!='undefined' && body.kinematic) {
			
			bodyDef.type=this._b2Body.b2_kinematicBody;
			
		} else {
			
			bodyDef.type=this._b2Body.b2_staticBody;
			
		}
		
		var position=entity.config.bodies[body.key];
		
		bodyDef.position.x=position.x;
		bodyDef.position.y=position.y;
		bodyDef.angle=position.angle*Math.PI*2;
		bodyDef.fixedRotation=body.fixedRotation;
		bodyDef.userData=body;
		
		body.physicsHandle=this._world.CreateBody(bodyDef);
		
		// Create all fixtures of the body
		
		for (var index in body.fixtures) {
			
			body.physicsHandle.CreateFixture(
				this._createFixture(
					entity,
					body,
					body.fixtures[index]
				)
			);
			
		}
		
		return body.physicsHandle;
	},
	
	/**
	 * Delegate method for fixture creation
	 * 
	 * @method _createFixture
	 * @param {zerk.game.engine.entity} entity Entity
	 * @param {zerk.game.engine.physics.body} body Body 
	 * @param {zerk.game.engine.physics.fixture} fixture Fixture
	 * @return {Object} Fixture handle
	 * @protected
	 */
	_createFixture: function(entity,body,fixture) {
		
		switch (fixture.shape) {
			case 'box':
				return this._createFixtureRectangle(
					entity,
					body,
					fixture
				);
				break;
			case 'circle':
				return this._createFixtureCircle(
					entity,
					body,
					fixture
				);
				break;
			case 'polygon':
				return this._createFixturePolygon(
					entity,
					body,
					fixture
				);
		}
		
	},
	
	/**
	 * Creates a rectangle shaped fixture
	 * 
	 * @method _createFixtureRectangle
	 * @param {zerk.game.engine.entity} entity Entity
	 * @param {zerk.game.engine.physics.body} body Body
	 * @param {zerk.game.engine.physics.fixture} fixture Fixture
	 * @return {Object} Fixture handle
	 * @protected
	 */
	_createFixtureRectangle: function(
		entity,
		body,
		fixture
	) {
		
		var fixDef=new this._b2FixtureDef;
		
		if (fixture.categoryBits!=null) {
			
			fixDef.filter.categoryBits=fixture.categoryBits;
			
		}
		if (fixture.maskBits!=null) {
			
			fixDef.filter.maskBits=fixture.maskBits;
			
		}
		
		fixDef.density=fixture.density;
		fixDef.friction=fixture.friction;
		fixDef.restitution=fixture.restitution;
		fixDef.isSensor=fixture.isSensor;
		fixDef.userData=fixture;
		
		fixDef.shape=new this._b2PolygonShape;
		
		var center=new this._b2Vec2(fixture.x, fixture.y);
		
		fixDef.shape.SetAsOrientedBox(
			fixture.width/2,
			fixture.height/2,
			center,
			fixture.angle
		);
		
		return fixDef;
		
	},
	
	/**
	 * Creates a circle shaped fixture
	 * 
	 * @method _createFixtureCircle
	 * @param {zerk.game.engine.entity} entity Entity
	 * @param {zerk.game.engine.physics.body} body Body
	 * @param {zerk.game.engine.physics.fixture} fixture Fixture
	 * @return {Object} Fixture handle
	 * @protected
	 */
	_createFixtureCircle: function(
		entity,
		body,
		fixture
	) {
		
		var fixDef=new this._b2FixtureDef;
		
		if (fixture.categoryBits!=null) {
			
			fixDef.filter.categoryBits=fixture.categoryBits;
			
		}
		if (fixture.maskBits!=null) {
			
			fixDef.filter.maskBits=fixture.maskBits;
			
		}
		
		fixDef.density=fixture.density;
		fixDef.friction=fixture.friction;
		fixDef.restitution=fixture.restitution;
		fixDef.isSensor=fixture.isSensor;
		fixDef.userData=fixture;
		
		fixDef.shape=new this._b2CircleShape(
			fixture.radius
		);
		
		fixDef.shape.SetLocalPosition(
			new this._b2Vec2(fixture.x, fixture.y)
		);
		
		return fixDef;
		
	},
	
	/**
	 * Creates a polygon shaped fixture
	 * 
	 * @method _createFixturePolygon
	 * @param {zerk.game.engine.entity} entity Entity
	 * @param {zerk.game.engine.physics.body} body Body
	 * @param {zerk.game.engine.physics.fixture} fixture Fixture
	 * @return {Object} Fixture handle
	 * @protected
	 */
	_createFixturePolygon: function(
		entity,
		body,
		fixture
	) {
		
		var fixDef=new this._b2FixtureDef;
		
		if (fixture.categoryBits!=null) {
			
			fixDef.filter.categoryBits=fixture.categoryBits;
			
		}
		if (fixture.maskBits!=null) {
			
			fixDef.filter.maskBits=fixture.maskBits;
			
		}
		
		fixDef.density=fixture.density;
		fixDef.friction=fixture.friction;
		fixDef.restitution=fixture.restitution;
		fixDef.isSensor=fixture.isSensor;
		fixDef.userData=fixture;
		
		fixDef.shape=new this._b2PolygonShape;
		
		// Create array of vertice instances
		
		var arr=[];
		
		for (var i=0;i<fixture.vertices.length;i++) {
			arr.push(
				new this._b2Vec2(
					fixture.vertices[i][0],
					fixture.vertices[i][1]
				)
			);
		}
		
		fixDef.shape.SetAsArray(arr, arr.length);
		
		return fixDef;
		
	},
	
	/**
	 * Delgate method for joint creation
	 * 
	 * @method _createJoint
	 * @param {zerk.game.engine.entity} entity Entity
	 * @param {zerk.game.engine.physics.joint} joint Joint
	 * @return {Object} Joint handle
	 * @protected
	 */
	_createJoint: function(entity,joint) {
		
		switch (joint.type) {
			case 'distance':
				return this._createJointDistance(entity,joint);
			case 'revolute':
				return this._createJointRevolute(entity,joint);
		}
		
	},
	
	/**
	 * Creates a distance joint
	 * 
	 * @method _createJointDistance
	 * @param {zerk.game.engine.entity} entity Entity
	 * @param {zerk.game.engine.physics.joint} joint Joint
	 * @return {Object} Joint handle
	 * @protected
	 */
	_createJointDistance: function(entity,joint) {
		
		var bodySource=entity.getBody(joint.source).physicsHandle;
		var bodyTarget=entity.getBody(joint.target).physicsHandle;
		
		var jointDef=new this._b2DistanceJointDef();
		
		jointDef.collideConnected=joint.collideConnected;
		jointDef.frequencyHz=joint.frequencyHz;
		jointDef.dampingRatio=joint.dampingRatio;
		
		// Create anchor vectors
		var anchorSource=bodySource.GetWorldCenter();
		var anchorTarget=bodyTarget.GetWorldCenter();
		
		jointDef.Initialize(
			bodySource,
			bodyTarget,
			anchorSource,
			anchorTarget
		);
		
		// Set local anchors
		jointDef.localAnchorA.Set(
			joint.anchorSourceX,
			joint.anchorSourceY
		);
		jointDef.localAnchorB.Set(
			joint.anchorTargetX,
			joint.anchorTargetY
		);
		
		return this._world.CreateJoint(jointDef);
		
	},
	
	/**
	 * Creates a revolute join
	 * 
	 * @method _createJointRevolute
	 * @param {zerk.game.engine.entity} entity Entity
	 * @param {zerk.game.engine.physics.joint} joint Joint
	 * @return {Object} Joint handle
	 * @protected
	 */
	_createJointRevolute: function(entity,joint) {
		
		var bodySource=entity.getBody(joint.source).physicsHandle;
		var bodyTarget=entity.getBody(joint.target).physicsHandle;
		
		var jointDef=new this._b2RevoluteJointDef();
		
		jointDef.enableLimit=joint.enableLimit;
		jointDef.lowerAngle=joint.lowerAngle;
		jointDef.upperAngle=joint.upperAngle;
		jointDef.enableMotor=joint.enableMotor;
		jointDef.motorSpeed=joint.motorSpeed;
		jointDef.maxMotorTorque=joint.maxMotorTorque;
		
		var anchorSource=bodySource.GetWorldCenter();
		anchorSource.x+=joint.anchorSourceX;
		anchorSource.y+=joint.anchorSourceY;
		
		jointDef.Initialize(
			bodySource,
			bodyTarget,
			anchorSource
		);
		
		return this._world.CreateJoint(jointDef);
		
	},
	
	/**
	 * Creates a mouse joint
	 * 
	 * @method _createJointMouse
	 * @param {Object} body Box2dWeb body
	 * @param {Float} targetX Horizontal position
	 * @param {Float} targetY Vertical position
	 * @return {Object} Joint handle
	 * @protected
	 */
	_createJointMouse: function(body,targetX,targetY) {
		
		var jointDef=new this._b2MouseJointDef();
		jointDef.bodyA=this._world.GetGroundBody();
		jointDef.bodyB=body;
		jointDef.target.Set(targetX,targetY);
		jointDef.collideConnected=true;
		jointDef.maxForce=300.0*body.GetMass();
		
		var joint=this._world.CreateJoint(jointDef);
		
		body.SetAwake(true);
		
		return joint;
		
	},
	
	/**
	 * Process mouse joint
	 * 
	 * @method _processMouseJoint
	 * @protected
	 */
	_processMouseJoint: function() {
		
		if (!this._engine.registry.getValue('control.mouse.enableJoint')) {
			
			return;
			
		}
		
		if (this._engine.control.mouse.mouseLeftDown && (!this._mouseJoint)) {
			
			var body=this.getBodyAtMouse();
			
			if (body) {
				
				this._mouseJoint=this._createJointMouse(
					body,
					this._engine.control.mouse.mouseX,
					this._engine.control.mouse.mouseY
				);
				
			}
			
		}
		
		if (this._mouseJoint) {
			
			if (this._engine.control.mouse.mouseLeftDown) {
				
				this._mouseJoint.SetTarget(
					new this._b2Vec2(
						this._engine.control.mouse.mouseX,
						this._engine.control.mouse.mouseY
					)
				);
				
			} else {
				
				this._destroyJoint(this._mouseJoint);
				this._mouseJoint=null;
				
			}
			
		}
		
	},
	
	/**
	 * Callbak method for internal processing of getBodyAtMouse
	 * 
	 * @method _getBodyAtMouseCallback
	 * @param {Object} fixture Box2D fixture
	 * @return {Boolean}
	 * @protected
	 */
	_getBodyAtMouseCallback: function(fixture) {
		
		/*
		 * TODO Remove global call zerk.game.engine.physics.*
		 */
		
		if (fixture.GetBody().GetType()
		!= zerk.game.engine.physics._b2Body.b2_staticBody) {
			
			if (fixture.GetShape().TestPoint(
				fixture.GetBody().GetTransform(),
				zerk.game.engine.physics._mouseJointVec
			)) {
				
				zerk.game.engine.physics._selectedBody=fixture.GetBody();
				return false;
				
			}
			
		}
		return true;
		
	},
	
	/**
	 * Local log method
	 * 
	 * @method _log
	 * @param {String} msg Log message
	 * @protected
	 */
	_log: function(msg) {
		
		this._engine.debug.log(
			msg,
			this._engine.debug.GROUP_PHYSICS
		);
		
	}
	
});