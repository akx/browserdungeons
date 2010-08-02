var canvas, ctx;
var level;
var hero;
var debug;
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
	"health":	function(){hero.drinkHealth();update();draw()},
	"mana":		function(){hero.drinkMana();update();draw()},
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
	level.placeRandomly(hero);
	
}

function fight(p1, p2) {
	_.each((p1.level >= p2.level ? [[p1, p2], [p2, p1]] : [[p2, p1], [p1, p2]]), function(pair) {
		var attacker = pair[0];
		var defender = pair[1];
		if(attacker.health <= 0) return;
		var dmg = attacker.rollDamage();
		var dmgType = attacker.getDamageType();
		var dmgTaken = defender.dealDamage(dmg, dmgType);
		var msg = sprintf(
			"The %s %s the %s for <u>%d</u> %s damage!",
			attacker.name,
			rndc("thwonks", "zaps", "hits", "smashes", "bonks", "splats"),
			defender.name,
			dmgTaken,
			dmgType
		);
		addMessage(msg);
	});
	//addMessage(sprintf("(%s HP: %d, %s HP: %d)", p1.name, p1.health, p2.name, p2.health));
}

function youDie() {
	hero.isDead = true;
	hero.health = 0;
	addRandomMessage(
		"Unfortunately it seems that you've run out of life.",
		sprintf(
			"Whoops! There was a horrible accident involving %s and %s...",
			rndc("an axe", "a barrage of magic", "mystical forces", "a sharp blade", "something very nasty", "a beguilingly cute little kitten"),
			rndc("yourself", "your lovely visage", "your abdomen (yes, those are your guts)")
		),
		"Aherm... you sort of kicked the bucket there. Better luck next time, eh?"
	);
	addMessage("Care for another try? <a href=\"#\" onclick=\"startGame();return false\">Click-clickety-click!</a>");
	
}

function moveHero(dx, dy) {
	if(hero.isDead) {
		addRandomMessage(
			"You're dead. You can't really move around much.",
			"You're not a ghost, you know.",
			"Hey, it's not like I wanted you to die. <small>Well, maybe I did. A little.</small>",
			"Um... you <i>do</i> realize you're lying there in a pool of your own intestines, don't you?"
		);
		return;
	}
	var newX = hero.x + dx, newY = hero.y + dy;
	var tile = level.get(newX, newY);
	var character = level.objectInTile(newX, newY, "Character");
	if(character) {
		fight(hero, character);
		if(character.health < 1) {
			level.add(new BloodDoodad().placeAt(character));
			var xpGain = Math.ceil((character.level + (Math.max(0, character.level - hero.level) + 1) * 3) * 18.773);
			addMessage("The " + character.name + " is " + rndc("dead", "vanquished", "smashed into tiny bits", "an icky pool on the floor", "mush") + "! Hooray! The hero (that's you) gains <u>" + xpGain + "</u> XP!");
			if(hero.health <= 0) {
				addMessage("Second wind! (You almost died there...)");
				hero.health = 1;
			}
			hero.xp += xpGain;
			level.remove(character);
		}
		update();
		draw();
		return;
	}
	if(tile == 0) {
		hero.x = newX;
		hero.y = newY;
		update();
		draw();
	} else {
		addRandomMessage(
			"You bravely dash forth, daring the unknown dangers of the dungeon... and bump headfirst into a wall. Well played.",
			"You have to be a ghost to walk through walls. It's easier to become one than you think, though...",
			"Fighting a wall? Clever.",
			"That's not a monster, that's a wall.",
			"Uh... tried casting the \"remove wall\" spell <i>first</i>?",
			"A splendid idea! ... It just doesn't work."
		);
	}
}

function _underHero(p) {
	return (p.x == hero.x && p.y == hero.y);
}
var pickupUnderHero;

function update() {
	pickupUnderHero = false;
	if(hero.isDead) return;
	if(hero.health < 1) {
		youDie();
		return;
	}
	

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
				hero.addHealth(1);
				hero.addMana(.5);
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
	var gameId = Math.floor(+new Date());
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