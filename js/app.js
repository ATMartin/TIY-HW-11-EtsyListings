var etsyData;

var urlRaw = 'https://openapi.etsy.com/v2/listings/active.js?api_key=k5wgyyr0g9x1yeqfd5pqu8lk&keywords=dragon&includes=Images,Shop&limit=30';
var urlScore = 'https://openapi.etsy.com/v2/listings/active.js?api_key=k5wgyyr0g9x1yeqfd5pqu8lk&keywords=dragon&includes=Images,Shop&limit=30&sort_on=score';
var urlPrice = 'https://openapi.etsy.com/v2/listings/active.js?api_key=k5wgyyr0g9x1yeqfd5pqu8lk&keywords=dragon&includes=Images,Shop&limit=30&sort_on=price';

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

var replaceText = function(text, data) {

};

var populatePage = function(marketSection, myData) {
	var container = $(".listings-content");
	var template = $("[data-template-name=listing-template]")[0].innerHTML;

	container.empty();
	myData.forEach(function(item) {
		if (marketSection != "all")
		{
			item.marketSections = determineMarketSections(item);
			if (item.marketSections.indexOf(marketSection) == -1) {
				return;
			}
		}
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

var addToCategoryList = function(item) {

};

$('.radio').on('click', function(e) {
	$('.radio').removeAttr('selected');
	$(this).attr('selected', true);
	populatePage($(this).attr('data-value'));
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
