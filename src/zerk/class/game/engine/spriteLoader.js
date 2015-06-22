/**
 * Sprite Loader
 *
 * Loads sprite sheets
 *
 * @class spriteLoader
 * @namespace zerk.game.engine
 * @module zerk
 **/
zerk.define({

    name: 'zerk.game.engine.spriteLoader'

}, {

    /**
     * JSON loader instance
     *
     * @property _jsonLoader
     * @type zerk.jsonLoader
     * @protected
     **/
    _jsonLoader: null,

    /**
     * Image loader instance
     *
     * @property _imageLoader
     * @type zerk.imageoader
     * @protected
     **/
    _imageLoader: null,

    _images: null,

    _maps: null,

    /**
     * Class constructor
     *
     * @method init
     * @param {zerk.jsonLoader} jsonLoader JSON loader instance
     * @param {zerk.game.engine.componentLoader} componentLoader Component
     *     loader instance
     */
    init: function(jsonLoader, imageLoader) {

        this._jsonLoader = jsonLoader;
        this._imageLoader = imageLoader;

        this._images = {};
        this._maps = {};

    },

    /**
     * Returns preloaded sprite information
     *
     * @method getSprite
     * @param {String} sheet Sprite sheet key
     * @param {String} key Sprite key
     * @return {config.sprite} Sprite information
     **/
    getSprite: function(spritesheet, sprite) {

        var me = this;

        if (!zerk.isDefined(me._maps[spritesheet])) {
            zerk.error('Spritesheet map not found "' + spritesheet + '"');
        }

        if (!zerk.isDefined(me._maps[spritesheet][sprite])) {
            zerk.error('Spritesheet map entry "' + sprite + '" not found "' + spritesheet + '"');
        }

        if (!zerk.isDefined(me._images[spritesheet])) {
            zerk.error('Spritesheet image not found "' + spritesheet + '"');
        }

        return {
            info: me._maps[spritesheet][sprite],
            image: me._images[spritesheet]
        };

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
    loadSprites: function(sprites, successFn, errorFn) {

        var me = this;

        var loadedImages = false;
        var loadedMaps = false;

        me._jsonLoader.require(
            sprites,
            function(maps) {

                for (var mapId in maps) {
                    me._maps[mapId] = me._parseSpriteData(maps[mapId]);
                }

                loadedMaps = true;
                if (loadedImages) {
                    successFn();
                }

            },
            errorFn
        );

        me._imageLoader.require(
            sprites,
            function(images) {

                for (var imagesId in images) {
                    me._images[imagesId] = images[imagesId];
                }

                loadedImages = true;
                if (loadedMaps) {
                    successFn();
                }

            },
            errorFn
        );

    },

    clear: function() {

        var me = this;

        this._images = {};
        this._maps = {};

    },

    _parseSpriteData: function(sprite) {

        var result = {};

        for (var i = 0; i < sprite.frames.length; i++) {

            var spriteInfo = {
                name: sprite.frames[i].filename.replace(/\.[^/.]+$/, ''),
                offsetX: sprite.frames[i].frame.x,
                offsetY: sprite.frames[i].frame.y,
                width: sprite.frames[i].frame.w,
                height: sprite.frames[i].frame.h
            };

            result[spriteInfo.name] = spriteInfo;

        }

        return result;

    }

});
