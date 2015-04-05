zerk.define({
	
	name: 'tools.game.engine.system.entityeditor',
	extend: 'zerk.game.engine.system'
	
},{
	
	/**
	 * Name of the system
	 * 
	 * @property _name
	 * @type String
	 * @protected
	 */
	_name: 'entityeditor',
	
	/**
	 * Thread that runs this system
	 * 
	 * @property _thread
	 * @type String
	 * @protected
	 **/
	_thread: 'render',
	
	/**
	 * Priority of this system
	 * 
	 * @property _priority
	 * @type Integer
	 * @protected
	 **/
	_priority: 105,
	
	/**
	 * Viewport system instance
	 * 
	 * @property _viewport
	 * @type zerk.game.engine.system.viewport
	 * @protected
	 **/
	_viewport: null,

    _editorState: '',

    _editorSpritesheet: '',

    _editorSprite: '',

    _editorVertices: [],
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 * @param {zerk.game.engine} engine Game engine
	 * @param {Object} config System configuration
	 **/
	init: function(engine,config) {
		
		zerk.parent('zerk.game.engine.system.sprite').init.apply(
			this,
			arguments
		);
		
		this._viewport=this._getSystem('viewport');
		
	},
	
	/**
	 * Returns true when the system is interested in given component
	 * 
	 * @method useComponent
	 * @param {String} name Component name
	 * @return {Boolean} True when the system is intereseted in given component
	 **/
	useComponent: function(name) {
		
		return (name=='sprite');
		
	},
	
	/**
	 * Starts the system
	 * 
	 * @method start
	 **/
	start: function() {
		
		zerk.parent('zerk.game.engine.system.sprite').start.apply(
			this,
			arguments
		);
		
	},
	
	/**
	 * Stops the system
	 * 
	 * @method stop
	 **/
	stop: function() {
		
		zerk.parent('zerk.game.engine.system.sprite').stop.apply(
			this,
			arguments
		);
		
	},
	
	/**
	 * Adds an entity to the system
	 * 
	 * @method addEntity
	 * @param {config.entity} entity Entity state
	 **/
	addEntity: function(entity) {
		
		zerk.parent('zerk.game.engine.system.sprite').addEntity.apply(
			this,
			arguments
		);
		
	},
	
	/**
	 * Updates the system
	 * 
	 * @method update
	 **/
	update: function() {

        var me=this;

		zerk.parent('zerk.game.engine.system.sprite').update.apply(
			me,
			arguments
		);

        if (me._editorState=='add_fixture') {

            var entities=me._engine.getEntitiesByTags('editor');
            var entity=entities[0];

            var image=me._engine._spriteLoader.getSprite(me._editorSpritesheet,me._editorSprite);
            var position=entity.components.position;

            var bodyState=null;
            for (var i=0;i<entity.components.physics._bodyList.length;i++) {
                var body=entity.components.physics._bodyList[i];
                if (body.origin) {
                    bodyState=entity.components.physics._bodyList[i];
                }
            }

            var bufferSize={
                width: image.info.width,
                height: image.info.height
            };

            //console.log('O',originBody);

            var fixtureX=0;
            var fixtureY=0;
            var spriteX=0;
            var spriteY=0;
            var fixtureAngle=0;
            var spriteAngle=0;

            this._viewport.bufferInit(
                'body',
                bufferSize.width,
                bufferSize.height,
                bufferSize.width/2,
                bufferSize.height/2,
                bodyState.angle
            );

            me._viewport.drawImage(
                'body',
                image.image,
                zerk.helper.fromMeter(fixtureX+spriteX),
                zerk.helper.fromMeter(fixtureY+spriteY),
                image.info.width,
                image.info.height,
                image.info.offsetX,
                image.info.offsetY,
                image.info.width,
                image.info.height,
                fixtureAngle+spriteAngle
            );

            // Draw the buffer onto the display
            this._viewport.bufferFlush(
                'body',
                'display',
                this._viewport._getCanvasX(position.x+bodyState.x), // -(bufferSize.width/2)
                this._viewport._getCanvasY(position.y+bodyState.y), // -(bufferSize.height/2)
                this._viewport.toScaleX(bufferSize.width),
                this._viewport.toScaleY(bufferSize.height),
                bodyState.angle
            );

            var vertices=[];
            var x=0;
            var y=0;

            for (var i=0;i<this._editorVertices.length;i++) {
                x=this._viewport._getCanvasX(this._editorVertices[i][0]);
                y=this._viewport._getCanvasY(this._editorVertices[i][1]);
                vertices.push([x,y]);
            }

            this._viewport.drawPolygon(
                'display',
                vertices,
                'rgba(127,127,76,0.5)',
                'rgba(127,127,76,0.5)',
                0
            );

            if (vertices.length>=3) {
                for (var i=0;i<vertices.length;i++) {
                    this._viewport.drawArc(
                        'display',
                        vertices[i][0],
                        vertices[i][1],
                        2,
                        0,
                        Math.PI*2,
                        true,
                        'rgb(255,255,255)'
                        //strokeColor,
                        //lineWidth
                    );
                }
            }

            //console.log('VERTICES',this._editorVertices.length);

        }

	},

    addVertice: function(x,y) {

        this._editorVertices.push([x,y]);

    },

    addFixture: function(spritesheet,sprite) {

        var me=this;

        me._engine._spriteLoader.loadSprites([spritesheet],function() {

            me._editorSpritesheet=spritesheet;
            me._editorSprite=sprite;
            me._editorState='add_fixture';

        });

    }

});