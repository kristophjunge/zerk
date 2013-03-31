/**
 * Global helper functions
 * 
 * @class zerk.game.engine.helper
 * @module zerk
 */
/*
 * TODO Rename fromMeter and toMeter more convenient
 */
zerk.define({
	
	name: 'zerk.game.engine.helper'
	
},{
	
	/**
	 * Class constructor
	 * 
	 * @method init
	 */
	init: function() {
		
	},
	
	/**
	 * Converts pixels into meters
	 * 
	 * @method toMeter 
	 * @param {Float} value Value in pixels
	 * @return {Float} Value in meters
	 */
	toMeter: function(value) {

		if (typeof value==='undefined' || value==0) return 0;
		return value/30;
		
	},
	
	/**
	 * Converts meters into pixels
	 * 
	 * @method fromMeter
	 * @param {Float} value Value in meters
 	 * @return {Float} Value in pixels
	 */
	fromMeter: function(value) {
		
		if (typeof value==='undefined' || value==0) return 0;
		return value*30;
		
	},
	
	/**
	 * Formats a number in percent notation
	 * 
	 * @method formatPercent
	 * @param {Float} value
	 * @return {String} Percent notated number
	 */
	formatPercent: function(value) {
		
		if (value) return value+'%';
		return '';
		
	},
	
	/**
	 * Rounds a number to given decimals
	 * 
	 * @method round
	 * @param {Float} value Number
	 * @param {Integer} decimals Number of decimals
	 * @return {Float} Rounded number
	 */
	round: function(value,decimals) {
		
		if (typeof decimals==='undefined' || decimals==0) {
			
			return Math.round(value);
			
		} else {
			
			var decimalsFactor=10*(decimals);
			return Math.round(value*decimalsFactor)/decimalsFactor;
			
		}
		
	}
	
});