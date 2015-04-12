var productSwiper,		//产品详情页中的图片
	entity_id;			//当前查看产品
$productDetailTpl = $('#productDetail-template');	
//初始化页面中产品

function setProductId (id)	{ entity_id = id; };

function showProductPage() {
	var items = [];
	if (productSwiper) {
			productSwiper.removeAllSlides();
			productSwiper = null;
		}
	else {
		}
	productSwiper = new Swiper('.product-swiper-container', {
			pagination: '.product-swiper-container .swiper-pagination',
			paginationClickable: true
			});	
	//var entity_id = requestUrl('entity_id') ;
	//产品图片列表，这个必须在上面的产品详情已经构建完成后才执行

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
//--------	*/
	//产品详情
	$.ajax ({
			type : 'get',
			url: baseUrl+'/api/rest/products/' + entity_id + '/',
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
	//end 详情
	//productSwiper = null;
}