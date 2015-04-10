<?php
class SkyMazon_Customer_OrderController extends Mage_Core_Controller_Front_Action {
	public function indexAction() {
		Mage::app ()->cleanCache ();
		$customer_email = Mage::app ()->getRequest ()->getParam ( 'email' );
		$orders = Mage::getResourceModel ( 'sales/order_collection' )->addFieldToSelect ( '*' )->addFieldToFilter ( 'customer_email', $customer_email )->addFieldToFilter ( 'state', array (
				'in' => Mage::getSingleton ( 'sales/order_config' )->getVisibleOnFrontStates () 
		) )->setOrder ( 'created_at', '' );
		
		$i = 0;
		foreach ( $orders as $_order ) {
			$order_list [$i] [OrderId] = $_order->getRealOrderId ();
			// echo $_order->getRealOrderId();			
			$order_list [$i] [GrandTotal] = $_order->getGrandTotal ();
			// echo $_order->formatPrice($_order->getGrandTotal());			
			$order_list [$i] [CreatedAt] = $_order->getCreatedAt ();
			// 2011-09-04 14:46:05			
			$order_list [$i] [UpdatedAt] = $_order->getUpdatedAt ();			
			$order_list [$i] [status] = $_order->getStatus ();
			// echo $_order->getStatusLabel();			
			// $order_list[$i][Name] = $_order->getShippingAddress() ? $this->htmlEscape($_order->getShippingAddress()->getName()) : NULL ;
			$i ++;
			// echo $_order->getShippingAddress() ? $this->htmlEscape($_order->getShippingAddress()->getName()) : '&nbsp;'
		}
		echo json_encode ( $order_list );
	}
}
