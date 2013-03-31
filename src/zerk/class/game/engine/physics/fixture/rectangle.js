/**
 * Rectangle shaped fixture 
 * 
 * @class zerk.game.engine.physics.fixture.rectangle
 * @extends zerk.game.engine.physics.fixture
 * @module zerk
 */
zerk.define({

	name: 'zerk.game.engine.physics.fixture.rectangle',
	extend: 'zerk.game.engine.physics.fixture'
	
},{
	
	/**
	 * Shape of the fixture
	 * 
	 * @property shape
	 * @type String
	 */
	type: 'box',
	
	/**
	 * Width of the rectangle
	 * 
	 * @property width
	 * @type Float
	 */
	width: 0,

	/**
	 * Height of the rectangle
	 * 
	 * @property height
	 * @type Float
	 */
	height: 0
	
});