	
//初始化页面中产品
function showProductPage() {
	var entity_id = requestUrl('entity_id') ;
	var title = requestUrl('title') ;
	var $productDetailTpl = $('#productDetail-template');	
	var productSwiper = new Swiper('.product-swiper-container', {
		pagination: '.product-swiper-container .swiper-pagination',
		paginationClickable: true,
		loop: true
	});

	//产品图片列表
	$.ajax ({
			type : 'get',
			url: baseUrl + '/api/rest/products/' + entity_id + '/images',
			dataType: 'json', // 注意：JSONP <-- P (lowercase)
			success: function(imglist) {
				$.each(imglist, function (i, item) {					
		<!-- 详情 rest 图片生成 -->
					productSwiper.appendSlide(sprintf(
						'<div class="swiper-slide"><img src="%s"></div>',
						item.url));
					});
					productSwiper.slideTo(1);
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
//--------	*/
	//产品详情
	$.ajax ({
			type : 'get',
			url: baseUrl+'/api/rest/products/' + entity_id + '/',
			dataType: 'json', // 注意：JSONP <-- P (lowercase)
			success:function(product){	
				//$('.title').text(product.name);
				//将json对象用刚刚注册的Handlebars模版封装，得到最终的html，插入到基础productInfo中。
				$('#productInfo').html(Handlebars.compile($productDetailTpl.html())({
					product: product
				}));
				},
			error: function (jqXHR) {
				alert('Please check the network!');
				}			
			});
	//end 详情
}