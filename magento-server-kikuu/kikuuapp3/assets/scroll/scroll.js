function initPageScroll(options) {

    options = $.extend({}, {
        pages: [],
        onRefresh: function (callback) {
            callback();
        },
        onLoadMore: function (callback) {
            callback();
        },
        onLeft: function () {
            return false;
        },
        onRight: function () {
            return false;
        }
    }, options);

    var pullActionDetect = {
        count: 0,
        limit: 10,
        check: function(scroll, $el, count) {
            if (count) {
                pullActionDetect.count = 0;
            }
            if (!$el.length) {
                return;
            }
            // Detects whether the momentum has stopped, and if it has reached the end - 200px of the scroller - it trigger the pullUpAction
            setTimeout(function() {
                if (scroll.y <= (scroll.maxScrollY + 200) && !$el.hasClass('scroll-loading')) {
                    $el.show().addClass('scroll-loading');
                    options.onLoadMore(function () {
                        $el.hide().removeClass('scroll-loading');
                    });
                } else if (pullActionDetect.count < pullActionDetect.limit) {
                    pullActionDetect.check(scroll, $el);
                    pullActionDetect.count++;
                }
            }, 200);
        }
    };

    function initScroll(i, page) {
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
                $el.find('scroller').trigger('scroll');

                if (this.distX < -100) {
                    options.onRight(page.id, i);
                    return;
                }
                if (this.distX > 100) {
                    options.onLeft(page.id, i);
                    return;
                }
                if (!page.pullRefresh) {
                    return;
                }
                if ($pd.is(':visible')) {
                    if ($pd.hasClass('flip')) {
                        $pd.attr('class', 'pullDown scroll-loading')
                            .find('.pullDownLabel')
                            .text('Loading...');
                        options.onRefresh(function () {
                            $pd.hide();
                            if ($el.data('pullUp')) {
                                $el.find('.scroller').append($el.data('pullUp'));
                            }
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

    $.each(options.pages, initScroll);
}