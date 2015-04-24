jQuery(document).ready(function($){
    // **********************************************************************// 
    // ! Main Navigation plugin
    // **********************************************************************//

    $.fn.et_menu = function ( options ) {
        var methods = {
            showChildren: function(el) {
                el.fadeIn(100).css({
                    display: 'list-item',
                    listStyle: 'none'
                }).find('li').css({listStyle: 'none'});
            },
            calculateColumns: function(el) {
                // calculate columns count
                var columnsCount = el.find('.container > ul > li.menu-item-has-children').length;
                var dropdownWidth = el.find('.container > ul > li').outerWidth();
                var padding = 20;
                if(columnsCount > 1) {
                    dropdownWidth = dropdownWidth*columnsCount + padding;
                    el.css({
                        'width':dropdownWidth
                    });
                }

                // calculate right offset of the  dropdown
                var headerWidth = $('.menu-wrapper').outerWidth();
                var headerLeft = $('.menu-wrapper').offset().left;
                var dropdownOffset = el.offset().left - headerLeft;
                var dropdownRight = headerWidth - (dropdownOffset + dropdownWidth);

                if(dropdownRight < 0) {
                    el.css({
                        'left':'auto',
                        'right':0
                    });
                } 
            },
            openOnClick: function(el,e) {
                var timeOutTime = 0;
                var openedClass = "current";
                var header = $('.header-wrapper');
                var $this = el;


                if($this.parent().hasClass(openedClass)) {
                    e.preventDefault();
                    $this.parent().removeClass(openedClass);
                    $this.next().stop().slideUp(settings.animTime);
                    header.stop().animate({'paddingBottom': 0}, settings.animTime);
                } else {

                    if($this.parent().find('>div').length < 1) {
                        return;
                    }

                    e.preventDefault();

                    if($this.parent().parent().find('.' + openedClass).length > 0) {
                        timeOutTime = settings.animTime;
                        header.stop().animate({'paddingBottom': 0}, settings.animTime);
                    }

                    $this.parent().parent().find('.' + openedClass).removeClass(openedClass).find('>div').stop().slideUp(settings.animTime);

                    setTimeout(function(){
                        $this.parent().addClass(openedClass);
                        header.stop().animate({'paddingBottom': $this.next().height()+50},settings.animTime);
                        $this.next().stop().slideDown(settings.animTime);
                    },timeOutTime);
                }
            }
        };

        var settings = $.extend({
            type: "default", // can be columns, default, mega, combined
            animTime: 250,
            openByClick: true
        }, options );

        this.find('>li').hover(function (){
            if(!$(this).hasClass('open-by-click') || (!settings.openByClick && $(this).hasClass('open-by-click'))) {
                var dropdown = $(this).find('> .nav-sublist-dropdown');
                if ($(this).hasClass('menu-full-width') && SW_MENU_POPUP_WIDTH) {
                    dropdown.css('width', SW_MENU_POPUP_WIDTH);
                }                
                methods.showChildren(dropdown);

                if(settings.type == 'columns') {
                    methods.calculateColumns(dropdown);
                }
            }
        }, function () {
            if(!$(this).hasClass('open-by-click') || (!settings.openByClick && $(this).hasClass('open-by-click'))) {
                $(this).find('> .nav-sublist-dropdown').fadeOut(100);
            }
        });

        return this;
    }

    // First Type of column Menu
    $('.main-nav .menu').et_menu({
        type: "default"
    });

    $('.fixed-header .menu').et_menu({
        openByClick: false
    });
    


    function et_equalize_height(elements, removeHeight) {
        var heights = [];

        if(removeHeight) {
            elements.attr('style', '');
        }

        elements.each(function(){
            heights.push($(this).height());
        });

        var maxHeight = Math.max.apply( Math, heights );
        if($(window).width() > 767) {
            elements.height(maxHeight);
        }
    }

    $(window).resize(function(){
        //et_equalize_height($('.product-category'), true);
    });

     // **********************************************************************// 
    // ! Mobile navigation
    // **********************************************************************// 

    var navList = $('.mobile-nav div > ul');
    var etOpener = '<span class="open-child">(open)</span>';
    navList.addClass('sw-mobile-menu');
    
    navList.find('li:has(ul)',this).each(function() {
        $(this).prepend(etOpener);
    })
    
    navList.find('.open-child').click(function(){
        if ($(this).parent().hasClass('over')) {
            $(this).parent().removeClass('over').find('>ul').slideUp(200);
        }else{
            $(this).parent().parent().find('>li.over').removeClass('over').find('>ul').slideUp(200);
            $(this).parent().addClass('over').find('>ul').slideDown(200);
        }
    });    
    $('.menu-icon, .close-mobile-nav').click(function(event) {
        if(!$('body').hasClass('mobile-nav-shown')) {
            $('body').addClass('mobile-nav-shown', function() {
                // Hide search input on click
                setTimeout(function(){
                    $(document).one("click",function(e) {
                        var target = e.target;
                        if (!$(target).is('.mobile-nav') && !$(target).parents().is('.mobile-nav')) {
                                    $('body').removeClass('mobile-nav-shown');
                        }
                    });  
                }, 111);
            });
        } else{
            $('body').removeClass('mobile-nav-shown');
        }
    });
});