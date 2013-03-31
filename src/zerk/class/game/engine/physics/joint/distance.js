/**
 * Distance joint
 * 
 * @class zerk.game.engine.physics.joint.distance
 * @extends zerk.game.engine.physics.joint
 * @module zerk
 */
zerk.define({

	name: 'zerk.game.engine.physics.joint.distance',
	extend: 'zerk.game.engine.physics.joint'
	
},{
	
	/**
	 * Type name of the joint
	 * 
	 * @property type
	 * @type String
	 */
	type: 'distance',
	
	/**
	 * Frequency
	 * 
	 * The frequency is specified in Hertz. Typically the frequency should 
	 * be less than a half the frequency of the time step. So if you are 
	 * using a 60Hz time step, the frequency of the distance joint should 
	 * be less than 30Hz. The reason is related to the Nyquist frequency.
	 * 
	 * @property frequencyHz
	 * @type Float
	 */
	frequencyHz: 4.0,
	
	/**
	 * Damping ratio
	 * 
	 * The damping ratio is non-dimensional and is typically between 0 
	 * and 1, but can be larger. At 1, the damping is critical 
	 * (all oscillations should vanish).
	 * 
	 * @property dampingRatio
	 * @type Float
	 */
	dampingRatio: 0.5,
	
	/**
	 * Indicates that connected bodies can collide each other
	 * 
	 * @property collideConnected
	 * @type Boolean
	 */
	collideConnected: false
	
});