var fs = require('fs'),
    version = require('./version.json'),
    //manifestFile = './android/Kikuu/AndroidManifest.xml',
    manifestFile = './magento-server-kikuu/kikuu/config.xml';
    manifest = fs.readFileSync(manifestFile).toString();

manifest = manifest.replace(/id="com.kikuu.android" version="([\d.]*)"/, 'id="com.kikuu.android" version="' + version.version + '"');
fs.writeFileSync(manifestFile, manifest);
