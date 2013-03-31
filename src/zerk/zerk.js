/*
 * Zerk Game Engine
 * 
 * Copyright (C) 2012 - 2013 by Kristoph Junge
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of 
 * this software and associated documentation files (the "Software"), to deal in 
 * the Software without restriction, including without limitation the rights to 
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies 
 * of the Software, and to permit persons to whom the Software is furnished to do 
 * so, subject to the following conditions: 
 * 
 * The above copyright notice and this permission notice shall be included in all 
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
 * SOFTWARE.
 */
/**
 * The Zerk main object and namespace
 * 
 * @class zerk
 * @module zerk
 * @static
 */
/*
 * TODO Turn Zerk main object internal members into private scope
 */
var zerk={
	
	/**
	 * The game engine configuration
	 * 
	 * @property _config
	 * @type object
	 * @private
	 */
	_config: null,
	
	/**
	 * Load state of classes
	 * 
	 * @property _classState
	 * @type object
	 * @private
	 */
	_classState: {},
	
	/**
	 * Class name to instance map
	 * 
	 * @property _classMap
	 * @type object
	 * @private
	 */
	_classMap: {},
	
	/**
	 * Defines that got delayed by requires
	 * 
	 * @property _delayedDefine
	 * @type object
	 * @private
	 */
	_delayedDefine: {},
	
	/**
	 * The main bootstrap method
	 * 
	 * @method init
	 * @param {Object} config Configuration object
	 */
	init: function(config) {
		
		this._config=config;
		
		this._loadScript('./'+this._config.gameDir+'/class/game.js');
		
	},
	
	/**
	 * Defines a new class
	 * 
	 *	// Class definition without meta object
	 *	zerk.define('myNamespace.myClass',{
	 *		// ...
	 *	}); 
	 * 
	 *	// Class definition with meta object
	 *	zerk.define({
	 *		name: 'myNamespace.myClass',
	 *		extend: 'myNamespace.myParentClass'
	 *		require: [
	 *			'myNamespace.myParentClass'
	 *		]
	 *	},{
	 *		// ...
	 *	});
	 * 
	 * @method define
	 * @param {String|Object} name The name of the class or a meta object
	 * @param {Object} body The body of the class
	 * @param {Function} callback Callback function that fires when the 
	 * 	class definition is done
	 */
	define: function(name,body,callback) {
		
		// Parse meta data
		var meta=this._parseMeta(name);
		
		// Requires that the class definition has to wait for
		var waitForRequires=[];
		
		// Requires that have to be loaded now
		var triggerRequires=[];
		
		for (var i=0;i<meta.require.length;i++) {
			
			// The class is currently loading by another require
			if (this._classLoading(meta.require[i])) {
				
				// Remember that we have to wait for it
				waitForRequires.push(meta.require[i]);
				
			// The class is untouched and need to be loaded
			} else if (!this._classLoaded(meta.require[i])) {
				
				// Remember that we have to wait for it
				waitForRequires.push(meta.require[i]);
				
				// Remember that we have to trigger the load of it
				triggerRequires.push(meta.require[i]);
				
			}
			
		}
		
		// If there are requires that we have to wait for
		if (waitForRequires.length>0) {
			
			// Delay our class definition till all requires are resolved
			this._delayDefine(name,body,callback,waitForRequires);
			
			for (var i=0;i<triggerRequires.length;i++) {
				
				this._requireClass(triggerRequires[i]);
				
			}
			
		// If there is nothing we have to wait for just create the class
		} else {
			
			this._defineClass(meta,body,callback);
			
		}
		
	},
	
	/**
	 * Method for inheritance like parent class calls
	 * 
	 * Use this with the apply method to inject the local scope.
	 * 
	 *	zerk.parent('myClass').myMethod.apply(
	 *		this,
	 *		arguments
	 *	);
	 * 
	 * @method parent
	 * @param {String} name The name of the class
	 * @return {Object} The parent class
	 */
	parent: function(name) {
		
		/*
		 * TODO Make the __proto__ usage crossbrowser safe
		 */
		return this._classMap[name].__proto__;
		
	},
	
	/**
	 * Creates a class instance
	 * 
	 * All arguments after 'name' are passed to the init method of the class.
	 * 
	 * @method create
	 * @param {String} name The name of the class
	 * @return {Object} Class instance
	 */
	create: function(name) {
		
		if (arguments.length==0) return;
		
		var args=Array.prototype.slice.call(arguments);
		var parent=args[0];
		
		if (typeof parent==='string') {
			
			var parentClass=this._classMap[parent];
			
		} else {
			
			var parentClass=parent;
			parent='Object';
			
		}
		
		/*
		 * TODO Create a useful error handling here
		 */
		if (typeof parentClass==='undefined') {
			
			console.log('Error: Class to create is undefined '+parent);
			return null;
			
		}
		
		var constructorArguments=args.slice(1);
		
		/*
		 * TODO Check if the _createObject method could be used here
		 */
		function f() {}
		if (typeof parentClass=='object') {
			
			f.prototype=parentClass;
			
		}
		var i=new f();
		
		if (typeof i.init!=='undefined') {
			
			i.init.apply(i,constructorArguments);
			
		}
		
		return i;
		
	},
	
	/**
	 * Apply properties to an object/class
	 * 
	 * @method apply
	 * @param {Object} obj The object witch the properties should be applied to
	 * @param {Object} props A JSON property structure
	 */
	/*
	 * TODO Rename the method apply to dont collide with native method
	 */
	apply: function(obj,props) {
		
		for (var name in props) {
			
			if (typeof(props[name])=='object') {
				
				if (typeof(props[name].length)!=='undefined') {
					
					obj[name]=props[name];
					
				} else {
					
					if (typeof obj[name]=='undefined') {
						
						obj[name]={};
						
					}
					
					this.apply(obj[name],props[name]);
				}
				
			} else {
				
				obj[name]=props[name];
				
			}
			
		}
		
	},
	
	/**
	 * Defines a class
	 * 
	 * @method _defineClass
	 * @param {Object} meta Class meta object
	 * @param {Object} body Class body
	 * @param {Function} callback Callback function that fires after the 
	 * 	class was defined
	 * @return {Object} Class definition
	 * @private
	 */
	_defineClass: function(meta,body,callback) {
		
		var baseClass=null;
		
		// Parse class name
		var classNameInfo=this._parseClassName(meta.name);
		
		if (meta.extend) {
			
			baseClass=this._classMap[meta.extend];
			
		} else {
			
			baseClass={};
			
		}
		
		var i=this._createObject(baseClass);
		
		for (var name in body) {
			
			i[name]=body[name];
			
		}
		
		// Add an entry to the class map
		this._classMap[meta.name]=i;
		
		if (meta.callback) {
			
			meta.callback.call();
			
		}
		
		this._classState[meta.name]='loaded';
		
		this._processLoadedClass(meta.name);
		
		if (typeof callback!=='undefined') {
			
			callback();
			
		}
		
		return this._classMap[meta.name];
		
	},
	
	/**
	 * Creates a delayed define entry and returns its handle
	 * 
	 * @method _delayDefine
	 * @param {Object} meta Class meta object
	 * @param {Object} body Class body
	 * @param {Function} callback Callback function
	 * @param {Array} waitFor
	 * @return {Object} The handle for the delayed define
	 * @private
	 */
	_delayDefine: function(meta,body,callback,waitFor) {
		
		// Format waitFor array as object
		var waitForObj={};
		
		for (var i=0;i<waitFor.length;i++) {
			
			waitForObj[waitFor[i]]='require';
			
		}
		
		return this._delayedDefine[meta.name]={
			meta: meta,
			code: body,
			callback: callback,
			waitFor: waitForObj
		};
		
	},
	
	/**
	 * Creates an object from parent object definition
	 * 
	 * This is an implementation of Douglas Crockfords prototypal 
	 * inheritance in JavaScript.
	 * 
	 * <a href="http://javascript.crockford.com/prototypal.html">
	 * http://javascript.crockford.com/prototypal.html</a>
	 * 
	 * @method _createObject
	 * @param {Object} parent
	 * @return {Object} The created object
	 * @private
	 */
	_createObject: function(parent) {
		
		/*
		 * TODO Create a useful error handling here
		 */
		if (typeof parent==='undefined') {
			
			console.log('Error: Object to create is undefined');
			return null;
			
		}
		
		function f() {}
		
		if (typeof parent=='object') {
			
			f.prototype=parent;
			
		}
		
		return new f();
		
	},
	
	/**
	 * Checks if a class is loaded and defined already
	 * 
	 * @method _classLoaded
	 * @param {String} className The name of the class
	 * @return {Boolean} Returns true if the class is loaded and defined 
	 * 	already
	 * @private
	 */
	_classLoaded: function(className) {
		
		if (typeof this._classState[className]!=='undefined') {
			
			return (this._classState[className]=='loaded');
			
		}
		
	},
	
	/**
	 * Checks if a class is loading already
	 * 
	 * @method _classLoading
	 * @param {String} className The name of the class
	 * @return {Boolean} Returns true if the class is currently loading
	 * @private
	 */
	_classLoading: function(className) {
		
		if (typeof this._classState[className]!=='undefined') {
			
			return (this._classState[className]=='loading');
			
		}
		
	},
	
	/**
	 * Returns the url for given class name
	 * 
	 * @method _getClassURL
	 * @param {String} className The name of the class
	 * @return {String} Class name in object key notation
	 * @private
	 */
	_getClassURL: function(className) {
		
		var segments=className.split('.');
		
		if (segments.length<2) return;
		
		var ns=segments[0];
		
		segments.splice(0,1);
		
		var path=segments.join('/')+'.js';
		
		return ((ns=='zerk') 
			? this._config.zerkDir 
			: this._config.gameDir)
			+'/class/'+path;
		
	},
	
	/**
	 * Loads the related script file of the given class name
	 * 
	 * @method _requireClass
	 * @param {String} className
	 * @private
	 */
	_requireClass: function(className) {
		
		// Get the target url of the class
		var url=this._getClassURL(className);
		
		// Trigger the script load
		this._loadScript(url,className);
		
		// Remember the class as loading already
		this._classState[className]='loading';
		
	},
	
	/**
	 * Loads a JavaScript file
	 * 
	 * @method _loadScript
	 * @param {String} url The target url of the script to be loaded
	 * @private
	 */
	_loadScript: function(url) {
		
		var head=document.getElementsByTagName('head')[0];
		var script=document.createElement('script');
		
		script.type='text/javascript';
		script.src=url+'?r='+Math.random();
		script.async=true;
		
		head.appendChild(script);
		
	},
	
	/**
	 * Process delayed defines after dependencies are resolved
	 * 
	 * @method _processLoadedClass
	 * @param {String} className The name of the class
	 * @private
	 */
	_processLoadedClass: function(className) {
		
		var entry=null;
		
		for (var name in this._delayedDefine) {
			
			entry=this._delayedDefine[name];
			
			if (typeof entry.waitFor[className]!=='undefined') {
				
				delete entry.waitFor[className];
				
				if (Object.keys(entry.waitFor).length==0) {
					
					this._defineClass(entry.meta,entry.code,entry.callback);
					delete this._delayedDefine[name];
					
				}
				
			}
			
		}
		
		// If this was the last delayed define
		if (Object.keys(this._delayedDefine).length==0) {
			
			this._onLoad();
			
		}
		
	},
	
	/**
	 * Normalize meta data
	 * 
	 * @method _parseMeta
	 * @param {String|Object} meta A class meta data object or name
	 * @return {Object} The parsed meta data object
	 * @private
	 */
	_parseMeta: function(meta) {
		
		var result={
			name: meta.name,
			extend: ((typeof meta.extend!=='undefined') ? meta.extend : ''),
			require: ((typeof meta.require!=='undefined') ? meta.require : [])
		};
		
		if (result.extend) {
			
			var extendRequireExisting=false;
			
			for (var i=0;i<result.require.length;i++) {
				
				if (result.require[i]==result.extend) {
					
					extendRequireExisting=true;
					break;
					
				}
				
			}
			
			if (!extendRequireExisting) {
				
				result.require.push(result.extend);
				
			}
			
		}
		
		return result;
		
	},
	
	/**
	 * Parses given class name and returns detailed information
	 * 
	 * @method _parseClassName
	 * @param {String} className The name of the class
	 * @return {Object} An object containing namespace information
	 * @private
	 */
	_parseClassName: function(className) {
		
		var path=className.split('.');
		var parent=path.slice(0,-1);
		var name=path.slice(path.length-1,path.length);
		
		return {
			name: name[0],
			parent: parent.join('.'),
			path: className
		};
		
	},
	
	/**
	 * Fires when all classes ever required are loaded and defined
	 * 
	 * @method _onLoad
	 * @private
	 */
	_onLoad: function() {
		
		/*
		 * TODO Implement a clean crossbrowser onready handler
		 */
		
		if (document.readyState==="complete") {
			
			this._ready();
			
		} else {
			
			var me=this;
			window.addEventListener(
				'load',
				function() {
					
					me._ready();
					
				},
				false
			);
			
		}
		
	},
	
	/**
	 * Fires when all classes ever required are loaded and defined
	 * and the document is ready
	 * 
	 * @method _ready
	 * @private
	 */
	_ready: function() {
		
		var config=this._config;
		var me=this;
		
		window.setTimeout(
			function() {
				
				me.game=zerk.create(config.game+'.game',config);
				
			},
			100
		);
		
	}
	
};