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