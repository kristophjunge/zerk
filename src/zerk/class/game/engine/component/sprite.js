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
			width: 0,
			height: 0
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
		
		// Apply world configuration
		zerk.apply(
			state,
			worldConfig
		);
		
		return state;
		
	}
	
});