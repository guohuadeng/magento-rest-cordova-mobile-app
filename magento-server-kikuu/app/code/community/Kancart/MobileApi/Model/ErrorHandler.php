<?php

class KancartErrorHandler {

    // CATCHABLE ERRORS
    public static function captureNormal($number, $message, $file, $line) {
	$errormsg = "ERROR #$number: $message in $file on line $line ";
	header("HTTP/1.0 200 OK",true);
	die(json_encode(array('result' => 'fail', 'code' => '0xFFFF', 'info' => $errormsg)));
	return true;
    }

    // EXCEPTIONS
    public static function captureException($exception) {
	// Display content $exception variable
	$errormsg = "Uncaught Exception: #{$exception->getCode()} {$exception->getMessage()} in {$exception->getFile()} on line {$exception->getLine()} ";
	header("HTTP/1.0 200 OK",true);
	die(json_encode(array('result' => 'fail', 'code' => '0xFFFF', 'info' => $errormsg)));
    }

    // UNCATCHABLE ERRORS
    public static function captureFatalError() {
	$error = error_get_last();
	if ($error) {
	    if (!defined('REQUEST_NORMAL_COMPLETE') && isset($_REQUEST['method'])) {
		if ($error['type'] == E_COMPILE_ERROR || $error['type'] == E_RECOVERABLE_ERROR || $error['type'] == E_ERROR || $error['type'] == E_CORE_ERROR || $error['type'] == E_USER_ERROR) {
		    $errormsg = "FATAL ERROR #{$error['type']}: {$error['message']} in {$error['file']} on line {$error['line']} ";
		    header("HTTP/1.0 200 OK",true);
		    die(json_encode(array('result' => 'fail', 'code' => '0xFFFF', 'info' => $errormsg)));
		}
	    }
	}
    }

}

if(!defined('E_DEPRECATED')){define ('E_DEPRECATED', 8192);}

set_error_handler(array('KancartErrorHandler', 'captureNormal'), E_COMPILE_ERROR|E_RECOVERABLE_ERROR|E_ERROR|E_CORE_ERROR|E_USER_ERROR);
set_exception_handler(array('KancartErrorHandler', 'captureException'));
register_shutdown_function(array('KancartErrorHandler', 'captureFatalError'));
?>