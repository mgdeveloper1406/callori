//This view manages the search results list
var SearchResultsView = Backbone.View.extend({
	el: $('#searchResults'),

	initialize: function(){
		_.bindAll(this, 'render', 'resetSearchList');

		//listen for the first time the collection resets
		this.listenToOnce(SearchBar, 'search', this.render);

		//make a collection
		this.collection = new SearchResults();

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
			var view = new SearchedItemView({model: model});
   			$('#searchResultsTable > tbody').append( view.render().el );
		});
	}
});