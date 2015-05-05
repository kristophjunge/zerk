/**
 * Helper
 * 
 * Global helper function library.
 * 
 * @class helper
 * @namespace zerk
 * @module zerk
 **/
zerk.helper={};

/**
 * Formats a number in percent notation
 * 
 * @method formatPercent
 * @param {Float} value
 * @return {String} Percent notated number
 **/
zerk.helper.formatPercent=function(value,decimals) {
	
	if (zerk.isDefined(decimals)) {
		
		value=zerk.helper.round(value,decimals);
		
	}
	
	if (value) return value+'%';
	return '';
	
};

/**
 * Rounds a number to given decimals
 * 
 * @method round
 * @param {Float} value Number
 * @param {Integer} decimals Number of decimals
 * @return {Float} Rounded number
 **/
zerk.helper.round=function(value,decimals) {
	
	if (typeof decimals==='undefined' || decimals==0) {
		
		return Math.round(value);
		
	} else {
		
		var decimalsFactor=10*(decimals);
		return Math.round(value*decimalsFactor)/decimalsFactor;
		
	}
	
};

/**
 * Rotate position at given angle
 * 
 * @method rotatePosition
 * @param {Float} x Horizontal position
 * @param {Float} y Vertical position
 * @param {Float} angle Angle
 * @return {Object} Returns an object containing x and y position
 **/
zerk.helper.rotatePosition=function(x,y,angle) {
	
	return {
		x: x*Math.cos(angle)-y*Math.sin(angle),
		y: x*Math.sin(angle)+y*Math.cos(angle)
	};
	
};

/**
 * Calculates the distance between two positions
 * 
 * @method calculateDistance
 * @param {Float} x1 First horizontal position
 * @param {Float} y1 First vertical position
 * @param {Float} x2 Second horizontal position
 * @param {Float} y2 Second vertical position
 * @return {Float} The distance
 **/
zerk.helper.calculateDistance=function(x1,y1,x2,y2) {
	
	return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
	
};

/**
 * Returns the center position of given polygon
 * 
 * @method getCenterOfPolygon
 * @param {Array} polygon Polygon array
 * @return {Object} Returns an object containing x and y position
 **/
zerk.helper.getCenterOfPolygon=function(polygon) {
	
	var x=0,
		y=0,
		z=0,
		pointX,
		pointY;
	
	for (var i=0;i<polygon.length;i++) {
		
		pointX=polygon[i][0]*Math.PI/180;
		pointY=polygon[i][1]*Math.PI/180;
		
		x+=Math.cos(pointX)*Math.cos(pointY);
		y+=Math.cos(pointX)*Math.sin(pointY);
		z+=Math.sin(pointX);
		
	}
	
	var resultX,resultY,hyp;
	
	hyp=Math.sqrt(x*x+y*y);
	resultX=Math.atan2(z,hyp)*180/Math.PI;
	resultY=Math.atan2(y,x)*180/Math.PI;
	
	return {
		x: resultX,
		y: resultY
	};
	
};

/**
 * Checks the clockwise order status of a polygon
 * 
 * Its assumed that:  
 * - the polygon is closed  
 * - the last point is not repeated  
 * - the polygon is convex  
 * 
 * @method isPolygonClockwise
 * @param {Array} polygon Polygon array
 * @return {Integer} Returns the following values:  
 * 	0 = incomputable  
 * 	1 = clockwise  
 * 	-1 = counterclockwise  
 **/
zerk.helper.isPolygonClockwise=function(polygon) {
	
	var i,
		j,
		k,
		z,
		count=0;
	
	if (polygon.length<3) {
		
		return null;
		
	}
	
	for (i=0;i<polygon.length;i++) {
		
		j=(i+1)%polygon.length;
		k=(i+2)%polygon.length;
		z=(polygon[j][0]-polygon[i][0])*(polygon[k][1]-polygon[j][1]);
		z-=(polygon[j][1]-polygon[i][1])*(polygon[k][0]-polygon[j][0]);
		
		if (z<0) {
			
			count--;
			
		} else if (z>0) {
			
			count++;
			
		}
		
	}
	
	if (count>0) {
		
		return true;
		
	} else if (count<0) {
		
		return false;
		
	} else {
		
		return null;
		
	}
	
};

/**
 * Checks if the given polygon is convex
 *
 * The polygon has to be in counter clockwise order
 *
 * @method isPolygonConvex
 * @param {Array} polygon Polygon array
 * @return {Boolean} Returns true if the polygon is convex
 **/
zerk.helper.isPolygonConvex=function(polygon) {

    if (polygon.length<4) {
        return true;
    }

    var sign=false;
    var n=polygon.length;

    for (var i=0;i<n;i++) {
        var dx1=polygon[(i+2)%n][0]-polygon[(i+1)%n][0];
        var dy1=polygon[(i+2)%n][1]-polygon[(i+1)%n][1];
        var dx2=polygon[i][0]-polygon[(i+1)%n][0];
        var dy2=polygon[i][1]-polygon[(i+1)%n][1];
        var zcrossproduct=dx1*dy2-dy1*dx2;
        if (i==0) {
            sign=zcrossproduct>0;
        } else {
            if (sign!=(zcrossproduct>0)) {
                return false;
            }
        }
    }

    return true;

};

/**
 * Returns a random number between min and max
 * 
 * @method random
 * @param {Float} min Minimum
 * @param {Float} max Maximum
 * @return {Float} Random number between min and max
 **/
zerk.helper.random=function(min,max) {
	
	return Math.random()*(max-min+1)+min;
	
	//return Math.floor(Math.random()*(max-min+1))+min;
	
};

zerk.helper.getPolygonOfRectangle=function(width,height) {

    return [
        [-(width/2),-(height/2)],
        [(width/2),-(height/2)],
        [(width/2),(height/2)],
        [-(width/2),(height/2)]
    ];

};


zerk.helper.rotatePolygon=function(vertices,angle) {

    var result=[];
    var position=null;

    for (var i=0;i<vertices.length;i++) {

        position=zerk.helper.rotatePosition(
            vertices[i][0],
            vertices[i][1],
            angle
        )

        result.push([position.x,position.y]);

    }

    return result;

};


zerk.helper.getBoundingBoxOfPolygon=function(vertices) {

    var minX=0;
    var maxX=0;
    var minY=0;
    var maxY=0;

    for (var i=0;i<vertices.length;i++) {

        var verticeMinX=vertices[i][0]*-1;
        if (maxX==null || verticeMinX>maxX) {
            maxX=verticeMinX;
        }

        var verticeMaxX=vertices[i][0];
        if (maxX==null || verticeMaxX>maxX) {
            maxX=verticeMaxX;
        }

        var verticeMinY=vertices[i][1]*-1;
        if (maxY==null || verticeMinY>maxY) {
            maxY=verticeMinY;
        }

        var verticeMaxY=vertices[i][1];
        if (maxY==null || verticeMaxY>maxY) {
            maxY=verticeMaxY;
        }

    }

    return {
        width: maxX*2,
        height: maxY*2
    }

};