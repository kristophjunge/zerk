/**
 * Browser
 * 
 * Crossbrowser library.
 * 
 * @class browser
 * @namespace zerk
 * @module zerk
 **/
zerk.browser={};

/**
 * Registers a callback function to a DOM element event
 * 
 * @method registerEvent
 * @param {DOMElement} element DOM element
 * @param {String} eventName Event name
 * @param {Function} callback Callback function
 **/
zerk.browser.registerEvent=function(element,eventName,callback) {
	
	if (typeof(element)=='string') {
		
		element=document.getElementById(element);
		
	}
	
	if (element==null) return;
	
	if (element.addEventListener) {
		
		if (eventName=='mousewheel') {
			
			element.addEventListener('DOMMouseScroll',callback,false);
			
		}
		
		element.addEventListener(eventName,callback,false);
		
	} else if (element.attachEvent) {
		
		element.attachEvent(
			'on'+eventName,
			callback
		);
		
	}
	
};

/**
 * Unregisters a callback function from a DOM element event
 * 
 * @method unregisterEvent
 * @param {DOMElement} element DOM element
 * @param {String} eventName Event name
 * @param {Function} callback Callback function
 **/
zerk.browser.unregisterEvent=function(element,eventName,callback) {
	
	if (typeof(element)=='string') {
		
		element=document.getElementById(element);
		
	}
	
	if (element==null) return;
	
	if (element.removeEventListener) {
		
		if (eventName=='mousewheel') {
			
			element.removeEventListener('DOMMouseScroll',callback,false);
			
		}
		
		element.removeEventListener(eventName,callback,false);
		
	} else if (element.detachEvent) {
		
		element.detachEvent(
			'on'+eventName,
			callback
		);
		
	}
	
};

/**
 * Cancel DOM event
 * 
 * @method cancelEvent
 * @param {DOMEvent} event DOM event
 * @return {Boolean} Returns false
 **/
zerk.browser.cancelEvent=function(event) {
	
	event=((event) ? event : window.event);
	
	if (event.stopPropagation) event.stopPropagation();
	if (event.preventDefault) event.preventDefault();
	
	event.cancelBubble=true;
	event.cancel=true;
	event.returnValue=false;
	
	return false;
	
};

/**
 * Returns the position of given DOM element
 * 
 * @method getElementPosition
 * @param {DOMElement} element DOM element
 * @return {Object} Offset
 **/
zerk.browser.getElementPosition=function(element) {
	
	var tagname="";
	var left=0;
	var top=0;
	var node=element;
	
	while (typeof(node)==='object' && typeof(node.tagName)!=='undefined') {
		
		left+=node.offsetLeft;
		top+=node.offsetTop;
		tagname=node.tagName.toLowerCase();
		
		if (tagname==='body') {
			
			node=0;
			
		}
		
		if (typeof(node)==='object') {
			
			if (typeof(node.offsetParent)==='object') {
				
				node=node.offsetParent;
				
			}
			
		}
		
	}
	
	return {
		left: left,
		top: top
	};
	
};

/**
 * Crossbrowser requestAnimationFrame
 * 
 * <a href="http://paulirish.com/2011/requestanimationframe-for-smart-animating/">
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/</a>
 * 
 * <a href="http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating">
 * http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating</a>
 * 
 * requestAnimationFrame polyfill by Erik Möller
 * 
 * fixes from Paul Irish and Tino Zijdel
 * 
 * @method setupRequestAnimationFrame
 **/
zerk.browser.setupRequestAnimationFrame=function() {
	
	var lastTime=0;
	
	var vendors=[
		'ms',
		'moz',
		'webkit',
		'o'
	];
	
	for (var x=0; x<vendors.length && !window.requestAnimationFrame; ++x) {
		
		window.requestAnimationFrame
			=window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimationFrame
			=window[vendors[x]+'CancelAnimationFrame']
			|| window[vendors[x]+'CancelRequestAnimationFrame'];
		
	}
	
	if (!window.requestAnimationFrame) {
		
		window.requestAnimationFrame=function(callback,element) {
			
			var currTime=new Date().getTime();
			var timeToCall=Math.max(0,16-(currTime-lastTime));
			var id=window.setTimeout(
				function() {
					
					callback(currTime+timeToCall); 
					
				},
				timeToCall
			);
			lastTime=currTime+timeToCall;
			return id;
			
		};
		
	}
 
	if (!window.cancelAnimationFrame) {
		
		window.cancelAnimationFrame=function(id) {
			
			clearTimeout(id);
			
		};
		
	}
	
}


zerk.browser.getViewportSize=function() {

    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    return {
        width: x,
        height: y
    }

};