
// ==============================================
// PDP - image zoom - needs to be available outside document.ready scope
// ==============================================

var ProductMediaManager = {
    IMAGE_ZOOM_THRESHOLD: 20,
    imageWrapper: null,

    swapImage: function(targetImage) {
        targetImage = jQuery(targetImage);
        targetImage.addClass('gallery-image');

        if(targetImage[0].complete) { //image already loaded -- swap immediately
			 jQuery("li.etalage_thumb").trigger('zoom.destroy');
			 jQuery("li.etalage_thumb .gallery-image").remove();
			 jQuery("li.etalage_thumb img.etalage_thumb_image").show();
			 jQuery("li.etalage_thumb_active img.etalage_thumb_image").hide();
			 jQuery(targetImage).insertBefore(jQuery("li.etalage_thumb_active img.etalage_thumb_image"));
			 imagesLoaded(targetImage, function() {
				 if(typeof zoom_enabled !== 'undefined' && zoom_enabled == true)
					 jQuery("li.etalage_thumb").zoom({touch:false});
			 });

        } else { //need to wait for image to load
			 jQuery("li.etalage_thumb").trigger('zoom.destroy');
			 jQuery("li.etalage_thumb .gallery-image").remove();
			 jQuery("li.etalage_thumb img.etalage_thumb_image").show();
			 jQuery("li.etalage_thumb_active img.etalage_thumb_image").hide();
			 jQuery(targetImage).insertBefore(jQuery("li.etalage_thumb_active img.etalage_thumb_image"));
            imagesLoaded(targetImage, function() {
				if(typeof zoom_enabled !== 'undefined' && zoom_enabled == true)
	                jQuery("li.etalage_thumb").zoom({touch:false});
            });

        }
    },
    init: function() {
        ProductMediaManager.imageWrapper = jQuery('.product-img-box');

        jQuery(document).trigger('product-media-loaded', ProductMediaManager);
    }
};

jQuery(document).ready(function() {
    ProductMediaManager.init();
});