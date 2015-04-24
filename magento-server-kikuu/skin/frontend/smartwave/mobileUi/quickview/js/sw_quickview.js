jQuery.noConflict();
jQuery(function($) {
        //insert quickview popup        
        $('.quickview-icon').fancybox({
            'type'              : 'iframe',            
            'autoSize'          : false,
            'titleShow'         : false,
            'autoScale'         : false,
            'transitionIn'      : 'none',
            'transitionOut'     : 'none',
            'scrolling'         : 'auto',
            'padding'           : 0,
            'margin'            : 0,                        
            'autoDimensions'    : false,
            'width'             : EM.Quickview.QS_FRM_WIDTH,
            'maxHeight'         : EM.Quickview.QS_FRM_HEIGHT,
            'centerOnScroll'    : true,            
            'height'            : 'auto',
            'beforeLoad'        : function() {
                
            },
            'afterLoad'        : function() {     
                $('#fancybox-content').height('auto');

                
            },
            'helpers'             : {
                overlay : {
                    locked : false // try changing to true and scrolling around the page
                }
            }            
        });
});


