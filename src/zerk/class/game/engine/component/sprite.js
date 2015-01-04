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
		
		// Extend bodies
		for (var index in entityConfig.bodies) {
			
			var extendedBody={
				render: {}
			};
			
			zerk.apply(extendedBody,entityConfig.bodies[index]);
			
			extendedBody.key=index;
			
			extendedBody._renderList=zerk.objectValues(extendedBody.render);
			
			state.bodies[index]=extendedBody;
			
			state._bodyList.push(state.bodies[index]);
			
		}
		
		// Apply world configuration
		zerk.apply(
			state,
			worldConfig
		);
		
		return state;
		
	}
	
});