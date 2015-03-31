function initPageScroll(options) {

    options = $.extend({}, {
        pages: [],
        onRefresh: function (callback) {
            callback();
        },
        onLoadMore: function (callback) {
            callback();
        }
    }, options);

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
                console.log(this.x);
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