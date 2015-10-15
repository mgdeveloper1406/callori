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

		//Need to convert the API data into models
		parse: function(data) {
			return _.map(data.hits, function(hit) {
				return new Food(hit.fields, {parse: true});
			})
		},

		search: function(url) {
			this.url = url;
			this.fetch({reset: true});
		}
	});

	//This collection will manage the foods that we ate
	var MealFoods = Backbone.Collection.extend({
		model: Food
	});


	//This view will instantiate the search bar,
	//and will manage the overall list view
	var SearchList = Backbone.View.extend({
		el: $('.search'),

		events: {
			'click #searchButton': 'search',
			'keyup #searchField': 'checkForEnter'
		},

		initialize: function(){
			_.bindAll(this, 'render', 'search', 'resetSearchList', 'checkForEnter');

			this.collection = new SearchFoods();
			this.listenTo(this.collection, 'reset', this.resetSearchList);

			this.render();
		},

		render: function(){
			//This does nothing anymore, but I'm keeping it in case I want to change that.
		},

		//ask the collection to update based on the search term
		//this was all in here (this.collection.url = url; this.collection.fetch({reset:true})),
		//but it seemed like that should be a method on the collection.
		//Another way to do it would be to have the view fire an event when the search field is updated,
		//and have the collection listen for that event and take the neccesary action.
		search: function(){
			var url =
				'https://api.nutritionix.com/v1_1/search/' +
				$('#searchField').val() +
				'?fields=item_name%2Cbrand_name%2Cnf_calories&appId=58a3a103&appKey=fbcefe5014170fc55dd1fef3d0292a16'
			;
			this.collection.search(url);
		},

		//clear the list and repopulate with new items
		resetSearchList: function(){
			$('#searchResultsTable > tbody').html('');
			_.each(this.collection.models, function(model){
				var view = new SearchedFoodItem({model: model});
	   			$('#searchResultsTable > tbody').append( view.render().el );
			});
		},

		//not using a form, so we need to watch for the user pressing enter
		checkForEnter: function(event){
			if(event.keyCode == 13){
        		this.$("#searchButton").click();
    		}
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

	var Search = new SearchList;
	var Meal = new Meal;

})