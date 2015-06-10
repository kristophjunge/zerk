zerk.define({

	name: 'entityeditor.game.engine.system.entityeditor',
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

    _control: null,

    _physics: null,

    _editorState: '',

    _editorSpritesheet: '',

    _editorSprite: '',

    _editorVertices: [],
    _editorVerticesValid: true,

    _editorMovingPoint: false,
    _editorVerticeIndex: null,

    _editorFixtureX: 0,
    _editorFixtureY: 0,

    _editorFixtureShape: '',

    _editorFocusFixture: null,

	/**
	 * Class constructor
	 *
	 * @method init
	 * @param {zerk.game.engine} engine Game engine
	 * @param {Object} config System configuration
	 **/
	init: function(engine,config) {

		zerk.parent('entityeditor.game.engine.system.entityeditor').init.apply(
			this,
			arguments
		);

		this._viewport=this._getSystem('viewport');

        this._physics=this._getSystem('physics');

        this._control=this._getSystem('control');

	},

	/**
	 * Returns true when the system is interested in given component
	 *
	 * @method useComponent
	 * @param {String} name Component name
	 * @return {Boolean} True when the system is intereseted in given component
	 **/
	useComponent: function(name) {

        return false;

	},

	/**
	 * Starts the system
	 *
	 * @method start
	 **/
	start: function() {

        var me=this;

		zerk.parent('entityeditor.game.engine.system.entityeditor').start.apply(
			me,
			arguments
		);

        me._control.keyboard.on(
            'keypress',
            me._onKeyPress,
            me
        );

        me._control.mouse.on(
            'mousedown',
            me._onMouseDown,
            me
        );

        me._control.mouse.on(
            'mouseup',
            me._onMouseUp,
            me
        );

        me._control.mouse.on(
            'mousemove',
            me._onMouseMove,
            me
        );

	},

	/**
	 * Stops the system
	 *
	 * @method stop
	 **/
	stop: function() {

		zerk.parent('entityeditor.game.engine.system.entityeditor').stop.apply(
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

		zerk.parent('entityeditor.game.engine.system.entityeditor').addEntity.apply(
			this,
			arguments
		);

	},

    drawBackground: function(entity) {

        var me=this;

        if (!me._editorSprite) {
            return;
        }

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

        var fixtureX=0;
        var fixtureY=0;
        var spriteX=0;
        var spriteY=0;
        var fixtureAngle=0;
        var spriteAngle=0;

        me._viewport.bufferInit(
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
            me._viewport.toPixel(fixtureX+spriteX),
            me._viewport.toPixel(fixtureY+spriteY),
            image.info.width,
            image.info.height,
            image.info.offsetX,
            image.info.offsetY,
            image.info.width,
            image.info.height,
            fixtureAngle+spriteAngle,
            0.5
        );

        // Draw the buffer onto the display
        me._viewport.bufferFlush(
            'body',
            'display',
            me._viewport._getCanvasX(position.x+bodyState.x), // -(bufferSize.width/2)
            me._viewport._getCanvasY(position.y+bodyState.y), // -(bufferSize.height/2)
            me._viewport.toZoom(bufferSize.width),
            me._viewport.toZoom(bufferSize.height),
            bodyState.angle,
            me._viewport.toZoom(-bufferSize.width/2),
            me._viewport.toZoom(-bufferSize.height/2)
        );

    },

    drawVertices: function() {

        var me=this;

        var vertices=[];
        var x=0;
        var y=0;

        for (var i=0;i<me._editorVertices.length;i++) {
            x=me._viewport._getCanvasX(me._editorVertices[i][0]);
            y=me._viewport._getCanvasY(me._editorVertices[i][1]);
            vertices.push([x,y]);
        }

        var color='rgba(127,127,76,0.5)';
        if (!me._editorVerticesValid) {
            color='rgba(255,0,0,0.5)';
        }

        if (vertices.length>=3) {
            me._viewport.drawPolygon(
                'display',
                vertices,
                color,
                color,
                0
            );
        }

        for (var i=0;i<vertices.length;i++) {

            var color='rgba(255,255,255,0.75)';
            if (i==me._editorVerticeIndex-1) {
                var color='rgba(0,255,0,0.75)';
            }

            me._viewport.drawArc(
                'display',
                vertices[i][0],
                vertices[i][1],
                5,
                0,
                Math.PI*2,
                true,
                color
                //strokeColor,
                //lineWidth
            );
        }

    },


	/**
	 * Updates the system
	 *
	 * @method update
	 **/
	update: function() {

        var me=this;

		zerk.parent('entityeditor.game.engine.system.entityeditor').update.apply(
			me,
			arguments
		);

        var entities=me._engine.getEntitiesByTags('editor');
        var entity=entities[0];

        me.drawBackground(entity);

        if (me._editorState=='add_fixture') {
            me._renderFixtureOriginIndicator();
        }

        if (me._editorState=='draw_polygon') {
            me.drawVertices();

        }

	},

    getEntity: function() {

        var me=this;

        var entities=me._engine.getEntitiesByTags('editor');

        return entities[0];

    },

    addVertice: function(x,y) {

        var me=this;

        if (me._editorState=='draw_polygon') {

            if (me._editorVerticeIndex < me._editorVertices.length) {
                me._editorVertices.splice(me._editorVerticeIndex, 0, [x, y]);
            } else {
                me._editorVertices.push([x, y]);
            }

            me._editorVerticeIndex++;

            //console.log('VERTICE INDEX AT',me._editorVerticeIndex);

            me.validatePolygon();

        }

    },

    validatePolygon: function() {

        this._editorVerticesValid=(zerk.helper.isPolygonClockwise(this._editorVertices)
            && zerk.helper.isPolygonConvex(this._editorVertices));

    },

    setBackground: function(spritesheet,sprite) {

        var me=this;

         me._engine._spriteLoader.loadSprites([spritesheet],function() {

             me._editorSpritesheet=spritesheet;
             me._editorSprite=sprite;

         });

    },

    placeFixture: function(shape) {

        var me=this;

        me._editorFixtureShape=shape;

        if (me._editorFixtureShape=='polygon') {

            me._editorState='draw_polygon';

        } else {

            me._editorState='place_fixture';

        }

        console.log('EDITOR STATE',me._editorState);

    },

    addFixture: function() {

        var me=this;

        console.log('ADD FIXTURE');

        me._editorState='add_fixture';

        if (me._editorFixtureShape=='box' || me._editorFixtureShape=='circle') {

            me.applyFixture();

        }

    },

    applyFixture: function() {

        var me=this;

        console.log('APPLY FIXTURE');

        var entity=me.getEntity();
        var body=entity.components.physics._bodyList[0];

        var newKey='fixture'+body._fixtureList.length;

        if (me._editorFixtureShape=='polygon') {

            /*
            if (!me._editorVerticesValid) {
                alert('Polygon is not valid');
                return;
            }
            */







            var vertices=[];

            // Calculate polygon center
            var center=zerk.helper.getCenterOfPolygon(me._editorVertices);

            me._editorFixtureX=center.x;
            me._editorFixtureY=center.y;

            // Calculate positions relative to fixture origin
            for (var i=0;i<me._editorVertices.length;i++) {
                vertices.push([
                    me._editorVertices[i][0]-center.x,
                    me._editorVertices[i][1]-center.y
                ]);
            }

            console.log('VERT',vertices);




            if (!me._editorVerticesValid) {
                console.log('Polygon is not valid');

                var concave = new decomp.Polygon();
                var convex = new decomp.Polygon();
                concave.vertices = vertices;
                //convex.vertices = concave.decomp();
                convex.vertices = concave.quickDecomp()




                for (var i = 0; i < convex.vertices.length; i++) {
                    me.applyFixtureVertices(convex.vertices[i].vertices, i);
                };
            } else {
                me.applyFixtureVertices(vertices);
            }


            /*
            var fixture={
                key: newKey,
                x: me._editorFixtureX,
                y: me._editorFixtureY,
                angle: 0,
                shape: 'polygon',
                vertices: vertices
            };

            me._physics.addFixture(
                entity,
                body,
                newKey,
                fixture
            );
            */

        } else if (me._editorFixtureShape=='box') {

            var fixture={
                key: newKey,
                x: me._editorFixtureX,
                y: me._editorFixtureY,
                angle: 0,
                shape: 'box',
                width: 0.5,
                height: 0.5
            };

            me._physics.addFixture(
                entity,
                body,
                newKey,
                fixture
            );

        } else if (me._editorFixtureShape=='circle') {

            var fixture={
                key: newKey,
                x: me._editorFixtureX,
                y: me._editorFixtureY,
                angle: 0,
                shape: 'circle',
                radius: 0.25,
            };

            me._physics.addFixture(
                entity,
                body,
                newKey,
                fixture
            );

        }




        me._editorVerticesValid=true;
        me._editorMovingPoint=false;
        me._editorVerticeIndex=null;
        me._editorVertices=[];
        me._editorState='';

        console.log('AFTER ADD');

    },

    applyFixtureVertices: function(vertices, key) {
        var me=this;
        var entity=me.getEntity();
        var body=entity.components.physics._bodyList[0];

        key = (!zerk.isDefined(key)) ? 'new' : 'new_' + key;

        var fixture={
            key: key,
            x: me._editorFixtureX,
            y: me._editorFixtureY,
            angle: 0,
            shape: 'polygon',
            vertices: vertices
        };

        me._physics.addFixture(
            entity,
            body,
            key,
            fixture
        );
    },

    cancelAddFixture: function() {

        var me=this;

        console.log('CANCEL ADD FIXTURE');

        me._editorVerticesValid=true;
        me._editorMovingPoint=false;
        me._editorVerticeIndex=null;
        me._editorVertices=[];
        me._editorState='';

    },

    _onMouseDown: function(event) {

        var me=this;

        var control=me._control;

        var viewport=me._viewport;

        if (control.mouse.mouseRightDown) {

            if (me._editorState=='draw_polygon') {

                var pointSizePixel = 10;

                var pointWidth = me._viewport.fromPixel(viewport.fromZoom(pointSizePixel));
                var pointHeight = me._viewport.fromPixel(viewport.fromZoom(pointSizePixel));

                for (var i = 0; i < me._editorVertices.length; i++) {

                    if (control.mouse.mouseX >= me._editorVertices[i][0] - (pointWidth / 2)
                        && control.mouse.mouseX <= me._editorVertices[i][0] + (pointWidth / 2)
                        && control.mouse.mouseY >= me._editorVertices[i][1] - (pointHeight / 2)
                        && control.mouse.mouseY <= me._editorVertices[i][1] + (pointHeight / 2)
                    ) {

                        me._editorMovingPoint = true;
                        me._editorVerticeIndex = i + 1;

                        console.log('VERTICE INDEX AT', me._editorVerticeIndex);

                    }

                }

            }



        } else if (control.mouse.mouseLeftDown) {

            if (me._editorState=='place_fixture') {

                me._editorFixtureX=control.mouse.mouseX;
                me._editorFixtureY=control.mouse.mouseY;

                me.addFixture();

            } else if (me._editorState=='draw_polygon') {

                console.log('PLACE POINT');

                me.addVertice(
                    control.mouse.mouseX,
                    control.mouse.mouseY
                );

            } else {


                var body=this._physics.getBodyAtMouse();

                console.log('B',body);

                /*
                if (body) {

                    this._mouseJoint=this._createJointMouse(
                        body,
                        this.fromWorldScale(systemControl.mouse.mouseX),
                        this.fromWorldScale(systemControl.mouse.mouseY)
                    );

                }
                */


            }

        }

    },

    _onMouseMove: function(event) {

        var me=this;

        if (me._editorState=='draw_polygon') {

            if (me._editorMovingPoint) {

                me._editorVertices[me._editorVerticeIndex-1][0]=me._control.mouse.mouseX;
                me._editorVertices[me._editorVerticeIndex-1][1]=me._control.mouse.mouseY;

                me.validatePolygon();

            }
        }

    },

    _onMouseUp: function(event) {

        var me=this;

        me._editorMovingPoint=false;

    },

    _onKeyPress: function(event) {

        var me=this;

        if (me._editorState=='draw_polygon') {

            console.log('KEY', event.keyCode);

            if (event.keyCode == 114) { // r

                if (me._editorVerticeIndex != null) {
                    me._editorVertices.splice(me._editorVerticeIndex - 1, 1);

                    me.validatePolygon();

                    if (me._editorVerticeIndex == 0) {
                        me._editorVerticeIndex = null;
                    } else {
                        me._editorVerticeIndex--;
                    }
                }

            } else if (event.keyCode == 13) { // Return

                me.applyFixture();

            } else if (event.keyCode == 99) { // c

                me.cancelAddFixture();

            }

        }

    },

    editorDumpFixture: function() {

        var me=this;

        var data=JSON.stringify(me._editorVertices);

        console.log(data);

    },

    _renderFixtureOriginIndicator: function() {

        var me=this;

        /*
        var size=0.2;

        this._viewport.drawLines(
            'display',
            [
                [
                    me._viewport._getCanvasX(me._editorFixtureX)-me._viewport.toPixel(size),
                    me._viewport._getCanvasY(me._editorFixtureY),
                    me._viewport._getCanvasX(me._editorFixtureX)+me._viewport.toPixel(size),
                    me._viewport._getCanvasY(me._editorFixtureY)
                ],
                [
                    me._viewport._getCanvasX(me._editorFixtureX),
                    me._viewport._getCanvasY(me._editorFixtureY)-me._viewport.toPixel(size),
                    me._viewport._getCanvasX(me._editorFixtureX),
                    me._viewport._getCanvasY(me._editorFixtureY)+me._viewport.toPixel(size)
                ]
            ],
            'rgb(0,255,0)'
        );
        */

    }

});