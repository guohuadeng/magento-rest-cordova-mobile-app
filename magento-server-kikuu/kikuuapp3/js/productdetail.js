// 处理页面url传递的参数
function requestUrl(paras)
    { 
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
	
var entity_id = requestUrl('entity_id') ;
var title = requestUrl('title') ;
var swiper = new Swiper('.product-swiper-container', {
	pagination: '.swiper-pagination',
	paginationClickable: true,
});
//初始化页面中产品信息
$(document).ready(function(){
	var $detailTpl = $('#detail-template');	
	var $detailImgTpl = $('#detailImg-template');	
	$('.title').text(title);

	//产品图片列表
	$.ajax ({
			type : 'get',
			url: baseUrl + '/api/rest/products/' + entity_id + '/images',
			dataType: 'json', // 注意：JSONP <-- P (lowercase)
			success: function(imglist) {
				$.each(imglist, function (i, item) {
					swiper.appendSlide(sprintf(
						'<div class="swiper-slide"><img src="%s"></div>',
						item.url));
					});
			if (callback) {
				callback();
			}
		},
			error: function (jqXHR) {
				alert('Please check the network!');
			}			
		});	
//--------	
	//产品详情
	$.ajax ({
			type : 'get',
			url: baseUrl+'/api/rest/products/' + entity_id + '/',
			dataType: 'json', // 注意：JSONP <-- P (lowercase)
			success:function(product){	
				$('.title').text(product.name);
				//将json对象用刚刚注册的Handlebars模版封装，得到最终的html，插入到基础productInfo中。
				$('#productInfo').html(Handlebars.compile($detailTpl.html())({
					product: product
				}));
				},
			error: function (jqXHR) {
				alert('Please check the network!');
				}			
			});
	//end 详情
});