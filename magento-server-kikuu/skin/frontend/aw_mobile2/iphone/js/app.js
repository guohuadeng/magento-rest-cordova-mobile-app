window.addEventListener('load', function() {
    FastClick.attach(document.body);
}, false);

Element.addMethods({
    outerWidth: function (element) {
        element = $(element);
        if (!element) {
            return null;
        }
        var width = element.getWidth();
        if (element.getStyle('border-left')) {
            width += parseFloat(element.getStyle('border-left'));
        }
        if (element.getStyle('border-right')) {
            width += parseFloat(element.getStyle('border-right'));
        }
        return Math.max(width, 0);
    },

    outerHeight: function (element) {
        element = $(element);
        if (!element) {
            return null;
        }
        var height = element.getHeight();
        if (element.getStyle('border-top')) {
            height += parseFloat(element.getStyle('border-top'));
        }
        if (element.getStyle('border-bottom')) {
            height += parseFloat(element.getStyle('border-bottom'));
        }
        return Math.max(height, 0);
    }
});
var hideTopMenuBySwipe = function () {
    //todo slow animation on Iphone3
    window.topFlag = true;
    Quo($$('.page-scroll-wrapper').first()).swiping(function(e) {
        var sensitivity = 30;
        if(navigator.userAgent.match(/Android/i)) {
            sensitivity = 5;
        }
        if (Math.abs(e.currentTouch.y - e.iniTouch.y) < sensitivity) {
            return false;
        }
        if (window.disableHideTopMenuBySwipe) {
            return;
        }
        var topHeight = 84;
        if (window.topFlag) {
            topHeight = 0;
        }
        if (document.viewport.getHeight() >= $$('.page-scroll').first().getHeight() + topHeight) {
            return;
        }
        if (e.iniTouch.y > e.currentTouch.y)  {
            if (!window.topFlag) {
                return;
            }
            hideTopMenu();
            window.topFlag = false;
        } else {
            if (window.topFlag) {
                return;
            }
            showTopMenu();
            window.topFlag = true;
        }
    });
};
var hideTopMenu = function () {
    window.pageContentPaddingTop = $('page_content').getStyle('padding-top');
    window.mainPaddingTop = $('main').getStyle('padding-top');
    var top = parseInt(window.pageContentPaddingTop) + parseInt(window.mainPaddingTop);
    new Effect.Morph('content_top', {
        style: 'top:-' + top + 'px;opacity:0;',
        duration: 0.4
    });
    $('main').addClassName('hide-top-menu');
    $('page_content').addClassName('hide-top-menu');
    $('main').removeClassName('show-top-menu');
    $('page_content').removeClassName('show-top-menu');
};
var showTopMenu = function () {
    new Effect.Morph('content_top', {
        style: 'top:0;opacity:1;',
        duration: 0.4
    });
    $('main').addClassName('show-top-menu');
    $('page_content').addClassName('show-top-menu');
    $('main').removeClassName('hide-top-menu');
    $('page_content').removeClassName('hide-top-menu');
};
function handleOrientation() {
    if (window.orientation == 'undefined') {
        return;
    }
    if (window.orientation == 0 || window.orientation == 180) {
        document.body.setAttribute("orient", "profile");
    } else {
        document.body.setAttribute("orient", "landscape");
    }
    //var hscroll = (document.all ? document.scrollLeft : window.pageXOffset);
   // var vscroll = (document.all ? document.scrollTop : window.pageYOffset);
    window.scrollTo(0, 0);
    return;
}
Event.observe(document, "dom:loaded", function(e){
    window.disableHideTopMenuBySwipe = false;
    hideTopMenuBySwipe();
    $$('.panel--from-bottom').each(function(el) {
        el.setStyle({display:'block'});
    });
    handleOrientation();
    window.addEventListener('orientationchange', handleOrientation, false);
});
var setTitleMargin = function (el) {
    var parentChildNodes = el.up().childElements();
    var leftWidth = 0;
    var rightWidth = 0;
    var isLeftElements = true;
    parentChildNodes.each(function(childNode) {
        if (childNode != el) {
            if (isLeftElements) {
                leftWidth += Math.max(childNode.outerWidth(), 0);
            } else {
                rightWidth += Math.max(childNode.outerWidth(), 0);
            }
        } else {
            isLeftElements = false;
        }
    });
    var span = el.select('span').first();
    if (span) {
        if (span.outerWidth() / 2 <  el.up().outerWidth() / 2 - leftWidth) {
            leftWidth = rightWidth = 0;
        }
        /**if (el.up().outerWidth() - leftWidth - rightWidth > span.outerWidth()) {
            leftWidth = rightWidth = 0;
        }**/
    }
    el.style.left = leftWidth + 'px';
    el.style.right = rightWidth + 'px';
    return true;
};
var awMobile2 = awMobile2 || {};
awMobile2.app = {};
/****************** AJAX AUTOCOMPLITER ************************/
awMobile2.app.AjaxAutocompleter = Class.create(Ajax.Autocompleter, {
    updateChoices: function(choices) {
        if(!this.changed && this.hasFocus) {
            if (this.update) {
                this.update.innerHTML = choices;
                Element.cleanWhitespace(this.update);
                if (this.update.down()) {
                    Element.cleanWhitespace(this.update.down());
                    if(this.update.firstChild && this.update.down().childNodes) {
                        this.entryCount =
                            this.update.down().childNodes.length;
                        for (var i = 0; i < this.entryCount; i++) {
                            var entry = this.getEntry(i);
                            entry.autocompleteIndex = i;
                            this.addObservers(entry);
                        }
                    } else {
                        this.entryCount = 0;
                    }
                }
            }
            this.stopIndicator();
            this.index = 0;
            if(this.entryCount==1 && this.options.autoSelect) {
                this.selectEntry();
                this.hide();
            } else {
                this.render();
            }
        } else {
            this.stopIndicator();
        }
    },
    markPrevious: function() {
        if(this.index > 0) this.index--;
        else this.index = this.entryCount-1;
        //this.getEntry(this.index).scrollIntoView(true); useless
    }
});
/****************** CATEGORY NAVIGATION ************************/
awMobile2.app.categoryNavigation = Class.create({
    initialize: function(elId, openMenuElId){
        //main menu element
        this._navMenuElid = elId;

        //back button
        this._backButton = $$('#' + this._navMenuElid + ' .js-catalog-nav-back').first();

        //menu header
        this._headerEl =  $$('#' + this._navMenuElid + ' .panel-nav').first();

        //open menu link
        this._openMenuElid = openMenuElId;
        this._hideBackAction = true;
        this.init();
        Event.observe(window, 'load', function(e){
            //if has title - calculate position
            if ($$('#' + this._navMenuElid + ' .panel-nav__title')) {
                this.titleResize($$('#' + this._navMenuElid + ' .panel-nav__title').first());
            }
            //setup observers
            this.startObservers();
        }.bind(this));
    },
    init: function() {
        var clickMapList = [];
        var currentCategoryEl = $$('#' + this._navMenuElid + ' .nav__item.is-current').first();
        if (!currentCategoryEl) {
            return;
        }
        if (currentCategoryEl.hasClassName('nav__item--with-subcategory')) {
            clickMapList.push(currentCategoryEl);
        }
        var collectParentCategoryPathFn;
        collectParentCategoryPathFn = function(categoryEl) {
            var parentCategoryID = categoryEl.up('.nav__list').getAttribute('data-parent-category');
            if (!parentCategoryID) {
                return;
            }
            var parentCategory = $$('#' + this._navMenuElid + ' .nav__item[data-category="' + parentCategoryID +'"]').first();
            clickMapList.push(parentCategory);
            collectParentCategoryPathFn(parentCategory);
        }.bind(this);
        collectParentCategoryPathFn(currentCategoryEl);
        clickMapList.reverse();
        var me = this;
        clickMapList.each(function(el){
            me.onSubcategoryClick(el.select('.nav__item-title').first(), true);
        });
    },
    startObservers: function() {
        //back button
        this._backButton = $$('#' + this._navMenuElid + ' .js-catalog-nav-back').first();

        //menu header
        this._headerEl =  $$('#' + this._navMenuElid + ' .panel-nav').first();

        //default menu title
        this._defaultMenuTitle = $$('#' + this._navMenuElid + ' .panel-nav__title').first().getAttribute('data-default-title');
        //on subcategory click
        $$('#' + this._navMenuElid + ' .nav__item--with-subcategory .nav__item-title').each(function(titleEl){
            titleEl.observe('click', function(e){
                this.onSubcategoryClick(titleEl);
                Event.stop(e);
            }.bind(this));
        }.bind(this));

        // Back navigation in catalog
        this._startObserverForBackLink();

        //open menu link
        Quo($(this._openMenuElid)).tap(function(e){
            $(this._navMenuElid).addClassName('is-opened');
            $$('.page-scroll-wrapper').each(function(el) {el.addClassName('no-scroll');});
        }.bind(this));

        //close menu link
        Quo($$('#' + this._navMenuElid + ' .js-close-panel').first()).tap(function(e){
            $(this._navMenuElid).removeClassName('is-opened');
            $$('.page-scroll-wrapper').each(function(el) {el.removeClassName('no-scroll');});
        }.bind(this));
    },
    _startObserverForBackLink: function() {
        if (this._backButton) {
            this._backButton.observe('click', function(e){
                if (!this._backButton.hasClassName('is-new') ) {
                    this.onBackNavigationClick();
                }
                Event.stop(e);
            }.bind(this));
        }
    },
    onSubcategoryClick: function(subcategoryEl, disableAnimation) {
        //remove active class flag
        $$('#' + this._navMenuElid).first().select('.js-active').each(function(el){
            el.removeClassName('js-active');
        });

        //submenu category value
        var category = subcategoryEl.up().getAttribute('data-category');

        //get next submenu
        var listToOpen = $$('#' + this._navMenuElid + ' .nav__list[data-parent-category="' + category + '"]').first();

        //open menu
        listToOpen.scrollTop = 0;
        if (disableAnimation) {
            listToOpen.setStyle({'transition': "none", '-webkit-transition-duration': "none"});
        }
        listToOpen.addClassName('is-opened js-active');
        if (disableAnimation) {
            setTimeout(function(){
                listToOpen.setStyle({'transition': null, '-webkit-transition': null});
            }, 10);
        }
        //add shadow class on prev menu
        var navListEl = subcategoryEl.match('.nav__list') ? subcategoryEl : subcategoryEl.up('.nav__list');
        navListEl.addClassName('is-shadow-showed is-shadowed');

        //animate next title
        this._animateNextTitle(subcategoryEl, disableAnimation);
        return true;
    },
    _animateNextTitle: function(subcategoryEl, disableAnimation) {
        //get category name
        var categoryName = subcategoryEl.title.trim();

        //animate
        this._headerEl.addClassName('is-animate-forward');
        var currentTitle = $$('#' + this._navMenuElid + ' .panel-nav__title').first().innerHTML.trim();

        //if hide button flag
        if (this._hideBackAction) {
            this._backButton.setStyle({display: 'block'});
            this._backButton.addClassName('is-new');
            this._backButton.select(".panel-nav__action-label").first().update(currentTitle);
            this._hideBackAction = false;
        } else {
            //animate back button
            this._backButton.addClassName('is-old');
            var cloneBackBtn = this._backButton.cloneNode(true);
            cloneBackBtn.removeClassName('is-old').addClassName('is-new');

            //update title
            cloneBackBtn.select(".panel-nav__action-label").first().update(currentTitle);

            this._headerEl.appendChild(cloneBackBtn);
            if (disableAnimation) {
                $$('#' + this._navMenuElid + ' .panel-nav__title').first().setStyle({
                    'animation-name': 'none',
                    '-webkit-animation-name': 'none'
                });
            }
            //re-init back button
            this._backButton = cloneBackBtn;
            this._startObserverForBackLink();
        }

        //update title element
        var titleEl = $$('#' + this._navMenuElid + ' .panel-nav__title').first();
        titleEl.addClassName('is-old');
        var cloneTitleEl = titleEl.cloneNode(true);

        cloneTitleEl.update(categoryName);
        cloneTitleEl.removeClassName('is-old').addClassName('is-new');

        this._headerEl.appendChild(cloneTitleEl);

        this.titleResize($$('#' + this._navMenuElid + ' .panel-nav__title.is-new').first());

        //callback after animate
        var fn = function(e) {
            $$('#' + this._navMenuElid + ' .panel-nav .is-old').each(function(el){
                el.remove();
            });
            $$('#' + this._navMenuElid + ' .panel-nav .is-new').each(function(el){
                el.removeClassName('is-new');
            });

            this._headerEl.removeClassName('is-animate-forward');

            $$('#' + this._navMenuElid + ' .panel-nav__title').last().stopObserving("webkitAnimationEnd", fn);
            $$('#' + this._navMenuElid + ' .panel-nav__title').last().stopObserving("animationend", fn);
        }.bind(this);

        //animate title
        $$('#' + this._navMenuElid + ' .panel-nav__title').last().observe("webkitAnimationEnd", fn);
        $$('#' + this._navMenuElid + ' .panel-nav__title').last().observe("animationend", fn);
        if (disableAnimation) {
            fn();
            $$('#' + this._navMenuElid + ' .panel-nav__title').first().setStyle({
                'animation-name': null,
                '-webkit-animation-name': null
            });
        }
        return true;
    },
    _back: function() {
        //current sub-menu
        var currentMenu = $$('#' + this._navMenuElid + ' .js-active').first();
        //if menu has subcategory
        if (currentMenu && currentMenu.hasClassName('nav__list--subcategory')) {
            //prev menu
            var backMenuChild = currentMenu.getAttribute('data-parent-category');
            var backMenu = $$('#' + this._navMenuElid + ' .nav__item[data-category="' + backMenuChild + '"]').first().up('.nav__list');

            //parent category id
            var parentCategoryId = backMenu.getAttribute('data-parent-category');
            var parentMenu = null;
            var parentParentCategoryId = null;

            //if parentCategoryId get parentParentCategoryId
            if (parentCategoryId) {
                parentMenu = $$('#' + this._navMenuElid + ' .nav__item[data-category="' + parentCategoryId + '"]').first().up('.nav__list');
                parentParentCategoryId = parentMenu.getAttribute('data-parent-category');
            }

            backMenu.addClassName('js-active');
            backMenu.removeClassName('is-shadowed');

            this._getCallbackPrevMenu(backMenu);
            //callback after animate
            var fn = this._getCallbackPrevMenu(backMenu);

            //back button animate
            backMenu.observe("webkitTransitionEnd", fn);
            backMenu.observe("transitionend", fn);
            backMenu.observe("oTransitionEnd", fn);
            backMenu.observe("MSTransitionEnd", fn);

            currentMenu.removeClassName('is-opened js-active');

            //animate prev title
            this._animatePrevTitle(parentCategoryId, parentParentCategoryId)
            return true
        }
        this._backButton.up('.panel').removeClassName('is-opened');
        $$('.page-scroll-wrapper').each(function(el) {el.removeClassName('no-scroll');});
        return true;
    },
    _getCallbackPrevMenu: function (el) {
        var fn = function(e) {
            el.removeClassName('is-shadow-showed');
            el.stopObserving("webkitTransitionEnd", fn);
            el.stopObserving("transitionend", fn);
            el.stopObserving("oTransitionEnd", fn);
            el.stopObserving("MSTransitionEnd", fn);
        }.bind(el);
        return fn;
    },
    onBackNavigationClick: function() {
        return this._back();
    },
    _animatePrevTitle: function(parentCategoryId, parentParentCategoryId) {
        //init parent title
        var parentMenuTitle = this._defaultMenuTitle;
        if (parentCategoryId) {
            parentMenuTitle = $$('#' + this._navMenuElid + ' .nav__item[data-category="' + parentCategoryId + '"] .nav__item-title').first().innerHTML.trim();
        }

        //init parent parent title
        var parentParentMenuTitle = this._defaultMenuTitle;
        if (parentParentCategoryId) {
            parentParentMenuTitle = $$('#' + this._navMenuElid + ' .nav__item[data-category="' + parentParentCategoryId + '"]').first().innerHTML.trim();
        } else if (!parentCategoryId) {
            parentParentMenuTitle = $$('#' + this._navMenuElid + ' .panel-nav__action--back').first().getAttribute('data-default-label');
            this._hideBackAction = true;
        }
        this._headerEl.addClassName('is-animate-backward');

        //re-init back button
        this._backButton.addClassName('is-old');
        var cloneActionLeftEl = this._backButton.cloneNode(true);
        cloneActionLeftEl.removeClassName('is-old').addClassName('is-new');
        this._headerEl.appendChild(cloneActionLeftEl);
        cloneActionLeftEl.select(".panel-nav__action-label").first().update(parentParentMenuTitle);

        //re-init back button
        this._backButton = cloneActionLeftEl;
        this._startObserverForBackLink();

        //hide all back buttons
        if (this._hideBackAction) {
            $$('#' + this._navMenuElid + ' .panel-nav__action--back').each(function(el){
                el.setStyle({display: "none"});
            });
        }

        //update title
        var navTitle = $$('#' + this._navMenuElid + ' .panel-nav__title').first();
        navTitle.removeAttribute('style');
        navTitle.addClassName('is-old');
        cloneNavTitle = navTitle.cloneNode(true);
        cloneNavTitle.update(parentMenuTitle);
        cloneNavTitle.removeClassName('is-old').addClassName('is-new');
        this._headerEl.appendChild(cloneNavTitle);

        //title resize
        this.titleResize($$('#' + this._navMenuElid + ' .panel-nav__title.is-new').first());

        //callback
        var fn = function(e) {
            $$('#' + this._navMenuElid + ' .panel-nav .is-old').each(function(el){
                el.remove();
            });
            $$('#' + this._navMenuElid + ' .panel-nav .is-new').each(function(el){
                el.removeClassName('is-new');
            })
            this._headerEl.removeClassName('is-animate-backward');
            navTitle.stopObserving("webkitAnimationEnd", fn);
            navTitle.stopObserving("animationend", fn);
        }.bind(this);
        navTitle.observe("webkitAnimationEnd", fn);
        navTitle.observe("animationend", fn);
        return true;
    },
    titleResize: function(el) {
        var leftButton = el.up().select('[class*="action--left"]').first();
        if (el.hasClassName('is-new')) {
            leftButton = el.up().select('.panel-nav__action--left.is-new').first();
        }
        var rightButton = el.up().select('[class*="action--right"]').first();
        var leftButtonWidth = 0;
        if (leftButton) {
            leftButtonWidth = Math.max(leftButton.outerWidth(), 0);
        }
        var rightButtonWidth = 0;
        if (rightButton) {
            rightButtonWidth = Math.max(rightButton.outerWidth(), 0);
        }
        var margin = Math.max(leftButtonWidth, rightButtonWidth);

        el.setStyle({"left": margin + "px", "right": margin + "px", "text-align": "center"});
        var isTooLong = el.outerWidth() < el.scrollWidth;
        if (isTooLong) {
            if (leftButtonWidth < rightButtonWidth) {
                el.setStyle({"left": leftButtonWidth + "px", "text-align": "right"});
            } else {
                el.setStyle({"right": rightButtonWidth + "px", "text-align": "left"});
            }
        }
    }
});

