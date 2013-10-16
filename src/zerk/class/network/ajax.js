/**
 * AJAX Interface
 * 
 * Crossbrowser container for the XMLHttpRequest object.
 * 
 * @class ajax
 * @namespace zerk.network
 * @module zerk
 **/
zerk.define({
	
	name: 'zerk.network.ajax'
	
},{
	
	/**
	 * List of different XMLHttpRequest vendor implemenations
	 * 
	 * @property _factories
	 * @type Array
	 * @protected
	 **/
	_factories: [
		function () {return new XMLHttpRequest();},
		function () {return new ActiveXObject("Msxml2.XMLHTTP");},
		function () {return new ActiveXObject("Msxml3.XMLHTTP");},
		function () {return new ActiveXObject("Microsoft.XMLHTTP");}
	],
	
	/**
	 * Creates an environment specific XMLHttpRequest object
	 * 
	 * @method _createXMLHTTPObject
	 * @return {XMLHttpRequest} The XMLHttpRequest object
	 * @protected
	 **/
	_createXMLHTTPObject: function () {
		
		var xmlHttp = false;
		
		for (var i=0;i<this._factories.length;i++) {
			
			try {
				
				xmlHttp = this._factories[i]();
				
			} catch (e) {
				
				continue;
				
			}
			
			break;
			
		}
		
		return xmlHttp;
	},
	
	/**
	 * Performs an AJAX request
	 * 
	 * @method request
	 * @param {String} url Target url
	 * @param {Boolean} post true = POST  
	 * 	false = GET
	 * @param {Function} successHandler Event handler for success
	 * @param {Function} errorHandler Event handler for error
	 * @async
	 **/
	request: function (url,post,successHandler,errorHandler) {
		
		var request = this._createXMLHTTPObject();
		
		if (!request) {
			
			return;
			
		}
		
		var method = ((post) ? "POST" : "GET");
		
		request.open(method,url,true);
		request.setRequestHeader('User-Agent','XMLHTTP/1.0');
		
		if (post) {
			
			req.setRequestHeader(
				'Content-type','application/x-www-form-urlencoded'
			);
			
		}
		
		request.onreadystatechange = function () {
			
			if (request.readyState != 4) return;
			
			if (request.status != 200 && request.status != 304) {
				
				if (typeof errorHandler=='function') {
					
					errorHandler(request);
					
				}
				
				return;
				
			}
			
			if (typeof successHandler=='function') {
				
				successHandler(request);
				
			}
			
		};
		
		if (request.readyState == 4) {
			
			return;
			
		}
		
		request.send(post);
		
	}
		
});