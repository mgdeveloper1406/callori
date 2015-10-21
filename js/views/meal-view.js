//This view will handle the meal
var MealView = Backbone.View.extend({
	el: $('#meal'),

	initialize: function(){
		_.bindAll(this, 'render', 'addMealItemToList');

		this.collection = new Meal();
		this.listenTo(this.collection, 'add', this.addMealItemToList);
		this.listenTo(this.collection, 'remove', this.render);
	},

	//Updates the calorie total
	render: function(){
		if (!$(this.el).is(":visible")) {
			$(this.el).show('medium');
		}
		var total = 0;
		_.each(this.collection.models, function(model){
			total += model.attributes.nf_calories;
		});
		$(this.el).find('#total span').text(total);
	},

	//Creates a new meal item, adds it to the list, and calls render to update the total
	addMealItemToList: function(model){
		var view = new MealItemView({model: model});
		$('#mealTable > tbody').append(view.render().el);
		this.render();
	}
});