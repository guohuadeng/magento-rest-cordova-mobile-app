(function () {
    var scripts = [
        'js/define.js',
        'js/util.js',
        'js/server.js',
        'js/common.js',
        'js/index.js',
        'js/productdetail.js'
    ];

    for (var i = 0; i < scripts.length; i++) {
        document.write('<script src="' + scripts[i] + '"></script>');
    }
})();