function grayscale(src) {
	
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		var imgObj = new Image();
		imgObj.src = src;
		canvas.width = imgObj.width;
		canvas.height = imgObj.height;
		ctx.drawImage(imgObj, 0, 0);
		var imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
		for(var y = 0; y < imgPixels.height; y++){
			for(var x = 0; x < imgPixels.width; x++){
				var i = (y * 4) * imgPixels.width + x * 4;
				var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
				imgPixels.data[i] = avg;
				imgPixels.data[i + 1] = avg;
				imgPixels.data[i + 2] = avg;
			}
		}
		ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
		return canvas.toDataURL();
		
}

(function($){
	$(window).load(function(){
		
		$('#loading').fadeOut('slow');
		
		var images = $('#css3panels .panel img');
		if(!$('html').hasClass('oldie')) {
			images.each(function(){
				var el = $(this);
				//el.clone().addClass('grayscale').css({"z-index":"998","opacity":"0"}).insertBefore(el).queue(function(){
				el.clone().addClass('grayscale').insertBefore(el).queue(function(){
					var el = $(this);
					el.dequeue();
				});
				this.src = grayscale(this.src);
				el.css({"top":"-"+ el.height() +"px"});
			});
			/*
			$('#css3panels .panel').live('mouseover',function(){
				$(this).find('img:first').animate({opacity:1}, {duration: 200, queue:false});
			});
			
			$(".grayscale").live('mouseout',function(){
				$(this).animate({opacity:0},{duration: 200, queue:false});
			});
			*/
		}
	});
})(jQuery);
