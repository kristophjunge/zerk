zerk.define({
	
	name: 'entityeditor.game',
	extend: 'zerk.game',
	require: [
		'zerk.game.engine.component.physics',
		'zerk.game.engine.component.position',
		'zerk.game.engine.component.sprite',
		'zerk.game.engine.component.player',
		'zerk.game.engine.component.damager',
		'zerk.game.engine.component.fall',
		'zerk.game.engine.component.trigger',
		'zerk.game.engine.component.elevator',
		
		'zerk.game.engine.system.physics.box2d',
		'zerk.game.engine.system.viewport.canvas',
		'zerk.game.engine.system.sprite',
		'zerk.game.engine.system.wireframe',
		'zerk.game.engine.system.message',
		'zerk.game.engine.system.debuginfo',
		'zerk.game.engine.system.control',
		'zerk.game.engine.system.player',
		'zerk.game.engine.system.damager',
		'zerk.game.engine.system.fall',
		'zerk.game.engine.system.trigger',
		'zerk.game.engine.system.elevator',
        'tools.game.engine.system.entityeditor'

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

        me._engine._jsonLoader.addNamespace('sandbox.component','./../../demo/sandbox/data/component');
        me._engine._jsonLoader.addNamespace('sandbox.entity','./../../demo/sandbox/data/entity');
        me._engine._jsonLoader.addNamespace('sandbox.world','./../../demo/sandbox/data/world');
        me._engine._jsonLoader.addNamespace('sandbox.config','./../../demo/sandbox/data/config');
        me._engine._jsonLoader.addNamespace('sandbox.spritesheet','./../../demo/sandbox/media/spritesheet');
        me._engine._imageLoader.addNamespace('sandbox.texture','./../../demo/sandbox/media/texture');
        me._engine._imageLoader.addNamespace('sandbox.spritesheet','./../../demo/sandbox/media/spritesheet');

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
                        "name": "entityeditor.entity.empty",
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

                var control=me._engine.getSystem('control');

			},
			function(error) {
				
				console.log(error);
				
			}
		);

	},

    editorAddFixture: function(spritesheet,sprite) {

        var me=this;

        var editor=me._engine.getSystem('entityeditor');

        editor.addFixture(spritesheet,sprite);

    },

    editorDumpFixture: function() {

        var me=this;

        var editor=me._engine.getSystem('entityeditor');

        editor.editorDumpFixture();

    }
	
});