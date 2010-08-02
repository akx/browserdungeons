var LevelObj = Base.extend({
	tileName:	null,
	constructor: function() {
		this.x = this.y = 0;
	},
	draw: function() {
		if(this.tileName) ctx.drawImage(tiles[this.tileName], this.screenX(), this.screenY());
	},
	screenX: function() {
		return this.x * 20;
	},
	screenY: function() {
		return this.y * 20;
	},
	
	placeAt: function(lo) {
		this.x = lo.x;
		this.y = lo.y;
		return this;
	}
});
