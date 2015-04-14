//初始化页面中产品信息
//将json对象用刚刚注册的Handlebars模版封装，得到最终的html，插入到基础productInfo				
// 处理返回数据
function ready() {
    var entity_id,
        productSwiper,
        query = utils.queryUrl();
        productInfoTpl = $('#productInfo-template').html(),	
        productAttrTpl = $('#productAttr-template').html(),		
        productOptionTpl = $('#productOption-template').html();

    //主页面传来的全局 产品id，但是有时不是主页面传来而是直接网页参数传来
//    entity_id = query.entity_id || defines.cur_entity_id;
      entity_id = requestUrl('entity_id') || defines.cur_entity_id;
    


    //产品图片列表
    function showImg(entity_id) {
        $.ajax({
            type: 'get',
            url: defines.baseUrl + '/api/rest/products/' + entity_id + '/images',
            dataType: 'json',
            success: function (imglist) {
                productSwiper = new Swiper('.product-swiper-container', {
                    pagination: '.product-swiper-container .swiper-pagination',
                    slidesPerView: 1,
                    centeredSlides: true,
                    parallax: true,
                    paginationClickable: true,
                    preloadImages: true
                    //lazyLoading: true    // Enable lazy loading
                });
                var iHtml;
                $.each(imglist, function (i, item) {
                    productSwiper.appendSlide(sprintf('<div class="swiper-slide"><img class="small-image" src="%s" alt="Kikuu.com"></div>', item.url));
                });
                productSwiper.slideTo(0);
            },
            error: function (jqXHR) {
//					alert('Please check the network!');
            }
        });
    }

    // end 产品图片列表--------	*/
    //产品详情
    function showInfo(entity_id) {
        $.ajax({
            type: 'get',
            url: defines.baseUrl + '/restconnect/products/getproductdetail/productid/' + entity_id,
            dataType: 'json',
            success: function (product) {
				//处理为带千位","，去除小数点
                product.final_price_with_tax = fmoney(product.final_price_with_tax,0);
                product.regular_price_with_tax = fmoney(product.regular_price_with_tax,0);

                $('#productInfo').html(Handlebars.compile(productInfoTpl)({
                    product: product
                }));
            },
            error: function (jqXHR) {
//					alert('Please check the network!');
            }
        });
    }
    //end 产品详情
    //产品选项
    function showOption(entity_id) {
        $.ajax({
            type: 'get',
            url: defines.baseUrl + '/restconnect/products/getcustomoption/productid/' + entity_id,
            dataType: 'json', // 注意：JSONP <-- P (lowercase)
            success: function (option) { 
				$.each(option, function(i,item) {
					$("#debug").append(item.custom_option_type+"一级</br>");
					
					$.each(item.custom_option_value, function(j,item2) {
						$("#debug").append(item2.default_price+"二级</br>");
							
							});						
						});
				
                $('#productOption').html(Handlebars.compile(productOptionTpl)({
                    option: option
                }));
				},
            error: function (jqXHR) {
                alert('Please check the network!');
            }
        });
    }
    ///end 产品选项
	
    function handleOption($el, func, list) {
        // 处理返回数据
        var items = $.map(list, function (item) {
            var custom_option_value = new Date(moment(item.special_from_date, 'YYYY-MM-DD HH:mm:ss')),
                toDate = new Date(moment(item.special_to_date, 'YYYY-MM-DD HH:mm:ss')),
                date = new Date();
            if (+fromDate <= +date && +date <= +toDate) {
                item.price_percent = ~~(-100 * (item.regular_price_with_tax -
                    item.final_price_with_tax) / item.regular_price_with_tax);
                item.price_percent_class = '';
            } else {
                item.price_percent_class = 'none';
                item.final_price_with_tax = item.regular_price_with_tax;
            }
            item.final_price_with_tax = parseFloat(item.final_price_with_tax).toFixed(2);
            item.regular_price_with_tax = parseFloat(item.regular_price_with_tax).toFixed(2);
            return item;
        });
        $el[func](Handlebars.compile(itemTpl)({
            items: items
        }));
        var $cb = $el.find('.cb');
        $cb = $cb.length ? $cb : $('<div class="cb"></div>');
        $el.append($cb);
      //end 处理返回数据
    }
	function requestUrl(paras)	{ 
			// 内嵌的iFrame需要处理自己的url，所以临时加上
			// 处理页面url传递的参数
			var url = location.href; 
			var paraString = url.substring(url.indexOf('?')+1,url.length).split('&'); 
			var paraObj = {} 
			for (i=0; j=paraString[i]; i++){ 
			paraObj[j.substring(0,j.indexOf('=')).toLowerCase()] = j.substring(j.indexOf('=')+1,j.length); 
			} 
			var returnValue = paraObj[paras.toLowerCase()]; 
			if(typeof(returnValue)=='undefined'){ 
			return ''; 
			}else{ 
			return returnValue; 
			} 
		}
	//构造页面
    showImg(entity_id);
//    showInfo(entity_id);
    showOption(entity_id);
}

$(document).ready(ready);