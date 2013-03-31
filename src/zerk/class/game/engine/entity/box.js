/**
 * Simple box entity
 * 
 * @class zerk.game.engine.entity.box
 * @extends zerk.game.engine.entity
 * @module zerk
 */
zerk.define({

	name: 'zerk.game.engine.entity.box',
	extend: 'zerk.game.engine.entity'
	
},{
	
	/**
	 * Name of the entity
	 * 
	 * @property name
	 * @type String
	 */
	name: 'box',
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 * @param {zerk.game.engine} engine
	 * @param {Object} config
	 */
	init: function(engine,config) {
		
		zerk.parent('zerk.game.engine.entity.box').init.apply(
			this,
			arguments
		);
		
		zerk.apply(
			this.config,
			{
				width: 15,
				height: 1
			}
		);
		
	},
	
	/**
	 * Setup bodies
	 * 
	 * @method setup
	 */
	setup: function() {
		
		this.bodies=[
			{
				key: 'body1',
				x: 0,
				y: 0,
				width: this.config.width,
				height: this.config.height,
				angle: 0,
				moveable: false,
				origin: true,
				fixtures: [
					{
						shape: 'box',
						x: 0,
						y: 0,
						angle: 0,
						width: this.config.width,
						height: this.config.height
					}
				]
			}
		];
		
		zerk.parent('zerk.game.engine.entity.box').setup.apply(
			this,
			arguments
		);
		
	}
	
});