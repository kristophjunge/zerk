#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var userArgs = process.argv.splice(2);
var mode = userArgs.splice(0, 1)[0];

switch (mode) {
    case 'dev': 
        startDevServer(userArgs);
        break;
}

function startDevServer(userArgs) {
    var zerkConfig = checkZerkFile(userArgs);

    var devServer = spawn(__dirname + '/server/dev/run.js', [zerkConfig.content, path.dirname(zerkConfig.dir)]);

    devServer.stdout.on('data', function (data) {
        console.log('zerk [log]: ' + data);
    });

    devServer.stderr.on('data', function (data) {
        console.log('zerk [error]: ' + data);
    });

    devServer.on('close', function (code) {
        console.log('zerk [shutdown]: ' + code);
    });
}

function checkZerkFile(configDir) {
    configDir = configDir[0] || '.';
    configDir += '/zerk.json';
    configDir = path.resolve(configDir);

    try {
        var zerkConfig = fs.statSync(configDir);
        if (zerkConfig.isFile()) {
            return {
                dir: configDir,
                content: fs.readFileSync(configDir, {encoding: 'UTF-8'})
            };
        }
    } catch(err) {
        if (err.code == 'ENOENT') {
            console.log('No zerk file found! (Expected: ' + configDir + ')');
            process.exit();
        }
    }
}