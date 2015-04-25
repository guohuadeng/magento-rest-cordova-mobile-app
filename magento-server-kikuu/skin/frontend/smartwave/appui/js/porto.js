function setNewsletterCookie(){
	jQuery.cookie('newsletter_popup','dontshowitagain');
}
jQuery.fn.extend({
    scrollToMe: function(){
        var top = jQuery(this).offset().top - 100;
        jQuery('html,body').animate({scrollTop: top}, 500);
    },
    scrollToJustMe: function(){
        var top = jQuery(this).offset().top;
        jQuery('html,body').animate({scrollTop: top}, 500);
    }
});
function portoAlert(msg){
	jQuery('<div class="note-msg container alert" style="display:none;position:fixed;top:30px;margin-left:-30px;z-index:9999;">'+msg+'</div>').appendTo("div.main");
	jQuery(".alert").fadeIn(500);
	setTimeout(function(){	jQuery(".alert").fadeOut(500);setTimeout(function(){jQuery(".alert").remove();},500);},3000);
}
jQuery(function($){
    $('div.product-view p.no-rating a, div.product-view .rating-links a').click(function(){
        $('.product-tabs ul li').removeClass('active');
        $('#tab_review_tabbed').addClass('active');
        $('.product-tabs .tab-content').hide();
        $('#tab_review_tabbed_contents').show();
        $('#tab_review_tabbed').scrollToMe();
        return false;
    });
    
    $(".word-rotate").each(function() {

        var $this = $(this),
            itemsWrapper = $(this).find(".word-rotate-items"),
            items = itemsWrapper.find("> span"),
            firstItem = items.eq(0),
            firstItemClone = firstItem.clone(),
            itemHeight = 0,
            currentItem = 1,
            currentTop = 0;

        itemHeight = firstItem.height();

        itemsWrapper.append(firstItemClone);

        $this
            .height(itemHeight)
            .addClass("active");

        setInterval(function() {
            currentTop = (currentItem * itemHeight);
            
            itemsWrapper.animate({
                top: -(currentTop) + "px"
            }, 300, function() {
                currentItem++;
                if(currentItem > items.length) {
                    itemsWrapper.css("top", 0);
                    currentItem = 1;
                }
            });
            
        }, 2000);

    });
    $(window).stellar({
        responsive: true,
        scrollProperty: 'scroll',
        parallaxElements: false,
        horizontalScrolling: false,
        horizontalOffset: 0,
        verticalOffset: 0
    });
/********** Fullscreen Slider ************/
    var s_width = $(window).innerWidth();
    var s_height = $(window).innerHeight();
    var s_ratio = s_width/s_height;
    var v_width=320;
    var v_height=240;
    var v_ratio = v_width/v_height;
    $(".full-screen-slider div.item").css("position","relative");
    $(".full-screen-slider div.item").css("overflow","hidden");
    $(".full-screen-slider div.item").width(s_width);
    $(".full-screen-slider div.item").height(s_height);
    $(".full-screen-slider div.item > video").css("position","absolute");
    $(".full-screen-slider div.item > video").bind("loadedmetadata",function(){
        v_width = this.videoWidth;
        v_height = this.videoHeight;
        v_ratio = v_width/v_height;
        if(s_ratio>=v_ratio){
            $(this).width(s_width);
            $(this).height("");
            $(this).css("left","0px");
            $(this).css("top",(s_height-s_width/v_width*v_height)/2+"px");
        }else{
            $(this).width("");
            $(this).height(s_height);
            $(this).css("left",(s_width-s_height/v_height*v_width)/2+"px");
            $(this).css("top","0px");
        }
        $(this).get(0).play();
    });
	$(".header-container.type10 .dropdown-menu .menu-container>a").click(function(){
		    if(!$("body").hasClass("cms-index-index") || $(".header-container.type10").hasClass("sticky-header")) {
			    if ($(this).next().hasClass("show")) {
				    $(this).next().removeClass("show");
			    } else {
				    $(this).next().addClass("show");
			    }
		    }
		    if($(window).width()<=991){
			    if ($(".mobile-nav.side-block").hasClass("show")) {
				    $(".mobile-nav.side-block").removeClass("show");
				    $(".mobile-nav.side-block").slideUp();
			    } else {
				    $(".mobile-nav.side-block").addClass("show");
				    $(".mobile-nav.side-block").slideDown();
			    }
		    }
	});
	if($(window).width()>=992)
		$(".cms-index-index .header-container.type10+.top-container .slider-wrapper").css("min-height",$(".header-container.type10 .menu.side-menu").height()+20+"px");
    $(window).resize(function(){
		if($(window).width()>=992)
			$(".cms-index-index .header-container.type10+.top-container .slider-wrapper").css("min-height",$(".header-container.type10 .menu.side-menu").height()+20+"px");
		else
			$(".cms-index-index .header-container.type10+.top-container .slider-wrapper").css("min-height","");
        s_width = $(window).innerWidth();
        s_height = $(window).innerHeight();
        s_ratio = s_width/s_height;
        $(".full-screen-slider div.item").width(s_width);
        $(".full-screen-slider div.item").height(s_height);
        $(".full-screen-slider div.item > video").each(function(){
            if(s_ratio>=v_ratio){
                $(this).width(s_width);
                $(this).height("");
                $(this).css("left","0px");
                $(this).css("top",(s_height-s_width/v_width*v_height)/2+"px");
            }else{
                $(this).width("");
                $(this).height(s_height);
                $(this).css("left",(s_width-s_height/v_height*v_width)/2+"px");
                $(this).css("top","0px");
            }
        });
    });

/************** Header - Search icon, Links icon click event ***************/
    $(".top-links-icon").click(function(e){
        $("a.search-icon").parent().children("#search_mini_form").removeClass("show");
        if($(this).parent().children("ul.links").hasClass("show")){
            $(this).parent().children("ul.links").removeClass("show");
        }
        else
            $(this).parent().children("ul.links").addClass("show");
        e.stopPropagation();
    });
    $("a.search-icon").click(function(e){
        $(".top-links-icon").parent().children("ul.links").removeClass("show");
        if($(this).parent().children("#search_mini_form").hasClass("show")){
            $(this).parent().children("#search_mini_form").removeClass("show");
        }
        else
            $(this).parent().children("#search_mini_form").addClass("show");
        e.stopPropagation();
    });
    $("a.search-icon").parent().click(function(e){
        e.stopPropagation();
    })
    $("html,body").click(function(){
        $(".top-links-icon").parent().children("ul.links").removeClass("show");
        $("a.search-icon").parent().children("#search_mini_form").removeClass("show");
    });
    
    /********************* Product Images ***********************/
    
    $("a.product-image img.defaultImage").each(function(){
        var default_img = $(this).attr("src");
        if(!default_img)
            default_img = $(this).attr("data-src");
        var thumbnail_img = $(this).parent().children("img.hoverImage").attr("src");
        if(!thumbnail_img)
            thumbnail_img = $(this).parent().children("img.hoverImage").attr("data-src");
        if(default_img){
            if(default_img.replace("/small_image/","/thumbnail/")==thumbnail_img){
                $(this).parent().children("img.hoverImage").remove();
                $(this).removeClass("defaultImage");
            }
        }
    });

    /********************* Qty Holder **************************/
    $(".table_qty_inc").unbind('click').click(function(){
		if($(this).parent().children(".qty").is(':enabled'))
        	$(this).parent().children(".qty").val((+$(this).parent().children(".qty").val()+1) || 0);
    });
    $(".table_qty_dec").unbind('click').click(function(){
		if($(this).parent().children(".qty").is(':enabled'))
	        $(this).parent().children(".qty").val(($(this).parent().children(".qty").val()-1 > 0)?($(this).parent().children(".qty").val() - 1) : 0);
    });
    
    $(".qty_inc").unbind('click').click(function(){
		if($(this).parent().parent().children("input.qty").is(':enabled')){
			$(this).parent().parent().children("input.qty").val((+$(this).parent().parent().children("input.qty").val() + 1) || 0);
			$(this).parent().parent().children("input.qty").focus();
			$(this).focus();
		}
    });
    $(".qty_dec").unbind('click').click(function(){
		if($(this).parent().parent().children("input.qty").is(':enabled')){
			$(this).parent().parent().children("input.qty").val(($(this).parent().parent().children("input.qty").val() - 1 > 0) ? ($(this).parent().parent().children("input.qty").val() - 1) : 0);
			$(this).parent().parent().children("input.qty").focus();
			$(this).focus();
		}
    });
    
    /* moving action links into product image area */
    $(".move-action .item .details-area .actions").each(function(){
        $(this).parent().parent().children(".product-image-area").append($(this));
    });
});
jQuery(function($){
    var breadcrumb_pos_top = 0;
    $(window).scroll(function(){
        if(!$("body").hasClass("cms-index-index")){
            var side_header_height = $(".header-container.type12").innerHeight();
            var window_height = $(window).height();
            if(side_header_height-window_height<$(window).scrollTop()){
                if(!$(".header-container.type12").hasClass("fixed-bottom"))
                    $(".header-container.type12").addClass("fixed-bottom");
            }
            if(side_header_height-window_height>=$(window).scrollTop()){
                if($(".header-container.type12").hasClass("fixed-bottom"))
                    $(".header-container.type12").removeClass("fixed-bottom");
            }
        }
        if($("body.side-header .top-container > .breadcrumbs").length){
            if(!$("body.side-header .top-container > .breadcrumbs").hasClass("fixed-position")){
                breadcrumb_pos_top = $("body.side-header .top-container > .breadcrumbs").offset().top;
                if($("body.side-header .top-container > .breadcrumbs").offset().top<$(window).scrollTop()){
                    $("body.side-header .top-container > .breadcrumbs").addClass("fixed-position");
                }
            }else{
                if(breadcrumb_pos_top>=$(window).scrollTop()){
                    $("body.side-header .top-container > .breadcrumbs").removeClass("fixed-position");
                }
            }
        }
    });
});