/**
 * Polygon shaped fixture
 * 
 * @class zerk.game.engine.physics.fixture.polygon
 * @extends zerk.game.engine.physics.fixture
 * @module zerk
 */
zerk.define({

	name: 'zerk.game.engine.physics.fixture.polygon',
	extend: 'zerk.game.engine.physics.fixture'
	
},{
	
	/**
	 * Shape of the fixture
	 * 
	 * @property shape
	 * @type String
	 */
	type: 'polygon',
	
	/**
	 * List of vertices
	 * 
	 * @property vertices
	 * @type Array 
	 */
	vertices: null,
	
	/**
	 * Class contructor
	 * 
	 * @method init
	 */
	init: function() {
		
		zerk.parent('zerk.game.engine.physics.fixture.polygon').init.apply(
			this,
			arguments
		);
		
		this.vertices=[];
		
	}
	
});