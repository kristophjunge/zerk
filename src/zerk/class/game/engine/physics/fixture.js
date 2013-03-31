/**
 * Fixture
 * 
 * This class represents a fixture in the Box2D interface.
 * 
 * All fixtures should inherit from here.
 * 
 * @class zerk.game.engine.physics.fixture
 * @module zerk
 */
zerk.define({

	name: 'zerk.game.engine.physics.fixture',
	require: [
		
	]
	
},{
	
	/**
	 * Parent body
	 * 
	 * @property body
	 * @type zerk.game.engine.physics.body
	 */
	body: null,
	
	/**
	 * Key of the fixture
	 * 
	 * @property key
	 * @type String
	 */
	key: '',
	
	/**
	 * Shape of the fixture
	 * 
	 * @property shape
	 * @type String
	 */
	shape: '',
	
	/**
	 * Horizontal position of the fixture related to the body center
	 * 
	 * @property x
	 * @type Float
	 */
	x: 0,
	
	/**
	 * Vertical position of the fixture related to the body center
	 * 
	 * @property y
	 * @type Float
	 */
	y: 0,
	
	/**
	 * Density
	 * 
	 * The fixture density is used to compute the mass properties of the parent 
	 * body. The density can be zero or positive. You should generally use 
	 * similar densities for all your fixtures. This will improve stacking 
	 * stability.
	 *  
	 * The mass of a body is not adjusted when you set the density. 
	 * You must call ResetMassData for this to occur.
	 * 
	 * @property density
	 * @type Float
	 */
	density: 1.0,
	
	/**
	 * Slide behaviour
	 * 
	 * Friction is used to make objects slide along each other realistically. 
	 * Box2D supports static and dynamic friction, but uses the same parameter 
	 * for both. Friction is simulated accurately in Box2D and the friction 
	 * strength is proportional to the normal force (this is called Coulomb 
	 * friction). The friction parameter is usually set between 0 and 1, but 
	 * can be any non-negative value. A friction value of 0 turns off friction 
	 * and a value of 1 makes the friction strong. When the friction force is 
	 * computed between two shapes, Box2D must combine the friction parameters 
	 * of the two parent fixtures
	 * 
	 * @property friction
	 * @type Float
	 */
	friction: 0.2,
	
	/**
	 * Bounce behaviour
	 * 
	 * Restitution is used to make objects bounce.
	 * 
	 * The restitution value is usually set to be between 0 and 1. 
	 * Consider dropping a ball on a table. A value of zero means the ball 
	 * won't bounce. This is called an inelastic collision. A value of one 
	 * means the ball's velocity will be exactly reflected. This is called a 
	 * perfectly elastic collision.
	 * 
	 * @property restitution
	 * @type Float
	 */
	restitution: 0.0,
	
	/**
	 * Rotation angle of the fixture
	 * 
	 * @property angle
	 * @type Float
	 */
	angle: 0,
	
	/**
	 * Category bits
	 * 
	 * @property categoryBits
	 * @type Null|Integer
	 */
	categoryBits: -1,
	
	/**
	 * Mask bits
	 * 
	 * @property maskBits
	 * @type Null|Integer
	 */
	maskBits: -1,
	
	/**
	 * Indicates that the fixture is a sensor
	 * 
	 * @property isSensor
	 * @type Boolean
	 */
	isSensor: false,
	
	/**
	 * List of sprites
	 * 
	 * @property sprites
	 * @type Array
	 */
	sprites: null,
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 * @param {zerk.game.engine.physics.body} body
	 */
	init: function(body) {
		
		this.body=body;
		this.sprites=[];
		
	}
	
});