/****************** LAYER NAVIGATION ************************/
awMobile2.app.layerNavigation = Class.create(awMobile2.app.categoryNavigation, {
    initializeLayer: function(containerId) {
        //content main container
        this._containerId = containerId;

        this._type = null;

        //mask el id
        this._loaderElId = 'ajax_loader';

        //selected class
        this._isSelectedClassName = 'is-selected';

        //active filter
        this._currentFilter = new Array();

        //mobbile ajax request param
        this._observerRequestVar = 'aw_mobile2';
        Event.observe(window, 'load', function(e){
            this.startLnObservers();
        }.bind(this));
    },
    setType: function(type) {
        this._type = type;
    },
    _disableApplyButton: function() {
        if (this._applyButton && !this._applyButton.hasClassName('disabled')) {
            this._applyButton.addClassName('disabled');
        }
        return true;
    },
    _isApplyButtonDisabled: function() {
        if (this._applyButton && this._applyButton.hasClassName('disabled')) {
            return true;
        }
        return false;
    },
    _enableApplyButton: function() {
        if (this._applyButton && this._applyButton.hasClassName('disabled')) {
            this._applyButton.removeClassName('disabled');
        }
        return true;
    },
    startLnObservers: function() {
        //apply button
        this._applyButton = $$('#' + this._navMenuElid + ' .layer-apply-button').first();

        //element - select all
        this._allFilterElements = $$('#' + this._navMenuElid + ' .all');

        //parent menu items
        this._parentCategoryItems = $$('#' + this._navMenuElid + ' .nav__item--with-subcategory');

        //all filters
        this._filtres = new Array();

        this._clearAllFlag = false;

        this._allowToReload = false;

        //filters elements
        this._filterElements = $$('#' + this._navMenuElid + ' .filter__item');

        //filter by title
        this._filterByTitle = null;
        if ($$('#' + this._navMenuElid + ' .filter__current-parameter')) {
            this._filterByTitle = $$('#' + this._navMenuElid + ' .filter__current-parameter')[0];
        }

        //init clear all button
        this._clearFilterEl = null;
        if ($$('#' + this._navMenuElid + ' .js-filter-clear')) {
            this._clearFilterEl = $$('#' + this._navMenuElid + ' .js-filter-clear')[0];
            Quo(this._clearFilterEl).tap(function(e) {
                this._clearFilters();
            }.bind(this));
        }

        if ($$('#' + this._navMenuElid + ' .filter__item-clear').length) {
             $$('#' + this._navMenuElid + ' .filter__item-clear').each(function(el) {
                 Quo(el).tap(function(e) {
                     this._clearFilter(el);
                 }.bind(this));
             }.bind(this));
             if (this._clearFilterEl) {
                 this._clearFilterEl.show();
             }
        }

        //set event on filter tap
        if (this._filterElements) {
            this._filterElements.each(function(el) {
                if (Quo(el).attr('data-request-var')) {
                    this._filtres.push(el);
                    Quo(el).tap(function(e) {
                        if (!el.hasClassName(this._isSelectedClassName)) {
                            this._markFilter(el);
                        }
                    }.bind(this));
                }
            }.bind(this));
        }

        //apply button click
        if (!this._applyButton) {
            this._applyButton = this._backButton;
        }
        Quo($(this._applyButton)).tap(function(e){
            this.onApplyButtonClick();
        }.bind(this));


        //this._disableApplyButton();
        //set event on filter "All" tap
        if (this._allFilterElements) {
            //select all filters
            this._allFilterElements.each(function(el) {
                Quo(el).tap(function(e) {
                    this._unselectAll(el);
                }.bind(this));
            }.bind(this));
        }
        return true;
    },
    _unselectAll: function(el) {
        //check all filters
        var targetEl = el;
        while (targetEl) {
            if (targetEl.hasClassName('filter__item') && targetEl.hasClassName(this._isSelectedClassName)) {
                this._removeFilter(targetEl);
            }
            targetEl = targetEl.next();
        }
        return true;
    },
    _clearFilter: function(el) {
        this._currentFilter = new Array();
        this._currentFilter.push(el.up().up());
        this._back();
        return this._reload();
    },
    _clearFilters: function() {
        //this._disableApplyButton();
        this._clearFilterEl.hide();
        this._clearAllFlag = true;
        this._currentFilter = new Array();
        $$('#' + this._navMenuElid + ' li.' + this._isSelectedClassName).each(function(el) {
            el.removeClassName(this._isSelectedClassName);
        }.bind(this));

        this._clearFilterBreadcrumbs();
        this._back();
        return this._reload();
    },
    _markFilter: function(el) {
        //check/uncheck filter
        if (el.hasClassName(this._isSelectedClassName)) {
            this._removeFilter(el);
        } else {
            this._addFilter(el);
        }
        return true;
    },
    _removeFilter: function(el) {
        //uncheck filter
        el.removeClassName(this._isSelectedClassName);
        this._elForRemove = el;
        this._currentFilter.each(function(elem, index) {
            if (elem == this._elForRemove) {
                this._currentFilter.splice(index, 1);
            }
        }.bind(this));
        if (this._currentFilter.length == 0) {
            this._disableApplyButton();
        }
        return true;
    },
    _addFilter: function(el) {
        var targetEl = el.up().down();
        while (targetEl) {
            if (targetEl.hasClassName('filter__item') && targetEl.hasClassName(this._isSelectedClassName)) {
                this._removeFilter(targetEl);
            }
            targetEl = targetEl.next();
        }
        el.addClassName(this._isSelectedClassName);
        this._currentFilter.push(el);
        this._enableApplyButton();
        this._allowToReload = true;
        return true;
    },
    onBackNavigationClick: function() {
        this._clearFilterBreadcrumbs();
        this._addFilterBreadcrumbs();
        if (!this._applyButton) {
            this.onApplyButtonClick()
        } else {
            this._back();
            this._backButton.setStyle({display: "block"});
        }
    },
    _addFilterBreadcrumbs: function() {
        this._currentFilter.each(function(activeFilter) {
            this._parentCategoryItems.each(function(parentFilter) {
                if (Quo(activeFilter.up().up()).attr('data-parent-category') == Quo(parentFilter).attr('data-category')) {
                    var defaultOptionTitle = parentFilter.down().down().getAttribute('data-default-title');
                    parentFilter.down().down().innerHTML += '<span class="default-option-title">' + defaultOptionTitle + ': <span class="option-label">' + activeFilter.down().innerHTML + '</span>';
                }
            });
        }.bind(this));
        return true;
    },
    _clearFilterBreadcrumbs: function()
    {
        this._parentCategoryItems.each(function(parentEl) {
            parentEl.down().down().innerHTML = '';
        });
        return true;
    },
    onApplyButtonClick: function() {
        this._back();
        if (this._allowToReload) {
            this._reload();
        }
    },
    _reload: function() {
        if (this._currentFilter.length || this._clearAllFlag) {
            //reload category page
            this._showLoader();
            this._allowToReload = false;
            Quo.ajax({
                type: 'GET',
                url: window.location.href.split('?')[0],
                data: this._getRequestParams(),
                dataType: 'json',
                async: true,
                success: function(response) {
                    if ($(this._containerId)) {
                        this._updateProductList(response);
                        var url = this._getNewUrl();
                        window.history.pushState({}, 'New URL: ' + url, url);
                    }
                    this._hideLoader();
                    if (this._type == 'layer') {
                        this._updateLayer(response);
                        this.startObservers();
                        this.startLnObservers();
                    }
                }.bind(this),
                error: function(xhr, type) {
                }
            });
        }
        return true;
    },
    _getCallbackPrevMenu: function (el) {
        this._backMenuEl = el;
        var fn = function(e) {
            this._backMenuEl.removeClassName('is-shadow-showed');
            this._backMenuEl.stopObserving("webkitTransitionEnd", fn);
            this._backMenuEl.stopObserving("transitionend", fn);
            this._backMenuEl.stopObserving("oTransitionEnd", fn);
            this._backMenuEl.stopObserving("MSTransitionEnd", fn);
        }.bind(this);
        return fn;
    },
    _updateLayer: function(response) {
        if (response.layer) {
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = response.layer;
            tempDiv.down().next().addClassName('is-opened');
            $(this._navMenuElid).innerHTML = tempDiv.down().next().innerHTML;
            response.layer.evalScripts();
        }
        return true;
    },
    _updateProductList: function(response) {
        if (response.content) {
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = response.content;
            $(this._containerId).innerHTML = tempDiv.down().innerHTML;
            response.content.evalScripts();
        }
        return true;
    },
    _showLoader: function() {
        //show loader
        $(this._loaderElId).setStyle({display:'block'});
        return true;
    },
    _hideLoader: function() {
        //hide loader
        $(this._loaderElId).setStyle({display:'none'});
        return true;
    },
    _getRequestParams: function() {
        var request = {};
        var params = window.location.href.split('?')[1];
        if (params) {
            var pairs = params.split('&');
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i].split('=');
                if(this._clearAllFlag &&
                    (decodeURIComponent(pair[0]) == 'order' || decodeURIComponent(pair[0]) == 'dir' || decodeURIComponent(pair[0]) == 'q')
                ) {
                    request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
                }
                if (!this._clearAllFlag) {
                    request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
                }
            }
        }
        if (this._currentFilter.length && !this._clearAllFlag) {
            this._currentFilter.each(function(el) {
                request[Quo(el).attr('data-request-var')] = Quo(el).attr('value');
                if (Quo(el).attr('value') == '') {
                    delete request[Quo(el).attr('data-request-var')];
                }
            }.bind(request));
        }
        request[this._observerRequestVar] = true;
        /**if (this._clearAllFlag) {
            $$('#' + this._navMenuElid + ' .filter__item-clear').each(function(el) {
                delete request[Quo(el.up().up()).attr('data-request-var')];
            }.bind(request));
        }**/
        return request;
    },
    _getNewUrl: function() {
        var pairs = [];
        var requestParams = this._getRequestParams();
        delete requestParams[this._observerRequestVar];
        for (var key in requestParams) {
            if (requestParams.hasOwnProperty(key)) {
                pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(requestParams[key]));
            }
        }
        return window.location.href.split('?')[0] + '?' + pairs.join('&');
    }
    /**_animatePrevTitle: function(subcategoryEl) {
        if (this._filterByTitle) {
            this._filterByTitle.innerHTML = '';
        }
        return true;
    }**/
    /**_animateNextTitle: function (subcategoryEl) {
        this._applyButton.setStyle({display:'none'});
        this._backButton.setStyle({display:'block'});
        this._clearFilterBreadcrumbs();
        if (this._filterByTitle) {
            this._filterByTitle.innerHTML = subcategoryEl.innerHTML.trim();
        }
        return true;
    }**/
});

