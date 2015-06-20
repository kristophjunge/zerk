var fs = require('fs');
var path = require('path');
var zerkDir = path.resolve(__dirname, '../../');
var moduleDir = path.resolve(zerkDir, 'node_modules');
var companion = require(moduleDir + '/companion/src/companion.js');
var JSON5 = companion.require('../../vendor/json5/json5.js').JSON5;

module.exports = function (zerkDir) {
    var module = {};
    var zerkPath = 'src/zerk/';
    var dependencyList = [];
    var namespaces = {};

    /*
    module.generateTree = function(rootDir, gameClass) {

        console.log('GENERATE TREE OF', gameClass + ' inside root ' + rootDir);

        dependencyList = [];

        traverseTree(rootDir + '/' + gameClass);

        dependencyList.push('/' + gameClass);

    };
    */

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

        for (var i=0; i<classes.length; i++) {
            var classInfo = resolvePath(classes[i]);
            result.push(classInfo.webRoot + '/' + classInfo.path);
        }

        return result;


    };

    module.getDependencyList = function () {
        return dependencyList;
    };

    function traverseTree(dependencyList, depPath) {

        //console.log('TRAVEERSE', depPath);

        var classInfo = resolvePath(depPath);

        var filesystemPath = classInfo.parentDir + '/' + classInfo.path;

        try {
            var depFileContent = fs.readFileSync(filesystemPath, {encoding: 'UTF-8'});
        } catch (exception) {
            console.error('No class file found at: ' + filesystemPath);
            process.exit();
        }

        var deps = parseContent(depFileContent);

        var result;
        var processedAlready = false;
        for (var i=0; i<deps.length; i++) {

            traverseTree(dependencyList, deps[i]);

            /*
            result = resolvePath(deps[i]);



            //console.log('DEP', deps[i]);

            console.log('FOUND (' + result.namespace + ')', result.path);



            //var ns=getNamespace(result.namespace);
            //console.log('NS',ns);


            if (result.namespace === 'zerk') {
                //traverseTree(rootDir, result.path); // zerkDir + '/' +

                traverseTree(dependencyList, result.path);

            } else {
                //traverseTree(rootDir, result.path);

                traverseTree(dependencyList, result.path);

            }
            */




            /*
            processedAlready = false;
            for (var x=0; x<dependencyList.length; x++) {
                if (dependencyList[x].path == result.path
                && dependencyList[x].path == result.namespace) {

                }

            }
            */

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

        //console.log('NSI', namespaceInfo);

        if (!namespaceInfo) {
            console.log('Namespace is not registered "' + nameSpace + '"');
            return false;
        }

        return {
            namespace: namespaceInfo.namespace,
            webRoot: namespaceInfo.webRoot + '/class',
            parentDir: namespaceInfo.path + '/class',
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