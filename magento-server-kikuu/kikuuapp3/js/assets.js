(function () {
    var scripts = [
		//绑定fastclick，更好处理tap,滚动的流畅度提升明显，因chrome浏览器操作原因，开发阶段关闭
        //'assets/fastclick/fastclick.js',
        'assets/mobilebone/mobilebone.js',
        'assets/scroll/iscroll.js',		
		//尝试使用iscroll5来取代4，失败
		//'assets/iscroll5/iscroll.js',
        'assets/scroll/scroll.js',
        'bower_components/jquery/jquery.min.js',
        'bower_components/handlebars/handlebars.min.js',
        'bower_components/sprintf/dist/sprintf.min.js',
        'bower_components/store2/dist/store2.min.js',
        'bower_components/momentjs/moment.js',
        'bower_components/swiper/dist/js/swiper.jquery.min.js',
        'bower_components/jquery.lazyload/jquery.lazyload.js'
    ];

    for (var i = 0; i < scripts.length; i++) {
        document.write('<script src="' + scripts[i] + '"></script>');
    }
})();