/****************** CUSTOMER ACCOUNT ************************/
awMobile2.app.customerAccount = Class.create({
    initialize: function(openElId, containerElId) {
        this._currentMenu = null;
        this._containerElId = containerElId;
        this._loaderElId = 'ajax_loader';
        this._openedClass = 'is-opened';
        this._loginFormId = false;
        this._forgotFormId = false;
        this._registerFormId = false;
        this._loginFormContainer = null;
        this._forgotFormContainer = null;
        this._registerFormContainer = null;
        this._forgotFormTitle = null;
        this._backButton = null;
        this._openElId = openElId;
        this._lock = false;
        Event.observe(window, 'load', function(e){
            this.startObservers();
            if (window.location.href.search('#account') != -1) {
                this.showMenu();
            }
        }.bind(this));
    },
    startObservers: function() {
        Quo($(this._openElId)).tap(function(e){
            this.showMenu();
        }.bind(this));
        if ($$('#' + this._containerElId + ' .js-close-panel').first()) {
            Quo($$('#' + this._containerElId + ' .js-close-panel').first()).tap(function(e){
                this.hideMenu();
            }.bind(this));
        }
        if ($$('#' + this._containerElId + ' .js-catalog-nav-back').first()) {
            this._backButton = $$('#' + this._containerElId + ' .js-catalog-nav-back').first();
            this._startObserverForBackLink();
        }
        return true;
    },
    showMenu: function() {
        if (this._lock) {
            return false;
        }
        this._lock = true;
        var fn = function(e) {
            $(this._containerElId).up().addClassName('customer-menu-no-transform');
            $(this._containerElId).up().style.top = '0';
            $(this._containerElId).up().style.opacity = '1';
            $(this._containerElId).up().removeClassName(this._openedClass);
            $(this._containerElId).up().stopObserving("webkitTransitionEnd", fn);
            $(this._containerElId).up().stopObserving("transitionend", fn);
            $(this._containerElId).up().stopObserving("oTransitionEnd", fn);
            $(this._containerElId).up().stopObserving("MSTransitionEnd", fn);
            setTimeout(function() {
                $(this._containerElId).up().removeClassName('customer-menu-no-transform');
                this._lock = false;
            }.bind(this),400);
        }.bind(this);

        $(this._containerElId).up().observe("webkitTransitionEnd", fn);
        $(this._containerElId).up().observe("transitionend", fn);
        $(this._containerElId).up().observe("oTransitionEnd", fn);
        $(this._containerElId).up().observe("MSTransitionEnd", fn);
        $(this._containerElId).up().addClassName(this._openedClass);
        return true;
    },
    _back: function() {
        this._animatePrevMenu();
        this._animatePrevTitle();
        this._currentMenu = null;
    },
    _animatePrevMenu: function() {
        var backMenu = this._loginFormContainer;
        backMenu.addClassName('js-active');
        backMenu.removeClassName('is-shadowed');
        var fn = function(e) {
            backMenu.removeClassName('is-shadow-showed');
            backMenu.stopObserving("webkitTransitionEnd", fn);
            backMenu.stopObserving("transitionend", fn);
            backMenu.stopObserving("oTransitionEnd", fn);
            backMenu.stopObserving("MSTransitionEnd", fn);
        }.bind(backMenu);

        backMenu.observe("webkitTransitionEnd", fn);
        backMenu.observe("transitionend", fn);
        backMenu.observe("oTransitionEnd", fn);
        backMenu.observe("MSTransitionEnd", fn);

        var currentMenu = $$('#' + this._containerElId + ' .is-opened.js-active').first();
        currentMenu.removeClassName('is-opened js-active');
        return true;
    },
    _animatePrevTitle: function() {
        var parentMenuTitle = $$('#' + this._containerElId + ' .panel-nav__title').first().getAttribute('data-default-title');
        var headerEl = $$('#' + this._containerElId + ' .panel-nav').first();
        headerEl.addClassName('is-animate-backward');

        this._backButton.addClassName('is-old');
        var cloneActionLeftEl = this._backButton.cloneNode(true);
        cloneActionLeftEl.removeClassName('is-old').addClassName('is-new');
        headerEl.appendChild(cloneActionLeftEl);
        cloneActionLeftEl.select(".panel-nav__action-label").first().update(parentMenuTitle);

        this._backButton = cloneActionLeftEl;

        this._startObserverForBackLink();

        this._backButton.setStyle({display: "none"});

        var navTitle = $$('#' + this._containerElId + ' .panel-nav__title').first();
        navTitle.addClassName('is-old');
        cloneNavTitle = navTitle.cloneNode(true);
        cloneNavTitle.update(parentMenuTitle);
        cloneNavTitle.removeClassName('is-old').addClassName('is-new');
        headerEl.appendChild(cloneNavTitle);

        this.titleResize($$('#' + this._containerElId + ' .panel-nav__title.is-new').first());

        var fn = function(e) {
            $$('#' + this._containerElId + ' .panel-nav .is-old').each(function(el){
                el.remove();
            });
            $$('#' + this._containerElId + ' .panel-nav .is-new').each(function(el){
                el.removeClassName('is-new');
            })
            headerEl.removeClassName('is-animate-backward');
            navTitle.stopObserving("webkitAnimationEnd", fn);
            navTitle.stopObserving("animationend", fn);
        }.bind(this);
        navTitle.observe("webkitAnimationEnd", fn);
        navTitle.observe("animationend", fn);
        return true;
    },
    login: function() {
        if (!this._loginFormId) {
            return false;
        }

        var validator = new Validation(this._loginFormId);
        if (validator.validate()) {
            $(this._loginFormId).submit();
        }
    },
    register: function() {
        if (!this._registerFormId) {
            return false;
        }

        var validator = new Validation(this._registerFormId);
        if (validator.validate()) {
            $(this._registerFormId).submit();
        }
    },
    forgot: function() {
        if (!this._forgotFormId) {
            return false;
        }

        var validator = new Validation(this._forgotFormId);
        if (validator.validate()) {
            $(this._forgotFormId).submit();
        }
    },
    setLoginForm: function(formId) {
        this._loginFormId = formId;
        if ($(this._loginFormId)) {
            $(this._loginFormId).observe('submit', function(event){this.login();Event.stop(event);}.bind(this));
            this._loginFormContainer = $$('#' + this._containerElId + ' .customer-account-login').first();
        }
        return true;
    },
    setForgotForm: function(formId) {
        this._forgotFormId = formId;
        if ($(this._forgotFormId)) {
            $(this._forgotFormId).observe('submit', function(event){this.restore();Event.stop(event);}.bind(this));
            this._forgotFormContainer = $$('#' + this._containerElId + ' .customer-account-forgotpassword').first();
        }
        return true;
    },
    setRegisterForm: function(formId) {
        this._registerFormId = formId;
        if ($(this._registerFormId)) {
            $(this._registerFormId).observe('submit', function(event){this.restore();Event.stop(event);}.bind(this));
            this._registerFormContainer = $$('#' + this._containerElId + ' .customer-account-register').first();
        }
        return true;
    },
    setRegisterTitle: function(title) {
        this._registerFormTitle = title;
        return true;
    },
    setForgotTitle: function(title) {
        this._forgotFormTitle = title;
        return true;
    },
    setForgotLink: function(elId) {
        if ($(elId)) {
            Quo($(elId)).tap(function(e){
                this.showForgotForm();
            }.bind(this));
        }
        return true;
    },
    setRegisterLink: function(elId) {
        if ($(elId)) {
            Quo($(elId)).tap(function(e){
                this._showRegisterForm();
            }.bind(this));
        }
        return true;
    },
    _showRegisterForm: function() {
        if (this._currentMenu != 'register') {
            this._currentMenu = 'register';
            this._animateNextMenu(this._registerFormContainer);
            this._animateNextTitle(this._registerFormTitle);
        }
        return true;
    },
    showForgotForm: function() {
        if (this._currentMenu != 'forgot') {
            this._currentMenu = 'forgot';
            this._animateNextMenu(this._forgotFormContainer);
            this._animateNextTitle(this._forgotFormTitle);
        }
        return true;
    },
    _animateNextMenu: function(el) {
        //animate menu
        if (el && this._loginFormContainer) {
            el.addClassName('is-opened js-active');
            this._loginFormContainer.addClassName('is-shadow-showed is-shadowed');
        }
        return true;
    },
    _startObserverForBackLink: function() {
        Quo(this._backButton).tap(function(e){
            this._back();
            Event.stop(e);
        }.bind(this));
        return true;
    },
    _animateNextTitle: function(title) {
        if (!title) {
            return false;
        }
        //animate title
        var headerEl = $$('#' + this._containerElId + ' .panel-nav').first();
        headerEl.addClassName('is-animate-forward');
        var currentTitleEl = $$('#' + this._containerElId + ' .panel-nav__title').first();
        var currentTitle = currentTitleEl.innerHTML.trim();
        this._backButton.setStyle({display: 'block'});
        this._backButton.addClassName('is-new');
        this._backButton.select(".panel-nav__action-label").first().update(currentTitle);

        currentTitleEl.addClassName('is-old');
        var cloneTitleEl = currentTitleEl.cloneNode(true);
        cloneTitleEl.update(title);
        cloneTitleEl.removeClassName('is-old').addClassName('is-new');

        headerEl.appendChild(cloneTitleEl);
        this.titleResize($$('#' +  this._containerElId + ' .panel-nav__title.is-new').first());

        var fn = function(e) {
            $$('#' + this._containerElId + ' .panel-nav .is-old').each(function(el){
                el.remove();
            });
            $$('#' + this._containerElId + ' .panel-nav .is-new').each(function(el){
                el.removeClassName('is-new');
            });
            headerEl.removeClassName('is-animate-forward');
            $$('#' + this._containerElId + ' .panel-nav__title').last().stopObserving("webkitAnimationEnd", fn);
            $$('#' + this._containerElId + ' .panel-nav__title').last().stopObserving("animationend", fn);
        }.bind(this);

        $$('#' + this._containerElId + ' .panel-nav__title').last().observe("webkitAnimationEnd", fn);
        $$('#' + this._containerElId + ' .panel-nav__title').last().observe("animationend", fn);
        return true;
    },
    hideMenu: function() {
        if (this._lock) {
            return false;
        }
        this._lock = true;
        var fn = function(e) {
            $(this._containerElId).up().addClassName('customer-menu-no-transform');
            $(this._containerElId).up().removeAttribute('style');
            $(this._containerElId).up().style.display = 'block';
            $(this._containerElId).up().removeClassName('customer-menu-transform');
            $(this._containerElId).up().removeClassName('customer-menu-no-transform');
            $(this._containerElId).up().stopObserving("webkitTransitionEnd", fn);
            $(this._containerElId).up().stopObserving("transitionend", fn);
            $(this._containerElId).up().stopObserving("oTransitionEnd", fn);
            $(this._containerElId).up().stopObserving("MSTransitionEnd", fn);
            this._lock = false;
        }.bind(this);

        $(this._containerElId).up().observe("webkitTransitionEnd", fn);
        $(this._containerElId).up().observe("transitionend", fn);
        $(this._containerElId).up().observe("oTransitionEnd", fn);
        $(this._containerElId).up().observe("MSTransitionEnd", fn);
        $(this._containerElId).up().addClassName('customer-menu-transform');
        return true;
    },
    titleResize: function(el) {
        var leftButton = el.up().select('[class*="action--left"]').first();
        if (el.hasClassName('is-new')) {
            leftButton = el.up().select('.panel-nav__action--left.is-new').first();
        }
        var rightButton = el.up().select('[class*="action--right"]').first();
        var leftButtonWidth = 0;
        if (leftButton) {
            leftButtonWidth = Math.max(leftButton.outerWidth(), 0);
        }
        var rightButtonWidth = 0;
        if (rightButton) {
            rightButtonWidth = Math.max(rightButton.outerWidth(), 0);
        }
        var margin = Math.max(leftButtonWidth, rightButtonWidth);

        el.setStyle({"left": margin + "px", "right": margin + "px", "text-align": "center"});
        var isTooLong = el.outerWidth() < el.scrollWidth;
        if (isTooLong) {
            if (leftButtonWidth < rightButtonWidth) {
                el.setStyle({"left": leftButtonWidth + "px", "text-align": "right"});
            } else {
                el.setStyle({"right": rightButtonWidth + "px", "text-align": "left"});
            }
        }
    }
});

