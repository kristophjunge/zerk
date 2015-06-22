/**
 * MadStone component
 * 
 * @class jumpandrun.game.engine.component.madStone
 * @module jumpandrun
 */
zerk.define({
	
	name: 'jumpandrun.game.engine.component.madStone',
	extend: 'zerk.game.engine.component'
	
},{
	
	_name: 'madStone',
	
	build: function(entityConfig,worldConfig) {
		
		var defaultConfig={
			speed: 1.5,
			releaseDelay: 250,
			status: 'wait_to_fall',
			worldOffset: 0
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