/**
 * Physics Component
 *
 * CLASS_DESCRIPTION
 *
 * @class physics
 * @namespace zerk.game.engine.component
 * @extends zerk.game.engine.component
 * @module zerk
 **/
zerk.define({

    name: 'zerk.game.engine.component.physics',
    extend: 'zerk.game.engine.component'

},{

    _name: 'physics',

    build: function(entityConfig,worldConfig) {

        var defaultConfig={
            bodies: [],
            joints: []
        };

        var state={};

        // Apply default configuration
        zerk.apply(
            state,
            defaultConfig
        );

        // Merge with entity entityConfig worldConfiguration

        zerk.apply(
            state,
            entityConfig
        );

        state._bodyList=[];
        state._jointList=[];

        // Extend bodies
        for (var index in entityConfig.bodies) {

            /**
             * *** THIS IS NOT A CLASS! ITS A CONFIGURATION OBJECT. ***
             *
             * Physics body configuration.
             *
             * Represents a body in the Box2D interface.
             *
             * Used by {{#crossLink "zerk.game.engine.component.physics"}}{{/crossLink}}
             *
             * @class config.component.physics.body
             **/
            var extendedBody={

                /**
                 * Physics handle
                 *
                 * @property _physicsHandle
                 * @type Object
                 * @protected
                 */
                _physicsHandle: null,

                /**
                 * List of fixtures
                 *
                 * @property _fixtureList
                 * @type Array
                 * @protected
                 */
                _fixtureList: [],

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
                 * @type Float
                 * @deprecated
                 */
                width: 0,

                /**
                 * Total height of the body with all its fixtures and their positions
                 *
                 * @property height
                 * @type Float
                 * @deprecated
                 */
                height: 0,

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
                moveable: false,

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
                 * Fixtures of the body
                 *
                 * May contain one of:
                 *
                 * {{#crossLink "config.component.physics.body.fixture.rectangle"}}{{/crossLink}}
                 *
                 * @property fixtures
                 * @type Object
                 */
                fixtures: null

            };

            zerk.apply(extendedBody,entityConfig.bodies[index]);

            extendedBody.key=index;

            state.bodies[index]=extendedBody;

            state._bodyList.push(state.bodies[index]);

            var extendedFixture=null;

            for (var indexTwo in entityConfig.bodies[index].fixtures) {

                switch (entityConfig.bodies[index].fixtures[indexTwo].shape) {
                    case 'box':

                        /**
                         * *** THIS IS NOT A CLASS! ITS A CONFIGURATION OBJECT. ***
                         *
                         * Physics rectangle fixture configuration.
                         *
                         * Used by {{#crossLink "zerk.game.engine.component.physics"}}{{/crossLink}}
                         *
                         * @class rectangle
                         * @namespace config.component.physics.body.fixture
                         **/
                        extendedFixture={
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
                             * The horizontal position of the fixture related to the body center
                             *
                             * @property x
                             * @type Float
                             */
                            x: 0,

                            /**
                             * The vertical position of the fixture related to the body center
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
                             * Shape of the fixture
                             *
                             * @property type
                             * @type String
                             */
                            shape: 'box',

                            /**
                             * Width of the rectangle
                             *
                             * @property width
                             * @type Float
                             */
                            width: 0,

                            /**
                             * Height of the rectangle
                             *
                             * @property height
                             * @type Float
                             */
                            height: 0
                        };

                        break;
                    case 'circle':

                        /**
                         * *** THIS IS NOT A CLASS! ITS A CONFIGURATION OBJECT. ***
                         *
                         * Physics circle fixture configuration.
                         *
                         * Used by {{#crossLink "zerk.game.engine.component.physics"}}{{/crossLink}}
                         *
                         * @class circle
                         * @namespace config.component.physics.body.fixture
                         **/
                        extendedFixture={
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
                             * The horizontal position of the fixture related to the body center
                             *
                             * @property x
                             * @type Float
                             */
                            x: 0,

                            /**
                             * The vertical position of the fixture related to the body center
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
                             * Shape of the fixture
                             *
                             * @property type
                             * @type String
                             */
                            shape: 'circle',

                            /**
                             * Radius of the circle
                             *
                             * @property radius
                             * @type Float
                             */
                            radius: 0
                        };

                        break;
                    case 'polygon':

                        /**
                         * *** THIS IS NOT A CLASS! ITS A CONFIGURATION OBJECT. ***
                         *
                         * Physics polygon fixture configuration.
                         *
                         * Used by {{#crossLink "zerk.game.engine.component.physics"}}{{/crossLink}}
                         *
                         * @class polygon
                         * @namespace config.component.physics.body.fixture
                         **/
                        extendedFixture={
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
                             * The horizontal position of the fixture related to the body center
                             *
                             * @property x
                             * @type Float
                             */
                            x: 0,

                            /**
                             * The vertical position of the fixture related to the body center
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
                             * Shape of the fixture
                             *
                             * @property type
                             * @type String
                             */
                            shape: 'polygon',

                            /**
                             * List of vertices
                             *
                             * @property vertices
                             * @type Array
                             */
                            vertices: []
                        };

                        break;
                }

                zerk.apply(
                    extendedFixture,
                    entityConfig.bodies[index].fixtures[indexTwo]
                );

                extendedFixture.key=indexTwo;

                state.bodies[index].fixtures[indexTwo]=extendedFixture;

                state.bodies[index]._fixtureList.push(
                    state.bodies[index].fixtures[indexTwo]
                );

            }

        }

        // Extend joints
        var extendedJoint=null;

        for (var index in entityConfig.joints) {

            switch (entityConfig.joints[index].type) {
                case 'distance':

                    /**
                     * *** THIS IS NOT A CLASS! ITS A CONFIGURATION OBJECT. ***
                     *
                     * Physics distance joint configuration.
                     *
                     * Used by {{#crossLink "zerk.game.engine.component.physics"}}{{/crossLink}}
                     *
                     * @class distance
                     * @namespace config.component.physics.joint
                     **/
                    extendedJoint={
                        /**
                         * Type name of the joint
                         *
                         * @property type
                         * @type String
                         */
                        type: 'distance',

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
                    };

                    break;
                case 'revolute':

                    /**
                     * *** THIS IS NOT A CLASS! ITS A CONFIGURATION OBJECT. ***
                     *
                     * Physics revolute joint configuration.
                     *
                     * Used by {{#crossLink "zerk.game.engine.component.physics"}}{{/crossLink}}
                     *
                     * @class revolute
                     * @namespace config.component.physics.joint
                     **/
                    extendedJoint={
                        /**
                         * Type name of the joint
                         *
                         * @property type
                         * @type String
                         */
                        type: 'revolute',

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
                    };

                    break;
                case 'prismatic':

                    /**
                     * *** THIS IS NOT A CLASS! ITS A CONFIGURATION OBJECT. ***
                     *
                     * Physics prismatic joint configuration.
                     *
                     * Used by {{#crossLink "zerk.game.engine.component.physics"}}{{/crossLink}}
                     *
                     * @class prismatic
                     * @namespace config.component.physics.joint
                     **/
                    extendedJoint={
                        /**
                         * Type name of the joint
                         *
                         * @property type
                         * @type String
                         */
                        type: 'prismatic',

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
                         * Whether the joint limits will be active
                         *
                         * @property enableLimit
                         * @type Boolean
                         */
                        enableLimit: false,

                        /**
                         *
                         *
                         * @property lowerTranslation
                         * @type Float
                         */
                        lowerTranslation: 0,

                        /**
                         *
                         *
                         * @property upperTranslation
                         * @type Float
                         */
                        upperTranslation: 0,

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
                         * Max motor force
                         *
                         * @property maxMotorForce
                         * @type Float
                         */
                        maxMotorForce: 1.0
                    };

                    break;
            }

            zerk.apply(extendedJoint,entityConfig.joints[index]);

            extendedJoint.key=index;

            state.joints[index]=extendedJoint;

            state._jointList[index]=state.joints[index];

        }

        // Merge with world entityConfig worldConfiguration
        zerk.apply(
            state,
            worldConfig
        );

        return state;

    }

});