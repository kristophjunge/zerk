# Zerk Game Engine

Zerk is a JavaScript game engine developed by Kristoph Junge and [others](https://github.com/kristophjunge/zerk/graphs/contributors).

Zerk is based on an [Entity-Component-System](http://en.wikipedia.org/wiki/Entity_component_system) architecture.

Zerk aims to be able to run various types of 2D games on desktop and mobile devices.

More information can be found here [kristophjunge.com](https://kristophjunge.com).

**Other Software that Zerk is using:**

[Box2DWeb](http://code.google.com/p/box2dweb/) a JavaScript port of the [Box2D](http://box2d.org/) physics library written by Erin Catto and others. Used as the main physcis engine.

[JSON5](https://github.com/aseemk/json5) by Aseem Kishore and others. Used to to parse JSON files with comments.

[Poly-Decomp](https://github.com/schteppe/poly-decomp.js) a library for decomposition of polygons into convex regions writte by Stefan Hedman. Used to decompose complex polygons inside the entity editor.

[Node.js](https://nodejs.org/) by Joyent, Inc. and other Node contributors. Used to serve the zerk tool chain like the development server.


##Installation

Zerk can be installed via npm.

```bash
$ npm install -g zerk
```

##Using Zerk

Zerk is currently at an early development stage, use it at your own risk.

Navigate into an empty game directory and run:
```bash
$ zerk init
$ zerk dev
```


##License

Zerk is licensed under the MIT License.


##Documentation

The Zerk API documentation is available at [http://dev.kristophjunge.com/zerk/doc/latest](http://dev.kristophjunge.com/zerk/doc/latest)