/****************** POPUP ************************/
awMobile2.app.popup = Class.create({
    initialize: function() {
        this._headerEl = null;
    },
    open: function(el, headTitle, closeButtonTitle, callbackAfterClose, isAddContainerClasses) {
        //target element
        this._popupEl = el;

        //callback after close
        this._callbackAfterClose = callbackAfterClose;

        //is need to created container
        this._isAddContainerClasses = isAddContainerClasses;
        handleOrientation();

        //create popup header element
        this._headerEl = document.createElement('header');
        var h2El = document.createElement('h2');
        this._headerEl.setAttribute('class', 'panel-nav');
        var backButton = document.createElement('button');
        backButton.setAttribute('class', 'panel-nav__action panel-nav__action--left panel-nav__action--apply js-catalog-nav-back panel-nav__action--back');
        backButton.setStyle({display:'none'});
        backButton.innerHTML =  '<span class="panel-nav__action-label"></span>';
        this._headerEl.appendChild(backButton);
        h2El.setAttribute('class', 'panel-nav__title');
        h2El.innerHTML = headTitle;
        this._headerEl.appendChild(h2El);

        //create header close button
        var closeButton = document.createElement('button');
        closeButton.setAttribute('class', 'panel-nav__action panel-nav__action--right panel-nav__action--cancel js-close-panel');
        closeButton.setAttribute('type', 'button');
        closeButton.appendChild(document.createTextNode(closeButtonTitle));
        this._headerEl.appendChild(closeButton);

        //insert header element
        this._popupEl.up().up().insert(this._headerEl);
        this._popupEl.addClassName('popup');
        this._popupEl.up().up().setStyle({'display':'block'});
        //bug if iphone
        $$('.page-scroll-wrapper').each(function(el) {el.addClassName('no-scroll');});
        $$('.page-scroll').each(function(el) {el.addClassName('no-scroll');});

        if (el != $('product_gallery')) {
            this._popupEl.up().up().addClassName('is-opened');
        }

        //bind event on close popup
        Quo(closeButton).tap(function(e){
            this.close();
        }.bind(this));
        Quo(backButton).tap(function(e){
            this.close();
        }.bind(this));
        setTitleMargin(h2El);

        if (this._isAddContainerClasses) {
            this._popupEl.up().up().addClassName('panel--from-bottom');
            this._popupEl.up().addClassName('panel__container');
            this._popupEl.up().up().addClassName('panel');
        }
        return true;
    },
    close: function() {
        //timeout - waiting 0.4 sec until popup not hided
        this._popupEl.up().up().removeClassName('is-opened');
        $$('.page-scroll-wrapper').each(function(el) {el.removeClassName('no-scroll');});
        $$('.page-scroll').each(function(el) {el.removeClassName('no-scroll');});
        if (this._isAddContainerClasses) {
            this._popupEl.up().removeClassName('panel__container');
            //this._popupEl.up().up().removeClassName('add-to-cart-options');
            this._popupEl.up().up().removeClassName('panel');
            this._popupEl.up().up().removeClassName('panel--from-bottom');
        }
        this._popupEl.removeClassName('popup');
        this._popupEl.up().up().removeAttribute('style');
        //remove header element
        if (this._headerEl) {
            this._headerEl.remove();
            this._headerEl = null;
        }
        //callback
        this._callbackAfterClose();
        return true;
    }
});

