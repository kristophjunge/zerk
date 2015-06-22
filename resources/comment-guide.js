/**
 * CLASS_TITLE
 * 
 * CLASS_DESCRIPTION
 * 
 * @class CLASS_NAME
 * @namespace CLASS_NAMESPACE
 * @extends PARENT_CLASS_NAME
 * @module zerk
 **/


/**
 * STATIC_CLASS_TITLE
 * 
 * CLASS_DESCRIPTION
 * 
 * @class CLASS_NAME
 * @namespace CLASS_NAMESPACE
 * @extends PARENT_CLASS_NAME
 * @module zerk
 * @static
 **/


/**
@example
    model.set('foo', 'bar');
**/


    /**
     * PRIVATE_PROPERTY_DESCRIPTION
     *
     * @property PROPERTY_NAME
     * @type Boolean|Integer|Float|String|Object|Array|Function|Mixed|Any|CLASS_NAME
     * @default VALUE
     * @private
     * @deprecated
     **/


    /**
     * PROTECTED_PROPERTY_DESCRIPTION
     *
     * @property PROPERTY_NAME
     * @type Boolean|Integer|Float|String|Object|Array|Function|Mixed|Any|CLASS_NAME
     * @default VALUE
     * @protected
     * @deprecated
     **/


    /**
     * PUBLIC_PROPERTY_DESCRIPTION
     *
     * @property PROPERTY_NAME
     * @type Boolean|Integer|Float|String|Object|Array|Function|Mixed|Any|CLASS_NAME
     * @default VALUE
     * @deprecated
     **/


    /**
     * PRIVATE_METHOD_DESCRIPTION
     *
     * @method METHOD_NAME
     * @param {Boolean|Integer|Float|String|Object|Array|Function|Mixed|Any|CLASS_NAME} PARAM_NAME PARAM_DESCRIPTION
     *     SECOND_LINE
     * @return {Boolean|Integer|Float|String|Object|Array|Function|Mixed|Any|CLASS_NAME} RETURN_DESCRIPTION
     * @private
     * @async
     * @deprecated
     **/


    /**
     * PROTECTED_METHOD_DESCRIPTION
     *
     * @method METHOD_NAME
     * @param {Boolean|Integer|Float|String|Object|Array|Function|Mixed|Any|CLASS_NAME} PARAM_NAME PARAM_DESCRIPTION
     *     SECOND_LINE
     * @return {Boolean|Integer|Float|String|Object|Array|Function|Mixed|Any|CLASS_NAME} RETURN_DESCRIPTION
     * @protected
     * @async
     * @deprecated
     **/


    /**
     * PUBLIC_METHOD_DESCRIPTION
     *
     * @method METHOD_NAME
     * @param {Boolean|Integer|Float|String|Object|Array|Function|Mixed|Any|CLASS_NAME} PARAM_NAME PARAM_DESCRIPTION
     *     SECOND_LINE
     * @return {Boolean|Integer|Float|String|Object|Array|Function|Mixed|Any|CLASS_NAME} RETURN_DESCRIPTION
     * @async
     * @deprecated
     **/


    /**
     * EVENT_DESCRIPTION
     *
     * @event EVENT_NAME
     * @param {Boolean|Integer|Float|String|Object|Array|Function|Mixed|Any|CLASS_NAME} PARAM_NAME PARAM_DESCRIPTION
     *     SECOND_LINE
     * @return {Boolean|Integer|Float|String|Object|Array|Function|Mixed|Any|CLASS_NAME} RETURN_DESCRIPTION
     * @deprecated
     **/


    /**
     * Class constructor
     *
     * @method init
     * @param {Boolean|Integer|Float|String|Object|Array|Function|Mixed|Any|CLASS_NAME} PARAM_NAME PARAM_DESCRIPTION
     *     SECOND_LINE
     **/


    /**
     * Example code:
     *
     *    start: function() {
     *
     *        this._log('Started');
     *
     *        this._running=true;
     *
     *        this._tick(); // Run the first tick
     *
     *        this._startTimer();
     *
     *        return true;
     *
     *    }
     *
     **/


    /**
     * Example JSON Object:
     *
     *    {
     *        // Comment
     *        a: 'b',
     *        // Multiine comment
     *        // goes this way
     *        c: 'd'
     *    }
     *
     **/


    // Inline config structure

    /**
     * *** THIS IS NOT A CLASS! ITS A CONFIGURATION OBJECT. ***
     *
     * CONFIGURATION_SUBJECT configuration.
     *
     * Used by {{#crossLink "OWNER_CLASS_NAME"}}{{/crossLink}}
     *
     * @class config.CONFIGURATION_NAME
     **/

    /**
     * CONFIG_DESCRIPTION
     *
     * @property CONFIG_NAME
     * @type Boolean|Integer|Float|String|Object|Array|Function|Mixed
     * @default VALUE
     * @deprecated
     **/


    /**
     * @for RESUME_CLASS_NAME
     **/


    /**
     * @param {Function} successHandler Event handler for success
     * @param {Function} errorHandler Event handler for error
     **/


     /**
      * @param {DOMEvent} event Event information
      */


    /**
     * Local log method
     *
     * @method _log
     * @param {String} message Log message
     * @param {Integer} severity Log severity
     * @protected
     **/


    // System properties

    /**
     * Thread that runs this system
     *
     * @property _thread
     * @type String
     * @protected
     **/


    /**
     * Priority of this system
     *
     * @property _priority
     * @type Integer
     * @protected
     **/


    /**
     * Viewport system instance
     *
     * @property _viewport
     * @type zerk.game.engine.system.viewport
     * @protected
     **/


    /**
     * Physics system instance
     *
     * @property _physics
     * @type zerk.game.engine.system.physics
     * @protected
     **/


    // System methods

    /**
     * Starts the system
     *
     * @method start
     **/


    /**
     * Stops the system
     *
     * @method stop
     **/


    /**
     * Updates the system
     *
     * @method update
     **/


    /**
     * Returns true when the system is interested in given component
     *
     * @method useComponent
     * @param {String} name Component name
     * @return {Boolean} True when the system is intereseted in given component
     **/


    /**
     * Returns the configuration defaults of the system
     *
     * @method _getConfigDefaults
     * @return {Object} Default configuration
     * @protected
     **/


    /**
     * Adds an entity to the system
     *
     * @method addEntity
     * @param {config.entity} entity Entity state
     **/


    /**
     * Removes an entity from the system
     *
     * @method removeEntity
     * @param {config.entity} entity Entity state
     **/



    // Code comment


    // Multiline comment
    // goes this way


    /*--------------------------------------------------------------------------
     | Method seperator block
     *------------------------------------------------------------------------*/


    /*--------------------------------------------------------------------------
     |
     | Block for larger explanation
     |
     | Some content here
     |
     *------------------------------------------------------------------------*/


    // Is true when ...

    // Returns true if the given ... is ...

    // Fires when ...

    // Base class for ... . All ... should inherit from here.


    /*
     * TODO Some todo instructions here
     */


    /*

    List of special data types:
    ---------------------------
    DOMElement
    DOMEvent
    DOMTimer
    Box2D.Common.Math.b2Vec2
    Box2D.Collision.b2AABB
    Box2D.Dynamics.b2BodyDef
    Box2D.Dynamics.b2Body
    Box2D.Dynamics.b2FixtureDef
    Box2D.Dynamics.b2Fixture
    Box2D.Dynamics.b2World
    Box2D.Collision.Shapes.b2PolygonShape
    Box2D.Collision.Shapes.b2CircleShape
    Box2D.Dynamics.b2DebugDraw
    Box2D.Dynamics.Joints.b2MouseJointDef
    Box2D.Dynamics.Joints.b2RevoluteJointDef
    Box2D.Dynamics.Joints.b2DistanceJointDef
    Box2D.Dynamics.b2ContactListener

    */