(function () {
    var scripts = [
        'bower_components/jquery/jquery.min.js',
        'bower_components/ratchet/dist/js/ratchet.js',
        'bower_components/handlebars/handlebars.min.js',
        'bower_components/sprintf/dist/sprintf.min.js',
        'bower_components/store2/dist/store2.min.js',
        'bower_components/swiper/dist/js/swiper.js',

        'assets/scroll/iscroll.js',
        'assets/scroll/scroll.js',
        'js/common.js',
        'js/index.js'
    ];

    for (var i = 0; i < scripts.length; i++) {
        document.write('<script src="' + scripts[i] + '"></script>');
    }
})();