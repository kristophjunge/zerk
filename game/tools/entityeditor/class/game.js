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
	
},{
	
	run: function(config) {

        var me=this;

		if (!zerk.parent('entityeditor.game').run.apply(
            me,
			arguments
		)) {
			return;
		}
		
		if (!me._engine.start()) {
			return;
		}

        me._engine._jsonLoader.addNamespace('monstertruck.component','./../../game/demo/monstertruck/data/component');
        me._engine._jsonLoader.addNamespace('monstertruck.entity','./../../game/demo/monstertruck/data/entity');
        me._engine._jsonLoader.addNamespace('monstertruck.world','./../../game/demo/monstertruck/data/world');
        me._engine._jsonLoader.addNamespace('monstertruck.config','./../../game/demo/monstertruck/data/config');
        me._engine._jsonLoader.addNamespace('monstertruck.spritesheet','./../../game/demo/monstertruck/media/spritesheet');
        me._engine._imageLoader.addNamespace('monstertruck.texture','./../../game/demo/monstertruck/media/texture');
        me._engine._imageLoader.addNamespace('monstertruck.spritesheet','./../../game/demo/monstertruck/media/spritesheet');

		me._engine.loadWorldConfig(
            {
                "name": "empty",
                "config": {
                    "systems": {
                        "physics": {
                            "gravityX": 0,
                            "gravityY": 0
                        }
                    }
                },
                "entities": [
                    {
                        //"name": "entityeditor.entity.empty",
                        "name": "monstertruck.entity.monstertruck",
                        //"name": "sandbox.entity.crate",
                        tags: [
                            'editor'
                        ],
                        "components": {
                            "position": {
                                "x": 0,
                                "y": 0
                            }
                        }
                    }
                ]
            },
			function() {

                me._engine.getSystem('physics').setEnabled(false);

                var entities=me._engine.getEntitiesByTags('editor');
                var entity=entities[0];

                me._engine.getSystem('entityeditor').setEditEntity(entity.id);

                //var control=me._engine.getSystem('control');

			},
			function(error) {
				
				console.log(error);
				
			}
		);

	},

    editorSetBackground: function(spritesheet,sprite) {

        var me=this;

        var editor=me._engine.getSystem('entityeditor');

        editor.setBackground(spritesheet,sprite);

    },

    editorAddFixture: function(shape) {

        var me=this;

        var editor=me._engine.getSystem('entityeditor');

        console.log('CALL');

        editor.placeFixture(shape);

    },

    editorDumpFixture: function() {

        var me=this;

        var editor=me._engine.getSystem('entityeditor');

        editor.editorDumpFixture();

    }
	
});