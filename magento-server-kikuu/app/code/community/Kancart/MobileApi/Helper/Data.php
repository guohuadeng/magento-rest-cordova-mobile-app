<?php

/**
 * Magento
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@magentocommerce.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Magento to newer
 * versions in the future. If you wish to customize Magento for your
 * needs please refer to http://www.magentocommerce.com for more information.
 *
 * @category    Mage
 * @package     Mage_XmlConnect
 * @copyright   Copyright (c) 2010 Magento Inc. (http://www.magentocommerce.com)
 * @license     http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 * This helper is from Magento xmlconnect, to avoid some website hasn't installed xmlconnect 
 */
class Kancart_MobileApi_Helper_Data extends Mage_Core_Helper_Abstract {

    public function redirectMobile() {//controller_action_predispatch      
        if (Mage::getStoreConfig('Kancart/redirect/active') < 1) {
            return;
        } elseif (preg_match('/(admin|downloader|MobileApi)/i', $_SERVER['REQUEST_URI'])) {
            return;
        } elseif (isset($_REQUEST['view_full_site'])) {
            Mage::getSingleton('customer/session')->setViewFullSite(true);
            return;
        } elseif (Mage::getSingleton('customer/session')->getViewFullSite()) {
            return;
        }

        if ($this->isMobile()) {
            $url = Mage::getStoreConfig('Kancart/redirect/url');
            if (!strlen($url)) {
                $parts = explode('.', $_SERVER['SERVER_NAME']);
                if (checkdnsrr('m.' . $parts[1] . '.com')) {
                    $url = 'm.' . $parts[1] . '.com';
                } else {
                    $url = $parts[1] . '.kancart.com';
                }
            }

            if (strpos($url, 'http') === false) {
                $url = 'http://' . $url;
            }
            $url = rtrim($url, '/');

            $path = trim(Mage::app()->getRequest()->getPathInfo(), '/');
            $parts = explode('/', $path);
            if ($parts) {
                if ($parts[0] == 'catalog') {
                    if ($parts[1] == 'category') {
                        $url .= '/categories/' . end($parts);
                    } elseif ($parts[1] == 'product') {
                        $url .= '/item_detail/' . $parts[4];
                    }
                } elseif ($parts[0] == 'catalogsearch') {
                    $url .= '/item_search/?query=' . Mage::app()->getRequest()->getParam('q');
                }
            }

            header('Location: ' . $url);
            exit();
        }
    }

    private function isMobile() {
        if (isset($_SERVER['HTTP_X_WAP_PROFILE'])) {
            return true;
        } else if (isset($_SERVER['HTTP_USER_AGENT']) && $_SERVER['HTTP_USER_AGENT']) {
            if (preg_match('/(iphone|android|ipad|ipod).+mobile/i', $_SERVER['HTTP_USER_AGENT'])) {//ignore tablet
                return true;
            } else if (preg_match('/IEMobile|blackberry|mini|windows\sce|palm/i', $_SERVER['HTTP_USER_AGENT'])) {
                return true;
            }
        }

        return false;
    }

    public function isDiscountEnabled() {
        return defined('KANCART_APP_KEY');
    }

    public function getFrontConfig($name) {
        return Mage::getStoreConfig('Kancart/general/' . $name, Mage::app()->getStore());
    }

}
