zerk.define({

    name: 'entityeditor.game',
    extend: 'zerk.game',
    require: [
        'zerk.game.engine.component.physics',
        'zerk.game.engine.component.position',
        'zerk.game.engine.component.render',
        'zerk.game.engine.component.player',
        'zerk.game.engine.component.damager',
        'zerk.game.engine.component.fall',
        'zerk.game.engine.component.trigger',
        'zerk.game.engine.component.elevator',

        'zerk.game.engine.system.physics.box2d',
        'zerk.game.engine.system.viewport.canvas',
        'zerk.game.engine.system.render',
        'zerk.game.engine.system.wireframe',
        'zerk.game.engine.system.message',
        'zerk.game.engine.system.debuginfo',
        'zerk.game.engine.system.control',
        'zerk.game.engine.system.player',
        'zerk.game.engine.system.damager',
        'zerk.game.engine.system.fall',
        'zerk.game.engine.system.elevator',

        'entityeditor.game.engine.system.entityeditor'

    ]

}, {

    run: function(config) {

        var me = this;

        if (!zerk.parent('entityeditor.game').run.apply(
            me,
            arguments
        )) {
            return;
        }

        if (!me._engine.start()) {
            return;
        }

        var editorContainer = document.createElement('div');

        editorContainer.setAttribute('class', 'zerk-editor');

        editorContainer.innerHTML =
            '<div class="zerk-panel">' +
                '<div class="zerk-panel-header">Editor State</div>' +
                '<div id="zerk-editor-state">idle</div>' +
            '</div>' +
            '<div class="zerk-panel">' +
                '<div class="zerk-panel-header">Background</div>' +
                'Spritesheet: <input id="editor-spritesheet" value="monstertruck.spritesheet.monstertruck"/>' +
                'Sprite: <input id="editor-sprite" value="full"/>' +
                '<div>' +
                    '<span class="zerk-button" onclick="zerk.game.editorSetBackground(' +
                        'document.getElementById(\'editor-spritesheet\').value,' +
                        'document.getElementById(\'editor-sprite\').value' +
                    ')"><span class="zerk-button-label">Set Background</span></span>' +
                '</div>' +
            '</div>' +
            '<div class="zerk-panel">' +
                '<div class="zerk-panel-header">Add Fixture</div>' +
                '<span class="zerk-button" onclick="zerk.game.editorAddFixture(\'polygon\')">' +
                '<span class="zerk-button-label">Polygon</span></span>' +
                '<span class="zerk-button" onclick="zerk.game.editorAddFixture(\'box\')">' +
                '<span class="zerk-button-label">Box</span></span>' +
                '<span class="zerk-button" onclick="zerk.game.editorAddFixture(\'circle\')">' +
                '<span class="zerk-button-label">Circle</span></span>' +
            '</div>' +
            '<div class="zerk-panel">' +
                '<div class="zerk-panel-header">Inspector</div>' +
                '<div class="zerk-editor-inspector" id="zerk-editor-inspector"></div>' +
            '</div>';

        document.body.appendChild(editorContainer);

        var editorCss = document.createElement('link');
        editorCss.setAttribute('href', '/zerk/game/tool/entityeditor/media/stylesheet/style.css');
        editorCss.setAttribute('media', 'screen');
        editorCss.setAttribute('rel', 'stylesheet');
        editorCss.setAttribute('type', 'text/css');

        document.head.appendChild(editorCss);

        me._engine.loadWorldConfig(
            {
                name: 'empty',
                config: {
                    systems: {
                        physics: {
                            gravityX: 0,
                            gravityY: 0
                        }
                    }
                },
                entities: [
                    {
                        name: 'monstertruck.entity.monstertruck',
                        tags: [
                            'editor'
                        ],
                        components: {
                            position: {
                                x: 0,
                                y: 0
                            }
                        }
                    }
                ]
            },
            function() {

                me._engine.getSystem('physics').setEnabled(false);

                var entities = me._engine.getEntitiesByTags('editor');
                var entity = entities[0];

                me._engine.getSystem('entityeditor').setEditEntity(entity.id);

            },
            function(error) {

                console.log(error);

            }
        );

    },

    editorSetBackground: function(spritesheet, sprite) {

        var me = this;

        var editor = me._engine.getSystem('entityeditor');

        editor.setBackground(spritesheet, sprite);

    },

    editorAddFixture: function(shape) {

        var me = this;

        var editor = me._engine.getSystem('entityeditor');

        editor.placeFixture(shape);

    },

    editorDumpFixture: function() {

        var me = this;

        var editor = me._engine.getSystem('entityeditor');

        editor.editorDumpFixture();

    },

    toggleSelectionFixture: function(button, entityId, bodyKey, fixtureKey) {

        var me = this;

        var editor = me._engine.getSystem('entityeditor');

        editor.addSelectionFixtureReplace(entityId, bodyKey, fixtureKey);

    }

});
