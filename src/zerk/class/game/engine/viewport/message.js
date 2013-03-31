/**
 * Viewport message
 * 
 * @class zerk.game.engine.viewport.message
 * @module zerk
 */
zerk.define({

	name: 'zerk.game.engine.viewport.message'
	
},{
	
	/**
	 * Unique ID of the message
	 * 
	 * @property id
	 * @type String
	 */
	id: '',
	
	/**
	 * Font
	 * 
	 * @property font
	 * @type String
	 */
	font: 'sans-serif',
	
	/**
	 * Font size
	 * 
	 * @property size
	 * @type Number
	 */
	size: 20,
	
	/**
	 * Font color
	 * 
	 * @property color
	 * @type String
	 */
	color: 'rgb(255,0,0)',
	
	/**
	 * Message text
	 * 
	 * @property text
	 * @type String
	 */
	text: '',
	
	/**
	 * Horizontal position
	 * 
	 * @property x
	 * @type Integer
	 */
	x: 0,
	
	/**
	 * Vertical position
	 * 
	 * @property y
	 * @type Integer
	 */
	y: 0,
	
	/**
	 * Lifetime of the message
	 * 
	 * @property lifetime
	 * @type Integer
	 */
	lifetime: 0,
	
	/**
	 * Starttime of the message
	 * 
	 * @property starttime
	 * @type Integer
	 */
	starttime: null,
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 * @param {String} id Unique ID of the message
	 * @param {Integer} x Horizontal position
	 * @param {Integer} y Vertical position
	 * @param {String} text Message text
	 * @param {Integer} size Font size
	 * @param {String} color Font color
	 */
	init: function (id,x,y,text,size,color) {
		
		if (typeof id!=='undefined') this.id=id;
		if (typeof x!=='undefined') this.x=x;
		if (typeof y!=='undefined') this.y=y;
		if (typeof text!=='undefined') this.text=text;
		if (typeof size!=='undefined') this.size=size;
		if (typeof color!=='undefined') this.color=color;
		
	}
	
});