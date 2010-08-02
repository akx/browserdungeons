//if(!window.console) window.console = {log: function(){}};
var canvas, ctx;
var level;
var chars = [];
var hero = new Hero();
var pickups = [];

function newLevel() {
	level = new Level();
	level.generate();
	do {
		hero.x = irnd(0, level.w);
		hero.y = irnd(0, level.h);
	} while(level.get(hero.x, hero.y) != 0);
}

function draw() {
	for(var y = 0; y < level.h; y ++) {
		var cy = y * 20;
		for(var x = 0; x < level.w; x ++) {
			var cx = x * 20;
			if(!level.isDiscovered(x, y)) {
				ctx.fillStyle = "rgb(16,16,32)";
				ctx.fillRect(cx, cy, 20, 20);
				continue;
			}
			var tile = level.get(x, y);
			
			if(tile == 0) {
				ctx.drawImage(tiles.Dirt, cx, cy);
			} else if(tile == 1) {// normal wall
				ctx.drawImage(tiles.Wall, cx, cy);
			}
		}
	}
	hero.draw();
}

function init() {
	canvas = document.getElementById("game");
	ctx = canvas.getContext('2d');
	loadTiles();
	newLevel();
	draw();
}