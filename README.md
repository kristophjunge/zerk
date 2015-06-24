# Zerk Game Engine

Zerk is a JavaScript game engine developed by Kristoph Junge and [others](https://github.com/kristophjunge/zerk/graphs/contributors).

Zerk is based on an [Entity-Component-System](http://en.wikipedia.org/wiki/Entity_component_system) architecture.

Zerk aims to be able to run various types of 2D games on desktop and mobile devices.

More information can be found here [kristophjunge.com](https://kristophjunge.com).

**Other Software that Zerk is using:**

[Box2DWeb](http://code.google.com/p/box2dweb/) a JavaScript port of the [Box2D](http://box2d.org/) physics library written by Erin Catto and others.

[JSON5](https://github.com/aseemk/json5) by Aseem Kishore and others.

[Poly-Decomp](https://github.com/schteppe/poly-decomp.js) a library for decomposition of polygons into convex regions.

##Installation

Zerk can be installed via npm.

```bash
$ npm install -g zerk
```

##Using Zerk

Zerk is currently at an early development stage, use it at your own risk.

Create a `zerk.json` file in your game directory.
```javascript
{
    "game": "mygame",
    "bootstrapClass": "mygame.game",
    "namespaces": {
        "mygame": "./"
    },
    "log": {
        "enabled": true,
        "severity": 3
    },
    "dev": {
        "port": 8337
    }
}
```

Create a game class under `class/game.js` in your game directory.

```javascript
zerk.define({
	name: 'mygame.game',
	extend: 'zerk.game'
},{
    // ...
});
```

Create a configuration file under `data/config/default.json` in your game directory.

```javascript
{
    "engine": {
        "defaultSystems": [
            "physics",
            "viewport",
            "render",
            "wireframe",
            "message",
            "debuginfo",
            "control"
        ],
        "componentMap": {
            "position": "zerk.game.engine.component.position",
            "physics": "zerk.game.engine.component.physics",
            "render": "zerk.game.engine.component.render",
            "trigger": "zerk.game.engine.component.trigger"
        },
        "systemMap": {
            "physics": "zerk.game.engine.system.physics.box2d",
            "viewport": "zerk.game.engine.system.viewport.canvas",
            "render": "zerk.game.engine.system.render",
            "wireframe": "zerk.game.engine.system.wireframe",
            "message": "zerk.game.engine.system.message",
            "debuginfo": "zerk.game.engine.system.debuginfo",
            "control": "zerk.game.engine.system.control"
        }
    }
}
```

Navigate into your game directory and run the `zerk  dev` command.

```bash
$ zerk dev
```

##License

Zerk is licensed under the MIT License.


##Documentation

The Zerk API documentation is available at [http://dev.kristophjunge.com/zerk/doc/latest](http://dev.kristophjunge.com/zerk/doc/latest)
