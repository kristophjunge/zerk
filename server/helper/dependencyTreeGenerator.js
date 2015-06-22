var fs = require('fs');
var path = require('path');
var zerkDir = path.resolve(__dirname, '../../');
var moduleDir = path.resolve(zerkDir, 'node_modules');
var companion = require(moduleDir + '/companion/src/companion.js');
var JSON5 = companion.require('../../vendor/json5/json5.js').JSON5;

module.exports = function(zerkDir) {
    var module = {};
    var zerkPath = 'src/zerk/';
    var namespaces = {};

    module.setNamespaces = function(ns) {

        namespaces = ns;

    };

    module.parseDependencies = function(gameClass) {

        //console.log('Loading dependencies:', gameDir + gameClass);

        var dependencyList = [];

        traverseTree(dependencyList, gameClass);

        dependencyList.push(gameClass);

        return dependencyList;

    };

    module.getWebPaths = function(classes) {

        var result = [];

        for (var i = 0; i < classes.length; i++) {
            var classInfo = resolvePath(classes[i]);
            result.push(classInfo.webRoot + '/' + classInfo.path);
        }

        return result;

    };

    module.getDependencyList = function() {
        return dependencyList;
    };

    function traverseTree(dependencyList, depPath) {

        var classInfo = resolvePath(depPath);

        var filesystemPath = classInfo.parentDir + '/' + classInfo.path;

        try {
            var depFileContent = fs.readFileSync(filesystemPath, {encoding: 'UTF-8'});
        } catch (exception) {
            console.error('No class file found at: ' + filesystemPath);
            process.exit();
        }

        var deps = parseContent(depFileContent);
        for (var i = 0; i < deps.length; i++) {

            traverseTree(dependencyList, deps[i]);

            if (dependencyList.indexOf(deps[i]) === -1) {
                dependencyList.push(deps[i]);
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

        var nameSpace = pathArray.splice(0, 1)[0];

        var namespaceInfo = getNamespace(nameSpace);

        if (!namespaceInfo) {
            console.log('Namespace is not registered "' + nameSpace + '"');
            return false;
        }

        return {
            namespace: namespaceInfo.namespace,
            webRoot: namespaceInfo.webRoot + '/class',
            parentDir: namespaceInfo.absolutePath + '/class',
            //path: path.path + '/' + pathArray.join('/') + '.js'
            path: pathArray.join('/') + '.js'
        };
    }

    function getNamespace(namespace) {
        for (var property in namespaces) {
            if (property === namespace) {
                return namespaces[property];
            }
        }
    }

    return module;
};
