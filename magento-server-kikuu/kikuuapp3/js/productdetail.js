//初始化页面中产品信息
//将json对象用刚刚注册的Handlebars模版封装，得到最终的html，插入到基础productInfo				
// 处理返回数据
function ready() {
    var entity_id,
        productSwiper,
        query = utils.queryUrl();

    //主页面传来的全局 产品id，但是有时不是主页面传来而是直接网页参数传来
    entity_id = query.entity_id || defines.cur_entity_id;

    function init() {
        showInfo(entity_id);
        showImg(entity_id);
    }

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
                    //productSwiper.appendSlide(sprintf('<div class="swiper-slide"><img class="swiper-lazy small-image" data-src="%s" alt="Kikuu.com"></div>',item.url)); 延迟加载暂时不用
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
            url: defines.baseUrl + '/api/rest/products/' + entity_id + '/',
            dataType: 'json',
            success: function (product) {
                product.final_price_with_tax = parseFloat(product.final_price_with_tax).toFixed(2);
                product.regular_price_with_tax = parseFloat(product.regular_price_with_tax).toFixed(2);

                $('#productInfo').html(Handlebars.compile(defines.productInfoTpl)({
                    product: product
                }));
            },
            error: function (jqXHR) {
//					alert('Please check the network!');
            }
        });
    }
    //end 产品详情
    /*/产品选项
    function showOption(entity_id) {
        $.ajax({
            type: 'get',
            url: defines.baseUrl + '/api/rest/products/' + entity_id + '/',
            dataType: 'json', // 注意：JSONP <-- P (lowercase)
            success: function (product) {
                product.final_price_with_tax = parseFloat(product.final_price_with_tax).toFixed(2);
                product.regular_price_with_tax = parseFloat(product.regular_price_with_tax).toFixed(2);

                $('#productInfo').html(Handlebars.compile(defines.productOptionTpl)({
                    product: product
                }));
            },
            error: function (jqXHR) {
                alert('Please check the network!');
            }
        });
    }
    *///end 产品选项
	//构造页面
    showImg(entity_id);
    showInfo(entity_id);
}

$(document).ready(ready);