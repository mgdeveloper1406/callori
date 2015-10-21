//A view for each item in the meal
var MealItemView = Backbone.View.extend({
	tagName: 'tr',

	template: _.template($('#meal-item-template').html()),

	events: {
		'click #remove': 'removeMealItem'
	},

	initialize: function(){
		_.bindAll(this, 'render', 'removeMealItem');
	},

	render: function(){
		$(this.el).html( this.template(this.model.attributes) );
		return this;
	},

	// is there a better way to do this?
	removeMealItem: function(){
		Meal.collection.remove(this.model);
		this.remove();
	}
});