//This view will handle all the searched food models
var SearchedFoodItemView = Backbone.View.extend({
	tagName: 'tr',

	template: _.template($('#food-search-template').html()),

	events: {
		'click #add': 'addToMeal'
	},

	intialize: function(){
		_.bindAll(this, 'render', 'addToMeal');
	},

	render: function(){
		$(this.el).html( this.template(this.model.attributes) );
		return this;
	},

	//Should views talk to unrelated views/collections like this??
	addToMeal: function(){
		Meal.collection.add(this.model.clone());
	}
});