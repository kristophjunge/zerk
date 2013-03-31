/**
 * Revolute joint
 * 
 * @class zerk.game.engine.physics.joint.revolute
 * @extends zerk.game.engine.physics.joint
 * @module zerk
 */
zerk.define({

	name: 'zerk.game.engine.physics.joint.revolute',
	extend: 'zerk.game.engine.physics.joint'
	
},{
	
	/**
	 * Type name of the joint
	 * 
	 * @property type
	 * @type String
	 */
	type: 'revolute',
	
	/**
	 * Horizontal position on the source body
	 * 
	 * @property anchorSourceX
	 * @type Float
	 */
	anchorSourceX: 0,
	
	/**
	 * Vertical position on the source body
	 * 
	 * @property anchorSourceY
	 * @type Float
	 */
	anchorSourceY: 0,
	
	/**
	 * Whether the joint limits will be active
	 * 
	 * @property enableLimit
	 * @type Boolean
	 */
	enableLimit: false,
	
	/**
	 * Angle for the lower limit
	 * 
	 * @property lowerAngle
	 * @type Float
	 */
	lowerAngle: 0,
	
	/**
	 * Angle for the upper limit
	 * 
	 * @property upperAngle
	 * @type Float
	 */
	upperAngle: 0,
	
	/**
	 * Whether the joint motor will be active
	 * 
	 * @property enableMotor
	 * @type Boolean
	 */
	enableMotor: false,
	
	/**
	 * The target speed of the joint motor
	 * 
	 * Positive for counter clockwise, negative for clockwise
	 * 
	 * @property motorSpeed
	 * @type Float
	 */
	motorSpeed: 0,
	
	/**
	 * Motor torque
	 * 
	 * The maximum allowable torque the motor can use. 
	 * A torque too weak won't be able to move the bodies.
	 * 
	 * @property maxMotorTorque
	 * @type Float
	 */
	maxMotorTorque: 10 
	
});