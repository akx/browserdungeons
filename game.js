//if(!window.console) window.console = {log: function(){}};
var canvas, ctx;
var level;
var chars = [];
var hero = new Hero();
var pickups = [];
var keymap = {
	99:		function(){return moveHero(+1,+1)}, // kp3
	98:		function(){return moveHero(+0,+1)}, // kp2
	97:		function(){return moveHero(-1,+1)}, // kp1
	100:	function(){return moveHero(-1,+0)}, // kp4
	101:	function(){return action()}, // kp5
	102:	function(){return moveHero(+1,+0)}, // kp6
	103:	function(){return moveHero(-1,-1)}, // kp7
	104:	function(){return moveHero(+0,-1)}, // kp8
	105:	function(){return moveHero(+1,-1)}, // kp9
}

function newLevel() {
	level = new Level();
	level.generate();
	do {
		hero.x = irnd(0, level.w);
		hero.y = irnd(0, level.h);
	} while(level.get(hero.x, hero.y) != 0);
}

function moveHero(dx, dy) {
	var tile = level.get(hero.x + dx, hero.y + dy);
	if(tile == 0) {
		hero.x += dx;
		hero.y += dy;
		update();
		draw();
	} else {
		addRandomMessage(
			"You bravely dash forth, daring the unknown dangers of the dungeon... and bump headfirst into a wall. Well played.",
			"You have to be a ghost to walk through walls. It's easier to become one than you think, though...",
			"Fighting a wall? Clever.",
			"That's not a monster, that's a wall.",
			"Uh... tried casting the \"remove wall\" spell <i>first</i>?"
		);
	}
}

function update() {
	for(var xx = -1; xx <= 1; xx++)for(var yy = -1; yy <= 1; yy++)level.discover(hero.x + xx, hero.y + yy);
}

function draw() {
	for(var y = 0; y < level.h; y ++) {
		var cy = y * 20;
		for(var x = 0; x < level.w; x ++) {
			var cx = x * 20;
			if(!level.isDiscovered(x, y)) {
				var dst = Math.sqrt((x - hero.x) * (x - hero.x) + (y - hero.y) * (y - hero.y));
				var light = Math.max(0, 0 | (64 - dst * 5));
				ctx.fillStyle = "rgb("+light+","+light+","+light+")";
				ctx.fillRect(cx, cy, 20, 20);
				continue;
			}
			var tile = level.get(x, y);
			ctx.drawImage((tile == 0 ? tiles.Dirt : tiles.Wall), cx, cy);
		}
	}
	hero.draw();
}

function keyPress(evt) {
	var key = evt.keyCode;
	var func = keymap[key];
	if(func) func();
}

function startGame() {
	newLevel();
	update();
	draw();
}

function addRandomMessage() {
	addMessage(arguments[irnd(0, arguments.length)]);
}

function addMessage(message) {
	var logDiv = document.getElementById("log");
	var msgDiv = document.createElement("div");
	var nao = new Date;
	msgDiv.innerHTML = sprintf("[%02d:%02d:%02d]: %s", nao.getHours(), nao.getMinutes(), nao.getSeconds(), message);
	logDiv.appendChild(msgDiv);
	logDiv.scrollTop = 9000;
}

function init() {
	canvas = document.getElementById("game");
	document.addEventListener("keyup", keyPress, false);
	ctx = canvas.getContext('2d');
	loadTiles();
	
	var waitForTileLoad;
	(waitForTileLoad = function() {
		if(allTilesLoaded) {
			startGame();
		} else {
			setTimeout(waitForTileLoad, 150);
		}
	})();
}
window["init"] = init;