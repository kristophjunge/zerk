#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var companion = require('companion');
var companion = require('companion');
var srcPath = path.resolve(__dirname, '../../src');

var zerk = companion.require(srcPath + '/zerk/zerk.js').zerk;

// Load custom require module
companion.require(srcPath + '/zerk-node/class/helper/require.js', {
    require: require,
    zerk: zerk,
    companion: companion,
    console: console
});
var requireContext = zerk.create('zerkNode.helper.require');
zerk.require = requireContext.require.bind(requireContext);

// Load path module
zerk.require(srcPath + '/zerk-node/class/helper/path.js');
var pathContext = zerk.create('zerkNode.helper.path', srcPath);
zerk.path = pathContext.get.bind(pathContext);

// TODO: Start init script
zerk.require(zerk.path('zerknode') + '/class/init.js');
zerk.create('zerkNode.init');

// TODO: Start dev server
zerk.require(zerk.path('zerknode') + '/class/dev.js');
zerk.create('zerkNode.dev');