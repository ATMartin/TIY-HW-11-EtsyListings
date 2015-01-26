var etsyData;
var query = 'dragon';
var urlRaw = 'https://openapi.etsy.com/v2/listings/active.js?api_key=k5wgyyr0g9x1yeqfd5pqu8lk&keywords='+ query +'&includes=Images,Shop&limit=30';
var urlScore = 'https://openapi.etsy.com/v2/listings/active.js?api_key=k5wgyyr0g9x1yeqfd5pqu8lk&keywords=' + query + '&includes=Images,Shop&limit=30&sort_on=score';
var urlPrice = 'https://openapi.etsy.com/v2/listings/active.js?api_key=k5wgyyr0g9x1yeqfd5pqu8lk&keywords=' + query + '&includes=Images,Shop&limit=30&sort_on=price';

var loadData = function(urlSource) {
$.ajax({
	url: urlSource,
	dataType: 'jsonp',
	success: function(data) {
		etsyData = data.results;
		console.log(etsyData.length);
		populatePage("all", etsyData);
	}
});
}

$(document).ready(function() { loadData(urlRaw); });

var categories = {
		'Handmade': [],
		'Vintage': [],
		'Supplies': []
	};

var populatePage = function(marketSection, myData) {
	var container = $(".listings-content");
	var template = $("[data-template-name=listing-template]")[0].innerHTML;
  
	container.empty();
  categories = {
		'Handmade': [],
		'Vintage': [],
		'Supplies': []
	};
	myData.forEach(function(item) {
		item.marketSections = determineMarketSections(item);
		if (marketSection != "all" && item.marketSections.indexOf(marketSection) == 1) { return; };
		
		getCategories(item);

		var shortTitle = (item.title.length > 30) ? (item.title.substr(0, 30) + '...') : item.title;
		var shortSeller = (item.Shop.shop_name.length > 20) ? ( item.Shop.shop_name.substr(0, 20) + '...') : item.Shop.shop_name;

		var listing =
			template
			.replace("<% img %>", "<img src='" + item.Images[0].url_170x135 + "'>")
			.replace("<% title %>", "<a href='" + item.url.split('?')[0] + "'>" + shortTitle + "</a>")
			.replace("<% seller %>", "<a href='" + item.Shop.url.split('?')[0] + "'>" + shortSeller + "</a>")
			.replace("<% price %>", "$" + item.price + " " + item.currency_code);
		container.append(listing);
	});

	renderCategories(categories);
};

var determineMarketSections = function(item) {
	var marketSections = [];
	var vintageYears = ['before_1996', '1990_1995', '1980s', '1970s', '1960s', '1950s', '1940s', '1930s', '1920s', '1910s', '1900s', '1800s', '1700s', 'before_1700']
	if (item.who_made == 'i_did' || !item.used_manufacturer) {
		marketSections.push('Handmade');
	}
	if (vintageYears.indexOf(item.when_made) > -1) {
		marketSections.push('Vintage');
	}
	if (item.is_supply == "true") {
		marketSections.push('Supplies');
	}
	return marketSections;
};

var getCategories = function(item) {
	if (item.marketSections == []) { return; }
	item.marketSections.forEach(function(section) {
		item.category_path.forEach(function(category) {
			if (categories[section].indexOf(category) == -1) { categories[section].push(category); }	
		});	
	});
};

var renderCategories = function(categories) {
	var $rootEl = $('.sidebar-categories'),
			rootUrl = 'http://www.etsy.com/search/',
			myList = "";
  
	$rootEl.empty();	
	Object.keys(categories).forEach(function(i) {
		if (categories[i] == []) { return; }
		myList += "<h4><a href='" + rootUrl + i + "?q=" + query + "'>" + i + "</a></h4><ul>";
		categories[i].forEach(function(subcat) {
			myList += "<li><a href='" + rootUrl + i + "/" + subcat + "?q=dragon'>" + subcat + "</a></li>";
		});
		myList += "</ul>"
	});

	$rootEl.append(myList);


};

$('.radio').on('click', function(e) {
	$('.radio').removeAttr('selected');
	$(this).attr('selected', true);
	populatePage($(this).attr('data-value'), etsyData);
});

$('.sorter').on('click', function(e) {
	$('.sort-panel').toggle();
});

$('.sort').on('click', function(e) {
	$('.sort').removeAttr('selected');
	$(this).attr('selected', true);
	$('.current-sort').text($(this).text());
	switch ($(this).data('value')) {
		case 'created':
			loadData(urlRaw);
			break;
		case 'price-high':
			populatePage('all', etsyData.sort(function(a,b) { return a.price - b.price; }));	
			break;
		case 'price-low':
			populatePage('all', etsyData.sort(function(a,b) { return b.price - a.price; }));
			break;
		case 'score':
			loadData(urlScore);
			break;
	};
});

$('.submitSearch').on('click', function(e) {
	query = $('#search').val();
	urlRaw = 'https://openapi.etsy.com/v2/listings/active.js?api_key=k5wgyyr0g9x1yeqfd5pqu8lk&keywords='+ query +'&includes=Images,Shop&limit=30';
	urlScore = 'https://openapi.etsy.com/v2/listings/active.js?api_key=k5wgyyr0g9x1yeqfd5pqu8lk&keywords=' + query + '&includes=Images,Shop&limit=30&sort_on=score';
	urlPrice = 'https://openapi.etsy.com/v2/listings/active.js?api_key=k5wgyyr0g9x1yeqfd5pqu8lk&keywords=' + query + '&includes=Images,Shop&limit=30&sort_on=price';

	loadData(urlRaw);
});
