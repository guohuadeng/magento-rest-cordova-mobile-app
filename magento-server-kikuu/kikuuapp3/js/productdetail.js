var entity_id;
var productSwiper = new Swiper('.product-swiper-container', {
		pagination: '.product-swiper-container .swiper-pagination',
		slidesPerView: 1,
		centeredSlides: true,
		parallax: true,
		paginationClickable: true,
		loop: true
});

//初始化页面中产品信息
$(document).ready(function(){
		entity_id = requestUrl('entity_id');
		$productDetailTpl = $('#productDetail-template'),
		$detailImgTpl = $('#detailImg-template');
	if (entity_id)
		showProductPage(entity_id);	
	});
	
function setProductId (id)	{ entity_id = id; };

function showProductPage() {
	//var items = [];
	if (productSwiper) {
			productSwiper.removeAllSlides();
		}
	//产品图片列表
	$.ajax ({
			type : 'get',
			url: defines.baseUrl + '/api/rest/products/' + entity_id + '/images',
			dataType: 'json', // 注意：JSONP <-- P (lowercase)
			success: function(imglist) {
				$.each(imglist, function (i, item) {					
		<!-- 详情 rest 图片生成 -->
					productSwiper.appendSlide(sprintf(
						'<div class="swiper-slide"><img src="%s"></div>',
						item.url));
					});
					productSwiper.slideTo(0);
                    $('img.lazy').lazyload({
                        effect: 'fadeIn',
                        container: ('.swiper-slide'),
                        placeholder: 'images/loading.gif'
                    });
		},
			error: function (jqXHR) {
				alert('Please check the network!');
			}			
		});	
	// end 产品图片列表--------	*/
	//产品详情
	$.ajax ({
			type : 'get',
			url: defines.baseUrl+'/api/rest/products/' + entity_id + '/',
			dataType: 'json', // 注意：JSONP <-- P (lowercase)
			success:function(product){	
				//将json对象用刚刚注册的Handlebars模版封装，得到最终的html，插入到基础productInfo				
				// 处理返回数据
				product.final_price_with_tax = parseFloat(product.final_price_with_tax).toFixed(2);
				product.regular_price_with_tax = parseFloat(product.regular_price_with_tax).toFixed(2);
				
				$('#productInfo').html(Handlebars.compile($productDetailTpl.html())({
					product: product
				}));
				},
			error: function (jqXHR) {
				alert('Please check the network!');
				}			
			});
	//end 产品详情
	//productSwiper = null;
}