/**
 * Body
 * 
 * This class represents a body in the Box2D interface.
 * 
 * @class zerk.game.engine.physics.body
 * @module zerk
 */
zerk.define({

	name: 'zerk.game.engine.physics.body'
	
},{
		
	/**
	 * Identification key
	 * 
	 * Unique inside the enitity.
	 * 
	 * @property key
	 * @type String
	 */
	key: '',
	
	/**
	 * Physics handle
	 * 
	 * @property physicsHandle
	 * @type Object
	 */
	physicsHandle: null,
	
	/**
	 * Indicates that this body is the origin of its parent entity
	 * 
	 * @property origin
	 * @type Boolean
	 */
	origin: false,
	
	/**
	 * The horizontal position of the body related to the entity center
	 * 
	 * @property x
	 * @type Float
	 */
	x: 0,
	
	/**
	 * The vertical position of the body related to the entity center
	 * 
	 * @property y
	 * @type Float
	 */
	y: 0,
	
	/**
	 * Total width of the body with all its fixtures and their positions
	 * 
	 * @property width
	 * @type Integer
	 */
	width: 3,
	
	/**
	 * Total height of the body with all its fixtures and their positions
	 * 
	 * @property height
	 * @type Integer
	 */
	height: 3,
	
	/**
	 * Rotation angle of the body
	 * 
	 * @property angle
	 * @type Float
	 */
	angle: 0,
	
	/**
	 * Indicates that the body is moveable
	 *  
	 * @property moveable
	 * @type Boolean
	 */
	moveable: true,
	
	/**
	 * Sets the body to be kinematic
	 * 
	 * @property kinematic
	 * @type Boolean
	 */
	kinematic: false,
	
	/**
	 * Indicates that the body cannot rotate
	 * 
	 * @property fixedRotation
	 * @type Boolean
	 */
	fixedRotation: false,
	
	/**
	 * Fixtures array
	 * 
	 * An array of fixtures bound to this body
	 * 
	 * @property fixtures
	 * @type Array
	 */
	fixtures: null,
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 */
	init: function() {
		
		this.fixtures=[];
		
	}
	
});