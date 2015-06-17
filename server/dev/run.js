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

deps.generateTree('/class/game.js');

var requiredFiles = [
    '/src/box2dweb/Box2dWeb-2.1.a.3.js',
    '/src/json5/json5.js',
    '/src/zerk/zerk.js',
    '/src/zerk/helper.js',
    '/src/zerk/browser.js'
];

requiredFiles = requiredFiles.concat(deps.getDependencyList());

console.log("requiredFiles:", requiredFiles)

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

    console.log('Dev-Server is running at http://localhost:' + zerkConfig.dev.port);
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