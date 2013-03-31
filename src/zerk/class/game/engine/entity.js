/**
 * Entity
 * 
 * All entities should inherit from here.
 * 
 * @class zerk.game.engine.entity
 * @extends zerk.observable
 * @module zerk
 */
zerk.define({
	
	name: 'zerk.game.engine.entity',
	extend: 'zerk.observable'
	
},{
	
	/**
	 * Fires when the entity gets spawned
	 * 
	 * @event spawn
	 * @return {Boolean} Return false to Cancel bubble
	 */
	
	/**
	 * Fires every world simulation tick
	 * 
	 * @event tick
	 * @return {Boolean} Return false to Cancel bubble
	 */
	
	/**
	 * Fires when two fixtures start colliding
	 * 
	 * @event contactbegin
	 * @param {zerk.game.engine.physics.fixture} sourceFixture Source fixture
	 * @param {zerk.game.engine.physics.fixture} targetFixture Target fixture
	 * @return {Boolean} Return false to Cancel bubble
	 */
	
	/**
	 * Fires when two fixtures stop colliding
	 * 
	 * @event contactend
	 * @param {zerk.game.engine.physics.fixture} sourceFixture Source fixture
	 * @param {zerk.game.engine.physics.fixture} targetFixture Target fixture
	 * @return {Boolean} Return false to Cancel bubble
	 */
	
	/**
	 * Fires before two fixtures start colliding
	 * 
	 * @event contactpostsolve
	 * @param {zerk.game.engine.physics.fixture} sourceFixture Source fixture
	 * @param {zerk.game.engine.physics.fixture} targetFixture Target fixture
	 * @param {Object} impulse
	 * @return {Boolean} Return false to Cancel bubble
	 */
	
	/**
	 * Name of the entity
	 * 
	 * @property name
	 * @type String
	 */
	name: '',
	
	/**
	 * Width of the entity
	 * 
	 * @property width
	 * @type Integer
	 */
	width: 0,
	
	/**
	 * Height of the entity
	 * 
	 * @property height
	 * @type Integer
	 */
	height: 0,
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 * @param {zerk.game.engine} engine Game engine
	 * @param {Object} config Entity configuration
	 */
	init: function(engine) {
		
		zerk.parent('zerk.game.engine.entity').init.apply(
			this,
			arguments
		);
		
		this._engine=engine;
		
		this.joints=[];
		this.sprites={};
		
		// Extend default config with local config
		
		this.config={
			id: '',
			x: 0,
			y: 0,
			bodies: [
				
			]
		};
		
	},
	
	/**
	 * Destroys this entity and removes it from the world
	 * 
	 * @method destroy
	 */
	destroy: function() {
		
		this._engine.world.destroy(this);
		
	},
	
	/**
	 * Entity setup method
	 * 
	 * Entities should define their bodies and joints in this method
	 * 
	 * @method setup
	 */
	setup: function() {
		
		// Calculate initial positions relative to the origin body
		var x=0.0;
		var y=0.0;
		var angle=0;
		
		// Create positions for each body
		if (this.config.bodies.length==0) {
			
			for (var index in this.bodies) {
				
				if (this.bodies[index].origin) {
					
					x=this.config.x;
					y=this.config.y;
					
					if (this.config.angle) {
						
						angle=this.config.angle;
						
					} else {
						
						angle=this.bodies[index].angle;
						
					}
					
				} else {
					
					x=this.config.x+this.bodies[index].x;
					y=this.config.y+this.bodies[index].y;
					angle=this.bodies[index].angle;
					
				}
				
				this.config.bodies[this.bodies[index].key]={
					x: x,
					y: y,
					angle: angle
				};
				
			}
			
		}
		
		for (var index in this.bodies) {
			
			var extendedBody=zerk.create(
				'zerk.game.engine.physics.body'
			);
			
			zerk.apply(extendedBody,this.bodies[index]);
			
			extendedBody._entity=this;
			
			this.bodies[index]=extendedBody;
			
			var extendedFixture=null;
			
			for (var indexTwo in this.bodies[index].fixtures) {
				
				switch (this.bodies[index].fixtures[indexTwo].shape) {
					case 'box':
						extendedFixture=zerk.create(
							'zerk.game.engine.physics.fixture.rectangle',
							this.bodies[index]
						);
						break;
					case 'circle':
						extendedFixture=zerk.create(
							'zerk.game.engine.physics.fixture.circle',
							this.bodies[index]
						);
						break;
					case 'polygon':
						extendedFixture=zerk.create(
							'zerk.game.engine.physics.fixture.polygon',
							this.bodies[index]
						);
						break;
				}
				
				zerk.apply(
					extendedFixture,
					this.bodies[index].fixtures[indexTwo]
				);
				
				this.bodies[index].fixtures[indexTwo]=extendedFixture;
				
			}
			
		}
		
		var extendedJoint=null;
		
		for (var index in this.joints) {
			
			switch (this.joints[index].type) {
				case 'distance':
					extendedJoint=zerk.create(
						'zerk.game.engine.physics.joint.distance'
					);
					break;
				case 'revolute':
					extendedJoint=zerk.create(
						'zerk.game.engine.physics.joint.revolute'
					);
					break;
			}
			
			zerk.apply(extendedJoint,this.joints[index]);
			
			this.joints[index]=extendedJoint;
			
		}
		
		this._createMapBody();
		
	},
	
	/**
	 * Apply configuration object
	 * 
	 * @method applyConfig
	 * @param {Object} config
	 */
	applyConfig: function(config) {
		
		zerk.apply(
			this.config,
			config
		);
		
	},
	
	/**
	 * Returns a body by key
	 * 
	 * @method getBody
	 * @param {String} key Key of the body
	 * @return {zerk.game.engine.physics.body} Body instance
	 */
	getBody: function(key) {
		
		return this._mapBody[key];
		
	},
	
	/**
	 * Create a map to the physics handles of all bodies by their keys
	 * 
	 * @method _createMapBody
	 * @protected
	 */
	_createMapBody: function() {
		
		this._mapBody={};
		
		for (var index in this.bodies) {
			this._mapBody[this.bodies[index].key]=this.bodies[index];
		}
		
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
	_bodyApplyImpulse: function(bodyKey,degrees,power) {
		
		var physicsBody=this._mapBody[bodyKey].physicsHandle;
		
		physicsBody.ApplyImpulse(
			new this._engine.physics._b2Vec2(
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
	_setLinearVelocity: function(bodyKey,degrees,power) {
		
		var physicsBody=this._mapBody[bodyKey].physicsHandle;
		
		physicsBody.SetLinearVelocity(
			new this._engine.physics._b2Vec2(
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
	_setBodyPosition: function(bodyKey,position) {
		
		var physicsBody=this._mapBody[bodyKey].physicsHandle;
		
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
	_setBodySleepingAllowed: function(bodyKey,allowed) {
		
		this.getBody(bodyKey).physicsHandle.SetSleepingAllowed(allowed);
		
	},
	
	/**
	 * Sets whether given body is moveable
	 * 
	 * @method _setBodyMoveable
	 * @param {String} bodyKey
	 * @param {Boolean} moveable
	 * @protected
	 */
	_setBodyMoveable: function(bodyKey,moveable) {
		
		var type=((moveable)
			? this._engine.physics._b2Body.b2_dynamicBody
			: this._engine.physics._b2Body.b2_staticBody);
		
		this.getBody(bodyKey).physicsHandle.SetType(
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
	_setBodyKinematic: function(bodyKey) {
		
		this.getBody(bodyKey).physicsHandle.SetType(
			this._engine.physics._b2Body.b2_kinematicBody
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
	_getBodyPosition: function(bodyKey) {
		
		return this.getBody(bodyKey).physicsHandle.GetPosition();
		
	},
	
	/**
	 * Returns the linear velocity of given body
	 * 
	 * @method _getBodyLinearVelocity
	 * @param {String} bodyKey
	 * @return {Object}
	 * @protected
	 */
	_getBodyLinearVelocity: function(bodyKey) {
		
		return this.getBody(bodyKey).physicsHandle.GetLinearVelocity();
		
	},
	
	/**
	 * Destroys given body
	 * 
	 * @method _destroyBody
	 * @param {String} bodyKey
	 * @protected
	 */
	_destroyBody: function(bodyKey) {
		
		var found=false;
		
		for (var i=0;i<this.bodies.length;i++) {
			
			if (this.bodies[i].key==bodyKey) {
				found=true;
				break;
			}
			
		}
		
		if (!found) return;
		
		this._engine.physics.scheduleDestroyBody(
			this,
			this.getBody(bodyKey)
		);
		
		this.bodies.splice(i,1);
		
		return true;
		
	}
	
});