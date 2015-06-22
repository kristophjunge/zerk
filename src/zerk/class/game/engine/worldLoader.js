/**
 * World Loader
 *
 * Loads world definitions from JSON files.
 *
 * @class worldLoader
 * @namespace zerk.game.engine
 * @module zerk
 **/
zerk.define({

    name: 'zerk.game.engine.worldLoader'

},{

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
     * @type zerk.imageLoader
     * @protected
     **/
    _imageLoader: null,

    /**
     * Component loader instance
     *
     * @property _componentLoader
     * @type zerk.game.engine.componentLoader
     * @protected
     **/
    _componentLoader: null,

    /**
     * Entity loader instance
     *
     * @property _entityLoader
     * @type zerk.game.engine.entityLoader
     * @protected
     **/
    _entityLoader: null,

    /**
     * Sprite loader instance
     *
     * @property _spriteLoader
     * @type zerk.game.engine.spriteLoader
     * @protected
     **/
    _spriteLoader: null,

    /**
     * Texture loader instance
     *
     * @property _textureLoader
     * @type zerk.game.engine.textureLoader
     * @protected
     **/
    _textureLoader: null,

    /**
     * Class constructor
     *
     * @method init
     * @param {zerk.game.engine} engine Game engine
     */
    init: function(
        jsonLoader,
        imageLoader,
        componentLoader,
        entityLoader,
        spriteLoader,
        textureLoader
    ) {

        this._entities=[];
        this._components=[];
        this._textures=[];
        this._spritesheets=[];

        this._jsonLoader=jsonLoader;
        this._imageLoader=imageLoader;
        this._componentLoader=componentLoader;
        this._entityLoader=entityLoader;
        this._spriteLoader=spriteLoader;
        this._textureLoader=textureLoader;

    },

    /**
     * Loads a world by given resource id
     *
     * @method loadWorld
     * @param {String} name World resource id
     * @param {Function} successFn Event handler for success
     * @param {Function} errorFn Event handler for error
     * @async
     **/
    loadWorld: function(name,successFn,errorFn) {

        var me=this;

        me._componentLoader.clear();
        me._entityLoader.clear();
        me._spriteLoader.clear();
        me._textureLoader.clear();

        // @TOOD Make cachable config
        if (true) {
            me._jsonLoader.clear();
            me._imageLoader.clear();
        }

        this._jsonLoader.require(
            [name],
            function(data) {
                me._onLoadWorld(data[name],successFn,errorFn);
            },
            errorFn
        );

    },

    /**
     * Fires when the world is loaded
     *
     * @method _onLoadWorld
     * @param {Object} world World definition
     * @param {Function} successFn Event handler for success
     * @param {Function} errorFn Event handler for error
     * @protected
     * @async
     **/
    _onLoadWorld: function(world,successFn,errorFn) {

        var me=this;

        me.loadWorldConfig(world,successFn,errorFn);

    },

    loadWorldConfig: function(world,successFn,errorFn) {

        var me=this;

        var entityIdList=[];
        for (var i=0;i<world.entities.length;i++) {
            entityIdList.push(world.entities[i].name);
        }

        entityIdList=zerk.arrayUnique(entityIdList);

        this._entityLoader.loadEntities(
            entityIdList,
            function(entities) {
                me._onLoadEntities(world,entities,successFn,errorFn);
            },
            errorFn
        );

    },

    /**
     * Fires when the entities are loaded
     *
     * @method _onLoadEntities
     * @param {Object} world World definition
     * @param {Array} entities Array of entities
     * @param {Function} successFn Event handler for success
     * @param {Function} errorFn Event handler for error
     * @protected
     **/
    _onLoadEntities: function(world,entities,successFn,errorFn) {

        var me=this;

        var components=[];
        var spritesheets=[];
        var textures=[];

        for (var entityKey in entities) {

            var entity=entities[entityKey];

            for (var component in entity.components) {

                components.push(component);

                if (component=='render') {

                    for (var layerKey in entity.components[component].layers) {

                        var layer=entity.components[component].layers[layerKey];

                        switch (layer.render) {
                            case 'texture':
                                textures.push(layer.texture);
                                break;
                            case 'sprite':
                                spritesheets.push(layer.spritesheet);
                                break;
                        }

                    }

                }

            }

        }

        // Remove duplicates
        components=zerk.arrayUnique(components);
        textures=zerk.arrayUnique(textures);
        spritesheets=zerk.arrayUnique(spritesheets);

        var loadedComponenets=false;
        var loadedSprites=false;
        var loadedTextures=false;

        me._componentLoader.loadComponents(
            components,
            function() {
                loadedComponenets=true;
                if (loadedTextures && loadedSprites) {
                    successFn(world);
                }
            },
            errorFn
        );

        me._textureLoader.loadTextures(
            textures,
            function() {
                loadedTextures=true;
                if (loadedComponenets && loadedSprites) {
                    successFn(world);
                }
            },
            errorFn
        );

        me._spriteLoader.loadSprites(
            spritesheets,
            function() {
                loadedSprites=true;
                if (loadedTextures && loadedComponenets) {
                    successFn(world);
                }
            },
            errorFn
        );

    }

});