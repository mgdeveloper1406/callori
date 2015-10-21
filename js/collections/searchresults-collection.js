//This collection will manage the API call and response
var SearchResults = Backbone.Collection.extend({
	model: Food,
	url: '',

	initialize: function(){
		_.bindAll(this, 'parse', 'search');
	},

	//Need to convert the API data into models
	parse: function(data) {
		return _.map(data.hits, function(hit) {
			return new Food(hit.fields, {parse: true});
		});
	},

	search: function(searchTerm) {
		this.url =
			'https://api.nutritionix.com/v1_1/search/' +
			searchTerm +
			'?fields=item_name%2Cbrand_name%2Cnf_calories&appId=58a3a103&appKey=fbcefe5014170fc55dd1fef3d0292a16';
		this.fetch({reset: true});
	}
});