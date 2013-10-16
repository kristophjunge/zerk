zerk.define({
	
	name: 'jumpandrun.game',
	extend: 'zerk.game',
	require: [
		'zerk.game.engine.component.physics',
		'zerk.game.engine.component.position',
		'zerk.game.engine.component.sprite',
		'zerk.game.engine.component.player',
		'zerk.game.engine.component.damager',
		'zerk.game.engine.component.fall',
		'zerk.game.engine.component.trigger',
		'zerk.game.engine.component.elevator',
		'jumpandrun.game.engine.component.madStone', // Custom component
		'zerk.game.engine.system.physics.box2d',
		'zerk.game.engine.system.viewport.canvas',
		'zerk.game.engine.system.sprite',
		'zerk.game.engine.system.wireframe',
		'zerk.game.engine.system.message',
		'zerk.game.engine.system.debuginfo',
		'zerk.game.engine.system.control',
		'zerk.game.engine.system.player',
		'zerk.game.engine.system.damager',
		'zerk.game.engine.system.fall',
		'zerk.game.engine.system.trigger',
		'zerk.game.engine.system.elevator',
		'jumpandrun.game.engine.system.madStone' // Custom system
	]
	
},{
	
	_running: false,
	
	_dead: false,
	
	_won: false,
	
	_systemControl: null,
	
	_systemMessage: null,
	
	_systemPlayer: null,
	
	_firstRun: true,
	
	run: function(config) {
		
		var self=this;
		
		if (!zerk.parent('jumpandrun.game').run.apply(
			this,
			arguments
		)) {
			
			return;
			
		}
		
		if (!this._engine.start()) {
			
			return;
			
		}
		
		this._engine.loadWorld(
			'jumpandrun.world.level',
			function() {
				
				self._onLoadWorld();
				
			},
			function(error) {
				
				console.log(error);
				
			}
		);
		
	},
	
	_onLoadWorld: function() {
		
		this._startGame();
		
	},
	
	_startGame: function() {
		
		this._systemControl=this._engine.getSystem('control');
		
		this._systemMessage=this._engine.getSystem('message');
		
		this._systemPlayer=this._engine.getSystem('player');
		
		if (this._firstRun) {
		
			this._systemMessage.registerMessage(
				zerk.create(
					'zerk.game.engine.system.message.message',
					'click-to-start',
					0,
					0,
					'Click to start',
					30,
					'rgb(0,255,0)'
				)
			);
			
			this._firstRun=false;
			
		} else {
			
			this._running=true;
			
			this._setControlsEnabled(true);
			
		}
		
		this._systemControl.keyboard.on(
			'keypress',
			this._onKeyPress,
			this
		);
		
		this._systemControl.mouse.on(
			'mousedown',
			this._onMouseDown,
			this
		);
		
		this._systemPlayer.on(
			'dead',
			this._onPlayerDead,
			this
		);
		
		this._systemPlayer.on(
			'win',
			this._onPlayerWin,
			this
		);
		
	},
	
	_stopGame: function() {
		
		this._systemControl.keyboard.un(
			'keypress',
			this._onKeyPress,
			this
		);
		
		this._systemControl.mouse.un(
			'mousedown',
			this._onMouseDown,
			this
		);
		
		this._systemPlayer.un(
			'dead',
			this._onPlayerDead,
			this
		);
		
		this._systemPlayer.un(
			'win',
			this._onPlayerWin,
			this
		);
		
	},
	
	_getConfigDefaults: function() {
		
		return {
			version: '1.0.0'
		};
		
	},
	
	/* --- CUSTOM GAME METHODS --- */
	
	restartGame: function() {
		
		if (!this._running) return;
		
		this._stopGame();
		
		this._setControlsEnabled(false);
		
		this._engine.reset();
		
		var self=this;
		
		this._engine.loadWorld(
			'jumpandrun.world.level',
			function() {
				
				self._onLoadWorld();
				
			},
			function(error) {
				
				console.log(error);
				
			}
		);
		
		this._dead=false;
		this._won=false;
		
	},
	
	_onPlayerDead: function(entity) {
		
		this._setControlsEnabled(false);
		
		this._dead=true;
		
		this._systemMessage.registerMessage(
			zerk.create(
				'zerk.game.engine.system.message.message',
				'you-are-dead',
				0,
				-25,
				'You Are Dead',
				30,
				'rgb(255,0,0)'
			)
		);
		
		this._systemMessage.registerMessage(
			zerk.create(
				'zerk.game.engine.system.message.message',
				'press-return-to-restart',
				0,
				25,
				'- Press return to restart -',
				15,
				'rgb(200,200,200)'
			)
		);
		
	},
	
	_onPlayerWin: function(entity) {
		
		this._setControlsEnabled(false);
		
		this._won=true;
		
		this._systemMessage.registerMessage(
			zerk.create(
				'zerk.game.engine.system.message.message',
				'you-win',
				0,
				-25,
				'You Win',
				30,
				'rgb(0,255,0)'
			)
		);
		
		this._systemMessage.registerMessage(
			zerk.create(
				'zerk.game.engine.system.message.message',
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
		
		var players=this._engine.getEntitiesByTags('player');
		
		if (zerk.isEmpty(players)) return;
		
		var entity=players[0];
		
		entity.components.player.enableControl=enabled;
		
	},
	
	_onKeyPress: function(event) {
		
		if (event.keyCode==13) {
			
			this.restartGame();
			
		} else if (event.keyCode==27) {
			
			this._engine.stop();
			
		}
		
	},
	
	_onMouseDown: function(event) {
		
		if (!this._running
		&& this._systemControl.mouse.mouseLeftDown) {
			
			this._running=true;
			
			this._setControlsEnabled(true);
			
			this._systemMessage.unregisterMessage('click-to-start');
			
		}
		
	}
	
});