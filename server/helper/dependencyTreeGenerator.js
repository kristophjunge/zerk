var fs = require('fs');
var path = require('path');
var zerkDir = path.resolve(__dirname, '../../');
var moduleDir = path.resolve(zerkDir, 'node_modules');
var companion = require(moduleDir + '/companion/src/companion.js');
var JSON5 = companion.require('../../vendor/json5/json5.js').JSON5;

module.exports = function (namespaces, zerkDir, gameDir) {
    var module = {};
    var zerkPath = '/src/zerk/class';
    var dependencyList = [];

    module.generateTree = function(depPath) {
        dependencyList = [];
        traverseTree(gameDir + depPath);
        dependencyList.push(depPath);
    };

    module.getDependencyList = function () {
        return dependencyList;
    }

    function traverseTree(depPath) {
        try {
            var depFileContent = fs.readFileSync(depPath, {encoding: 'UTF-8'});
        } catch (exception) {
            console.error('No game file found at: ' + depPath);
            process.exit();
        }

        var deps = parseContent(depFileContent);

        var result;
        var index;
        for (var i=0; i<deps.length; i++) {
            result = resolvePath(deps[i]);

            if (result.namespace === 'zerk') {
                traverseTree(zerkDir + '/' + result.path);
            } else {
                traverseTree(gameDir + '/' + result.path);
            }

            if (dependencyList.indexOf(result.path) === -1) {
                dependencyList.push(result.path);
            }
        }
    }

    function parseContent(depContent) {
        depContent = depContent.replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, '');
        depContent = depContent.replace(/\s/g, '');
        var pattern = new RegExp('zerk\\\.define\\\(\\\{(.*?)\\\}(?=,)', 'g');
        var result = JSON5.parse('{' + pattern.exec(depContent)[1] + '}');
        var extend = result.extend || null;
        var required = result.require || [];

        if (extend !== null) {
            required.push(extend);
        }

        return required
    }

    function resolvePath(dottedPath) {
        var pathArray = dottedPath.split('.');
        var path = getNamespace(pathArray.splice(0, 1)[0]);
        return {
            namespace: path.namespace,
            path: path.path + '/' + pathArray.join('/') + '.js'
        };
    }

    function getNamespace(namespace) {
        if (namespace === 'zerk') {
            return {
                namespace: namespace,
                path: zerkPath
            };
        }
        for (var property in namespaces) {
            if (property === namespace) {
                return {
                    namespace: namespace,
                    path: namespaces[property]
                };
            }
        }
    }

    return module;
};