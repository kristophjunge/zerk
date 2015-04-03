/**
 * Sprite Component
 * 
 * CLASS_DESCRIPTION
 * 
 * @class sprite
 * @namespace zerk.game.engine.component
 * @extends zerk.game.engine.component
 * @module zerk
 **/
zerk.define({
	
	name: 'zerk.game.engine.component.sprite',
	extend: 'zerk.game.engine.component'
	
},{
	
	_name: 'sprite',
	
	build: function(entityConfig,worldConfig) {
		
		var defaultConfig={
			visible: true,
			render: []
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
		
		state._bodyList=[];

        var renderConfig=null;

        for (var bodyKey in entityConfig.bodies) {

            state.bodies[bodyKey]._fixtureList=[];

            for (var fixtureKey in entityConfig.bodies[bodyKey].fixtures) {

                state.bodies[bodyKey].fixtures[fixtureKey]._renderList=[];

                for (var renderKey in state.bodies[bodyKey].fixtures[fixtureKey]) {

                    var renderItem=state.bodies[bodyKey].fixtures[fixtureKey][renderKey];

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
                                 * Texture
                                 *
                                 * @property texture
                                 * @type string
                                 */
                                texture: ''
                            };

                            zerk.apply(textureConfig,entityConfig.bodies[bodyKey].fixtures[fixtureKey][renderKey]);

                            state.bodies[bodyKey].fixtures[fixtureKey][renderKey].key=renderKey;

                            textureConfig.key=renderKey;

                            state.bodies[bodyKey].fixtures[fixtureKey][renderKey]=textureConfig;

                            state.bodies[bodyKey].fixtures[fixtureKey]._renderList.push(
                                state.bodies[bodyKey].fixtures[fixtureKey][renderKey]
                            );

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
                                sprite: ''
                            };

                            zerk.apply(spriteConfig,entityConfig.bodies[bodyKey].fixtures[fixtureKey][renderKey]);

                            spriteConfig.key=renderKey;

                            state.bodies[bodyKey].fixtures[fixtureKey][renderKey]=spriteConfig;

                            state.bodies[bodyKey].fixtures[fixtureKey][renderKey].key=renderKey;

                            state.bodies[bodyKey].fixtures[fixtureKey]._renderList.push(
                                state.bodies[bodyKey].fixtures[fixtureKey][renderKey]
                            );

                            break;

                    }

                }

                state.bodies[bodyKey].fixtures[fixtureKey].key=fixtureKey;

                state.bodies[bodyKey]._fixtureList.push(
                    state.bodies[bodyKey].fixtures[fixtureKey]
                );

            }

            state.bodies[bodyKey].key=bodyKey;

            state._bodyList.push(state.bodies[bodyKey]);

        }

		// Apply world configuration
		zerk.apply(
			state,
			worldConfig
		);
		
		return state;
		
	}
	
});