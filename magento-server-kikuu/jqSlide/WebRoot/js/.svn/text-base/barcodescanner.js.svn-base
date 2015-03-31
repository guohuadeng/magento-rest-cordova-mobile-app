/**
 * Phonegap Barcode Scanner plugin
 * Copyright (c) Matt Kane 2010
 *
 */
var BarcodeScanner = function() { 

}

BarcodeScanner.Type = {
	QR_CODE: "QR_CODE",
	DATA_MATRIX: "DATA_MATRIX",
	UPC_E: "UPC_E",
	UPC_A: "UPC_A",
	EAN_8: "EAN_8",
	EAN_13: "EAN_13",
	CODE_128: "CODE_128",
	CODE_39: "CODE_39",
	CODE_93: "CODE_93",
	CODABAR: "CODABAR",
	ITF: "ITF",
	RSS14: "RSS14",
	PDF417: "PDF417",
	RSS_EXPANDED: "RSS_EXPANDED",
	PRODUCT_CODE_TYPES: "UPC_A,UPC_E,EAN_8,EAN_13",
	ONE_D_CODE_TYPES: "UPC_A,UPC_E,EAN_8,EAN_13,CODE_39,CODE_93,CODE_128",
	QR_CODE_TYPES: "QR_CODE",
	ALL_CODE_TYPES: null
}

BarcodeScanner.Encode = {
		TEXT_TYPE: "TEXT_TYPE",
		EMAIL_TYPE: "EMAIL_TYPE",
		PHONE_TYPE: "PHONE_TYPE",
		SMS_TYPE: "SMS_TYPE"
		//  CONTACT_TYPE: "CONTACT_TYPE",  // TODO:  not implemented, requires passing a Bundle class from Javascriopt to Java
		//  LOCATION_TYPE: "LOCATION_TYPE" // TODO:  not implemented, requires passing a Bundle class from Javascriopt to Java
	}
//二维码扫描的方法
BarcodeScanner.prototype.scan = function(types, success, fail, options) {

	
	
    return PhoneGap.exec(function(args) {
        success(args);
    }, function(args) {
        fail(args);
    }, 'BarcodeScanner', 'scan', []);
};

PhoneGap.addConstructor(function() {
	//如果不支持window.plugins,则创建并设置     
    if(!window.plugins){   
        window.plugins={};   
    }   
    window.plugins.barcodeScanner=new BarcodeScanner(); 
	//PhoneGap.addPlugin('barcodeScanner', new BarcodeScanner());
	PluginManager.addService("BarcodeScanner","com.com.lifeng.jdtx.barcode.BarcodeScanner");
});