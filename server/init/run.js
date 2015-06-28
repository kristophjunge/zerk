#!/usr/bin/env node
module.exports = function(userArgs) {

    userArgPath = userArgs.length && userArgs[0] || '';

    var fs = require('fs');
    var path = require('path');
    var zerkDir = path.resolve(__dirname, '../../');
    var moduleDir = path.resolve(zerkDir, 'node_modules');
    var skeletonDir = path.resolve(__dirname, 'skeleton/default');

    var prompt = require('prompt');
    var hogan = require(moduleDir + '/hogan.js');
    var mkdirp = require('mkdirp');

    prompt.message = '';
    prompt.delimiter = '';

    var schema = {
        properties: {
            name: {
                description: 'Game name',
                default: 'mygame'
            },
            log: {
                properties: {
                    enabled: {
                        description: 'Enable logs?',
                        default: true
                    },
                    severity: {
                        description: 'Log severity',
                        default: 3
                    }
                }
            },
            viewport: {
                properties: {
                    worldScale: {
                        description: 'World scale',
                        default: 120
                    }
                }
            },
            physics: {
                properties: {
                    scale: {
                        description: 'Physics scale',
                        default: 1
                    }
                }
            }
        }
    };

    prompt.get(schema, function(err, result) {

        if (err) {
            return onErr(err);
        }

        walk(skeletonDir, function(err, files) {
            if (err) {
                return onErr(err);
            }

            var templates = [];
            var path = '';
            for (var i = 0; i < files.length; i++) {
                path = files[i].replace(skeletonDir + '/', '');
                templates.push({
                    name: path,
                    content: generateTemplate(path, result)
                });
            }

            saveTemplates(templates);
        });
    });

    function onErr(err) {
        console.log(err);
        return 1;
    }

    function saveTemplates(templates) {
        console.log('');

        var template;
        var fileName = '';
        var fileExists;
        for (var i = 0; i < templates.length; i++) {
            template = templates[i];
            fileName = path.resolve(userArgPath, template.name);
            fileExists = fs.existsSync(fileName);

            if (fileExists) {
                console.log('[Skipped] ' + fileName);
                continue;
            }

            writeFile(fileName, template.content);
            console.log('[Created] ' + fileName);
        }
    }

    function writeFile(name, contents, cb) {
        mkdirp(path.dirname(name), function(err) {
            if (err) {
                return onErr(err);
            }
            fs.writeFile(name, contents, cb)
        })
    }

    function generateTemplate(template, data) {
        var template = fs.readFileSync(skeletonDir + '/' + template, {encoding: 'UTF-8'})
        var compiled = hogan.compile(template);
        return compiled.render(data);
    }

    function walk(dir, done) {
        var results = [];
        fs.readdir(dir, function(err, list) {
            if (err) {
                return done(err);
            }
            var pending = list.length;
            if (!pending) {
                return done(null, results);
            }
            list.forEach(function(file) {
                file = path.resolve(dir, file);
                fs.stat(file, function(err, stat) {
                    if (stat && stat.isDirectory()) {
                        walk(file, function(err, res) {
                            results = results.concat(res);
                            if (!--pending) {
                                done(null, results);
                            }
                        });
                    } else {
                        results.push(file);
                        if (!--pending) {
                            done(null, results);
                        }
                    }
                });
            });
        });
    };
}