/****************** Pager ************************/
awMobile2.app.pager = Class.create({
    initialize: function(buttonId, currentPage, lastPageNum) {
        this._currentPage = currentPage;
        this._lastPageNum = lastPageNum;
        this._buttonId = buttonId;
        this.containerId = null;
        this.tableId = null;
        this._pagerRequestVar = 'p';
        this._observerRequestVar = 'aw_mobile2';
        if (this._currentPage == this._lastPageNum) {
            $(this._buttonId).up().hide();
        }
        Quo($(this._buttonId)).tap(function(e){
            this.showNext();
        }.bind(this));
    },
    reInit: function(currentPageNum, lastPageNum) {
        this._currentPage = currentPageNum;
        this._lastPageNum = lastPageNum;
        if (this._currentPage == this._lastPageNum) {
            $(this._buttonId).up().hide();
        } else {
            $(this._buttonId).up().show();
            $(this._buttonId).removeClassName('disabled');
            $(this._buttonId).up().removeClassName('is-loading');
        }
    },
    showNext: function() {
        $(this._buttonId).addClassName('disabled');
        $(this._buttonId).up().addClassName('is-loading');
        Quo.ajax({
            type: 'GET',
            url: window.location.href.split('?')[0],
            data: this._getRequestParams(),
            dataType: 'json',
            async: true,
            success: function(response) {
                if ($(this.containerId) && response.content) {
                    var tempDiv = document.createElement('div');
                    tempDiv.innerHTML = response.content;
                    if (this.tableId) {
                        $(this.tableId).select('tbody').first().innerHTML = $(this.tableId).select('tbody').first().innerHTML + tempDiv.select('#' + this.tableId + ' tbody').first().innerHTML;
                    } else {
                        $(this.containerId).innerHTML = $(this.containerId).innerHTML + tempDiv.down().innerHTML;
                    }
                    response.content.evalScripts();
                }
            }.bind(this),
            error: function(xhr, type) {
                $(this._buttonId).removeClassName('disabled');
                $(this._buttonId).up().removeClassName('is-loading');
            }
        });
    },
    _getRequestParams: function() {
        var request = {};
        var params = window.location.href.split('?')[1];
        if (params) {
            var pairs = params.split('&');
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i].split('=');
                request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
            }
        }
        request[this._observerRequestVar] = true;
        request[this._pagerRequestVar] = this._currentPage + 1;
        return request;
    }
});

/****************** SHOPPING CART ************************/
awMobile2.app.shoppingCart = Class.create({
    initialize: function(openElId, containerElId) {
        this._containerEl = $(containerElId);
        this._openedClass = 'is-opened';
        Quo($(openElId)).tap(function(e){
            this.showMenu();
        }.bind(this));
        if ($$('#' + containerElId + ' .js-close-panel').first()) {
            Quo($$('#' + containerElId + ' .js-close-panel').first()).tap(function(e){
                this.hideMenu();
            }.bind(this));
        }
        Event.observe(window, 'load', function(e){
            if (window.location.href.search('#cart') != -1) {
                this.showMenu();
            }
        }.bind(this));
    },
    showMenu: function() {
        $(this._containerEl).up().addClassName(this._openedClass);
        return true;
    },
    hideMenu: function() {
        $(this._containerEl).up().removeClassName(this._openedClass);
        return true;
    }
});

