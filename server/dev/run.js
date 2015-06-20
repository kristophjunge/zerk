#!/usr/bin/env node

var zerk={

    isArray: ('isArray' in Array) ? Array.isArray : function(value) {

        return Object.prototype.toString.call(value)==='[object Array]';

    },

    inArray: function(needle,haystack) {

        for (var i=0;i<haystack.length;i++) {
            if (haystack[i]==needle) {
                return true;
            }
        }

        return false;

    },

    rtrim: function(value, chars) {

        var chars=((zerk.isArray(chars)) ? chars : [chars]);
        var value=String(value);

        var lastChar=value.substr(-1, 1);
        while (zerk.inArray(lastChar, chars)) {
            value=value.substr(0, -1);
            lastChar=value.substr(-1, 1);
        }

        return value;

    }

};

var fs = require('fs');
var path = require('path');
var zerkDir = path.resolve(__dirname, '../../');
var moduleDir = path.resolve(zerkDir, 'node_modules');

var express = require('express');
var hogan = require(moduleDir + '/hogan.js');

var app = express();
var arguments = process.argv.splice(2);
var currentGameConfig = JSON.parse(arguments[0]);
var currentGameDir = arguments[1];
var port = 8000;

var deps = require(zerkDir + '/server/helper/dependencyTreeGenerator')(zerkDir);

var baseFiles = [
    '/zerk/vendor/box2dweb/Box2dWeb-2.1.a.3.js',
    '/zerk/vendor/json5/json5.js',
    '/zerk/vendor/poly-decomp/poly-decomp.js',
    '/zerk/src/zerk/zerk.js',
    '/zerk/src/zerk/helper.js',
    '/zerk/src/zerk/browser.js'
];

setupFileServers();



var server = app.listen(currentGameConfig.dev.port, function () {

    app.get('/', function (req, res) {

        var indexHtml = generateTemplate('index', {
            currentGameConfig: currentGameConfig
        });

        res.send(indexHtml);

    });

    app.get('/game', function (req, res) {

        res.send(serveGame(currentGameDir));

    });

    app.get('/zerk/:group/:demo', function (req, res) {

        var gameGroup = req.params.group;
        var gameName = req.params.demo;

        res.send(serveGame(zerkDir + '/game/' + gameGroup + '/' + gameName));

    });

    console.log('Dev-Server is running at http://localhost:' + currentGameConfig.dev.port);
    console.log('Server dir:', currentGameDir);
    console.log('Zerk dir:', zerkDir);
    console.log('Current game:', currentGameConfig.game);

});

function setupFileServers() {

    // Create fileserver for zerk root directory
    app.use("/zerk", express.static(zerkDir));

    // Create fileservers for all namespaces of current game
    var namespaces=getNamespaces(currentGameDir, currentGameConfig);
    for (var ns in namespaces) {

        if (ns === 'zerk') {
            console.log('Error: Do not manually define zerk namespace');
            // exit
        }

        console.log(
            'Registered namespace:',
            namespaces[ns].namespace + ' -> ' + namespaces[ns].path + ' (' + namespaces[ns].webRoot + ')'
        );

        app.use(namespaces[ns].webRoot, express.static(namespaces[ns].path));
    }

}

function getNamespaces(serverDir, gameConfig) {

    // Add static zerk namespace
    var result = {
        zerk: {
            namespace: 'zerk',
            webRoot: '/zerk/src/zerk',
            path: zerkDir + '/src/zerk'
        }
    };

    // Add namespaces from game config
    for (var ns in gameConfig.namespaces) {

        var namespaceDir = toAbsolutePath(serverDir, gameConfig.namespaces[ns]);
        var webRootDir;

        // Check if the namespace dir is contained in zerk dir.
        if (isSubdirectory(zerkDir, namespaceDir)) {
            webRootDir = '/zerk/' + getSubDirectoryPath(zerkDir, namespaceDir);
        } else {
            webRootDir = '/game/'+ns;
        }

        result[ns]={
            namespace: ns,
            webRoot: webRootDir,
            path: namespaceDir
        };

    }

    return result;

}

function toAbsolutePath(rootDir, relativePath) {

    // Check for relative path
    if (String(relativePath).substr(0, 1) !== '/') {
        if (String(relativePath).substr(0, 2) === './') {
            return rootDir + ((String(relativePath).length > 2) ? '/' + String(relativePath).substr(2) : '');
        } else {
            return rootDir + ((String(relativePath).length > 0) ? '/' + relativePath : '');
        }
    } else {
        return relativePath;
    }

}

function isSubdirectory(parentDir, dir) {

    var parentDir = zerk.rtrim(parentDir, '/') + '/';
    var dir = zerk.rtrim(dir, '/') + '/';

    return (dir.substr(0, parentDir.length) === parentDir);

}

function getSubDirectoryPath(parentDir, dir) {

    var parentDir = zerk.rtrim(parentDir, '/') + '/';
    var dir = zerk.rtrim(dir, '/') + '/';

    if (dir.substr(0, parentDir.length) === parentDir) {
        return dir.substr(parentDir.length);
    } else {
        return false;
    }

}

function serveGame(serverDir) {

    console.log('');
    console.log('=== SERVE GAME ===');

    // Load zerk.json
    var configPath = serverDir + '/' + 'zerk.json';

    console.log('Server dir:', serverDir);
    console.log('Config file:', configPath);

    var gameConfig = loadJsonFile(configPath);
    var gameName = gameConfig.game;
    var bootstrapClass = gameConfig.bootstrapClass;

    console.log('Game name:', gameName);

    // Build list of required js files
    var requiredFiles=[];

    // Add base files
    requiredFiles = requiredFiles.concat(baseFiles);

    // Add game files

    if (!bootstrapClass) {
        console.log('Error: missing bootstrapClass');
        // exit
    }

    var namespaces=getNamespaces(serverDir, gameConfig);

    deps.setNamespaces(namespaces);
    var requiredClasses = deps.parseDependencies(bootstrapClass);
    var webPaths = deps.getWebPaths(requiredClasses);

    requiredFiles = requiredFiles.concat(webPaths);

    // Create namespace map for web usage
    var namespaceMap={};
    for (var ns in namespaces) {
        namespaceMap[ns] = namespaces[ns].webRoot;
    }

    // Create bootstrap config
    var bootstrapConfig={
        game: gameName,
        //gameDir: gameDir,
        //zerkDir: zerkDir,
        log: {
            enabled: gameConfig.log.enabled,
            severity: gameConfig.log.severity
        },
        namespaces: namespaceMap
    };

    return generateTemplate('game', {
        bootstrapConfig: JSON.stringify(bootstrapConfig),
        zerkDir: zerkDir,
        files: requiredFiles
    })

}

function generateTemplate(template, data) {
    var template = fs.readFileSync(__dirname + '/'+template+'Template.html', {encoding: 'UTF-8'})
    var compiled = hogan.compile(template);
    return compiled.render(data);
}

function loadJsonFile(path) {
    try {
        var gameConfig = fs.statSync(path)
        if (gameConfig.isFile()) {
            return JSON.parse(fs.readFileSync(path, {encoding: 'UTF-8'}));
        }
    } catch(err) {
        if (err.code == 'ENOENT') {
            console.log('No zerk file found! (Expected: ' + path + ')');
            process.exit();
        }
    }
};