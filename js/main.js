/*
	This app will track calories.
	When you search for food, it will
	make an API call, and the turn that
	JSON response into a list of foods.

	When you click a food, it will be added
	to the list of food in your meal,
	and the total calories will update.
*/

$(function(){
	'use strict';

	//Model for food items
	var Food = Backbone.Model.extend({

		//parse function to clean up the data a little bit
		parse: function(data) {
			var hash = data;
			//some of the calorie counts are decimals, which causes
			//rounding errors on the total.  Let's just round them off!
			hash.nf_calories = Math.ceil(hash.nf_calories);
			return hash;
		}

	});

	//This collection will manage the API call and response
	var SearchFoods = Backbone.Collection.extend({
		model: Food,
		url: '',

		initialize: function(){
			_.bindAll(this, 'parse', 'search')
		},

		//Need to convert the API data into models
		parse: function(data) {
			return _.map(data.hits, function(hit) {
				return new Food(hit.fields, {parse: true});
			})
		},

		search: function(searchTerm) {
			console.log('collection searching');
			console.log(this);
			this.url =
				'https://api.nutritionix.com/v1_1/search/' +
				searchTerm +
				'?fields=item_name%2Cbrand_name%2Cnf_calories&appId=58a3a103&appKey=fbcefe5014170fc55dd1fef3d0292a16';
			this.fetch({reset: true});
		}
	});

	//This collection will manage the foods that we ate
	var MealFoods = Backbone.Collection.extend({
		model: Food
	});

	//This view manages the search bar, and emits events when
	//the user initiates a search
	var SearchBar = Backbone.View.extend({
		el: $('#searchBar'),

		events: {
			'click #searchButton': 'initiateSearch',
			'keyup #searchField': 'checkForEnter'
		},

		initialize: function(){
			_.bindAll(this, 'checkForEnter', 'initiateSearch');
		},

		checkForEnter: function(event){
			if(event.keyCode == 13){
	    		this.$("#searchButton").click();
			}
		},

		initiateSearch: function(){
			console.log('search button clicked');
			this.trigger('search', $('#searchField').val());
		}
	});

	//This view manages the search results list
	var SearchList = Backbone.View.extend({
		el: $('#searchResults'),

		initialize: function(){
			_.bindAll(this, 'render', 'resetSearchList');

			//listen for the first time the collection resets
			this.listenToOnce(SearchBar, 'search', this.render);

			//make a collection
			this.collection = new SearchFoods();

			//listen for searches and tell the collection to fetch
			this.listenTo(SearchBar, 'search', this.collection.search);

			//listen to the collection and update on reset
			this.listenTo(this.collection, 'reset', this.resetSearchList);
		},

		render: function(){
			$(this.el).show('slow');
		},

		resetSearchList: function(){
			$('#searchResultsTable > tbody').html('');
			_.each(this.collection.models, function(model){
				var view = new SearchedFoodItem({model: model});
	   			$('#searchResultsTable > tbody').append( view.render().el );
			});
		}
	});

	//This view will handle all the searched food models
	var SearchedFoodItem = Backbone.View.extend({
		tagName: 'tr',

		template: _.template($('#food-search-template').html()),

		events: {
			'click #add': 'addToMeal'
		},

		intialize: function(){
			_.bindAll(this, 'render', 'addToMeal')
		},

		render: function(){
			$(this.el).html( this.template(this.model.attributes) );
			return this;
		},

		//Should views talk to unrelated collections like this??
		addToMeal: function(){
			Meal.collection.add(this.model.clone());
		}
	});

	//This view will handle the meal
	var Meal = Backbone.View.extend({
		el: $('#meal'),

		events: {

		},

		initialize: function(){
			_.bindAll(this, 'render', 'addMealItemToList');

			this.collection = new MealFoods();
			this.listenTo(this.collection, 'add', this.addMealItemToList);
			this.listenTo(this.collection, 'remove', this.render);
		},

		//Updates the calorie total
		render: function(){
			var total = 0;
			_.each(this.collection.models, function(model){
				total += model.attributes.nf_calories;
			});
			$(this.el).find('#total span').text(total);
		},

		//Creates a new meal item, adds it to the list, and calls render to update the total
		addMealItemToList: function(model){
			var view = new MealItem({model: model});
			$('#mealTable > tbody').append(view.render().el);
			this.render();
		}
	});

	//A view for each item in the meal
	var MealItem = Backbone.View.extend({
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
	})

	var SearchBar = new SearchBar();
	var SearchList = new SearchList();
	var Meal = new Meal();

})