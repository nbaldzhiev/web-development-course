$(function () { // Same as document.addEventListener("DOMContentLoaded"...

  // Same as document.querySelector("#navbarToggle").addEventListener("blur",...
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });
});

(function (global) {
	var dc = {};
	var homeHtml = "snippets/home-snippet.html";
	var allCategoriesUrl = "http://davids-restaurant.herokuapp.com/categories.json";
	var categoriesTitleHtml = "snippets/categories-title-snippet.html";
	var categoryHtml = "snippets/category-snippet.html";
	var menuItemsUrl = "http://davids-restaurant.herokuapp.com/menu_items.json?category=";
	var menuItemTitleHtml = "snippets/menu-items-title.html";
	var menuItemHtml = "snippets/menu-item.html";

	var insertHtml = function (selector, html) {
		var targetElem = document.querySelector(selector);
		targetElem.innerHTML = html;
	};

	var showLoading = function (selector) {
		var html = "<div class='text-center'>";
		html += "<img src='images/ajax-loader.gif'></div>";
		insertHtml(selector, html);
	};

	var insertProperty = function (string, propName, propValue) {
		var propToReplace = "{{" + propName + "}}";
		var result = string.replace(
			new RegExp(propToReplace, "g"), propValue
		);
		return result;
	};

	document.addEventListener("DOMContentLoaded", function (event) {
		showLoading("#main-content");
		$ajaxUtils.sendGetRequest(homeHtml, function (responseText) {
			insertHtml("#main-content", responseText);
		}, false);
	});

	dc.loadMenuCategories = function () {
		showLoading("#main-content");
		$ajaxUtils.sendGetRequest(
			allCategoriesUrl,
			buildAndShowCategoriesHTML
		);
	};

	dc.loadMenuItems = function (categoryShort) {
		showLoading("#main-content");
		$ajaxUtils.sendGetRequest(
			menuItemsUrl + categoryShort,
			buildAndShowMenuItemsHTML
		);
	};

	var buildAndShowCategoriesHTML = function (categories) {
		$ajaxUtils.sendGetRequest(
			categoriesTitleHtml,
			function (categoriesTitleHtml) {
				$ajaxUtils.sendGetRequest(
					categoryHtml,
					function (categoryHtml) {
						var categoriesViewHtml = buildCategoriesViewHtml(
							categories,
							categoriesTitleHtml,
							categoryHtml
						);
						insertHtml("#main-content", categoriesViewHtml);
					},
					false
				);
			},
			false
		);
	};

	var buildCategoriesViewHtml = function (categories, categoriesTitleHtml, categoryHtml) {
		var finalHtml = categoriesTitleHtml;
		finalHtml += "<section class='row'>";

		for (var i = 0; i < categories.length; i++) {
			var html = categoryHtml;

			var name = categories[i].name;
			var short_name = categories[i].short_name;
			html = insertProperty(html, "name", name);
			html = insertProperty(html, "short_name", short_name);

			finalHtml += html;
		}

		finalHtml += "</section>";
		return finalHtml;
	};

	var buildAndShowMenuItemsHTML = function (categoryMenuItems) {
		$ajaxUtils.sendGetRequest(
			menuItemTitleHtml,
			function (menuItemTitleHtml) {
				$ajaxUtils.sendGetRequest(
					menuItemHtml,
					function (menuItemHtml) {
						var menuItemsViewHtml = buildMenuItemsViewHtml(
							categoryMenuItems,
							menuItemTitleHtml,
							menuItemHtml
						);
						insertHtml("#main-content", menuItemsViewHtml);
					},
					false
				)
			},
			false
		);
	};

	var buildMenuItemsViewHtml = function (categoryMenuItems, menuItemTitleHtml, menuItemHtml) {
		var finalHtml = insertProperty(menuItemTitleHtml, "name", categoryMenuItems.category.name);
		finalHtml = insertProperty(
			finalHtml, "special_instructions", categoryMenuItems.category.special_instructions
		);
		finalHtml += "<section class='row'>";

		var menuItems = categoryMenuItems.menu_items;
		var catShortName = categoryMenuItems.category.short_name;
		for (var i = 0; i < menuItems.length; i++) {
			var html = menuItemHtml;

			html = insertProperty(html, "catShortName", catShortName);
			html = insertProperty(html, "short_name", menuItems[i].short_name);
			html = insertItemPrice(html, "price_small", menuItems[i].price_small);
			html = insertItemPrice(html, "price_large", menuItems[i].price_large);
			html = insertItemPortionName(html, "small_portion_name", menuItems[i].small_portion_name);
			html = insertItemPortionName(html, "large_portion_name", menuItems[i].large_portion_name);
			html = insertProperty(html, "name", menuItems[i].name);
			html = insertProperty(html, "description", menuItems[i].description);

			if (i % 2 != 0) {
      			html += "<div class='clearfix visible-lg-block visible-md-block'></div>";
			}

			finalHtml += html;
		}
		finalHtml += "</section>";
		return finalHtml;
	};

	function insertItemPrice (html, pricePropName, priceValue) {
		if (!priceValue) {
			return insertProperty(html, pricePropName, "");
		}
		priceValue = "$" + priceValue.toFixed(2);
		return insertProperty(html, pricePropName, priceValue);
	}

	function insertItemPortionName (html, portionPropName, portionValue) {
		if (!portionValue) {
			return insertProperty(html, portionPropName, "");
		}
		portionValue = "(" + portionValue + ")";
  		return insertProperty(html, portionPropName, portionValue);
	}

	global.$dc = dc;

})(window);
