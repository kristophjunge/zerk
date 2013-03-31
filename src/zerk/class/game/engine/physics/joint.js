/**
 * Joint
 * 
 * This class represents a joint in the Box2D interface.
 * 
 * All joints should inherit from here.
 * 
 * @class zerk.game.engine.physics.joint
 * @module zerk
 */
zerk.define({

	name: 'zerk.game.engine.physics.joint',
	require: [
		
	]
	
},{
		
	/**
	 * Type name of the joint
	 * 
	 * @property type
	 * @type String
	 */
	type: '',
	
	/**
	 * Key of the source body
	 * 
	 * @property source
	 * @type String
	 */
	source: '',
	
	/**
	 * Key of the target body
	 * 
	 * @property target
	 * @type String
	 */
	target: '',
	
	/**
	 * Horizontal anchor position of the joint on the source body
	 * 
	 * @property anchorSourceX
	 * @type Float
	 */
	anchorSourceX: 0,
	
	/**
	 * Vertical anchor position of the joint on the source body
	 * 
	 * @property anchorSourceY
	 * @type Float
	 */
	anchorSourceY: 0,
	
	/**
	 * Horizontal anchor position of the joint on the target body
	 * 
	 * @property anchorTargetX
	 * @type Float
	 */
	anchorTargetX: 0,
	
	/**
	 * Vertical anchor position of the joint on the target body
	 * 
	 * @property anchorTargetY
	 * @type Float
	 */
	anchorTargetY: 0,
	
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
	 */
	init: function() {
		
		this.sprites=[];
		
	}
	
});