(function($) {
	change();
	$(window).resize(function() {
		change();
	});
	function change()
	{
		var maskHeight = $(window).height();
		var maskWidth = $(window).width();
		var wid, lef, last;
//		alert((maskWidth-768)/2+768);
		if( maskWidth<=768)
			wid=768;
		else if (maskWidth>1572)
			wid=1170;
		else
			wid=(maskWidth-768)/2+768;
		$('.ca-container').css('width',wid);
		lef=Math.ceil(wid/3);
		$('.ca-item').css('width',lef-4);
		
		last=$('.ca-item').length+1;
		for (i=1;i<last;i++)
		{
			if($('.ca-item-'+i).length)
			{
				if (parseInt($('.ca-item-'+i).css('left'),10)==0)
					break;
			}
		}
		if(i!=last)
		{
			var factor;
			if (parseInt($('.ca-item-' + i).find('div.ca-content-wrapper').css('width'),10)!=0)
			{
				$('.ca-item-' + i).find('div.ca-content-wrapper').css('left',lef+'px');
				$('.ca-item-' + i).find('div.ca-content-wrapper').css('width',(lef*2)+'px');
				$('.ca-item-' + i).find('div.ca-content-wrapper').find('div.ca-content').css('width',(lef*2-20)+'px');
			}
			
			if ($('.ca-item-' + i).find('div.ca-content-wrapper').css('width')=='0px')
				factor=1;
			else
				factor=3;
			for (j=1;j<last;j++)
			{
				if ($('.ca-item-'+j).length)
				{
					var k;
					if(j<i) k=j-i+(last-1); else k=j-i;
					$('.ca-item-'+j).css('left',lef*k*factor);
				}
			}
		}
	}
	var	aux		= {
			// navigates left / right
			navigate	: function( dir, $el, $wrapper, opts, cache ) {
				
				var scroll		= opts.scroll,
					factor		= 1,
					idxClicked	= 0;
					
				if( cache.expanded ) {
					scroll		= 1; // scroll is always 1 in full mode
					factor		= 3; // the width of the expanded item will be 3 times bigger than 1 collapsed item	
					idxClicked	= cache.idxClicked; // the index of the clicked item
				}
				
				// clone the elements on the right / left and append / prepend them according to dir and scroll
				cache.itemW = Math.ceil(parseInt($('.ca-container').css('width'),10) / 3);
				if( dir === 1 ) {
/*					$wrapper.find('div.ca-item:lt(' + scroll + ')').each(function(i) {
						$(this).clone(true).css( 'left', ( cache.totalItems - idxClicked + i ) * cache.itemW * factor + 'px' ).appendTo( $wrapper );
					}); */
/*					alert(scroll+','+idxClicked+','+factor);
					for (i=0;i<8;i++)
						$wrapper.find('div.ca-item'+i).css( 'left', ( cache.totalItems - idxClicked + i ) * cache.itemW * factor + 'px' ); */
					var last=$('.ca-item').length+1;
					for (i=1;i<last;i++)
					{
						if($('.ca-item-'+i).length)
						{
							if (parseInt($('.ca-item-'+i).css('left'),10)==0)
								break;
						}
					}
					i=i%(last-1);
					for (j=1;j<last;j++)
					{
						if ($('.ca-item-'+j).length)
						{
							var k;
							if(j<i) k=j-i+(last-1); else k=j-i;
							$('.ca-item-'+j).css('left',cache.itemW*k*factor);
						}
					}
				}
				else {
/*					var $first	= $wrapper.children().eq(0);
					
					$wrapper.find('div.ca-item:gt(' + ( cache.totalItems  - 1 - scroll ) + ')').each(function(i) {
						// insert before $first so they stay in the right order
						$(this).clone(true).css( 'left', - ( scroll - i + idxClicked ) * cache.itemW * factor + 'px' ).insertBefore( $first );
					}); */
					var last=$('.ca-item').length+1;
					for (i=1;i<last;i++)
					{
						if($('.ca-item-'+i).length)
						{
							if (parseInt($('.ca-item-'+i).css('left'),10)==0)
								break;
						}
					}
					i=(i+1)%(last-1);
					if (i==0) i=(last-1);
					for (j=1;j<last;j++)
					{
						if ($('.ca-item-'+j).length)
						{
							var k;
							if (j<=i) k=j-i+1; else k=j-i+1-(last-1);
							$('.ca-item-'+j).css('left',cache.itemW*k*factor);
						}
					}
				}
				
				// animate the left of each item
				// the calculations are dependent on dir and on the cache.expanded value
				$wrapper.find('div.ca-item').each(function(i) {
					var $item	= $(this);
					cache.itemW = Math.ceil(parseInt($('.ca-container').css('width'),10) / 3);
					$item.stop().animate({
						left	:  ( dir === 1 ) ? '-=' + ( cache.itemW * factor * scroll ) + 'px' : '+=' + ( cache.itemW * factor * scroll ) + 'px'
					}, opts.sliderSpeed, opts.sliderEasing, function() {
						if( ( dir === 1 && $item.position().left < - idxClicked * cache.itemW * factor ) || ( dir === -1 && $item.position().left > ( ( cache.totalItems - 1 - idxClicked ) * cache.itemW * factor ) ) ) {
							// remove the item that was cloned
//							$item.remove();
						}						
						cache.isAnimating	= false;
					});
				});
				
			},
			// opens an item (animation) -> opens all the others
			openItem	: function( $wrapper, $item, opts, cache ) {
				cache.idxClicked	= $item.index();
				// the item's position (1, 2, or 3) on the viewport (the visible items) 
				cache.winpos		= aux.getWinPos( $item.position().left, cache );
				cache.itemW = Math.ceil(parseInt($('.ca-container').css('width'),10) / 3);
				$wrapper.find('div.ca-item').not( $item ).hide();
				$item.find('div.ca-content-wrapper').css( 'left', cache.itemW + 'px' ).stop().animate({
					width	: cache.itemW * 2 + 'px',
					left	: cache.itemW + 'px'
				}, opts.itemSpeed, opts.itemEasing)
				.end()
				.stop()
				.animate({
					left	: '0px'
				}, opts.itemSpeed, opts.itemEasing, function() {
					cache.isAnimating	= false;
					cache.expanded		= true;
					
					aux.openItems( $wrapper, $item, opts, cache );
				});
						
			},
			// opens all the items
			openItems	: function( $wrapper, $openedItem, opts, cache ) {
				var openedIdx	= $openedItem.index();
				
				$wrapper.find('div.ca-item').each(function(i) {
					var $item	= $(this),
						idx		= $item.index();
					cache.itemW = Math.ceil(parseInt($('.ca-container').css('width'),10) / 3);
					if( idx !== openedIdx ) {
						$item.css( 'left', - ( openedIdx - idx ) * ( cache.itemW * 3 ) + 'px' ).show().find('div.ca-content-wrapper').css({
							left	: cache.itemW + 'px',
							width	: cache.itemW * 2 + 'px'
						});
						
						// hide more link
						aux.toggleMore( $item, false );
					}
				});
			},
			// show / hide the item's more button
			toggleMore	: function( $item, show ) {
				( show ) ? $item.find('a.ca-more').show() : $item.find('a.ca-more').hide();	
			},
			// close all the items
			// the current one is animated
			closeItems	: function( $wrapper, $openedItem, opts, cache ) {
				var openedIdx	= $openedItem.index();
				var last;
				cache.itemW = Math.ceil(parseInt($('.ca-container').css('width'),10) / 3);
				$openedItem.find('div.ca-content-wrapper').stop().animate({
					width	: '0px'
				}, opts.itemSpeed, opts.itemEasing)
				.end()
				.stop()
				.animate({
					left	: cache.itemW * ( cache.winpos - 1 ) + 'px'
				}, opts.itemSpeed, opts.itemEasing, function() {
					cache.isAnimating	= false;
					cache.expanded		= false;
				});
				
				// show more link
				aux.toggleMore( $openedItem, true );
				$wrapper.find('div.ca-item').each(function(i) {
					var $item	= $(this),
						idx		= $item.index();
					
					if( idx !== openedIdx ) {
						$item.find('div.ca-content-wrapper').css({
							width	: '0px'
						})
						.end()
						.css( 'left', ( ( cache.winpos - 1 ) - ( openedIdx - idx ) ) * cache.itemW + 'px' )
						.show();
						
						// show more link
						aux.toggleMore( $item, true );
					}
				});
				last=$('.ca-item').length+1;
				for (i=1;i<last;i++)
				{
					if($('.ca-item-'+i).length)
					{
						if (parseInt($('.ca-item-'+i).css('left'),10)==0)
							break;
					}
				}
				if(i!=last)
				{
					for (j=1;j<last;j++)
					{
						if ($('.ca-item-'+j).length)
						{
							var k;
							if(j<i) k=j-i+(last-1); else k=j-i;
							$('.ca-item-'+j).css('left',cache.itemW*k);
							$('.ca-item-'+j).css('display','block');
						}
					}
				}
			},
			// gets the item's position (1, 2, or 3) on the viewport (the visible items)
			// val is the left of the item
			getWinPos	: function( val, cache ) {
				switch( val ) {
					case 0 					: return 1; break;
					case cache.itemW 		: return 2; break;
					case cache.itemW * 2 	: return 3; break;
				}
			}
		},
		methods = {
			init 		: function( options ) {
				
				if( this.length ) {
					
					var settings = {
						sliderSpeed		: 500,			// speed for the sliding animation
						sliderEasing	: 'easeOutExpo',// easing for the sliding animation
						itemSpeed		: 500,			// speed for the item animation (open / close)
						itemEasing		: 'easeOutExpo',// easing for the item animation (open / close)
						scroll			: 1				// number of items to scroll at a time
					};
					
					return this.each(function() {
						
						// if options exist, lets merge them with our default settings
						if ( options ) {
							$.extend( settings, options );
						}
						
						var $el 			= $(this),
							$wrapper		= $el.find('div.ca-wrapper'),
							$items			= $wrapper.children('div.ca-item'),
							cache			= {};
						
						// save the with of one item	
//						cache.itemW			= $items.width();
						cache.itemW = Math.ceil(parseInt($('.ca-container').css('width'),10) / 3);
						// save the number of total items
						cache.totalItems	= $items.length;
						
						// add navigation buttons
						if( cache.totalItems > 3 )	
							$el.prepend('<div class="ca-nav"><span class="ca-nav-prev"><span class="glyphicon glyphicon-chevron-left glyphicon-white"></span></span><span class="ca-nav-next"><span class="glyphicon glyphicon-chevron-right glyphicon-white"></span></span></div>')	
						
						// control the scroll value
						if( settings.scroll < 1 )
							settings.scroll = 1;
						else if( settings.scroll > 3 )
							settings.scroll = 3;	
						
						var $navPrev		= $el.find('span.ca-nav-prev'),
							$navNext		= $el.find('span.ca-nav-next');
						
						// hide the items except the first 3
						$wrapper.css( 'overflow', 'hidden' );
						
						// the items will have position absolute 
						// calculate the left of each item
						$items.each(function(i) {
							$(this).css({
								position	: 'absolute',
								left		: i * cache.itemW + 'px'
							});
						});
						
						// click to open the item(s)
						$el.find('a.ca-more').click(function() {
							if( cache.isAnimating ) return false;
							cache.isAnimating	= true;
							$(this).hide();
							var $item	= $(this).closest('div.ca-item');
							//$item.addClass('opened');
							aux.openItem( $wrapper, $item, settings, cache );
							return false;
						});
						
						// click to close the item(s)
						$el.find('a.ca-close').click(function() {
							if( cache.isAnimating ) return false;
							cache.isAnimating	= true;
							var $item	= $(this).closest('div.ca-item');
							//$item.removeClass('opened');
							aux.closeItems( $wrapper, $item, settings, cache );
							return false;
						});
						
						// navigate left
						$navPrev.bind('click.contentcarousel', function( event ) {
							if( cache.isAnimating ) return false;
							cache.isAnimating	= true;
							aux.navigate( -1, $el, $wrapper, settings, cache );
						});
						
						// navigate right
						$navNext.bind('click.contentcarousel', function( event ) {
							if( cache.isAnimating ) return false;
							cache.isAnimating	= true;
							aux.navigate( 1, $el, $wrapper, settings, cache );
						});
						
						// adds events to the mouse
						$el.bind('mousewheel.contentcarousel', function(e, delta) {
							if(delta > 0) {
								if( cache.isAnimating ) return false;
								cache.isAnimating	= true;
								aux.navigate( -1, $el, $wrapper, settings, cache );
							}	
							else {
								if( cache.isAnimating ) return false;
								cache.isAnimating	= true;
								aux.navigate( 1, $el, $wrapper, settings, cache );
							}	
							return false;
						});
						
						$el.swipe({
							right: function() {
								if( cache.isAnimating ) return false;
								cache.isAnimating	= true;
								aux.navigate( -1, $el, $wrapper, settings, cache );
								//alert( "You swiped left!" );
							},
							left: function() {
								if( cache.isAnimating ) return false;
								cache.isAnimating	= true;
								aux.navigate( 1, $el, $wrapper, settings, cache ); 
								//alert( "You swiped right!" );
							},
							threshold: {
								x: 100,
								y: 100
							}
						});
						$(document.documentElement).keyup(function (event) {
							if (event.keyCode == 37) {
								if( cache.isAnimating ) return false;
								cache.isAnimating	= true;
								aux.navigate( -1, $el, $wrapper, settings, cache );
							} else if (event.keyCode == 39) {
								if( cache.isAnimating ) return false;
								cache.isAnimating	= true;
								aux.navigate( 1, $el, $wrapper, settings, cache ); 
							}
						});
							
					});
				}
			}
		};
	
	$.fn.contentcarousel = function(method) {
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.contentcarousel' );
		}
	};
	
})(jQuery);