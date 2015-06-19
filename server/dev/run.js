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

var deps = require(zerkDir + '/server/helper/dependencyTreeGenerator')(zerkConfig.namespaces, zerkDir, gameDir);

var baseFiles = [
    '/vendor/box2dweb/Box2dWeb-2.1.a.3.js',
    '/vendor/json5/json5.js',
    '/vendor/poly-decomp/poly-decomp.js',
    '/src/zerk/zerk.js',
    '/src/zerk/helper.js',
    '/src/zerk/browser.js'
];

app.use("/", express.static(zerkDir));
app.use("/", express.static(gameDir));

var server = app.listen(zerkConfig.dev.port, function () {

    app.get('/', function (req, res) {
        deps.generateTree('/class/game.js');
        var requiredFiles = baseFiles.concat(deps.getDependencyList());
        console.log(requiredFiles);
        var indexHtml = generateTemplate('index', zerkConfig, requiredFiles);
        res.send(indexHtml);
    });

    app.get('/game/current', function (req, res) {
        deps.generateTree('/class/game.js');
        var requiredFiles = baseFiles.concat(deps.getDependencyList());
        console.log(requiredFiles);
        var gameHtml = generateTemplate('game', zerkConfig, requiredFiles);
        res.send(gameHtml);
    });

    app.get('/demo/:demo', function (req, res) {
        deps.generateTree('/class/game.js');
        var requiredFiles = baseFiles.concat(deps.getDependencyList());
        console.log(requiredFiles);
        var demoConfig = getGameConfig('demo', req.params.demo);
        var gameHtml = generateTemplate('game', demoConfig, requiredFiles);
        res.send(gameHtml);
    });

    app.get('/game/tools/entityeditor', function (req, res) {
        deps.generateTree('/class/game.js');
        var requiredFiles = baseFiles.concat(deps.getDependencyList());
        console.log(requiredFiles);
        var toolConfig = getGameConfig('game/tools', 'entityeditor');
        var gameHtml = generateTemplate('entityeditor', toolConfig, requiredFiles);
        res.send(gameHtml);
    });

    console.log('Dev-Server is running at http://localhost:' + zerkConfig.dev.port);
});

function generateTemplate(template, zerkConfig, requiredFiles) {
    var template = fs.readFileSync(__dirname + '/'+template+'Template.html', {encoding: 'UTF-8'})
    var compiled = hogan.compile(template);
    var data = {
        config: zerkConfig,
        zerkDir: zerkDir,
        files: requiredFiles
    }
    return compiled.render(data);
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