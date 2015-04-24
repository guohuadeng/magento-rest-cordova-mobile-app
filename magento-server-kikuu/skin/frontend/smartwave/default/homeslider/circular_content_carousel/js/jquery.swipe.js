/**
 * @name jQuery Swipe plugin (https://github.com/jgarber623/jquery-swipe)
 * @author Jason Garber
 * @copyright (cc) Jason Garber (http://sixtwothree.org and http://www.viget.com)
 * 
 * Licensed under the CC-GNU GPL (http://creativecommons.org/licenses/GPL/2.0/)
 */

;(function( $, window, document, undefined ) {

	var Swipe = function( elem, options ) {
		this.elem = elem;
		this.$elem = $( elem );
		this.options = options;
		this.metadata = this.$elem.data( "swipe-options" );
	};

	Swipe.prototype = {
		defaults: {
			left: function( event ) {},
			right: function( event ) {},
			threshold: {
				x: 100,
				y: 25
			}
		},

		init: function() {
			this.config = $.extend( {}, this.defaults, this.options, this.metadata );

			this.coords = {
				start: {
					x: 0,
					y: 0
				},
				end: {
					x: 0,
					y: 0
				}
			};

			if ( this.elem.addEventListener ) {
				this.elem.addEventListener( "touchcancel", $.proxy( this.touchCancel, this ), false );
				this.elem.addEventListener( "touchend", $.proxy( this.touchEnd, this ), false );
				this.elem.addEventListener( "touchmove", $.proxy( this.touchMove, this ), false );
				this.elem.addEventListener( "touchstart", $.proxy( this.touchStart, this ), false );
			}

			return this;
		},

		touchCancel: function( event ) {

		},

		touchEnd: function( event ) {
			var delta = {
				x: this.coords.start.x - this.coords.end.x,
				y: this.coords.start.y - this.coords.end.y
			};

			if ( delta.y < this.config.threshold.y && delta.y > ( this.config.threshold.y * -1 ) ) {
				if ( delta.x > this.config.threshold.x ) {
					this.config.left();
				}

				if ( delta.x < ( this.config.threshold.x * -1 ) ) {
					this.config.right();
				}
			}
		},

		touchMove: function( event ) {
			event.preventDefault();

			var touches = event.targetTouches[0];

			this.coords.end = {
				x: touches.pageX,
				y: touches.pageY
			};
		},

		touchStart: function( event ) {
			var touches = event.targetTouches[0];

			this.coords = {
				start: {
					x: touches.pageX,
					y: touches.pageY
				},
				end: {
					x: touches.pageX,
					y: touches.pageY
				}
			};
		}
	};

	Swipe.defaults = Swipe.prototype.defaults;

	$.fn.swipe = function( options ) {
		return this.each( function() {
			new Swipe( this, options ).init();
		});
	};

	// window.Swipe = Swipe;

})( jQuery, window , document );