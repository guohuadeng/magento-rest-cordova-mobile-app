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
class Kancart_MobileApi_Model_Store extends Kancart_MobileApi_Model_Abstract {

    public function kancart_store_information_get() {
        $storeInformation = array();
        $storeInformation['general'] = $this->getGeneralInfo();
        $storeInformation['currencies'] = $this->getCurrencies();
        $storeInformation['languages'] = $this->getLanguages();
        $storeInformation['countries'] = $this->getCountries();
        $storeInformation['zones'] = $this->getZones();
        $storeInformation['order_statuses'] = $this->getOrderStatuses();
        $storeInformation['register_fields'] = $this->getRegisterFields();
        $storeInformation['address_fields'] = $this->getAddressFields();
        $storeInformation['category_sort_options'] = $this->getCategorySortOptions();
        $storeInformation['search_sort_options'] = $this->getSearchSortOptions();
        return array(true, '0x0000', $storeInformation);
    }

    public function getRegisterFields() {
        // Register fields
        $registerFields = array(
            array('type' => 'email', 'required' => true),
            array('type' => 'pwd', 'required' => true),
            array('type' => 'firstname', 'required' => true),
            array('type' => 'lastname', 'required' => true)
        );
        return $registerFields;
    }

    public function getAddressFields() {
        $addressFields = array(
            array('type' => 'firstname', 'required' => true),
            array('type' => 'lastname', 'required' => true),
            array('type' => 'company', 'required' => false),
            array('type' => 'fax', 'required' => false),
            array('type' => 'country', 'required' => true),
            array('type' => 'city', 'required' => true),
            array('type' => 'zone', 'required' => true),
            array('type' => 'address1', 'required' => true),
            array('type' => 'address2', 'required' => false),
            array('type' => 'postcode', 'required' => true),
            array('type' => 'telephone', 'required' => true),
        );
        return $addressFields;
    }