/****************** ADD PRODUCT TO CART ************************/
awMobile2.app.ajaxAddProductToCart = Class.create(VarienForm, {
    sendRequest: function()
    {
        if (!this.validator.validate()) {
            return false;
        }
        if (!this._loaderElId) {
            this._loaderElId = 'ajax_loader';
        }
        this._showLoader();
        var options = {
            method: "post",
            parameters: this.form.serialize(true),
            onComplete: function(transport) {
                if (!transport.responseText.isJSON()) {
                    document.location.href = this.form.action;
                    return;
                }
                var json = transport.responseText.evalJSON();
                if (json.redirect_to) {
                    document.location.href = json.redirect_to;
                    return;
                }
                if (json.top_cart_qty) {
                    this._updateTopCartQty(json.top_cart_qty);
                }
                if (json.message_box) {
                    this._updateMessageBox(json.message_box);
                }
                if (json.cart) {
                    this._updateCart(json.cart);
                }
                this._hideLoader();
            }.bind(this)
        };
        new Ajax.Request(this.form.action, options);
        return true;
    },
    _updateTopCartQty: function(content) {
        if ($('shopping_cart')) {
            if (!$('shopping_cart').down()) {
                $('shopping_cart').innerHTML = $('shopping_cart').innerHTML + '<span class="items-in-cart">' + content + '</span>';
                $('shopping_cart').removeClassName('header__link--cart-empty');
            } else {
                $('shopping_cart').down().innerHTML = content;
            }
        }
        return true;
    },
    _updateMessageBox: function(content) {
        if ($('messages_product_view')) {
            $('messages_product_view').innerHTML = content;
            content.evalScripts();
        }
        return true;
    },
    _updateCart: function(content) {
        if ($('top_cart')) {
            $('top_cart').innerHTML = content;
            content.evalScripts();
        }
        return true;
    },
    _showLoader: function() {
        $(this._loaderElId).show();
        return true;
    },
    _hideLoader: function() {
        $(this._loaderElId).hide();
        return true;
    }
});

