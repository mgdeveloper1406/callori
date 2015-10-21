/*
	This app will track calories.
	When you search for food, it will
	make an API call, and the turn that
	JSON response into a list of foods.

	When you click a food, it will be added
	to the list of food in your meal,
	and the total calories will update.
*/


var SearchBar = new SearchBar();
var SearchList = new SearchListView();
var Meal = new MealView();
