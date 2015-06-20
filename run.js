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
    console.log('');
    var zerkConfig = checkZerkFile(userArgs);

    var devServer = spawn(__dirname + '/server/dev/run.js', [zerkConfig.content, path.dirname(zerkConfig.dir)]);


    devServer.stdout.on('data', function (data) {
        //process.stdout.write('zerk [log]: ' + data);
        process.stdout.write(data);
    });

    devServer.stderr.on('data', function (err) {
        //process.stdout.write('zerk [error]: ' + err);
        process.stdout.write(err);
    });


    process.on('uncaughtException', function (exception) {
        process.stdout.write(exception);
    });

    devServer.on('close', function (code) {
        process.stdout.write('zerk [shutdown]: Code ' + code + '\n');
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