/****************** MEDIA GALLERY ************************/
awMobile2.app.mediaGallery = Class.create({
    initialize: function(galleryBlockId, gallerySliderBulletsBlockClass, fullModeTitle, fullModeCancelButtonTitle) {
        //main image gallery block
        this._galleryEl = $(galleryBlockId);

        this._popupCancelButtonTitle = fullModeCancelButtonTitle;

        //full screen popup title
        this._popupTitle = fullModeTitle;

        this._swipeStep = 300;
        this._swipeImgBulletStep = 67;

        //current block offset
        this._currentTransform = 0;

        this._currentImgBulletTransform = 0;

        //set full screen mode Off
        this._fullModeOn = false;

        //result X position after end of swiping
        this._lastSwipeTransformValue = 0;

        this._lastImgBulletSwipeTransformValue = 0;

        //current slider img index
        this._currentSlideIndex = 0;

        this._pinchingLock = false;

        //current zoom
        this.currentZoom = 1;

        this._maxZoom = 7;

        this._currentZoomTransformX
            = this._currentZoomTransformY
            = this._lastZommSwipeTransformValueX
            = this._lastZommSwipeTransformValueY = 0
        ;

        this._lastPinchTransformValue = 1;

        //popup object
        this.popup = null;

        //init slider bullets elements
        this._sliderBulletEl = null;

        this._sliderImageBulletElId = 'gallery_slider_bullets_img';

        if ($(this._sliderImageBulletElId)) {
            $(this._sliderImageBulletElId).select('div')[0].addClassName('active');
            //init gallery width
            var galleryWidth = ($(this._sliderImageBulletElId).select('img').length) * this._swipeImgBulletStep;
            $(this._sliderImageBulletElId).setStyle({width: galleryWidth + "px"});

            Quo($(this._sliderImageBulletElId)).swiping(function(e){
                this.swipingImgBullet(e);
            }.bind(this));
            Quo($(this._sliderImageBulletElId)).swipe(function(e){
                this.swipeImgBullet(e);
            }.bind(this));
            $$('#' + this._sliderImageBulletElId +' img').each(function(el, index) {
                Quo(el).tap(function(e){
                    this.tapImgBullet(index);
                }.bind(this));
            }.bind(this));
        }
        this._lockSwipeFlag = false;

        //init slider bullet elements
        if ($$(gallerySliderBulletsBlockClass)) {
            this._sliderBulletEl = $$(gallerySliderBulletsBlockClass);
            this._sliderBulletEl[0].addClassName('active');
            //this._sliderBulletEl[0].up().hide();
        }

        //init gallery width
        var galleryWidth = ($$('.product__gallery').first().select('img').length) * this._swipeStep;
        $$('.product__gallery').first().setStyle({width: galleryWidth + "px"});

        //set block horizontal offset
        Quo(this._galleryEl).swiping(function(e){
            this.swiping(e);
        }.bind(this));

        //init variables after end of swiping
        Quo(this._galleryEl).swipe(function(e){
            this.swipe(e);
        }.bind(this));

        //bind event on full screen mode
        $$('.product__gallery .product__gallery-image').each(function(el, index) {
            Quo(el).tap(function(e){
                this.tap(index);
            }.bind(this));
        }.bind(this));

        //bind event swipe left (full screen mode)
        Quo(this._galleryEl).swipeLeft(function(e){
            this.swipeLeft(e);
        }.bind(this));

        //bind event swipe right (full screen mode)
        Quo(this._galleryEl).swipeRight(function(e){
            this.swipeRight(e);
        }.bind(this));

        //bind event zooming (full screen mode)
        Quo(this._galleryEl).pinching(function(e){
            this.pinching(e);
        }.bind(this));

        //bind event zoom end (full screen mode)
        Quo(this._galleryEl).pinch(function(e){
            this.pinch(e);
        }.bind(this));

        window.addEventListener('orientationchange', function(){this.doOnOrientationChange();}.bind(this));
    },
    doOnOrientationChange: function() {
        if (!this._fullModeOn) {
            return;
        }
        this._galleryEl.select('.product__gallery-image').each(function(el) {
            var elHeight = window.innerHeight - $$('.gallery-container .panel-nav').first().getHeight()-$(this._sliderImageBulletElId).getHeight();

            el.setStyle({"width": window.innerWidth+"px", "height": elHeight+"px"});

            if (window.orientation == 0 || window.orientation == 180) {
                el.select('img').first().setStyle({"width": window.innerWidth+"px","height":"auto"});
            } else {
                el.select('img').first().setStyle({"width": "auto","height":elHeight + "px"});
            }
            el.select('img').first().setStyle({"margin-top":(elHeight - el.select('img').first().outerHeight())/2 + 'px'});
        }.bind(this));
        var galleryWidth = this._galleryEl.select('.product__gallery-image').length * window.innerWidth;
        this._galleryEl.setStyle({"width": galleryWidth+"px"});
        this._galleryEl.setStyle({'left': (window.innerWidth * this._currentSlideIndex * -1) + "px"});
    },
    swiping: function(e) {
        if (this._lockSwipeFlag || !this._canSwipe(e)) {
            return false;
        }

        //if full screen mode
        if (this._fullModeOn) {
            if (this.currentZoom > 1) {
                return this._swipingZoom(e);
            }
            return false;
        }
        e.preventDefault();
        this._stopScrollEvent();
        if (this._currentSwipeEffect) {
            this._currentSwipeEffect.cancel();
            this._currentSwipeEffect = null;
            return false;
        }

        //result image gallery block position on current swipe X position
        var x = e.currentTouch.x - e.iniTouch.x + this._currentTransform;

        this._lastSwipeTransformValue = x;

        //change image gallery block X position
        this._galleryEl.setStyle({left: x + "px"});
        return true;
    },
    swipingImgBullet: function(e)
    {
        e.preventDefault();
        this._stopScrollEvent();
        if (this._currentImgBulletSwipeEffect) {
            this._currentImgBulletSwipeEffect.cancel();
            this._currentImgBulletSwipeEffect = null;
            return false;
        }
        var x = e.currentTouch.x - e.iniTouch.x + this._currentImgBulletTransform;
        this._lastImgBulletSwipeTransformValue = x;

        //change image gallery block X position
        $(this._sliderImageBulletElId).setStyle({left: x + "px"});
        return true;
    },
    _applyZoomSwipe: function() {
        var currentSliderImg = this._galleryEl.select('img')[this._currentSlideIndex];

        //max allowed right offset
        var maxSwipeLeft = ((Quo(currentSliderImg).width() - document.body.clientWidth) / 2);
        this._lastZommSwipeTransformValueX = Math.min(this._lastZommSwipeTransformValueX, maxSwipeLeft);

        //max allowed left offset
        var maxSwipeRight = maxSwipeLeft + document.body.clientWidth - Quo(currentSliderImg).width();
        this._lastZommSwipeTransformValueX = Math.max(this._lastZommSwipeTransformValueX, maxSwipeRight);

        if (Quo(currentSliderImg).width() <= document.body.clientWidth) {
            this._lastZommSwipeTransformValueX = 0;
        }

        //max allowed right offset
        var maxSwipeTop = (Quo(currentSliderImg).height() - document.body.clientHeight) / 2;
        this._lastZommSwipeTransformValueY = Math.min(this._lastZommSwipeTransformValueY, maxSwipeTop);

        //max allowed bottom offset
        var maxSwipeBottom = maxSwipeTop + document.body.clientHeight - Quo(currentSliderImg).height();
        this._lastZommSwipeTransformValueY = Math.max(this._lastZommSwipeTransformValueY, maxSwipeBottom);

        if (Quo(currentSliderImg).height() <= document.body.clientHeight) {
            this._lastZommSwipeTransformValueY = 0;
        }

        if (this._lastPinchTransformValue == 1) {
            this._lastZommSwipeTransformValueY = this._lastZommSwipeTransformValueX = 0;
        }

        //change image gallery block X position
        currentSliderImg.setStyle({'left': this._lastZommSwipeTransformValueX + 'px'});
        currentSliderImg.setStyle({'top': this._lastZommSwipeTransformValueY + 'px'});
        return true;
    },
    _canSwipe: function(e) {
        var sensitivity = 30;
        if(navigator.userAgent.match(/Android/i)) {
            sensitivity = 5;
        }
        if (Math.abs(e.currentTouch.x - e.iniTouch.x) < sensitivity) {
            return false;
        }
        return true;
    },
    _swipingZoom: function(e) {
        if (this._lockSwipeFlag || Math.abs(e.currentTouch.x - e.iniTouch.x) < 30) {
            return false;
        }
        //reset transform x,y if zoom = 1
        if (this._lastPinchTransformValue == 1) {
            this._currentZoomTransformX = this._lastZommSwipeTransformValueX
                = this._currentZoomTransformY
                = this._lastZommSwipeTransformValueY = 0
            ;
        }
        //result image gallery block position on current swipe X position
        if (e.currentTouch.x != 'undefined' && e.iniTouch.x != 'undefined') {
            this._lastZommSwipeTransformValueX = e.currentTouch.x - e.iniTouch.x + this._currentZoomTransformX;
        }
        if (e.currentTouch.y != 'undefined' && e.iniTouch.y != 'undefined') {
            this._lastZommSwipeTransformValueY = e.currentTouch.y - e.iniTouch.y + this._currentZoomTransformY;
        }
        this._applyZoomSwipe();
        return true;

    },
    swipe: function(e) {
        if (this._lockSwipeFlag || !this._canSwipe(e)) {
            return false;
        }

        //if full screen mode
        if (this._fullModeOn) {
            if (this.currentZoom > 1) {
                return this._swipeZoom();
            }
            return false;
        }
        return this._swipeToNearlyImg();
    },
    swipeImgBullet: function(e) {
        //set step as image width like on apps
        //get width next img
        var nextImg = this._lastImgBulletSwipeTransformValue % this._swipeImgBulletStep;

        //init nearly img position
        if (nextImg < 0 && this._currentImgBulletTransform > this._lastImgBulletSwipeTransformValue) {
            this._lastImgBulletSwipeTransformValue = this._lastImgBulletSwipeTransformValue - (this._swipeImgBulletStep + nextImg);
        } else {
            this._lastImgBulletSwipeTransformValue = this._lastImgBulletSwipeTransformValue - nextImg;
        }

        this._calculateImgBulletMaxSwipe();

        this._currentImgBulletSwipeEffect = new Effect.Morph(this._sliderImageBulletElId, {
            style: 'left:' + this._lastImgBulletSwipeTransformValue + 'px',
            duration: 0.5,
            afterFinish: function(){
                this._continueScrollEvent();
                this._currentImgBulletSwipeEffect = null;
            }.bind(this)
        });
        //init variables after end of swipe
        this._currentImgBulletTransform = this._lastImgBulletSwipeTransformValue;
        return true;
    },
    _swipeToNearlyImg: function() {
        //set step as image width like on apps
        //get width next img
        var nextImg = this._lastSwipeTransformValue % this._swipeStep;

        //init nearly img position
        if (nextImg < 0 && this._currentTransform > this._lastSwipeTransformValue) {
            this._lastSwipeTransformValue = this._lastSwipeTransformValue - (this._swipeStep + nextImg);
        } else {
            this._lastSwipeTransformValue = this._lastSwipeTransformValue - nextImg;
        }

        this._calculateMaxSwipe();

        this._currentSwipeEffect = new Effect.Morph(this._galleryEl, {
            style: 'left:' + this._lastSwipeTransformValue + 'px',
            duration: 0.5,
            afterFinish: function(){
                this._continueScrollEvent();
                this._currentSwipeEffect = null;
            }.bind(this)
        });

        var index = 0;
        if (this._lastSwipeTransformValue != 0) {
            index = Math.abs(Math.round(this._lastSwipeTransformValue/this._swipeStep));
        }
        if ($(this._sliderImageBulletElId)) {
            $(this._sliderImageBulletElId).select('div').each(function(el){
                el.removeClassName('active');
            });
            $(this._sliderImageBulletElId).select('div')[index].addClassName('active');
        }

        this._sliderBulletEl.each(function(el){
            el.removeClassName('active');
        });
        this._sliderBulletEl[index].addClassName('active');

        //init variables after end of swipe
        this._currentTransform = this._lastSwipeTransformValue;
        return true;
    },
    _calculateMaxSwipe: function()
    {
        //max allowed left offset
        var maxSwipeLeft = $$('.gallery-container').first().getWidth() - this._galleryEl.getWidth();
        if(this._lastSwipeTransformValue < maxSwipeLeft) {
            this._lastSwipeTransformValue = maxSwipeLeft;
        }

        //max allowed right offset
        var maxSwipeRight = 0;
        if(this._lastSwipeTransformValue > maxSwipeRight) {
            this._lastSwipeTransformValue = maxSwipeRight;
        }
        return true;
    },
    _calculateImgBulletMaxSwipe: function()
    {
        //max allowed left offset
        var maxSwipeLeft = $(this._sliderImageBulletElId).select('img').first().getWidth() - $(this._sliderImageBulletElId).getWidth();
        if(this._lastImgBulletSwipeTransformValue < maxSwipeLeft) {
            this._lastImgBulletSwipeTransformValue = maxSwipeLeft;
        }

        //max allowed right offset
        var maxSwipeRight = 0;
        if(this._lastImgBulletSwipeTransformValue > maxSwipeRight) {
            this._lastImgBulletSwipeTransformValue = maxSwipeRight;
        }
        return true;
    },
    _swipeZoom: function() {
        this._applyZoomSwipe();
        //init variables after end of swipe
        this._currentZoomTransformX = this._lastZommSwipeTransformValueX;
        this._currentZoomTransformY = this._lastZommSwipeTransformValueY;
        return true;
    },
    switchViewModeToNormal: function() {
        if (!this._sliderBulletEl || !this._fullModeOn) {
            return false;
        }
        this._fullModeOn = false;

        var galleryWidth = ($$('.product__gallery').first().select('img').length) * this._swipeStep;
        this._galleryEl.setStyle({width: galleryWidth + "px"});

        //hide controls
       // this._sliderBulletEl[0].up().hide();
        this._galleryEl.select('.product__gallery-image').each(function(el) {
            el.removeClassName('full-screen');
            el.select('img').first().setStyle({
                'width': null,
                'height': null,
                'margin': null
            });
            el.setStyle({
                'width': null,
                'height': null
            });
            Quo(el.select('img').first()).vendor('transform', 'scale(1)');
        });

        this._popup = null;

        //init current view img after switch mode to normal
        var x = 0;
        if (this._currentSlideIndex) {
            x = -(this._currentSlideIndex * this._swipeStep);
        }
        this._galleryEl.setStyle({'left': x + 'px'});
        this._currentTransform = x;
        this._pinchingLock = false;
        this._continueScrollEvent();
        window.disableHideTopMenuBySwipe = false;
        showTopMenu();
        return true;
    },
    tap: function(index) {
        if (this._lockSwipeFlag) {
            return false;
        }

        if (!this._fullModeOn) {
            this.switchViewModeToFullScreen(index);
            return true;
        }
        return true;
    },
    tapImgBullet: function(index)
    {
        this.resetZoom();
        this._currentSlideIndex = index;
        this._slide();

    },
    switchViewModeToFullScreen: function(index) {
        if (!this._sliderBulletEl || this._fullModeOn) {
            return false;
        }
        this._fullModeOn = true;
        this._currentSlideIndex = index;

        //init popup
        this._popup = new awMobile2.app.popup();
        this._popup.open(this._galleryEl, this._popupTitle, this._popupCancelButtonTitle, function() {this.switchViewModeToNormal()}.bind(this), true);

        $$('.gallery-container')[0].select('button').each(function(el){
            el.removeAttribute('style');
        });
        var galleryWidth = this._galleryEl.select('.product__gallery-image').length * window.innerWidth;
        this._galleryEl.setStyle({"width": galleryWidth+"px"});
        //this._galleryEl.up().next().hide();

        //init slider bullet elements class
        var sliderBulletEl = this._sliderBulletEl;

        //setTimeout(function(){
            this._galleryEl.select('.product__gallery-image').each(function(el, elIndex) {
                el.addClassName('full-screen');
                var elHeight = window.innerHeight - $$('.gallery-container .panel-nav').first().getHeight()-$(this._sliderImageBulletElId).getHeight();

                el.setStyle({"width": window.innerWidth+"px", "height": elHeight+"px"});

                if (window.orientation == 0 || window.orientation == 180) {
                    el.select('img').first().setStyle({"width": window.innerWidth+"px","height":"auto"});
                } else {
                    el.select('img').first().setStyle({"width": "auto","height":elHeight + "px"});
                }

                el.select('img').first().setStyle({"margin-top":(elHeight - el.select('img').first().outerHeight())/2 + 'px'});
                sliderBulletEl[elIndex].removeClassName('active');
                if (elIndex == index) {
                    sliderBulletEl[elIndex].addClassName('active');
                }
            }.bind(this));
            this._galleryEl.setStyle({'left': (window.innerWidth * index * -1) + "px"});
        //}.bind(this), 800);
        hideTopMenu();
        window.disableHideTopMenuBySwipe = true;
        this._galleryEl.up().up().addClassName('is-opened');
        this._stopScrollEvent();
        return true;
    },
    swipeLeft: function() {
        if (!this._fullModeOn || this.currentZoom > 1) {
            return false;
        }
        this.resetZoom();
        //show next img
        this._currentSlideIndex += 1;
        this._currentSlideIndex = Math.min(
            this._currentSlideIndex, this._galleryEl.select('.product__gallery-image').length - 1
        );
        this._slide();
        return true;
    },
    resetZoom: function() {
        Quo(this._galleryEl.select('img')[this._currentSlideIndex]).vendor(
            'transform', 'scale(1)'
        );
        return true;
    },
    swipeRight: function() {
        if (!this._fullModeOn || this.currentZoom > 1) {
            return false;
        }
        this.resetZoom();
        //show prev img
        this._currentSlideIndex -= 1;
        this._currentSlideIndex = Math.max(this._currentSlideIndex, 0);
        this._slide();
        return true;
    },
    _slide: function()
    {
        if ($(this._sliderImageBulletElId)) {
            $(this._sliderImageBulletElId).select('div').each(function(el){
                el.removeClassName('active');
            });
            $(this._sliderImageBulletElId).select('div')[this._currentSlideIndex].addClassName('active');
        }

        var currentIndex = this._currentSlideIndex;
        var sliderBulletEl = this._sliderBulletEl;
        new Effect.Morph(this._galleryEl, {
            style: 'left:' + (currentIndex * window.innerWidth * -1) + "px",
            duration: 0.3
        });
        this._galleryEl.select('img').each(function(el, elIndex) {
            sliderBulletEl[elIndex].removeClassName('active');
            if (elIndex == currentIndex) {
                sliderBulletEl[elIndex].addClassName('active');
            }
        });
        this.currentZoom = this._lastPinchTransformValue = 1;
        return true;
    },
    pinching: function(e) {
        if (!this._fullModeOn || this._pinchingLock) {
            return false;
        }

        this._lockSwipeFlag = true;

        var initTouchDistance = Math.sqrt(
            Math.pow(e.iniTouch[1].x - e.iniTouch[0].x, 2) + Math.pow(e.iniTouch[1].y - e.iniTouch[0].y, 2)
        );
        var currentTouchDistance = Math.sqrt(
            Math.pow(e.currentTouch[1].x - e.currentTouch[0].x, 2)
                + Math.pow(e.currentTouch[1].y - e.currentTouch[0].y, 2)
        );

        this._lastPinchTransformValue = this.currentZoom + (currentTouchDistance - initTouchDistance) / 100;
        if (this.currentZoom == 1 && this._lastPinchTransformValue < 1) {
            this._popup.close();
            this._lockSwipeFlag = false;
            this._pinchingLock = true;
            return true;
        }
        this._lastPinchTransformValue = Math.max(this._lastPinchTransformValue, 1);
        this._lastPinchTransformValue = Math.min(this._lastPinchTransformValue, this._maxZoom);

        Quo(this._galleryEl.select('img')[this._currentSlideIndex]).vendor(
            'transform', 'scale(' + this._lastPinchTransformValue + ')'
        );
        this._swipeZoom();
        return true;
    },
    pinch: function(e) {
        if (!this._fullModeOn) {
            return false;
        }
        this._lockSwipeFlag = false;
        this.currentZoom = this._lastPinchTransformValue;
        return true;
    },
    _stopScrollEvent: function() {
        document.ontouchmove = function(event){
            event.preventDefault();
        };
        return true;
    },
    _continueScrollEvent: function() {
        document.ontouchmove = function(e){ return true; };
        return true;
    }
});
/****************** SEARCH BOX ************************/
awMobile2.app.searchBox = Class.create({
    _stopObserverFns : [],
    initialize: function(config) {
        this.config = config;
        var me = this;
        Event.observe(document, "dom:loaded", function(e){
            me.init();
            me.startObservers();
        });
    },
    init: function() {
        new awMobile2.app.AjaxAutocompleter(
            $$('.search-bar input').first(),
            $$('.search-bar .search-autocomplete').first(),
            this.config.url,
            {
                paramName: $$('.search-bar input').first().name,
                method: 'get',
                minChars: 3,
                indicator: $$('.search-autocomplete-indicator').first(),
                updateElement: function(element) {
                    if(element.title){
                        $$('.search-bar input').first().value = element.title;
                    }
                    $$('.search-bar').first().submit();
                },
                onShow : function(element, update) {
                    update.show();
                    update.up().show();
                },
                onHide: function(element, update) {
                    update.up().hide();
                    update.hide();
                }
            }
        );
    },
    startObservers: function() {
        var me = this;
        var submitButton = $$('.search-bar .form__submit').first();
        submitButton.setAttribute('disabled', 'true');
        //On options show
        var openPanelBtn = $$('.header__link--search').first();
        var openPanelFn = function(e){
            me.onOpenPanelClick();
            Event.stop(e);
        };
        this._stopObserverFns.push(function(){
            openPanelBtn.stopObserving('click', openPanelFn);
        });
        openPanelBtn.observe('click', openPanelFn);

        //Close panel
        var inputEl = $$('.search-bar .search-bar__textfield').first();
        var closePanelFn = function(e){
            if (inputEl.getValue().trim().length < 1) {
                me.onClosePanelClick();
            }
            Event.stop(e);
        };
        this._stopObserverFns.push(function(){
            inputEl.stopObserving('blur', closePanelFn);
        });
        Quo($$('.search-autocomplete-close').first()).tap(function(e){
            inputEl.value = '';
            inputEl.focus();
        }.bind(inputEl));

        inputEl.observe('keyup', function() {
            if (inputEl.value.length > 0) {
                $$('.search-autocomplete-close').first().setStyle({display: 'block'});
                submitButton.removeAttribute('disabled');
            } else {
                $$('.search-autocomplete-close').first().setStyle({display: 'none'});
                submitButton.setAttribute('disabled', 'true');
            }
        });
        inputEl.observe('blur', closePanelFn);
    },
    stopObservers: function() {
        this._stopObserverFns.each(function(fn){
            fn();
        });
        this._stopObserverFns = [];
    },
    onOpenPanelClick: function() {
        new Effect.Morph($$('.search-container').first(), {
            style: 'top:0',
            duration: 0.5,
            afterFinish: function(){
                $$('input').each(function(el){
                    el.setAttribute('disabled', 'true');
                });
                $$('select').each(function(el){
                    el.setAttribute('disabled', 'true');
                });
                $$('textarea').each(function(el){
                    el.setAttribute('disabled', 'true');
                });
                $$('checkbox').each(function(el){
                    el.setAttribute('disabled', 'true');
                });
                $$('.search-bar input').first().removeAttribute('disabled');
                $$('.search-bar .search-bar__textfield').first().focus();
            }
        });
    },
    onClosePanelClick: function() {
        $$('input').each(function(el){
            el.removeAttribute('disabled');
        });
        $$('select').each(function(el){
            el.removeAttribute('disabled');
        });
        $$('textarea').each(function(el){
            el.removeAttribute('disabled');
        });
        $$('checkbox').each(function(el){
            el.removeAttribute('disabled');
        });
        new Effect.Morph($$('.search-container').first(), {
            style: 'top:100%',
            duration: 0.3,
            afterFinish: function(){
                $$('.search-container').first().setStyle({'top': null});
            }
        });
    }
});
awMobile2.app.AjaxUpdater = Class.create({
    initialize: function(formId, url) {
        this._formId = formId;
        this._url = url;
        this._loaderElId = 'ajax_loader';
        if ($(this._formId)) {
            $(this._formId).onsubmit = function (event) {
                event.preventDefault();
                this.submit();
            }.bind(this);
        }
    },
    _showLoader: function() {
        $(this._loaderElId).show();
        return true;
    },
    _hideLoader: function() {
        $(this._loaderElId).hide();
        return true;
    },
    submit: function() {
        this._showLoader();
        var params = '';
        var url = this._url;
        if (this._formId && $(this._formId)) {
            params = $(this._formId).serialize();
            url = $(this._formId).action;
        }
        var options = {
            method: "post",
            postBody: params,
            onComplete: function(transport) {
                var impl    = document.implementation;
                var htmlDoc = impl.createHTMLDocument('');
                var responseText = transport.responseText.replace("<body>", "<main>");
                responseText = responseText.replace("</body>", "</main>");
                htmlDoc.body.innerHTML = responseText;
                document.body.innerHTML = htmlDoc.body.select('main').first().innerHTML;
                responseText.evalScripts();
                this.startObservers();
                this._hideLoader();
            }.bind(this)
        };
        new Ajax.Request(url, options);
    },
    startObservers: function() {
        if (typeof window.navigation != 'undefined') {
            window.navigation.startObservers();
        }
        if (typeof window.LayerNavigationFilter != 'undefined') {
            window.LayerNavigationFilter.startObservers();
            window.LayerNavigationFilter.startLnObservers();
        }
        if (typeof window.ToolbarNavigationFilter != 'undefined') {
            window.ToolbarNavigationFilter.startObservers();
            window.ToolbarNavigationFilter.startLnObservers();
        }
        if (typeof window.customerAccount != 'undefined') {
            window.customerAccount.startObservers();
        }
        FastClick.attach(document.body);
        window.disableHideTopMenuBySwipe = false;
        hideTopMenuBySwipe();
        handleOrientation();
        window.addEventListener('orientationchange', handleOrientation, false);
        $$('.panel--from-bottom').each(function(el) {
            el.setStyle({display:'block'});
        });
        if (typeof window.searchBox != 'undefined') {
            window.searchBox.init();
            window.searchBox.startObservers();
        }
        if ($(this._formId)) {
            $(this._formId).onsubmit = function (event) {
                event.preventDefault();
                this.submit();
            }.bind(this);
        }
        return true;
    }
});