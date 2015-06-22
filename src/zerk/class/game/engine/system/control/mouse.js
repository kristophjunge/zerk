/**
 * Mouse Interface
 *
 * Provides methods to handle mouse inputs.
 *
 * @class mouse
 * @namespace zerk.game.engine.system.control
 * @extends zerk.observable
 * @module zerk
 **/
/*
 * TODO Use DOM interface instead of native code
 */
zerk.define({

    name: 'zerk.game.engine.system.control.mouse',
    extend: 'zerk.observable'

}, {

    /**
     * Horizontal cursor position
     *
     * @property mouseX
     * @type Integer
     */
    mouseX: null,

    /**
     * Vertical cursor position
     *
     * @property mouseX
     * @type Integer
     */
    mouseY: null,

    /**
     * State of the left mouse button
     *
     * @property mouseLeftDown
     * @type Boolean
     */
    mouseLeftDown: false,

    /**
     * State of the middle mouse button
     *
     * @property mouseMiddleDown
     * @type Boolean
     */
    mouseMiddleDown: false,

    /**
     * State of the right mouse button
     *
     * @property mouseRightDown
     * @type Boolean
     */
    mouseRightDown: false,

    /**
     * Coordinates of the last mouse position
     *
     * @property _lastMousePosition
     * @type {Object}
     * @protected
     */
    _lastMousePosition: null,

    _lastMouseButton: -1,

    _doubleClickDelay: 200,

    _lastClickTime: 0,

    /**
     * State of the mouse joint
     *
     * @property _mouseJointActive
     * @type Boolean
     * @protected
     */
    _mouseJointActive: false,

    /**
     * Back reference to control class
     *
     * @property _control
     * @type zerk.game.engine.system.control
     */
    _control: null,

    _viewport: null,

    _config: null,

    /**
     * Class constructor
     *
     * @method init
     * @param {zerk.game.engine} engine
     */
    init: function(control, viewport, config) {

        zerk.parent('zerk.game.engine.system.control.mouse').init.apply(
            this,
            arguments
        );

        this._control = control;
        this._viewport = viewport;
        this._config = config;

        var self = this;

        var canvas = this._viewport.getCanvasElement('display');

        canvas.addEventListener(
            'click',
            function(event) {

                return self._onClick(event);

            }
        );

        canvas.addEventListener(
            'mousedown',
            function(event) {

                return self._onMouseDown(event);

            }
        );

        canvas.addEventListener(
            'mouseup',
            function(event) {

                return self._onMouseUp(event);

            }
        );

        canvas.addEventListener(
            'mousemove',
            function(event) {

                return self._onMouseMove(event);

            }
        );

        canvas.addEventListener(
            'contextmenu',
            function(event) {

                return self._onContextMenu(event);

            },
            false
        );

        zerk.browser.registerEvent(
            document,
            'mousewheel',
            function(event) {

                self._onMouseScroll(event);

            }
        );

    },

    /**
     * Returns the position of the cursor by given mouse event
     *
     * @method _getCursorPosition
     * @param {event} event Native mouse event
     * @return {Object} Coordinate object
     * @protected
     */
    _getCursorPosition: function(event) {

        var position = this._viewport.getCanvasPosition('display');

        return {
            x: event.clientX - position.left,
            y: event.clientY - position.top
        };

    },

    /**
     * Context menu event handler
     *
     * @method _onContextMenu
     * @param {event} event Native event
     * @return {Boolean} Returns false
     * @protected
     */
    _onContextMenu: function(event) {

        event.preventDefault();

        return false;

    },

    /**
     * Mouse down event handler
     *
     * @method _onMouseDown
     * @param {event} event Native event
     * @return {Boolean}
     * @protected
     */
    _onMouseDown: function(event) {

        var me = this;

        event.preventDefault();

        if (event.button == 0) {

            this.mouseLeftDown = true;

            /*
             * Trigger the mouse move event to interact
             * directly on click position
             */
            this._onMouseMove(event);

        } else if (event.button == 1) {

            this.mouseMiddleDown = true;

        } else if (event.button == 2) {

            this.mouseRightDown = true;

        }

        /**
         * Fires when a mouse button is pressed
         *
         * @param {DOMEvent} event
         * @event mousedown
         */
        this.fireEvent('mousedown', event);

        return false;

    },

    /**
     * Mouse up event handler
     *
     * @method _onMouseUp
     * @param {event} event Native event
     * @return {Boolean} Returns false
     * @protected
     */
    _onMouseUp: function(event) {

        if (event.button == 0) {

            this.mouseLeftDown = false;

        } else if (event.button == 1) {

            this.mouseMiddleDown = false;

        } else if (event.button == 2) {

            this.mouseRightDown = false;

        }

        /**
         * Fires when a mouse button is released
         *
         * @param {DOMEvent} event
         * @event mouseup
         */
        this.fireEvent('mouseup', event);

        return false;

    },

    /**
     * Mouse move event handler
     *
     * @method _onMouseMove
     * @param {event} event Native event
     * @protected
     */
    _onMouseMove: function(event) {

        var position = this._getCursorPosition(event);

        if (this.mouseMiddleDown) {

            /*
             * TODO Remove the mouse view from the controls system
             */
            this._viewport.setX(
                this._viewport.getX() - this._viewport.fromZoom(
                    (position.x - this._lastMousePosition.x) * this._config.zoomSpeed
                )
            );

            this._viewport.setY(
                this._viewport.getY() - this._viewport.fromZoom(
                    (position.y - this._lastMousePosition.y) * this._config.zoomSpeed
                )
            );

        }

        this.mouseX = this._viewport.fromPixel(this._viewport.getX() + this._viewport.fromZoom(
                position.x - (this._viewport.getWidth() / 2))
            );

        this.mouseY = this._viewport.fromPixel(this._viewport.getY() + this._viewport.fromZoom(
                position.y - (this._viewport.getHeight() / 2))
            );

        this._lastMousePosition = this._getCursorPosition(event);

        /**
         * Fires when the cursor is moved
         *
         * @param {DOMEvent} event
         * @event mousemove
         */
        this.fireEvent('mousemove', event);

    },

    /**
     * Mouse scroll event handler
     *
     * @method _onMouseScroll
     * @param {event} event Native event
     * @protected
     */
    _onMouseScroll: function(event) {

        event = ((event) ? event : window.event);
        var delta = ((event.detail) ? event.detail : event.wheelDelta * -1);

        /*
         * TODO Remove the mouse zoom from the controls system
         */
        if (this._config.enableWheelZoom) {

            if (delta < 0) {

                this._viewport.zoomIn();

            } else {

                this._viewport.zoomOut();

            }

        }

    },

    _onClick: function() {

        var me = this;

        var now = new Date();

        /**
         * Fires when a mouse button is pressed
         *
         * @param {DOMEvent} event
         * @event click
         */
        this.fireEvent('click', event);

        if (me._lastMouseButton == event.button &&
        me._lastClickTime >= now.getTime() - me._doubleClickDelay) {

            /**
             * Fires when a mouse button is pressed
             *
             * @param {DOMEvent} event
             * @event doubleclick
             */
            me.fireEvent('doubleclick', event);

        }

        me._lastMouseButton = event.button;
        me._lastClickTime = now.getTime();

    }

});
