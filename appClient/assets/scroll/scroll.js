function initPageScroll(options) {
    document.addEventListener("orientationchange", updateLayout);

    options = $.extend({}, {
        pages: [],
        onRefresh: function (callback) {
            callback();
        },
        onLoadMore: function (callback) {
            callback();
        },
        onPage: function (page) {
            return false;
        },
        onLeft: function () {
            return false;
        },
        onRight: function () {
            return false;
        }
    }, options);

    // The wrapperWidth before orientationChange. Used to identify the current page number in updateLayout();
    var wrapperWidth = 0,
        wrapperPage,
        wrapperX;

    window.myScroll = new iScroll('pageWrapper', {
        snap: true,
        momentum: false,
        hScrollbar: false,
        vScrollbar: false,
        lockDirection: true,
        onScrollStart: function () {
            wrapperX = this.x;
        },
        onScrollMove: function () {
            if (wrapperPage === myScroll.currPageX) {
                if (wrapperPage === 0 && this.x - wrapperX >= 50) {
                    options.onLeft();
                } else if (wrapperX  - this.x >= 50) {
                    options.onRight();
                }
            }
            wrapperPage = myScroll.currPageX;
        },
        onScrollEnd: function () {
            options.onPage(myScroll.currPageX);
        }
    });

    updateLayout();

    function updateLayout() {

        var currentPage = 0;

        if (wrapperWidth > 0) {
            currentPage = - Math.ceil( $('#pageScroller').position().left / wrapperWidth);
        }

        wrapperWidth = $('#pageWrapper').width();

        $('#pageScroller').css('width', wrapperWidth * options.pages.length);
        $('.page').css('width', wrapperWidth - 40);
        myScroll.refresh();
        myScroll.scrollToPage(currentPage, 0, 0);
    }

    var pullActionDetect = {
        count: 0,
        limit: 10,
        check: function(scroll, $el, count) {
            if (count) {
                pullActionDetect.count = 0;
            }
            // Detects whether the momentum has stopped, and if it has reached the end - 200px of the scroller - it trigger the pullUpAction
            setTimeout(function() {
                if (scroll.y <= (scroll.maxScrollY + 200) && !$el.hasClass('loading')) {
                    $el.show().addClass('loading');
                    options.onLoadMore(function () {
                        $el.hide().removeClass('loading');
                    });
                } else if (pullActionDetect.count < pullActionDetect.limit) {
                    pullActionDetect.check(scroll, $el);
                    pullActionDetect.count++;
                }
            }, 200);
        }
    };

    function initScroll(page) {
        var $el = $('#' + page.id),
            $pd = $el.find('.pullDown');

        var scroll = new iScroll(page.id, {
            hScrollbar: false,
            vScrollbar: false,
            lockDirection: true,
            onScrollMove: function () {
                if (!page.pullRefresh) {
                    return;
                }
                if (this.y > $pd.height()) {
                    $pd.attr('class', 'pullDown flip')
                        .find('.pullDownLabel')
                        .text('Release to refresh...');
                } else if (this.y >= 5) {
                    $pd.show()
                        .attr('class', 'pullDown')
                        .find('.pullDownLabel')
                        .text('Pull down to refresh...');
                } else {
                    $pd.hide();
                }
                pullActionDetect.check(scroll, $el.find('.pullUp'), 1);
            },
            onScrollEnd: function () {
                if (!page.pullRefresh) {
                    return;
                }
                if ($pd.is(':visible')) {
                    if ($pd.hasClass('flip')) {
                        $pd.attr('class', 'pullDown loading')
                            .find('.pullDownLabel')
                            .text('Loading...');
                        options.onRefresh(function () {
                            $pd.hide();
                        });
                    } else {
                        $pd.hide();
                    }
                }
                pullActionDetect.check(scroll, $el.find('.pullUp'), 1);
            }
        });
        $el.data('scroll', scroll);
    }

    $.each(options.pages, function (i, page) {
        initScroll(page);
    });
}