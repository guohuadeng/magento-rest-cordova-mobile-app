(function($){
	$.fn.mapmarker = function(options){
		var opts = $.extend({}, $.fn.mapmarker.defaults, options);

		return this.each(function() {
			// Apply plugin functionality to each element
			var map_element = this;
			//addMapMarker(map_element, opts.zoom, opts.center, opts.type, opts.dragging, opts.mousewheel, opts.controls, opts.markers, opts.styling, opts.featureType, opts.visibility, opts.elementType, opts.hue, opts.saturation, opts.lightness, opts.gamma, opts.navigation_control);
			addMapMarker(map_element, opts);
			
		});
	};
	
	// Set up default values
	var defaultMarkers = {
		"markers": []
	};

	$.fn.mapmarker.defaults = {
		zoom		: 8,
		center		: '0,0',
		type		: 'ROADMAP',
		controls	: 'HORIZONTAL_BAR',
		dragging	: 1,
		mousewheel	: 0,
		markers		: defaultMarkers,
		styling		: 0,
		featureType	: "road",
		visibility	: "simplified",
		elementType	: "all",
		hue			: "#00E5FF",
		saturation	: 0,
		lightness	: 0,
		gamma		: 1,
		navigation_control:1
	}

	// Main function code here (ref:google map api v3)
	//function addMapMarker(map_element, zoom, center, type, dragging, mousewheel, controls, markers, styling, featureType, visibility, elementType, hue, saturation, lightness, gamma){
	function addMapMarker(map_element, opts){
		//console.log(opts)
		dragging = (opts.dragging) ? true : false;
		mousewheel = (opts.mousewheel) ? true : false;
		nav_control = (opts.navigation_control) ? true : false;
		var maptype;
		switch(opts.type) {
			case"ROADMAP":
			default:
				maptype = google.maps.MapTypeId.ROADMAP;
			break;
			case"TERRAIN":
				maptype = google.maps.MapTypeId.TERRAIN;
			break;
			case"SATELLITE":
				maptype = google.maps.MapTypeId.SATELLITE;
			break;
			case"HYBRID":
				maptype = google.maps.MapTypeId.HYBRID;
			break;
		}
		switch(opts.controls) {
			case"DROPDOWN_MENU":
			default:
				mapcontrols = google.maps.MapTypeControlStyle.DROPDOWN_MENU;
			break;
			case"HORIZONTAL_BAR":
				mapcontrols = google.maps.MapTypeControlStyle.HORIZONTAL_BAR;
			break;
			
		}
		
		var coords = opts.center.split(","),
			centerPoint = new google.maps.LatLng(coords[0],coords[1]);
		if(opts.styling) {
			var myMapStyles = [
				{ featureType: opts.featureType, elementType: opts.elementType, stylers: [ { visibility: opts.visibility } , { hue: opts.hue }, { saturation: opts.saturation },{ lightness: opts.lightness }, { gamma: opts.gamma } ] }
			];
			var MapStyles = new google.maps.StyledMapType(myMapStyles, {name: "My personalized map"});
		}
		var myOptions = {
			scrollwheel: mousewheel,
			dragging: dragging,
			mapTypeControl: true,
			mapTypeControlOptions: {
				style: mapcontrols,
				position: google.maps.ControlPosition.LEFT_BOTTOM },
			navigationControl: nav_control,
			navigationControlOptions: {
				style: google.maps.NavigationControlStyle.SMALL,
				position: google.maps.ControlPosition.RIGHT_CENTER},
			zoom: opts.zoom,
			center: centerPoint,
			mapTypeId: maptype
		}
		var map = new google.maps.Map(map_element, myOptions);
		if(opts.styling) {
			map.mapTypes.set('custom_styled', MapStyles);
			map.setMapTypeId('custom_styled');
		}
		//google.maps.event.trigger(map, 'resize');
		var infowindow = null;
		var baloon_text = "";

		var markerIcon = function() {
			var image = new google.maps.MarkerImage(
				"sliders_sources/googlemap_eos/images/marker.png",
				new google.maps.Size(32,39),
				new google.maps.Point(0,0),
				new google.maps.Point(16,39)
			);

			markers.push(new google.maps.Marker({
				position: marker_points[iterator],
				draggable: false,
				raiseOnDrag: false,
				icon: image,
				shadow: shadow,
				shape: shape,
				map: map,
				animation: google.maps.Animation.DROP
			}));
			iterator++;
		}

		//run the marker JSON loop here
		$.each(opts.markers.markers, function(i, the_marker){
			latitude=the_marker.latitude;
			longitude=the_marker.longitude;
			icon = new google.maps.MarkerImage(
				the_marker.icon,
				new google.maps.Size(130,130),
				new google.maps.Point(0,0),
				new google.maps.Point(0,22)
			);
			//var baloon_text=the_marker.baloon_text;
			
			if(latitude!="" && longitude!=""){
				var marker = new google.maps.Marker({
					map: map, 
					position: new google.maps.LatLng(latitude,longitude),
					animation: google.maps.Animation.DROP,
					icon: icon,
					draggable: false,
					raiseOnDrag: false
				});
			}
		});
		$('#zoom_in').click(function(){
			map.setZoom(map.getZoom() + 1);
		});
		$('#zoom_out').click(function(){
			map.setZoom(map.getZoom() - 1);
		});
		$('#reset').click(function(){
        	map.setZoom(opts.zoom);
			map.setCenter(new google.maps.LatLng(coords[0],coords[1]));
      });
	}

})(jQuery);
