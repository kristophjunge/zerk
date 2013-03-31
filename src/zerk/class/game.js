/**
 * The game main class
 * 
 * All games should inherit from here.
 * 
 * @class zerk.game
 * @module zerk
 */
zerk.define({
	
	name: 'zerk.game',
	require: [
		'zerk.game.engine'
	]
	
},{

	/**
	 * The game engine
	 * 
	 * @property engine
	 * @type zerk.game.engine
	 */
	engine: null,
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 * @param {Object} config Game configuration
	 */
	init: function(config) {
		
		this.engine=zerk.create('zerk.game.engine',this,config);
		
		this._config={};
		
		this._config=this.engine.registry.register('game',this._config);
		
	}
	
});