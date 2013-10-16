/**
 * Game
 * 
 * Base class for games. All games should inherit from here.
 * 
 * @class game
 * @namespace zerk
 * @module zerk
 **/
zerk.define({
	
	name: 'zerk.game',
	require: [
		'zerk.game.engine',
		'zerk.jsonLoader'
	]
	
},{
	
	/**
	 * The game engine
	 * 
	 * @property _engine
	 * @type zerk.game.engine
	 * @protected
	 **/
	_engine: null,
	
	/**
	 * JSON Loader
	 * 
	 * @property _jsonLoader
	 * @type zerk.jsonLoader
	 * @protected
	 **/
	_jsonLoader: null,
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 * @param {Object} config Game configuration
	 * @async
	 **/
	init: function(config) {
		
		var self=this;
		
		this._config={};
		
		// Setup JSON loader namespaces
		this._jsonLoader=zerk.create(
			'zerk.jsonLoader',
			[
				{
					namespace: config.bootstrap.game+'.component',
					path: config.bootstrap.gameDir+'/data/component'
				},
				{
					namespace: config.bootstrap.game+'.entity',
					path: config.bootstrap.gameDir+'/data/entity'
				},
				{
					namespace: config.bootstrap.game+'.world',
					path: config.bootstrap.gameDir+'/data/world'
				},
				{
					namespace: config.bootstrap.game+'.config',
					path: config.bootstrap.gameDir+'/data/config'
				},
				{
					namespace: 'zerk.entity',
					path: config.bootstrap.zerkDir+'/data/entity'
				},
				{
					namespace: 'zerk.component',
					path: config.bootstrap.zerkDir+'/data/component'
				},
				{
					namespace: 'zerk.config',
					path: config.bootstrap.zerkDir+'/data/config'
				}
			]
		);
		
		var configResource=config.bootstrap.game+'.config.default';
		
		// Load game configuration
		this._jsonLoader.loadResource(
			configResource,
			function(data) {
				
				self._onLoadGameConfiguration(data,config);
				
			},
			function(e) {
				
				zerk.error({
					message: 'Could not load game configuration from "'+e.path+'"',
					game: config.bootstrap.game,
					resource: configResource,
					source: this
				});
				
			}
		);
		
	},
	
	/**
	 * Fires when the game configuration is loaded
	 * 
	 * @method _onLoadGameConfiguration
	 * @param {Object} gameConfig Game configuration
	 * @param {Object} localConfig Bootstrap configuration
	 * @protected
	 **/
	_onLoadGameConfiguration: function(gameConfig,localConfig) {
		
		var config={};
		
		zerk.apply(config,gameConfig);
		zerk.apply(config,localConfig);
		
		this.run(config);
		
	},
	
	/**
	 * Run the game
	 * 
	 * This method should be extended by child classes to boot the game.
	 * 
	 * @method run
	 **/
	run: function(config) {
		
		/*
		 * TODO Should this method (run) really be a public?
		 */
		
		this._engine=zerk.create(
			'zerk.game.engine',
			this._jsonLoader,
			config
		);
		
		this._config=this._engine.getRegistry().register(
			'game',
			this._getConfigDefaults()
		);
		
		return true;
		
	},
	
	/**
	 * Returns the default game configuration
	 * 
	 * This method should be extended by child classes to setup default game 
	 * configuration.
	 * 
	 * @method _getConfigDefaults
	 * @return {Object} Default configuration
	 * @protected
	 **/
	_getConfigDefaults: function() {}
	
});