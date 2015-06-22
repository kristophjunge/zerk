/**
 * Keyboard Interface
 *
 * Provides methods to handle keyboard inputs.
 *
 * @class keyboard
 * @namespace zerk.game.engine.system.control
 * @extends zerk.observable
 * @module zerk
 **/
/*
 * TODO Complete keycode list
 */
/*
 * TODO Use DOM interface instead of native code
 */
zerk.define({

    name: 'zerk.game.engine.system.control.keyboard',
    extend: 'zerk.observable'

},{

    /**
     * State of the backspace key
     *
     * @property pressedBackspace
     * @type Boolean
     */
    pressedBackspace: false,

    /**
     * State of the tab key
     *
     * @property pressedTab
     * @type Boolean
     */
    pressedTab: false,

    /**
     * State of the enter key
     *
     * @property pressedEnter
     * @type Boolean
     */
    pressedEnter: false,

    /**
     * State of the shift key
     *
     * @property pressedShift
     * @type Boolean
     */
    pressedShift: false,

    /**
     * State of the ctrl key
     *
     * @property pressedCtrl
     * @type Boolean
     */
    pressedCtrl: false,

    /**
     * State of the alt key
     *
     * @property pressedAlt
     * @type Boolean
     */
    pressedAlt: false,

    /**
     * State of the pause key
     *
     * @property pressedPause
     * @type Boolean
     */
    pressedPause: false,

    /**
     * State of the capslock key
     *
     * @property pressedCapsLock
     * @type Boolean
     */
    pressedCapsLock: false,

    /**
     * State of the escape key
     *
     * @property pressedEscape
     * @type Boolean
     */
    pressedEscape: false,

    /**
     * State of the space key
     *
     * @property pressedSpace
     * @type Boolean
     */
    pressedSpace: false,

    /**
     * State of the pageup key
     *
     * @property pressedPageUp
     * @type Boolean
     */
    pressedPageUp: false,

    /**
     * State of the pagedown key
     *
     * @property pressedPageDown
     * @type Boolean
     */
    pressedPageDown: false,

    /**
     * State of the end key
     *
     * @property pressedEnd
     * @type Boolean
     */
    pressedEnd: false,

    /**
     * State of the home key
     *
     * @property pressedHome
     * @type Boolean
     */
    pressedHome: false,

    /**
     * State of the arrow left key
     *
     * @property pressedArrowLeft
     * @type Boolean
     */
    pressedArrowLeft: false,

    /**
     * State of the arrow up key
     *
     * @property pressedArrowUp
     * @type Boolean
     */
    pressedArrowUp: false,

    /**
     * State of the arrow right key
     *
     * @property pressedArrowRight
     * @type Boolean
     */
    pressedArrowRight: false,

    /**
     * State of the arrow down key
     *
     * @property pressedArrowDown
     * @type Boolean
     */
    pressedArrowDown: false,

    /**
     * Back reference to control class
     *
     * @property _control
     * @type zerk.game.engine.system.control
     */
    _control: null,

    /**
     * Key map
     *
     * @property _keyMap
     * @type Object
     * @protected
     */
    _keyMap: null,

    /**
     * Class constructor
     *
     * @method init
     * @param {zerk.game.engine} engine
     */
    init: function(control) {

        zerk.parent('zerk.game.engine.system.control.keyboard').init.apply(
            this,
            arguments
        );

        this._control=control;

        this._keyMap={
            key8: 'Backspace',
            key9: 'Tab',
            key13: 'Enter',
            key16: 'Shift',
            key17: 'Ctrl',
            key18: 'Alt',
            key19: 'Pause',
            key20: 'CapsLock',
            key27: 'Escape',
            key32: 'Space',
            key33: 'PageUp',
            key34: 'PageDown',
            key35: 'End',
            key36: 'Home',
            key37: 'ArrowLeft',
            key38: 'ArrowUp',
            key39: 'ArrowRight',
            key40: 'ArrowDown'
        };

        var self=this;

        document.addEventListener(
            'keypress',
            function(event) {

                self._onKeyPress(event);

            }
        );

        document.addEventListener(
            'keydown',
            function(event) {

                self._onKeyDown(event);

            }
        );

        document.addEventListener(
            'keyup',
            function(event) {

                self._onKeyUp(event);

            }
        );

    },

    /**
     * Key down event handler
     *
     * @method _onKeyDown
     * @param {DOMEvent} event DOM event
     * @protected
     */
    _onKeyDown: function(event) {

        var keyName='key'+event.keyCode;

        if (typeof this._keyMap[keyName]!=='undefined') {
            this['pressed'+this._keyMap[keyName]]=true;
        }

        /**
         * Fires when a key is pressed
         *
         * @param {DOMEvent} event
         * @event keypress
         */
        this.fireEvent('keydown',event);

    },

    /**
     * Key up event handler
     *
     * @method _onKeyUp
     * @param {DOMEvent} event DOM event
     * @protected
     */
    _onKeyUp: function(event) {

        var keyName='key'+event.keyCode;

        if (typeof this._keyMap[keyName]!=='undefined') {
            this['pressed'+this._keyMap[keyName]]=false;
        }

        /**
         * Fires when a key is released
         *
         * @param {DOMEvent} event
         * @event keyup
         */
        this.fireEvent('keyup',event);

    },

    /**
     * Key press event handler
     *
     * @method _onKeyPress
     * @param {DOMEvent} event DOM event
     * @protected
     */
    _onKeyPress: function(event) {

        this.fireEvent('keypress',event);

    }

});