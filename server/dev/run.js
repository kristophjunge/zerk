#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var zerkDir = path.resolve(__dirname, '../../');
var moduleDir = path.resolve(zerkDir, 'node_modules');

var express = require('express');
var hogan = require(moduleDir + '/hogan.js');

var app = express();
var arguments = process.argv.splice(2);
var zerkConfig = JSON.parse(arguments[0]);
var gameDir = arguments[1];
var port = 8000;

var requiredFiles = [
    '/vendor/box2dweb/Box2dWeb-2.1.a.3.js',
    '/vendor/json5/json5.js',
    '/vendor/poly-decomp/poly-decomp.js',
    '/src/zerk/zerk.js',
    '/src/zerk/helper.js',
    '/src/zerk/browser.js',

    // TODO: Remove static file inclusion
    '/src/zerk/class/network/ajax.js',
    '/src/zerk/class/observable.js',
    '/src/zerk/class/jsonLoader.js',
    '/src/zerk/class/imageLoader.js',
    '/src/zerk/class/game/engine/system.js',
    '/src/zerk/class/game/engine/registry.js',
    '/src/zerk/class/game/engine/worldLoader.js',
    '/src/zerk/class/game/engine/textureLoader.js',
    '/src/zerk/class/game/engine/spriteLoader.js',
    '/src/zerk/class/game/engine/entityLoader.js',
    '/src/zerk/class/game/engine/componentLoader.js',
    '/src/zerk/class/game/engine.js',
    '/src/zerk/class/game.js',
    '/src/zerk/class/game/engine/component.js',
    '/src/zerk/class/game/engine/component/physics.js',
    '/src/zerk/class/game/engine/component/position.js',
    '/src/zerk/class/game/engine/component/render.js',
    '/src/zerk/class/game/engine/component/player.js',
    '/src/zerk/class/game/engine/component/damager.js',
    '/src/zerk/class/game/engine/component/fall.js',
    '/src/zerk/class/game/engine/component/trigger.js',
    '/src/zerk/class/game/engine/component/elevator.js',
    '/src/zerk/class/game/engine/system/physics.js',
    '/src/zerk/class/game/engine/system/physics/box2d.js',
    '/src/zerk/class/game/engine/system/viewport.js',
    '/src/zerk/class/game/engine/system/viewport/canvas.js',
    '/src/zerk/class/game/engine/system/render.js',
    '/src/zerk/class/game/engine/system/wireframe.js',
    '/src/zerk/class/game/engine/system/message/message.js',
    '/src/zerk/class/game/engine/system/message.js',
    '/src/zerk/class/game/engine/system/debuginfo.js',
    '/src/zerk/class/game/engine/system/control/keyboard.js',
    '/src/zerk/class/game/engine/system/control/mouse.js',
    '/src/zerk/class/game/engine/system/control.js',
    '/src/zerk/class/game/engine/system/player.js',
    '/src/zerk/class/game/engine/system/damager.js',
    '/src/zerk/class/game/engine/system/fall.js',
    '/src/zerk/class/game/engine/system/elevator.js',
    '/src/zerk/class/game.js',
    '/class/game/engine/system/entityeditor.js',
    '/class/game.js',
];


app.use("/", express.static(zerkDir));
app.use("/", express.static(gameDir));

var server = app.listen(zerkConfig.dev.port, function () {

    app.get('/', function (req, res) {
        var indexHtml = generateIndexHtml(zerkConfig);
        res.send(indexHtml);
    });

    app.get('/game/:game', function (req, res) {
        var gameHtml = generateGameHtml(zerkConfig);
        res.send(gameHtml);
    });

    app.get('/demo/:demo', function (req, res) {
        var demoConfig = getGameConfig('demo', req.params.demo);
        var gameHtml = generateGameHtml(demoConfig);
        res.send(gameHtml);
    });

    app.get('/tools/:tool', function (req, res) {
        var toolConfig = getGameConfig('tools', req.params.tool);
        var gameHtml = generateGameHtml(toolConfig);
        res.send(gameHtml);
    });

    console.log('Dev-Server running at http://localhost:' + zerkConfig.dev.port);
});

function generateIndexHtml(zerkConfig) {
    var indexTemplate = fs.readFileSync(__dirname + '/indexTemplate.html', {encoding: 'UTF-8'})
    var template = hogan.compile(indexTemplate);
    var data = {
        config: zerkConfig,
        zerkDir: zerkDir,
        files: requiredFiles
    }
    return template.render(data);
}

function generateGameHtml(zerkConfig) {
    var gameTemplate = fs.readFileSync(__dirname + '/gameTemplate.html', {encoding: 'UTF-8'})
    var template = hogan.compile(gameTemplate);
    var data = {
        config: zerkConfig,
        zerkDir: zerkDir,
        files: requiredFiles
    }
    return template.render(data);
}

function getGameConfig(type, game) {
    var configDir = zerkDir + '/' + type + '/' + game + '/zerk.json';

    try {
        var gameConfig = fs.statSync(configDir)
        if (gameConfig.isFile()) {
            return JSON.parse(fs.readFileSync(configDir, {encoding: 'UTF-8'}));
        }
    } catch(err) {
        if (err.code == 'ENOENT') {
            console.log('No zerk file found! (Expected: ' + configDir + ')');
            process.exit();
        }
    }
};