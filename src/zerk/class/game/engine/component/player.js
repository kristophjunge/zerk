/**
 * Player Component
 * 
 * CLASS_DESCRIPTION
 * 
 * @class player
 * @namespace zerk.game.engine.component
 * @extends zerk.game.engine.component
 * @module zerk
 **/
zerk.define({
	
	name: 'zerk.game.engine.component.player',
	extend: 'zerk.game.engine.component'
	
},{
	
	_name: 'player',
	
	build: function(entityConfig,worldConfig) {
		
		var defaultConfig={
			jumping: false,
			landed: false,
			jumpCounter: 0,
			contactCount: 0,
			enableControl: false,
			grounded: false
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