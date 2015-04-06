/*
 * TODO Give the Box2dWeb related properties their real types 
 */
/**
 * Box2D Physics System
 * 
 * Box2dWeb implementation.
 * 
 * @class box2d
 * @namespace zerk.game.engine.system.physics
 * @extends zerk.game.engine.system.physics
 * @module zerk
 **/
zerk.define({
	
	name: 'zerk.game.engine.system.physics.box2d',
	extend: 'zerk.game.engine.system.physics'
	
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
     * Minimum fixture size in meters
     *
     * @property _minFixtureSize
     * @type Integer
     * @protected
     */
    _minFixtureSize: 0.1,

    /**
     * Maximum fixture size in meters
     *
     * @property _maxFixtureSize
     * @type Integer
     * @protected
     */
    _maxFixtureSize: 10,

	/**
	 * Class constructor
	 * 
	 * @method init
	 * @param {zerk.game.engine} engine Game engine
	 */
	init: function(engine,config) {
		
		zerk.parent('zerk.game.engine.system.physics.box2d').init.apply(
			this,
			arguments
		);
		
		this._destroyBodyList=[];
		this._destroyJointList=[];
		
		this._world=new this._b2World(
			new this._b2Vec2(
				this._config.gravityX,
				this._config.gravityY
			), // Setup gravity
			true // Allow sleep
		);

		this._addContactListener();
		
		this._log('Ready');
		
	},

    /**
     * Starts the system
     *
     * @method start
     **/
    start: function() {

        if (this._config.debugDraw) {

            this.canvas=this._getSystem('viewport').getCanvasPhysicsDebug();

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

        zerk.parent('zerk.game.engine.system.physics.box2d').start.apply(
            this,
            arguments
        );

    },
	
	/**
	 * Physics engine tick
	 * 
	 * @method tick
	 */
	_tick: function() {
		
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
	
	getBody: function(entity,key) {
		
		return entity.components.physics.bodies[key];
		
	},
	
	/**
	 * Applies an impulse to given body
	 * 
	 * @method _bodyApplyImpulse
	 * @param {String} bodyKey
	 * @param {Integer} degrees
	 * @param {Integer} power
	 * @protected
	 */
	bodyApplyImpulse: function(entity,bodyKey,degrees,power) {
		
		var physicsBody=entity.components.physics.bodies[bodyKey]._physicsHandle;
		
		physicsBody.ApplyImpulse(
			new this._b2Vec2(
				Math.cos(degrees*(Math.PI/180))*power,
				Math.sin(degrees*(Math.PI/180))*power
			),
			physicsBody.GetWorldCenter()
		);
		
	},
	
	/**
	 * Sets the linear velocity of given body
	 * 
	 * @method __setLinearVelocity
	 * @param {String} bodyKey
	 * @param {Integer} degrees
	 * @param {Integer} power
	 * @protected
	 */
	setLinearVelocity: function(entity,bodyKey,degrees,power) {
		
		var physicsBody=entity.components.physics.bodies[bodyKey]._physicsHandle;
		
		physicsBody.SetLinearVelocity(
			new this._b2Vec2(
				Math.cos(degrees*(Math.PI/180))*power,
				Math.sin(degrees*(Math.PI/180))*power
			)
		);
		
	},
	
	/**
	 * Sets the position of given body
	 * 
	 * @method _setBodyPosition
	 * @param {String} bodyKey
	 * @param {Object} position
	 * @protected
	 */
	setBodyPosition: function(entity,bodyKey,position) {
		
		var physicsBody=entity.components.physics.bodies[bodyKey]._physicsHandle;
		
		return physicsBody.SetPosition(position);
		
	},
	
	/**
	 * Sets whether given body is allowed to sleep
	 * 
	 * @method _setBodySleepingAllowed
	 * @param {String} bodyKey
	 * @param {Boolean} allowed
	 * @protected
	 */
	setBodySleepingAllowed: function(entity,bodyKey,allowed) {
		
		entity.components.physics.bodies[bodyKey]._physicsHandle
			.SetSleepingAllowed(allowed);
		
	},
	
	/**
	 * Sets whether given body is moveable
	 * 
	 * @method _setBodyMoveable
	 * @param {String} bodyKey
	 * @param {Boolean} moveable
	 * @protected
	 */
	setBodyMoveable: function(entity,bodyKey,moveable) {
		
		var type=((moveable)
			? this._b2Body.b2_dynamicBody
			: this._b2Body.b2_staticBody);
		
		entity.components.physics.bodies[bodyKey]._physicsHandle.SetType(
			type
		);
		
	},
	
	/**
	 * Sets given body to be kinematic
	 * 
	 * @method __setBodyKinematic
	 * @param {String} bodyKey
	 * @protected
	 */
	setBodyKinematic: function(entity,bodyKey) {
		
		entity.components.physics.bodies[bodyKey]._physicsHandle.SetType(
			this._b2Body.b2_kinematicBody
		);
		
	},
	
	
	isBodyActive: function(body) {
		
		return (
			body._physicsHandle.IsActive()==true
		);
		
	},
	
	isBodyAwake: function(body) {
		
		return (
			body._physicsHandle.IsAwake()==true
		);
		
	},
	
	isBodyStatic: function(body) {
		
		return (
			body._physicsHandle.GetType()==this._b2Body.b2_staticBody
		);
		
	},
	
	isBodyKinematic: function(body) {
		
		return (
			body._physicsHandle.GetType()==this._b2Body.b2_kinematicBody
		);
		
	},

	/**
	 * Returns position of given body
	 * 
	 * @method _getBodyPosition
	 * @param {String} bodyKey
	 * @return {Object} Position
	 * @protected
	 */
	getBodyPosition: function(entity,bodyKey) {
		
		entity.components.physics.bodies[bodyKey]._physicsHandle.GetPosition();
		
	},
	
	/**
	 * Returns the linear velocity of given body
	 * 
	 * @method _getBodyLinearVelocity
	 * @param {String} bodyKey
	 * @return {Object}
	 * @protected
	 */
	getBodyLinearVelocity: function(entity,bodyKey) {
		
		var physicsBody=entity.components.physics.bodies[bodyKey]._physicsHandle;
		
		return physicsBody.GetLinearVelocity();
		
	},
	
	/**
	 * Destroys given body
	 * 
	 * @method _destroyBody
	 * @param {String} bodyKey
	 * @protected
	 */
	destroyBody: function(entity,bodyKey) {
		
		// Detroy the physics body
		this._scheduleDestroyBody(
			entity.components.physics.bodies[bodyKey]._physicsHandle
		);
		
		// Delete the body 
		delete entity.components.physics.bodies[bodyKey];
		
		// Delete the bodyList entry
		var found=false;
		
		for (var i=0;i<entity.components.physics._bodyList.length;i++) {
			
			if (entity.components.physics._bodyList[i].key==bodyKey) {
				found=true;
				break;
			}
			
		}
		
		if (!found) return;
		
		entity.components.physics._bodyList.splice(i,1);
		
		return true;
		
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
	 * @method _scheduleDestroyBody
	 * @param {zerk.game.engine.entity} entity
	 * @param {zerk.game.engine.system.physics.box2d.body} body
	 */
	_scheduleDestroyBody: function(physicsHandle) {
		
		this._destroyBodyList.push(physicsHandle);
		
	},
	
	/**
	 * Schedules a join to be destroyed after current simulation tick
	 * 
	 * @method _scheduleDestroyJoint
	 * @param {zerk.game.engine.entity} entity
	 * @param {zerk.game.engine.system.physics.box2d.join} body
	 */
	_scheduleDestroyJoint: function(physicsHandle) {
		
		this._destroyJointList.push(physicsHandle);
		
	},
	
	/**
	 * Destroys a body
	 * 
	 * @method _destroyBody
	 * @param {zerk.game.engine.entity} entity Entity
	 * @param {zerk.game.engine.system.physics.box2d.body} body Body
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
	 * @param {zerk.game.engine.system.physics.box2d.joint} joint Joint
	 * @protected
	 */
	_destroyJoint: function(physicsHandle) {

		if (this._world.IsLocked()) {
			
			console.error('Cannot destroy joint, world is locked');
			
		}
		
		this._world.DestroyJoint(physicsHandle);
		
	},
	
	/**
	 * Returns body at current cursor position if present
	 * 
	 * @method getBodyAtMouse
	 * @return {Object} Box2D body
	 */
	getBodyAtMouse: function() {
		
		/*
		 * TODO Try to remove dependency to control here
		 */
		var systemControl=this._getSystem('control');
		
		this._mouseJointVec=new this._b2Vec2(
			systemControl.mouse.mouseX,
			systemControl.mouse.mouseY
		);
		
		var aabb=new this._b2AABB();
		
		aabb.lowerBound.Set(
			systemControl.mouse.mouseX-0.001,
			systemControl.mouse.mouseY-0.001
		);
		
		aabb.upperBound.Set(
			systemControl.mouse.mouseX+0.001,
			systemControl.mouse.mouseY+0.001
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
				
				var entity=fixture.GetBody().GetUserData().entity;
				
				if (typeof entitiesById[entity.id]
				=='undefined') {
					
					entitiesById[entity.id]=entity;
					
				}
				
				return true;
				
			},
			aabb
		);
		
		var result=[];
		
		for (var id in entitiesById) {
			
			if (this._engine.getEntityById(id)!=null) {
				
				result.push(entitiesById[id]);
				
			}
			
		}
		
		return result;
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
	 * Synchronize the physic simulation properties of an entity
	 * 
	 * @method syncEntityPhysics
	 * @param {zerk.game.engine.entity} entity Entity
	 */
	_syncEntityPhysics: function(entity) {
		
		var bodies=entity.components.physics.bodies;
		
		for (var key in bodies) {
			
			if (bodies[key]._physicsHandle && bodies[key].origin) {
				
				entity.components.position.x=
					bodies[key]._physicsHandle.GetPosition().x;
					
				entity.components.position.y=
					bodies[key]._physicsHandle.GetPosition().y;
				
				entity.components.position.angle=
					bodies[key]._physicsHandle.GetAngle();
				
			}
			
		}
		
		for (var key in bodies) {
			
			if (bodies[key]._physicsHandle) {
				
				bodies[key].x=
					bodies[key]._physicsHandle.GetPosition().x
					-entity.components.position.x;
					
				bodies[key].y=
					bodies[key]._physicsHandle.GetPosition().y
					-entity.components.position.y;
					
				bodies[key].angle=
					bodies[key]._physicsHandle.GetAngle();
				
			}
			
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
		
		var sourceInfo=contact.GetFixtureA().GetUserData();
		var targetInfo=contact.GetFixtureB().GetUserData();
	
		/**
		 * Fires when two fixtures start colliding
		 * 
		 * @event contactbegin
		 * @param {zerk.game.engine.system.physics.box2d.fixture} sourceFixture Source fixture
		 * @param {zerk.game.engine.system.physics.box2d.fixture} targetFixture Target fixture
		 * @return {Boolean} Return false to Cancel bubble
		 */
		this.fireEvent(
			'contactbegin',
			sourceInfo,
			targetInfo
		);
		
	},
	
	/**
	 * Contact end event handler
	 * 
	 * @method _onContactEnd
	 * @param {Object} contact Contact information
	 * @protected
	 */
	_onContactEnd: function(contact) {
		
		var sourceInfo=contact.GetFixtureA().GetUserData();
		var targetInfo=contact.GetFixtureB().GetUserData();
		
		/**
		 * Fires when two fixtures stop colliding
		 * 
		 * @event contactend
		 * @param {zerk.game.engine.system.physics.box2d.fixture} sourceFixture Source 
		 * fixture
		 * @param {zerk.game.engine.system.physics.box2d.fixture} targetFixture Target 
		 * fixture
		 * @return {Boolean} Return false to Cancel bubble
		 */
		this.fireEvent(
			'contactend',
			sourceInfo,
			targetInfo
		);
		
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
	
		/**
		 * Fires before two fixtures start colliding
		 * 
		 * @event contactpostsolve
		 * @param {zerk.game.engine.system.physics.box2d.fixture} sourceFixture Source fixture
		 * @param {zerk.game.engine.system.physics.box2d.fixture} targetFixture Target fixture
		 * @param {Object} impulse
		 * @return {Boolean} Return false to Cancel bubble
		 */
		this.fireEvent(
			'contactpostsolve',
			sourceFixture,
			targetFixture,
			impulse
		);
		
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
		
		var self=this;
		
		listener.BeginContact=function(contact) {
			
			self._onContactBegin(contact);
			
		};
		
		listener.EndContact=function(contact) {
			
			self._onContactEnd(contact);
			
		};
		
		listener.PostSolve=function(contact,impulse) {
			
			self._onContactPostSolve(contact,impulse);
			
		};
		
		listener.PreSolve=function(contact,oldManifold) {
			
			self._onContactPreSolve(contact,oldManifold);
			
		};
		
		this._world.SetContactListener(listener);
		
	},
	

	/**
	 * Create the physics engine representation for an entity
	 * 
	 * @method createPhysics
	 * @param {zerk.game.engine.entity} entity Entity
	 */
	_createPhysics: function(entity) {
		
		for (var key in entity.components.physics.bodies) {
			
			this._createBody(entity,entity.components.physics.bodies[key]);
			
		}
		
		for (var key in entity.components.physics.joints) {
			
			this._createJoint(entity,entity.components.physics.joints[key]);
			
		}
		
	},
	
	/**
	 * Removes the physics engine representation for an entity
	 * 
	 * @method removePhysics
	 * @param {zerk.game.engine.entity} entity Entity
	 */
	_removePhysics: function(entity) {
		
		for (var key in entity.components.physics.bodies) {
			
			this._scheduleDestroyBody(
				entity.components.physics.bodies[key]._physicsHandle
			);
			
		}
		
		for (var key in entity.components.physics.joints) {
			
			this._scheduleDestroyJoint(
				entity.components.physics.joints[key]._physicsHandle
			);
			
		}
		
	},
	
	/**
	 * Creates a body
	 * 
	 * @method _createBody
	 * @param {zerk.game.engine.entity} entity Entity
	 * @param {zerk.game.engine.system.physics.box2d.body} body Body
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
		
		var bodyState=entity.components.physics.bodies[body.key];
		var position=entity.components.position;

		// Setup position
		bodyDef.position.x=position.x+bodyState.x;
		bodyDef.position.y=position.y+bodyState.y;
		bodyDef.angle=bodyState.angle*Math.PI*2;
		bodyDef.fixedRotation=body.fixedRotation;
		
		bodyDef.userData={
			entity: entity,
			body: body.key
		};
		
		body._physicsHandle=this._world.CreateBody(bodyDef);
		
		// Create all fixtures of the body
		
		for (var key in body.fixtures) {
			
			body.fixtures[key]._physicsHandle=body._physicsHandle.CreateFixture(
				this._createFixture(
					entity,
					body,
					body.fixtures[key]
				)
			);
			
		}
		
		return body._physicsHandle;
	},
	
	/**
	 * Delegate method for fixture creation
	 * 
	 * @method _createFixture
	 * @param {zerk.game.engine.entity} entity Entity
	 * @param {zerk.game.engine.system.physics.box2d.body} body Body 
	 * @param {zerk.game.engine.system.physics.box2d.fixture} fixture Fixture
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
	 * @param {zerk.game.engine.system.physics.box2d.body} body Body
	 * @param {zerk.game.engine.system.physics.box2d.fixture} fixture Fixture
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
		fixDef.userData={
			entity: entity,
			body: body.key,
			fixture: fixture.key
		};
		
		fixDef.shape=new this._b2PolygonShape;
		
		var center=new this._b2Vec2(fixture.x, fixture.y);
		
		var width=((typeof fixture.width=='string') 
			? (body.width/100)*parseInt(fixture.width)
			: fixture.width);
		
		var height=((typeof fixture.height=='string') 
			? (body.height/100)*parseInt(fixture.height)
			: fixture.height);

        if (width>this._maxFixtureSize) {
            zerk.error({
                message: 'Fixture width is too high \''+width+'\'. Maximum is \''+this._maxFixtureSize+'\'.',
                entityName: entity.name,
                fixtureKey: fixture.key
            });
        } else if (height>this._maxFixtureSize) {
            zerk.error({
                message: 'Fixture height is too high \''+height+'\'. Maximum is \''+this._maxFixtureSize+'\'.',
                entityName: entity.name,
                fixtureKey: fixture.key
            });
        } else if (width<this._minFixtureSize) {
            zerk.error({
                message: 'Fixture width is too small \''+width+'\'. Minimum is \''+this._minFixtureSize+'\'.',
                entityName: entity.name,
                fixtureKey: fixture.key
            });
        } else if (height<this._minFixtureSize) {
            zerk.error({
                message: 'Fixture height is too small \''+height+'\'. Minimum is \''+this._minFixtureSize+'\'.',
                entityName: entity.name,
                fixtureKey: fixture.key
            });
        }

		fixDef.shape.SetAsOrientedBox(
			width/2,
			height/2,
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
	 * @param {zerk.game.engine.system.physics.box2d.body} body Body
	 * @param {zerk.game.engine.system.physics.box2d.fixture} fixture Fixture
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
		fixDef.userData={
			entity: entity,
			body: body.key,
			fixture: fixture.key
		};

        var diameter=fixture.radius*2;

        if (diameter>this._maxFixtureSize) {
            zerk.error({
                message: 'Fixture diameter too high \''+diameter+'\'. Maximum is \''+this._maxFixtureSize+'\'.',
                entityName: entity.name,
                fixtureKey: fixture.key
            });
        } else if (diameter<this._minFixtureSize) {
            zerk.error({
                message: 'Fixture diameter too small \''+diameter+'\'. Minimum is \''+this._minFixtureSize+'\'.',
                entityName: entity.name,
                fixtureKey: fixture.key
            });
        }

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
	 * @param {zerk.game.engine.system.physics.box2d.body} body Body
	 * @param {zerk.game.engine.system.physics.box2d.fixture} fixture Fixture
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
		fixDef.userData={
			entity: entity,
			body: body.key,
			fixture: fixture.key
		};
		
		fixDef.shape=new this._b2PolygonShape;
		
		// Check if the polygon is specified in clockwise order since Box2D requires that
		if (!zerk.helper.isPolygonClockwise(fixture.vertices)) {
			
			zerk.error({
				message: 'Polygon is not specified in clockwise order. Change'
					+' the order of the vertices in the fixture definition.',
				entityName: entity.name,
				bodyKey: body.key,
				fixtureKey: fixture.key,
				polygon: fixture.vertices,
				source: this
			});
			
		}
		
		// Create array of vertice instances
		var arr=[];
		var position=null;
		for (var i=0;i<fixture.vertices.length;i++) {

            var x=fixture.vertices[i][0];
            var y=fixture.vertices[i][1];

            /*
            if (x>this._maxFixtureSize) {
                zerk.error({
                    message: 'Fixture vertice position x too high \''+x+'\'. Maximum is \''+this._maxFixtureSize+'\'.',
                    entityName: entity.name,
                    fixtureKey: fixture.key
                });
            } else if (y>this._maxFixtureSize) {
                zerk.error({
                    message: 'Fixture vertice position y too high \''+y+'\'. Maximum is \''+this._maxFixtureSize+'\'.',
                    entityName: entity.name,
                    fixtureKey: fixture.key
                });
            } else if (x<this._minFixtureSize) {
                zerk.error({
                    message: 'Fixture vertice position x too small \''+x+'\'. Minimum is \''+this._minFixtureSize+'\'.',
                    entityName: entity.name,
                    fixtureKey: fixture.key
                });
            } else if (y<this._minFixtureSize) {
                zerk.error({
                    message: 'Fixture vertice position y too small \''+y+'\'. Minimum is \''+this._minFixtureSize+'\'.',
                    entityName: entity.name,
                    fixtureKey: fixture.key
                });
            }
            */

            var position=zerk.helper.rotatePosition(
                x,
                y,
                fixture.angle
            );

			arr.push(
				new this._b2Vec2(
                    fixture.x+position.x,
                    fixture.y+position.y
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
	 * @param {zerk.game.engine.system.physics.box2d.joint} joint Joint
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
	 * @param {zerk.game.engine.system.physics.box2d.joint} joint Joint
	 * @return {Object} Joint handle
	 * @protected
	 */
	_createJointDistance: function(entity,joint) {
		
		var bodySource=entity.getBody(joint.source)._physicsHandle;
		var bodyTarget=entity.getBody(joint.target)._physicsHandle;
		
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
	 * @param {zerk.game.engine.system.physics.box2d.joint} joint Joint
	 * @return {Object} Joint handle
	 * @protected
	 */
	_createJointRevolute: function(entity,joint) {
		
		var bodySource=this.getBody(entity,joint.source)._physicsHandle;
		var bodyTarget=this.getBody(entity,joint.target)._physicsHandle;
		
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
		
		if (!this._config.enableMouseJoint) {
			
			return;
			
		}
		
		/*
		 * TODO Remove the mouse joint from the physics system
		 */
		var systemControl=this._getSystem('control');
		
		if (systemControl 
		&& systemControl.mouse.mouseLeftDown 
		&& !this._mouseJoint) {
			
			var body=this.getBodyAtMouse();
			
			if (body) {
				
				this._mouseJoint=this._createJointMouse(
					body,
					systemControl.mouse.mouseX,
					systemControl.mouse.mouseY
				);
				
			}
			
		}
		
		if (this._mouseJoint) {
			
			if (systemControl.mouse.mouseLeftDown) {
				
				this._mouseJoint.SetTarget(
					new this._b2Vec2(
						systemControl.mouse.mouseX,
						systemControl.mouse.mouseY
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
		 * TODO Remove global call zerk.game._engine._system.physics
		 */
		var self=zerk.game._engine._system.physics;
		
		if (fixture.GetBody().GetType()
		!=self._b2Body.b2_staticBody) {
			
			if (fixture.GetShape().TestPoint(
				fixture.GetBody().GetTransform(),
				self._mouseJointVec
			)) {
				
				self._selectedBody=fixture.GetBody();
				return false;
				
			}
			
		}
		return true;
		
	}
	
});