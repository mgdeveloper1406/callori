/*
	This app will track calories.
	When you search for food, it will
	make an API call, and the turn that
	JSON response into a list of foods.

	When you click a food, it will pop
	over to the list of food in your meal,
	and the total calories will update.
*/

// All our foods will be the same model
var Food = Backbone.Model.extend({

	defaults: {

	}

});

//This collection will manage the API call and response
var SearchFoods = Backbone.Collection.extend({
	model: Food,
	url: '',
	parse: function(data) {
		return _.map(data.hits, function(model) {
			return model;
		})
	}
});

//This collection will manage the foods that we ate
var MealFoods = Backbone.Collection.extend({
	model: Food
});

//This view will instantiate the search bar,
//and will manage all the overall list view
var SearchList = Backbone.View.extend({
	el: $('#search'),

	events: {
		'click button#searchButton': 'search'
	},

	initialize: function(){
		_.bindAll(this, 'render', 'search');

		this.collection = new SearchFoods();
		this.listenTo(this.collection, 'reset', this.resetSearchList);

		this.render();
	},

	render: function(){
		$(this.el).append("<input type='text' id='searchField'></input>")
		$(this.el).append("<button id='searchButton'>Search!</button>");
		$(this.el).append("<ul id='search-food-list'></ul>");
	},

	search: function(){
		var searchTerm = $('#searchField').val();
		this.collection.url =
			'https://api.nutritionix.com/v1_1/search/' +
			searchTerm +
			'?fields=item_name%2Cbrand_name%2Cnf_calories&appId=58a3a103&appKey=fbcefe5014170fc55dd1fef3d0292a16'
		;
		this.collection.fetch({reset: true});
	},

	resetSearchList: function(){
		_.each(this.collection.models, function(model){
			var view = new SearchedFood({model: model});
   			$('#search-food-list').append( view.render().el );
		})
	}
});

//This view will handle all the searched food models
var SearchedFood = Backbone.View.extend({
	tagName: 'li',

	template: _.template($('#food-search-template').html()),

	events: {
		'click #add': 'addToMeal'
	},

	intialize: function(){
		_.bindAll(this, 'render', 'addToMeal')
	},

	render: function(){
		$(this.el).html( this.template (this.model.attributes.fields) );
		console.log($(this.el).html());
		return this;
	}
});

//This view will handle the meal
var Meal = Backbone.View.extend({
	el: $('#meal'),

	events: {

	},

	intialize: function(){
		_.bindAll(this, 'render', 'addToMeal')

		this.collection = new MealFoods();
		this.listenTo(this.collection, add, this.addToMeal)
	}
});

var app = new SearchList;