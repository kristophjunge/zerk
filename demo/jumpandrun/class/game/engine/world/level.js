zerk.define({

	name: 'jumpandrun.game.engine.world.level',
	extend: 'zerk.game.engine.world',
	require: [
		'zerk.game.engine.entity.box',
		'jumpandrun.game.engine.entity.player',
		'jumpandrun.game.engine.entity.fallingPlatform',
		'jumpandrun.game.engine.entity.elevatorPlatform',
		'jumpandrun.game.engine.entity.balancePlatform',
		'jumpandrun.game.engine.entity.fallingStone',
		'jumpandrun.game.engine.entity.triggerZone',
		'jumpandrun.game.engine.entity.triggerExit',
		'jumpandrun.game.engine.entity.triggerDestroy',
		'jumpandrun.game.engine.entity.groundDown'
	]
	
},{
	
	_engine: null,
	
	_setup: function() {
		
		this._spawn(
			'jumpandrun.game.engine.entity.player',
			{
				id: 'player',
				//x: 182,
				//y: -10
				x: 0,
				y: 0
				
			}
		);
		
		this._spawn(
			'zerk.game.engine.entity.box',
			{
				id: 'ground1b',
				x: -7,
				y: -1.5,
				width: 1,
				height: 6
			}
		);
		
		this._spawn(
			'zerk.game.engine.entity.box',
			{
				id: 'ground1',
				x: 0,
				y: 2,
				width: 15,
				height: 1
			}
		);
		
		this._spawn(
			'jumpandrun.game.engine.entity.triggerDestroy',
			{
				id: 'triggerDestroy1',
				x: 13,
				y: 6,
				width: 15,
				height: 1
			}
		);
		
		this._spawn(
			'jumpandrun.game.engine.entity.fallingPlatform',
			{
				id: 'fallingPlatform5',
				x: 11.5,
				y: 1.5
			}
		);
		
		this._spawn(
			'zerk.game.engine.entity.box',
			{
				id: 'ground3',
				x: 22.5,
				y: 1,
				width: 10,
				height: 1
			}
		);
		
		this._spawn(
			'zerk.game.engine.entity.box',
			{
				id: 'ground4a',
				x: 28,
				y: 0.5,
				width: 1,
				height: 2
			}
		);
		
		this._spawn(
			'zerk.game.engine.entity.box',
			{
				id: 'ground4',
				x: 32.5,
				y: -1,
				width: 10,
				height: 1
			}
		);
		
		this._spawn(
			'jumpandrun.game.engine.entity.fallingStone',
			{
				id: 'fallingStone1',
				x: 32.5,
				y: -7
			}
		);
		
		this._spawn(
			'jumpandrun.game.engine.entity.triggerZone',
			{
				id: 'triggerZone1',
				x: 32.5,
				y: -4,
				targetEntityId: 'fallingStone1'
			}
		);
		
		this._spawn(
			'jumpandrun.game.engine.entity.groundDown',
			{
				id: 'ground5',
				x: 42.5,
				y: -1
			}
		);
		
		this._spawn(
			'zerk.game.engine.entity.box',
			{
				id: 'ground6',
				x: 49,
				y: 4,
				width: 3,
				height: 1
			}
		);
		
		this._spawn(
			'jumpandrun.game.engine.entity.triggerDestroy',
			{
				id: 'triggerDestroy2',
				x: 55,
				y: 9,
				width: 15,
				height: 1
			}
		);
		
		this._spawn(
			'jumpandrun.game.engine.entity.triggerDestroy',
			{
				id: 'triggerDestroy3',
				x: 70,
				y: 9,
				width: 15,
				height: 1
			}
		);
		
		this._spawn(
			'jumpandrun.game.engine.entity.triggerDestroy',
			{
				id: 'triggerDestroy4',
				x: 85,
				y: 9,
				width: 15,
				height: 1
			}
		);
		
		this._spawn(
			'jumpandrun.game.engine.entity.fallingPlatform',
			{
				id: 'fallingPlatform1',
				x: 54,
				y: 3.5
			}
		);
		
		this._spawn(
			'jumpandrun.game.engine.entity.fallingPlatform',
			{
				id: 'fallingPlatform2',
				x: 63,
				y: 5
			}
		);
		
		this._spawn(
			'jumpandrun.game.engine.entity.fallingPlatform',
			{
				id: 'fallingPlatform3',
				x: 69,
				y: 3
			}
		);
		
		this._spawn(
			'jumpandrun.game.engine.entity.fallingPlatform',
			{
				id: 'fallingPlatform4',
				x: 76,
				y: 1.5
			}
		);
		
		this._spawn(
			'zerk.game.engine.entity.box',
			{
				id: 'ground7',
				x: 84,
				y: 1,
				width: 7,
				height: 1
			}
		);
		
		this._spawn(
			'zerk.game.engine.entity.box',
			{
				id: 'ground7b',
				x: 88,
				y: 0.5,
				width: 1,
				height: 2
			}
		);
		
		this._spawn(
			'zerk.game.engine.entity.box',
			{
				id: 'ground8',
				x: 92.5,
				y: -1,
				width: 10,
				height: 1
			}
		);
		
		this._spawn(
			'jumpandrun.game.engine.entity.triggerDestroy',
			{
				id: 'triggerDestroy5',
				x: 100,
				y: 4,
				width: 15,
				height: 1
			}
		);
		
		this._spawn(
			'jumpandrun.game.engine.entity.triggerDestroy',
			{
				id: 'triggerDestroy6',
				x: 115,
				y: 4,
				width: 15,
				height: 1
			}
		);
		
		this._spawn(
			'jumpandrun.game.engine.entity.triggerDestroy',
			{
				id: 'triggerDestroy7',
				x: 130,
				y: 4,
				width: 15,
				height: 1
			}
		);
		
		this._spawn(
			'jumpandrun.game.engine.entity.triggerDestroy',
			{
				id: 'triggerDestroy8',
				x: 145,
				y: 9,
				width: 15,
				height: 1
			}
		);
		
		this._spawn(
			'jumpandrun.game.engine.entity.triggerDestroy',
			{
				id: 'triggerDestroy9',
				x: 160,
				y: 9,
				width: 15,
				height: 1
			}
		);
		
		this._spawn(
			'jumpandrun.game.engine.entity.triggerDestroy',
			{
				id: 'triggerDestroy10',
				x: 175,
				y: 9,
				width: 15,
				height: 1
			}
		);
		
		this._spawn(
			'jumpandrun.game.engine.entity.triggerDestroy',
			{
				id: 'triggerDestroy11',
				x: 190,
				y: 9,
				width: 15,
				height: 1
			}
		);
		
		this._spawn(
			'jumpandrun.game.engine.entity.fallingStone',
			{
				id: 'fallingStone2',
				x: 92.5,
				y: -7
			}
		);
		
		this._spawn(
			'jumpandrun.game.engine.entity.triggerZone',
			{
				id: 'triggerZone2',
				x: 92.5,
				y: -4,
				targetEntityId: 'fallingStone2'
			}
		);
				
		this._spawn(
			'jumpandrun.game.engine.entity.elevatorPlatform',
			{
				id: 'elevatorPlatform1',
				x: 100.5,
				y: -1,
				axis: 'horizontal',
				position: 0,
				turn: 'forward',
				enabled: true
			}
		);
		
		this._spawn(
			'jumpandrun.game.engine.entity.elevatorPlatform',
			{
				id: 'elevatorPlatform2',
				x: 111.5,
				y: -7,
				axis: 'vertical',
				position: 0,
				turn: 'forward',
				enabled: true
			}
		);
		
		this._spawn(
			'jumpandrun.game.engine.entity.elevatorPlatform',
			{
				id: 'elevatorPlatform3',
				x: 118.5,
				y: -5,
				axis: 'horizontal',
				position: 0,
				turn: 'forward',
				enabled: true
			}
		);
		
		this._spawn(
			'zerk.game.engine.entity.box',
			{
				id: 'ground11',
				x: 132.5,
				y: -5,
				width: 10,
				height: 1
			}
		);
		
		this._spawn(
			'zerk.game.engine.entity.box',
			{
				id: 'ground11b',
				x: 137,
				y: -2.5,
				width: 1,
				height: 4
			}
		);
		
		this._spawn(
			'jumpandrun.game.engine.entity.fallingStone',
			{
				id: 'fallingStone3',
				x: 132.5,
				y: -11
			}
		);
		
		this._spawn(
			'jumpandrun.game.engine.entity.triggerZone',
			{
				id: 'triggerZone3',
				x: 132.5,
				y: -8,
				targetEntityId: 'fallingStone3'
			}
		);
		
		this._spawn(
			'zerk.game.engine.entity.box',
			{
				id: 'ground12',
				x: 142.5,
				y: -1,
				width: 10,
				height: 1
			}
		);
		
		this._spawn(
			'jumpandrun.game.engine.entity.balancePlatform',
			{
				id: 'balancePlatform1',
				x: 152.5,
				y: -1
			}
		);
		
		this._spawn(
			'jumpandrun.game.engine.entity.balancePlatform',
			{
				id: 'balancePlatform2',
				x: 159.5,
				y: -1
			}
		);
		
		this._spawn(
			'jumpandrun.game.engine.entity.balancePlatform',
			{
				id: 'balancePlatform3',
				x: 167.5,
				y: 2
			}
		);
		
		this._spawn(
			'jumpandrun.game.engine.entity.elevatorPlatform',
			{
				id: 'elevatorPlatform4',
				x: 172.5,
				y: -7,
				distance: 8,
				axis: 'vertical',
				position: 0,
				enabled: true
			}
		);
		
		this._spawn(
			'zerk.game.engine.entity.box',
			{
				id: 'ground13',
				x: 182.5,
				y: -7,
				width: 10,
				height: 1
			}
		);
		
		this._spawn(
			'zerk.game.engine.entity.box',
			{
				id: 'ground14',
				x: 187,
				y: -10.5,
				width: 1,
				height: 6
			}
		);
		
		this._spawn(
			'jumpandrun.game.engine.entity.triggerExit',
			{
				id: 'triggerExit1',
				x: 182.5,
				y: -9,
				width: 3,
				height: 3
			}
		);
		
	}
	
});