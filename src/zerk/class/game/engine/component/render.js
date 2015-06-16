/**
 * Render Component
 * 
 * CLASS_DESCRIPTION
 * 
 * @class render
 * @namespace zerk.game.engine.component
 * @extends zerk.game.engine.component
 * @module zerk
 **/
zerk.define({
	
	name: 'zerk.game.engine.component.render',
	extend: 'zerk.game.engine.component'
	
},{
	
	_name: 'render',
	
	build: function(entityConfig,worldConfig) {
		
		var defaultConfig={
			visible: true,
			layers: []
		};
		
		// Create new state
		var state={};
		
		// Apply default configuration
		zerk.apply(
			state,
			defaultConfig
		);
		
		// Apply enitity configuration
		zerk.apply(
			state,
			entityConfig
		);
		
		state._layerList=[];

        var renderConfig=null;

        for (var layerKey in entityConfig.layers) {

            var renderItem=state.layers[layerKey];

            switch (renderItem.render) {
                case 'texture':

                    /**
                     * *** THIS IS NOT A CLASS! ITS A CONFIGURATION OBJECT. ***
                     *
                     * Sprite.
                     *
                     * Used by {{#crossLink "zerk.game.engine.component.sprite"}}{{/crossLink}}
                     *
                     * @class texture
                     * @namespace config.component.sprite
                     **/
                    textureConfig = {
                        /**
                         * The horizontal position of the texture
                         *
                         * @property x
                         * @type Float
                         */
                        x: 0,

                        /**
                         * The vertical position of the texture
                         *
                         * @property y
                         * @type Float
                         */
                        y: 0,

                        /**
                         * Rotation angle of the layer
                         *
                         * @property angle
                         * @type Float
                         */
                        angle: 0,

                        /**
                         * Physics body
                         *
                         * @property body
                         * @type string
                         */
                        body: '',

                        /**
                         * Physics fixture
                         *
                         * @property fixture
                         * @type string
                         */
                        fixture: '',

                        /**
                         * Texture
                         *
                         * @property texture
                         * @type string
                         */
                        texture: '',

                        /**
                         * The horizontal texture offset
                         *
                         * @property textureOffsetX
                         * @type Float
                         */
                        textureOffsetX: 0,

                        /**
                         * The vertical texture offset
                         *
                         * @property textureOffsetY
                         * @type Float
                         */
                        textureOffsetY: 0,

                        /**
                         * Rotation angle of the texture
                         *
                         * @property textureAngle
                         * @type Float
                         */
                        textureAngle: 0
                    };

                    zerk.apply(textureConfig,entityConfig.layers[layerKey]);
                    textureConfig.key=layerKey;

                    state.layers[layerKey]=textureConfig;

                    state._layerList.push(state.layers[layerKey]);

                    break;

                case 'sprite':

                    /**
                     * *** THIS IS NOT A CLASS! ITS A CONFIGURATION OBJECT. ***
                     *
                     * Sprite.
                     *
                     * Used by {{#crossLink "zerk.game.engine.component.sprite"}}{{/crossLink}}
                     *
                     * @class sprite
                     * @namespace config.component.sprite
                     **/
                    spriteConfig = {
                        /**
                         * The horizontal position of the sprite
                         *
                         * @property x
                         * @type Float
                         */
                        x: 0,

                        /**
                         * The vertical position of the sprite
                         *
                         * @property y
                         * @type Float
                         */
                        y: 0,

                        /**
                         * Rotation angle of the sprite
                         *
                         * @property angle
                         * @type Float
                         */
                        angle: 0,

                        /**
                         * Sprite sheet
                         *
                         * @property spritesheet
                         * @type string
                         */
                        spritesheet: '',

                        /**
                         * Image ID to use from the sprite sheet
                         *
                         * @property sprite
                         * @type string
                         */
                        sprite: '',

                        /**
                         * Physics body
                         *
                         * @property body
                         * @type string
                         */
                        body: '',

                        /**
                         * Physics fixture
                         *
                         * @property fixture
                         * @type string
                         */
                        fixture: ''
                    };

                    zerk.apply(spriteConfig,entityConfig.layers[layerKey]);
                    spriteConfig.key=layerKey;

                    state.layers[layerKey]=spriteConfig;

                    state._layerList.push(state.layers[layerKey]);

                    break;

            }

        }

		// Apply world configuration
		zerk.apply(
			state,
			worldConfig
		);

		return state;
		
	}
	
});