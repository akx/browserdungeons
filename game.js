//if(!window.console) window.console = {log: function(){}};
var canvas, ctx;
var level;
var hero;
var actions = {
	"move se":	function(){return moveHero(+1,+1)},
	"move s":	function(){return moveHero(+0,+1)},
	"move sw":	function(){return moveHero(-1,+1)},
	"move w":	function(){return moveHero(-1,+0)},
	"action":	function(){return action()},
	"move e":	function(){return moveHero(+1,+0)},
	"move nw":	function(){return moveHero(-1,-1)},
	"move n":	function(){return moveHero(+0,-1)},
	"move ne":	function(){return moveHero(+1,-1)},
	"health":	function(){hero.drinkHealth()},
	"mana":		function(){hero.drinkMana()},
	"reveal":	function(){level.setAllDiscovered();update();draw()},
	"null":		null
};
var keymap = {
	99:		"move se", // kp3
	98:		"move s", // kp2
	97:		"move sw", // kp1
	100:	"move w", // kp4
	101:	"action", // kp5
	102:	"move e", // kp6
	103:	"move nw", // kp7
	104:	"move n", // kp8
	105:	"move ne", // kp9
	49:		"slot 1", // num1
	50:		"slot 2", // num2
	51:		"slot 3", // num3
	52:		"slot 4", // num4
	53:		"slot 5", // num3,
	72:		"health", // H
	77:		"mana", // M
	82:		"reveal",
	0:		null
};

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

function _underHero(p) {
	return (p.x == hero.x && p.y == hero.y);
}
var pickupUnderHero;

function update() {
	pickupUnderHero = _.detect(level.pickups, _underHero);
	if(pickupUnderHero && pickupUnderHero.canAutoPickup) {
		pickupUnderHero.onPickup(hero);
		level.remove(pickupUnderHero);
		pickupUnderHero = null;
	}
	for(var xx = -1; xx <= 1; xx++) {
		for(var yy = -1; yy <= 1; yy++) {
			if(level.discover(hero.x + xx, hero.y + yy)) {
				hero.xp ++;
			}
		}
	}
	if(hero.xp >= hero.levelXp) {
		hero.levelUp();
		addMessage(
			sprintf(rndc(
				"You feel %s stronger. Welcome to level %d!",
				"You feel %s smarter. Welcome to level %d!",
				"You feel %s prettier. Welcome to level %d!",
				"You feel %s more awesome. Welcome to level %d!"
			), rndc(
				"a little bit",
				"somewhat",
				"a teensy weensy bit",
				"much",
				"awesomely"
			), hero.level) +
			" " +
			sprintf("You're going to need <u>%d XP</u> to get to level %d.", hero.levelXp, hero.level + 1)
		);
	}
}

function keyPress(evt) {
	var key = evt.keyCode;
	var action = keymap[key];
	//log("Key:", key, "mapped to:", action);
	var func = actions[action];
	if(func) func();
}

function startGame() {
	var nao = (+new Date() * 1000);
	var gameId = (0 | nao);
	addMessage("Game ID " + gameId);
	MSeed(gameId);
	Marsaglia();
	hero = new Hero();
	newLevel();
	addMessage("Welcome, brave adventurer! You are a <u>" + hero.klass + "</u> of the <u>" + hero.getRaceAdj() + "</u> persuasion. Best of luck!");
	
	update();
	draw();
}

function addRandomMessage() {
	addMessage(rndc.apply(null, arguments));
}

function addMessage(message) {
	var logDiv = document.getElementById("log");
	var msgDiv = document.createElement("div");
	var nao = new Date;
	msgDiv.innerHTML = sprintf("<small>%02d:%02d:%02d.</small> %s", nao.getHours(), nao.getMinutes(), nao.getSeconds(), message);
	logDiv.appendChild(msgDiv);
	logDiv.scrollTop += 900;
}

function doubleSizeOn() {
	canvas.className = "doublesize";
	addMessage("Whoomph! Everything seems... bigger.");
}


function init() {
	writeHTML();
	canvas = document.getElementById("game");
	document.addEventListener("keyup", keyPress, false);
	ctx = canvas.getContext('2d');
	loadTiles();
	addMessage("If you like, <a href=\"#\" onclick=\"doubleSizeOn();return false\">click here</a> to enable 2x scaling.");
	
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