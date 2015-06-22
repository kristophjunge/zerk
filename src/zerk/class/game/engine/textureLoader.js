/**
 * Texture Loader
 *
 * Loads textures
 *
 * @class textureLoader
 * @namespace zerk.game.engine
 * @module zerk
 **/
zerk.define({

    name: 'zerk.game.engine.textureLoader'

},{

    /**
     * Image loader instance
     *
     * @property _jsonLoader
     * @type zerk.jsonLoader
     * @protected
     **/
    _imageLoader: null,

    _textures: null,

    /**
     * Class constructor
     *
     * @method init
     * @param {zerk.imageLoader} imageLoader Image loader instance
     * @param {zerk.game.engine.componentLoader} componentLoader Component
     *     loader instance
     */
    init: function(imageLoader) {

        this._imageLoader=imageLoader;

        this._textures={};

    },

    /**
     * Returns preloaded texture data
     *
     * @method getTexture
     * @param {String} sheet Sprite sheet key
     * @param {String} key Sprite key
     * @return {config.sprite} Sprite information
     **/
    getTexture: function(key) {

        if (!zerk.isDefined(this._textures[key])) {
            zerk.error('Texture not found "'+key+'"');
        }

        return this._textures[key];

    },

    /**
     * Preloads given entities
     *
     * @method loadEntities
     * @param {Array} entities Array of entities
     * @param {Function} successFn Event handler for success
     * @param {Function} errorFn Event handler for error
     * @async
     **/
    loadTextures: function(idList,successFn,errorFn) {

        var me=this;

        this._imageLoader.require(
            idList,
            function(textures) {

                for (var texturesId in textures) {
                    me._textures[texturesId]=textures[texturesId];
                }

                successFn();

            },
            function (error) {
                errorFn(error);
            }
        );

    },

    clear: function() {

        var me=this;
        me._textures={};

    }

});