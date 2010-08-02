var Character = LevelObj.extend({
	name: "(thing)",
	kind: "Character",
	
	constructor: function() {
		this.base();
		this.maxHealth = this.health = 10;
		this.maxMana = this.mana = 10;
		this.level = 1;
		this.xp = this.levelXp = 0;
		this.healthPotions = 0;
		this.manaPotions = 0;
		this.magicResist = 0.0;
		this.physicalResist = 0.0;
	},
	calculateLevelXp: function() {
		this.levelXp = 0 | (15 + Math.pow(this.level, 1.3377) * 30);
	},
	levelUp: function() {
		if(this.xp >= this.levelXp) {
			this.xp -= this.levelXp;
			this.level++;
			this.calculateLevelXp();
		}
	},
	addHealth: function(hp) {
		this.health = 0 | Math.min(this.maxHealth, this.health + hp);
	},
	addMana: function(mp) {
		this.mana = 0 | Math.min(this.maxMana, this.mana + mp);
	},
	
	dealDamage: function(amount, type) {
		if(type == "magic") amount *= (1.0 - this.magicResist);
		else if(type == "physical") amount *= (1.0 - this.physicalResist);
		else throw "Hissy fit: Damage type " + type + " unknown.";
		this.health = Math.max(this.health - amount, 0);
	},
	
	draw: function() {
		ctx.drawImage(tiles[this.tileName], this.screenX(), this.screenY());
	},
	
	drawLevelOverlay: function(sx, sy) {
		var o = 2;
		setFont(12, null, null, "#000000", "Arial", "bold");
		ctx.fillText(this.level, sx, sy - o);
		ctx.fillText(this.level, sx, sy + o);
		ctx.fillText(this.level, sx - o, sy);
		ctx.fillText(this.level, sx + o, sy);
		var levelDelta = this.level - hero.level;
		if(levelDelta <= 1) ctx.fillStyle = "lime";
		else if(levelDelta <= 2) ctx.fillStyle = "yellow";
		else if(levelDelta <= 4) ctx.fillStyle = "orange";
		else ctx.fillStyle = "red";
		ctx.fillText(this.level, sx, sy);
	}
});

var HERO_CLASSES = ["warrior", "priest", "thief", "wizard"];
var HERO_RACES = ["human", "elf", "dwarf", "halfling", "orc"];
var raceAdjs = {
	"human":	"human",
	"elf":		"elven",
	"dwarf":	"dwarven",
	"halfling":	"halfling",
	"orc":		"orcish"
}
var Hero = Character.extend({
	constructor: function() {
		this.base();
		this.klass = rndc.apply(null, HERO_CLASSES);
		this.race = rndc.apply(null, HERO_RACES);
		this.tileName = "Hero" + this.klass.charAt(0).toUpperCase() + this.klass.substring(1);
		this.nSlots = (this.klass == "wizard" ? 5 : 4);
		this.slots = [];
		for(var i = 0; i < this.nSlots; i++) this.slots.push({id: i + 1, item: null});
		this.calculateLevelXp();
	},
	
	drinkHealth: function() {
		if(this.healthPotions > 0) {
			if(this.health >= this.maxHealth) {
				return addRandomMessage(
					"You really don't think you should drink this right now.",
					"Maybe this drink should be left until later."
				);
			}
			this.healthPotions --;
			this.addHealth(10);
			return addRandomMessage(
				"*Gulp!* You feel much healthier. Or at least those nasty wounds closed up nicely.",
				"*Slurp!* Mmm, tastes like strawberry and troll blood."
			);
		} else {
			return addRandomMessage(
				"You rummage through your pack and find absolutely no health potions. Damnit!",
				"You feel around a little in your pockets... No, that's not a health potion... That's not one either... Damnit, all out!"
			);
		}
	},

	drinkMana: function() {
		if(this.manaPotions > 0) {
			if(this.mana >= this.maxMana) {
				return addRandomMessage(
					"You really don't think you need an arcane pick-me-up at this very instant.",
					"Perhaps it'd be wiser to leave quaffing this until a li'l later."
				);
			}
			this.manaPotions --;
			this.addMana(10);
			return addRandomMessage(
				"*Gulp!* Oooohhh, mystical energy just courses through your very veins! Nice!",
				"*Slurp!* Mmm, tastes like blueberries and electricity."
			);
		} else {
			return addRandomMessage(
				"You rummage through your sack o'things and find absolutely nothing that'd help with this acute lack of mana. Gods be damned!",
				"You reach into your pockets and fish around a bit. No, that's not a vial of magical strength... Nor is that thing there... Welp, none left."
			);
		}
	},
	
	getRaceAdj: function() {
		return raceAdjs[this.race];
	}

	
});

var Enemy = Character.extend({
	kind: "Enemy",
	initLevel:	function(level) {
		this.level = level;
		this.health = this.maxHealth = rnd((this.level + 1) * 10, (this.level + 1) * 15);
	},
	
	draw: function() {
		this.base();
		var sx = this.screenX(), sy = this.screenY();
		ctx.lineWidth = 1;
		ctx.fillStyle = "red";
		ctx.fillRect(sx, sy + 20, 1, -(20 * this.health / this.maxHealth));
		
		sy += 19;
		this.drawLevelOverlay(sx, sy);
	}
});

var Imp = Enemy.extend({
	tileName: "Imp",
	name: "imp"
});