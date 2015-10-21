//This view manages the search bar, and emits events when
//the user initiates a search
var SearchBarView = Backbone.View.extend({
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
		this.trigger('search', $('#searchField').val());
	}
});