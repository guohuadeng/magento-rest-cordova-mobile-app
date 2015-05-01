<?php

/**
 * KanCart
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@kancart.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade KanCart to newer
 * versions in the future. If you wish to customize KanCart for your
 * needs please refer to http://www.kancart.com for more information.
 *
 * @copyright  Copyright (c) 2011 kancart.com (http://www.kancart.com)
 * @license    http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 */

/**
 * The none padding string consists of nothing.
 */
define('CRYPT_PADDING_MODE_NONE', -1);

/**
 * The zero padding string consists of a sequence of bytes filled with zeros.
 */
define('CRYPT_PADDING_MODE_ZERO', 0);

/**
 * The ansix923 padding string consists of 
 * a sequence of bytes filled with zeros before the length 
 */
define('CRYPT_PADDING_MODE_ANSIX923', 1);

/**
 * The iso10126 padding string consists of random data before the length.
 */
define('CRYPT_PADDING_MODE_ISO10126', 2);

/**
 * The pkcs 7 padding string consists of a sequence of bytes, 
 * each of which is equal to the total number of padding bytes added.
 */
define('CRYPT_PADDING_MODE_PKCS7', 3);

class Kancart_MobileApi_Helper_CryptoUtil extends Mage_Core_Helper_Abstract
{

    public static function Crypto($text, $cipher, $key, $isEncrypt) {
        switch ($cipher) {
            case 'DES': {
                    $crypt = Kancart::helper('DES');
                    $crypt->Crypt_DES(CRYPT_DES_MODE_CBC);
                    $crypt->setKey($key);
                    $crypt->setIV($key);
                    if ($isEncrypt) {
                        return strtoupper(bin2hex($crypt->encrypt($text)));
                    } else {
                        return $crypt->decrypt(Kancart_MobileApi_Helper_CryptoUtil::hex2bin($text));
                    }
                }break;
            case 'AES-256': {
                    $crypt = Kancart::helper('Rijndael');
                    $crypt->Crypt_Rijndael(CRYPT_RIJNDAEL_MODE_ECB);
                    $crypt->setKey($key);
                    if ($isEncrypt) {
                        return strtoupper(bin2hex($crypt->encrypt($text)));
                    } else {
                        return $crypt->decrypt(Kancart_MobileApi_Helper_CryptoUtil::hex2bin($text));
                    }
                }break;
            default:break;
        }
        return "ERROR";
    }

    private static function hex2bin($hexData) {
        $binData = "";
        for ($i = 0; $i < strlen($hexData); $i += 2) {
            $binData .= chr(hexdec(substr($hexData, $i, 2)));
        }
        return $binData;
    }

}

// CryptoUtil.php end