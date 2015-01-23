var etsyData;

$.ajax({
	url: 'https://openapi.etsy.com/v2/listings/active.js?api_key=k5wgyyr0g9x1yeqfd5pqu8lk&keywords=dragon&includes=Images,Shop&limit=30',
	dataType: 'jsonp',
	success: function(data) {
		etsyData = data.results;
		console.log(etsyData.length);
		populatePage();
	}
});


var populatePage = function() {
	var container = $(".listings-content");
	var template = $("[data-template-name=listing-template]")[0].innerHTML;

	etsyData.forEach(function(item) {
		var shortTitle = (item.title.length > 30) ? (item.title.substr(0, 30) + '...') : item.title;
		var shortSeller = (item.Shop.shop_name.length > 20) ? ( item.Shop.shop_name.substr(0, 20) + '...') : item.Shop.shop_name;

		var listing =
			template
			.replace("<% img %>", "<img src='" + item.Images[0].url_170x135 + "'>")
			.replace("<% title %>", "<a href='#'>" + shortTitle + "</a>")
			.replace("<% seller %>", "<a href='#'>" + shortSeller + "</a>")
			.replace("<% price %>", "$" + item.price + " " + item.currency_code);
		container.append(listing);
	});
};
