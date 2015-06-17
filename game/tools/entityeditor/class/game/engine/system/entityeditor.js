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

    _wireframe: null,

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

    _editorFocusEntity: 0,

    _editorSelectionFixtures: {},

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

        this._wireframe=this._getSystem('wireframe');

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
            'click',
            me._onClick,
            me
        );

        me._control.mouse.on(
            'doubleclick',
            me._onDoubleClick,
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

        if (me._isEditorState('draw_polygon')) {
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

        if (me._isEditorState('draw_polygon')) {

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

            me._setEditorState('draw_polygon');

        } else {

            me._setEditorState('place_fixture');

        }

    },

    addFixture: function() {

        var me=this;

        console.log('ADD FIXTURE');

        me._setEditorState('add_fixture');

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


        me.clearSelectionFixtures();


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

            me.addSelectionFixture(entity.id,body.key,newKey);

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

            me.addSelectionFixture(entity.id,body.key,newKey);

        }

        me._editorVerticesValid=true;
        me._editorMovingPoint=false;
        me._editorVerticeIndex=null;
        me._editorVertices=[];
        me._setEditorState('');

        console.log('AFTER ADD');


        me._updateInspector();

    },

    applyFixtureVertices: function(vertices, key) {
        var me=this;
        var entity=me.getEntity();
        var body=entity.components.physics._bodyList[0];

        var newKey='fixture'+body._fixtureList.length;

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

        me.addSelectionFixture(entity.id,body.key,newKey);

    },

    cancelAddFixture: function() {

        var me=this;

        console.log('CANCEL ADD FIXTURE');

        me._editorVerticesValid=true;
        me._editorMovingPoint=false;
        me._editorVerticeIndex=null;
        me._editorVertices=[];
        me._setEditorState('');

    },

    /*
    getFocusFixture: function() {

        var me=this;


    },
    */

    _onMouseDown: function(event) {

        var me=this;

        if (me._control.mouse.mouseRightDown) {

            if (me._isEditorState('draw_polygon')) {

                var pointSizePixel = 10;

                var pointWidth = me._viewport.fromPixel(viewport.fromZoom(pointSizePixel));
                var pointHeight = me._viewport.fromPixel(viewport.fromZoom(pointSizePixel));

                for (var i = 0; i < me._editorVertices.length; i++) {

                    if (me._control.mouse.mouseX >= me._editorVertices[i][0] - (pointWidth / 2)
                        && me._control.mouse.mouseX <= me._editorVertices[i][0] + (pointWidth / 2)
                        && me._control.mouse.mouseY >= me._editorVertices[i][1] - (pointHeight / 2)
                        && me._control.mouse.mouseY <= me._editorVertices[i][1] + (pointHeight / 2)
                    ) {

                        me._editorMovingPoint = true;
                        me._editorVerticeIndex = i + 1;

                        console.log('VERTICE INDEX AT', me._editorVerticeIndex);

                    }

                }

            }

        }

    },

    _onMouseMove: function(event) {

        var me=this;

        if (me._isEditorState('draw_polygon')) {

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

        console.log('KEY', event.keyCode);

        if (event.keyCode == 114) { // r

            if (me._isEditorState('draw_polygon')) {
                if (me._editorVerticeIndex != null) {
                    me._editorVertices.splice(me._editorVerticeIndex - 1, 1);

                    me.validatePolygon();

                    if (me._editorVerticeIndex == 0) {
                        me._editorVerticeIndex = null;
                    } else {
                        me._editorVerticeIndex--;
                    }
                }
            }

        } else if (event.keyCode == 32) { // Space

            if (me._isEditorState('draw_polygon')) {
                me.applyFixture();
            }

        } else if (event.keyCode == 99) { // c

            if (me._isEditorState('edit_fixture')) {

                me._setEditorState('');

            } else if (me._isEditorState('draw_polygon')) {

                me.cancelAddFixture();

            }

        }

    },

    editorDumpFixture: function() {

        var me=this;

        var data=JSON.stringify(me._editorVertices);

        console.log(data);

    },

    _onClick: function(event) {

        var me=this;

        if (event.button==0) {

            if (me._isEditorState('place_fixture')) {

                me._editorFixtureX=me._control.mouse.mouseX;
                me._editorFixtureY=me._control.mouse.mouseY;

                me.addFixture();

            } else if (me._isEditorState('draw_polygon')) {

                console.log('PLACE POINT');

                me.addVertice(
                    me._control.mouse.mouseX,
                    me._control.mouse.mouseY
                );

            } else if (me._isEditorState('')) {

                console.log('TRY SELECT FIXTURE');

                var focus = this._physics.getFixtureAtMouse();

                if (focus) {

                    if (!me._control.keyboard.pressedCtrl && !me._control.keyboard.pressedShift) {
                        me.clearSelectionFixtures();
                    }

                    me.addSelectionFixture(focus.entity.id,focus.body,focus.fixture);

                    me._updateInspector();

                    console.log('SELECT FIXTURE',focus.fixture);

                }

            }

        }

    },

    _onDoubleClick: function(event) {

        var me=this;

        if (event.button==0) { // Left mouse

            if (me._isEditorState('')) { // Idle state

                // Check if the double click takes place on current focus fixture
                var focus = this._physics.getFixtureAtMouse();

                if (focus && me.isFocusFixture(focus.entity.id,focus.body,focus.fixture)) {

                    me._editFixture();

                }

            }

        }

    },

    _updateInspector: function() {

        var me=this;

        var container=document.getElementById('zerk-editor-inspector');

        container.innerHTML='';

        var entity=this._engine.getEntityById(me._editorFocusEntity);

        var i=0;
        var x=0;

        for (i=0;i<entity.components.physics._bodyList.length;i++) {

            var body=entity.components.physics._bodyList[i];

            var bodyWrapper=document.createElement('div');
            bodyWrapper.setAttribute('class','zerk-body-wrapper');

            var bodyContainer=document.createElement('div');
            bodyContainer.setAttribute('class','zerk-body-container');
            bodyWrapper.appendChild(bodyContainer);

            var bodyLabel=document.createElement('span');
            bodyLabel.setAttribute('class','zerk-label');
            bodyLabel.innerText=body.key;
            bodyContainer.appendChild(bodyLabel);

            for (x=0;x<body._fixtureList.length;x++) {

                var fixtureContainerClass='zerk-fixture-container';

                if (me.isFocusFixture(entity.id,body.key,body._fixtureList[x].key)) {
                    fixtureContainerClass+=' zerk-selected';
                }

                var fixtureContainer=document.createElement('div');
                fixtureContainer.setAttribute('class',fixtureContainerClass);
                bodyWrapper.appendChild(fixtureContainer);

                var fixtureLabel=document.createElement('span');
                fixtureLabel.setAttribute('class','zerk-label');
                fixtureLabel.innerText=body._fixtureList[x].key;
                fixtureContainer.appendChild(fixtureLabel);

            }

            container.appendChild(bodyWrapper);

        }

    },

    _editFixture: function() {

        var me=this;

        console.log('START EDIT FIXTURE',me._editorSelectionFixtures);

        me._setEditorState('edit_fixture');

    },

    _setEditorState: function(state) {

        var me=this;

        me._editorState=state;

        document.getElementById('zerk-editor-state').innerHTML=((me._editorState) ? me._editorState : 'idle');

    },

    _isEditorState: function(state) {

        var me=this;

        return (me._editorState==state);

    },

    setEditEntity: function(entityId) {

        var me=this;

        me._editorFocusEntity=entityId;

        me._updateInspector();

    },

    isFocusFixture: function(entityId,bodyKey,fixtureKey) {

        var me=this;

        return (zerk.isDefined(me._editorSelectionFixtures[entityId])
            && zerk.isDefined(me._editorSelectionFixtures[entityId][bodyKey])
            && zerk.inArray(fixtureKey,me._editorSelectionFixtures[entityId][bodyKey]));

    },

    addSelectionFixture: function(entityId,bodyKey,fixtureKey) {

        var me=this;

        if (!zerk.isDefined(me._editorSelectionFixtures[entityId])) {
            me._editorSelectionFixtures[entityId]={};
        }

        if (!zerk.isDefined(me._editorSelectionFixtures[entityId][bodyKey])) {
            me._editorSelectionFixtures[entityId][bodyKey]=[];
        }

        if (!zerk.inArray(fixtureKey,me._editorSelectionFixtures[entityId][bodyKey])) {
            me._editorSelectionFixtures[entityId][bodyKey].push(fixtureKey);
        }

        me._wireframe.addHighlightFixture(entityId,bodyKey,fixtureKey);

    },

    removeSelectionFixture: function(entityId,bodyKey,fixtureKey) {

        var me=this;

        if (zerk.isDefined(me._editorSelectionFixtures[entityId])
            && zerk.isDefined(me._editorSelectionFixtures[entityId][bodyKey])) {

            zerk.removeFromArray(fixtureKey,me._editorSelectionFixtures[entityId][bodyKey]);

            if (me._editorSelectionFixtures[entityId][bodyKey].length==0) {
                delete me._editorSelectionFixtures[entityId][bodyKey];
            }

            if (me._editorSelectionFixtures[entityId][bodyKey].length==0) {
                delete me._editorSelectionFixtures[entityId][bodyKey];
            }

            if (zerk.objectCount(me._editorSelectionFixtures[entityId])==0) {
                delete me._editorSelectionFixtures[entityId];
            }

            me._wireframe.removeHighlightFixture(entityId,bodyKey,fixtureKey);

            return true;

        }

        return false;

    },

    clearSelectionFixtures: function() {

        var me=this;

        me._editorSelectionFixtures={};

        me._wireframe.removeAllHighlightFixtures();

    }

});