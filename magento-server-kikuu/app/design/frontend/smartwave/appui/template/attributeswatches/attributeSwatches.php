<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function addAttributeSwatches(&$_info) {


    $_info = json_decode($_info, true);
    //json_decode( $_info, true);
    
    /* will get all the attributes with swatches  */
    $_attributes_with_swatches = Mage::helper("attributeswatches")->getAttributesWithSwatchesProductView();
    $_attributes_hideselect = Mage::helper("attributeswatches")->getAttributesProductViewHideSelect();
    $_attributes_switchgallery = Mage::helper("attributeswatches")->getAttributesSwitchGalleryProductView();

    /* hide select only if the attribute has another type of selector associated */
    foreach ($_attributes_hideselect as $_id => $type) {
        if (!isset($_attributes_with_swatches[$_id])) {
            unset($_attributes_hideselect[$_id]);
        }
    }
    $_swatches_ids = array();

    foreach ($_info['attributes'] as $_id => $_attribute) {
        /* options with swatches from the db */
        if (isset($_attributes_with_swatches[$_attribute["code"]]) && $_attributes_with_swatches[$_attribute["code"]] == "image") {
            foreach ($_attribute["options"] as $_option) {
                $_swatches_ids[] = $_option["id"];
            }
        }
        /* set the swatch type to display in frontend */
        if (isset($_attributes_with_swatches[$_attribute["code"]])) {
            $_info['attributes'][$_id]["swatch_type"] = $_attributes_with_swatches[$_attribute["code"]];
        } else {
            $_info['attributes'][$_id]["swatch_type"] = false;
        }
        /* hide/show select in frontend */
        $_info['attributes'][$_id]["hideselect"] = isset($_attributes_hideselect[$_attribute["code"]]);
        /* switch gallery when attribute is selected */
        $_info['attributes'][$_id]["switchgallery"] = isset($_attributes_switchgallery[$_attribute["code"]]);
    }

    $_options = Mage::getModel('attributeswatches/attributeswatches')->getCollection()->addFieldToFilter('main_table.option_id', array('in' => $_swatches_ids));
    $_swatches_values = array();
    foreach ($_options as $_option) {
        $_swatch = "";
        if ($_option->getMode() == 2) {
            $_swatch = "background-color:#" . $_option->getColor();
        } elseif ($_option->getMode() == 1) {
            $_swatch = "background-image:url('" . Mage::getBaseUrl('media') . 'attributeswatches/' . $_option->getFilename() . "');";
        }
        $_swatches_values[$_option->getOptionId()] = $_swatch;
    }


    /* assign the images or colors to the swatches */
    foreach ($_info['attributes'] as $_id => $_attribute) {
        if (isset($_attributes_with_swatches[$_attribute["code"]]) && $_attributes_with_swatches[$_attribute["code"]] == "image") {
            foreach ($_attribute["options"] as $_i => $_option) {
                if (isset($_swatches_values[$_option["id"]]))
                    $_info['attributes'][$_id]["options"][$_i]["swatch_value"] = $_swatches_values[$_option["id"]];
            }
        }
    }

    //print_r($_info);

    return $_info;
}

?>
