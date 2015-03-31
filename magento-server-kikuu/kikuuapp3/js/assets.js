(function () {
    var scripts = [
        'assets/mobilebone/mobilebone.js',
        'assets/scroll/iscroll.js',
        'assets/scroll/scroll.js',
        'bower_components/jquery/jquery.min.js',
        'bower_components/handlebars/handlebars.min.js',
        'bower_components/sprintf/dist/sprintf.min.js',
        'bower_components/store2/dist/store2.min.js',
        'bower_components/momentjs/moment.js',
        'bower_components/swiper/dist/js/swiper.js'
    ];

    for (var i = 0; i < scripts.length; i++) {
        document.write('<script src="' + scripts[i] + '"></script>');
    }
})();