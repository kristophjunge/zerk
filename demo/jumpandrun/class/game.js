zerk.define({

	name: 'jumpandrun.game',
	extend: 'zerk.game',
	require: [
		'jumpandrun.game.engine.world.level'
	]
	
},{
	
	_running: false,
	
	_dead: false,
	
	_won: false,
	
	init: function(config) {
		
		zerk.parent('jumpandrun.game').init.apply(this,arguments);
		
		this.engine.start();
		
		this.engine.viewport.registerMessage(
			zerk.create(
				'zerk.game.engine.viewport.message',
				'click-to-start',
				0,
				0,
				'Click to start',
				30,
				'rgb(0,255,0)'
			)
		);
		
		this.engine.loadWorld('jumpandrun.game.engine.world.level');
		
		this.engine.control.keyboard.on(
			'keypress',
			this._onKeyPress,
			this
		);
		
		this.engine.control.mouse.on(
			'mousedown',
			this._onMouseDown,
			this
		);
		
		this.engine.on(
			'worldunloaded',
			this._onWorldUnloaded,
			this
		);
		
	},
	
	restartGame: function() {
		
		if (!this._running) return;
		
		this.engine.viewport.clearMessages();
			
		this.engine.unloadWorld();
		
		this._dead=false;
		this._won=false;
		
	},
	
	playerDead: function() {
		
		this._setControlsEnabled(false);
		
		this._dead=true;
		
		this.engine.viewport.registerMessage(
			zerk.create(
				'zerk.game.engine.viewport.message',
				'you-are-dead',
				0,
				-25,
				'You Are Dead',
				30,
				'rgb(255,0,0)'
			)
		);
		
		this.engine.viewport.registerMessage(
			zerk.create(
				'zerk.game.engine.viewport.message',
				'press-return-to-restart',
				0,
				25,
				'- Press return to restart -',
				15,
				'rgb(200,200,200)'
			)
		);
		
	},
	
	playerWin: function() {
		
		this._setControlsEnabled(false);
		
		this._won=true;
		
		this.engine.viewport.registerMessage(
			zerk.create(
				'zerk.game.engine.viewport.message',
				'you-win',
				0,
				-25,
				'You Win',
				30,
				'rgb(0,255,0)'
			)
		);
		
		this.engine.viewport.registerMessage(
			zerk.create(
				'zerk.game.engine.viewport.message',
				'press-return-to-restart',
				0,
				25,
				'- Press return to restart -',
				15,
				'rgb(200,200,200)'
			)
		);
		
	},
	
	_setControlsEnabled: function(enabled) {
		
		if (typeof enabled=='undefined') enabled=false;
		
		this.engine.world.getEntityById('player').config.enableControl=enabled;
		
	},
	
	_onWorldUnloaded: function() {
		
		this.engine.loadWorld('jumpandrun.game.engine.world.level');
		
		this._setControlsEnabled(true);
		
	},
	
	_onKeyPress: function(event) {
		
		if (event.keyCode==13) {
			
			this.restartGame();
			
		} else if (event.keyCode==27) {
			
			this.engine.stop();
			
		}
		
	},
	
	_onMouseDown: function(event) {
		
		if (!this._running
		&& this.engine.control.mouse.mouseLeftDown) {
			
			this._running=true;
			
			this._setControlsEnabled(true);
			
			this.engine.viewport.unregisterMessage('click-to-start');
			
		}
		
	}
	
});