    /**
     * Verify the address is complete
     * @param type $address
     * @return boolean
     */
    public function checkAddressIntegrity($address) {
        if (empty($address) || !is_array($address)) {
            return false;
        }

        $addressFields = $this->getAddressFields();
        foreach ($addressFields as $field) {
            if ($field['required'] === true) {
                $name = $field['type'];
                if ($name == 'country') {
                    if (!isset($address['country_id']) || empty($address['country_id'])) {
                        return false;
                    }
                } elseif ($name == 'zone') {
                    if (isset($address['zone_id']) && intval($address['zone_id'])) {
                        continue;
                    } elseif (isset($address['state']) && $address['state']) {
                        continue;
                    } elseif (isset($address['zone_name']) && $address['zone_name']) {
                        continue;
                    } else {
                        return false;
                    }
                } elseif ($name == 'city') {
                    if (isset($address['city_id']) && intval($address['city_id'])) {
                        continue;
                    } elseif (isset($address['city']) && $address['city']) {
                        continue;
                    } else {
                        return false;
                    }
                } elseif (!isset($address[$name]) || empty($address[$name])) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Returns currency symbol properties array based on config values
     *
     * @return array
     */
    public function getCurrencies() {
        $Curencies = array();
        $block = Mage::getBlockSingleton('Directory/Currency');
        $defaultCurrencyCode = $block->getCurrentCurrencyCode();
        $allowedCurrencies = $block->getCurrencies();
        if (empty($allowedCurrencies)) {
            $allowedCurrencies[$defaultCurrencyCode] = 'default';
        }

        /** @var $locale Mage_Core_Model_Locale */
        $locale = Mage::app()->getLocale();
        foreach ($allowedCurrencies as $code => $desc) {
            $Curencies[] = array(
                'currency_code' => $code,
                'default' => $defaultCurrencyCode == $code,
                'currency_symbol' => $locale->getTranslation($code, 'currencysymbol'),
                'currency_symbol_right' => false,
                'decimal_symbol' => '.',
                'group_symbol' => ',',
                'decimal_places' => 2,
                'description' => $desc,
            );
        }

        return $Curencies;
    }

    public function getLanguages() {
        $languages = array();
        $params = Mage::registry('application_params');
        $stores = Mage::app()->getStores(false, true);
        $allowspecific = Kancart::helper('Data')->getFrontConfig('allowspecific') > 0;
        $annlowStores = explode(',', Kancart::helper('Data')->getFrontConfig('stores'));
        foreach ($stores as $store) {
            if ($store->getIsActive()) {
                if (isset($params['scope_type']) && $params['scope_type'] == 'website' && isset($params['scope_code'])) {
                    $allow = !$allowspecific && $store->getWebsite()->getCode() == $params['scope_code'];
                } else {
                    $allow = !$allowspecific && $store->getWebsite()->getIsDefault();
                }
                if ($allow || ($allowspecific && in_array($store->getCode(), $annlowStores))) {
                    $languages[] = array(
                        'language_id' => $store->getCode(),
                        'language_code' => Mage::getStoreConfig('general/locale/code', $store->getCode()),
                        'language_name' => $store->getName(),
                        'position' => $store->getSortOrder()
                    );
                }
            }
        }
        return $languages;
    }

    public function getCountries() {
        $collection = Mage::getResourceModel('directory/country_collection')->loadByStore();
        $countries = array();
        foreach ($collection as $country) {
            $countries[] = array(
                'country_id' => $country->getCountryId(),
                'country_name' => $country->getName(),
                'country_iso_code_2' => $country->getIso2Code(),
                'country_iso_code_3' => $country->getIso3Code()
            );
        }
        return $countries;
    }

    public function getZones() {
        $zones = array();
        $collection = Mage::getModel('directory/country')->getCollection();
        foreach ($collection as $country) {
            foreach ($country->getRegions() as $region) {
                $zones[] = array(
                    'zone_id' => $region->getRegionId(),
                    'country_id' => $region->getCountryId(),
                    'zone_name' => $region->getName(),
                    'zone_code' => $region->getCode()
                );
            }
        }
        return $zones;
    }

    public function getOrderStatuses() {
        $statuses = Mage::getSingleton('sales/order_config')->getStatuses();
        $orderStatuses = array();
        $orderStatus = null;
        foreach ($statuses as $key => $value) {
            $orderStatus = array();
            $orderStatus['status_id'] = $key;
            $orderStatus['status_name'] = $value;
            $orderStatus['display_text'] = $value;
            $orderStatuses[] = $orderStatus;
        }
        return $orderStatuses;
    }

    /**
     * Read configuration Sort from XML
     * If customer set the sort mode
     * @return type
     */
    public function getCategorySortOptions() {
        $layout = Mage::getSingleton('core/layout');
        $update = $layout->getUpdate();
        $rootCategory = Mage::getModel('catalog/category')
                ->load(Mage::app()->getStore()->getRootCategoryId());
        Mage::register('current_category', $rootCategory);
        $update->addHandle('default');
        $update->addHandle($rootCategory->getLayoutUpdateHandle());
        $update->load();
        $layout->generateXml()->generateBlocks();
        $availableOrders = $layout->getBlock('product_list')
                ->prepareSortableFieldsByCategory($rootCategory)
                ->getAvailableOrders();
        $orderOptions = array();
        foreach ($availableOrders as $code => $title) {
            $optGrp = array();
            $optGrp[] = array(
                'title' => $title,
                'code' => $code . ':asc',
                'arrow_type' => 'asc');
            $optGrp[] = array(
                'title' => $title,
                'code' => $code . ':desc',
                'arrow_type' => 'desc');
            $orderOptions[] = $optGrp;
        }
        return $orderOptions;
    }

    public function getSearchSortOptions() {
        if (!($rootCategory = Mage::registry('current_category'))) {
            $rootCategory = Mage::getModel('catalog/category')
                    ->load(Mage::app()->getStore()->getRootCategoryId());
        }
        $availableOrders = $rootCategory->getAvailableSortByOptions();
        unset($availableOrders['position']);
        $availableOrders = array_merge(array(
            'relevance' => $this->__('Relevance')
                ), $availableOrders);

        $orderOptions = array();
        foreach ($availableOrders as $code => $title) {
            $optGrp = array();
            $optGrp[] = array(
                'title' => $title,
                'code' => $code . ':asc',
                'arrow_type' => 'asc');
            $optGrp[] = array(
                'title' => $title,
                'code' => $code . ':desc',
                'arrow_type' => 'desc');
            $orderOptions[] = $optGrp;
        }
        return $orderOptions;
    }

    public function getGeneralInfo() {
        return array(
            'cart_type' => 'magento',
            'cart_version' => Mage::getVersion(),
            'plugin_version' => KANCART_PLUGIN_VERSION,
            'support_kancart_payment' => true,
            'support_facebook_login' => true,
            'support_promotion' => true,
            'login_by_mail' => true
        );
    }

}

?>
