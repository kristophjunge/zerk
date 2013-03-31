/**
 * Circle shaped fixture
 * 
 * @class zerk.game.engine.physics.fixture.circle
 * @extends zerk.game.engine.physics.fixture
 * @module zerk
 */
zerk.define({

	name: 'zerk.game.engine.physics.fixture.circle',
	extend: 'zerk.game.engine.physics.fixture',
	require: [
		'zerk.game.engine.physics.fixture'
	]
	
},{
	
	/**
	 * Shape of the fixture
	 * 
	 * @property shape
	 * @type String
	 */
	type: 'circle',
	
	/**
	 * Radius of the circle
	 * 
	 * @property radius
	 * @type Float
	 */
	radius: 0
	
});