var fs = require('fs'),
    version = require('./version.json'),
    //manifestFile = './android/Kikuu/AndroidManifest.xml',
    manifestFile = './magento-server-kikuu/kikuu/platforms/android/AndroidManifest.xml';
    manifest = fs.readFileSync(manifestFile).toString();

manifest = manifest.replace(/android:versionCode="(\d*)"/, 'android:versionCode="' + version.code + '"');
manifest = manifest.replace(/android:versionName="([\d.]*)"/, 'android:versionName="' + version.name + '"');
fs.writeFileSync(manifestFile, manifest);
