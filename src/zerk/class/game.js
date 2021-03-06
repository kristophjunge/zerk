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
        'zerk.jsonLoader',
        'zerk.imageLoader'
    ]

}, {

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

        var self = this;

        this._config = {};

        var subNamespacesJson = {
            //component: 'data/component',
            entity: 'data/entity',
            world: 'data/world',
            config: 'data/config',
            spritesheet: 'media/spritesheet'
        };

        var subNamespacesImage = {
            texture: 'media/texture',
            spritesheet: 'media/spritesheet'
        };

        var namespacesJson = [];
        var namespacesImage = [];

        for (ns in config.bootstrap.namespaces) {

            for (subNs in subNamespacesJson) {
                namespacesJson.push({
                    namespace: ns + '.' + subNs,
                    path: config.bootstrap.namespaces[ns] + '/' + subNamespacesJson[subNs]
                });
            }

            for (subNs in subNamespacesImage) {
                namespacesImage.push({
                    namespace: ns + '.' + subNs,
                    path: config.bootstrap.namespaces[ns] + '/' + subNamespacesImage[subNs]
                });
            }

        }

        // Setup JSON loader
        this._jsonLoader = zerk.create(
            'zerk.jsonLoader',
            namespacesJson
        );

        // Setup image loader
        this._imageLoader = zerk.create(
            'zerk.imageLoader',
            namespacesImage
        );

        var configResource = config.bootstrap.game + '.config.default';

        // Load game configuration
        this._jsonLoader.require(
            [configResource],
            function(data) {

                self._onLoadGameConfiguration(data[configResource], config);

            },
            function(e) {

                zerk.error({
                    message: 'Could not load game configuration from "' + e.path + '"',
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
    _onLoadGameConfiguration: function(gameConfig, localConfig) {

        var config = {};

        zerk.apply(config, gameConfig);
        zerk.apply(config, localConfig);

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

        this._engine = zerk.create(
            'zerk.game.engine',
            this._jsonLoader,
            this._imageLoader,
            config
        );

        this._config = this._engine.getRegistry().register(
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
