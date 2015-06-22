var companion = require('companion');

var JSON5 = companion.require('../../src/json5/json5.js').JSON5;
var Box2D = companion.require('../../src/box2dweb/Box2dWeb-2.1.a.3.js').Box2D;
var zerkWrapper = companion.require('../../src/zerk/zerk.js', {
    companion: companion,
    console: console,
    Box2D: Box2D
});

companion.require('../../src/zerk/helper.js', zerkWrapper);

zerkWrapper.zerk.init({
    bootstrap: {
        game: 'gameserver',
        gameDir: './',
        zerkDir: './../../src/zerk',
        log: {
            enabled: true,
            severity: 3
        }
    }
});

// zerkWrapper.zerk._ready();
