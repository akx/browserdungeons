var LevelObj = Base.extend({
	constructor: function() {
		this.x = this.y = 0;
	},
	draw: function() {
		
	},
	screenX: function() {
		return this.x * 20;
	},
	screenY: function() {
		return this.y * 20;
	}
});
