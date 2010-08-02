
var Character = LevelObj.extend({
	constructor: function() {
		this.base();
		this.maxHealth = this.health = 10;
		this.maxMana = this.mana = 10;
		this.level = 1;
		this.xp = this.levelXp = 0;
		this.healthPotions = 0;
		this.manaPotions = 0;
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
	}
});

var HERO_CLASSES = ["warrior", "priest", "thief", "wizard"];
var Hero = Character.extend({
	constructor: function() {
		this.base();
		this.klass = "warrior";
		this.race = "human";
		this.tileName = "Hero" + this.klass.charAt(0).toUpperCase() + this.klass.substring(1);
		this.nSlots = 4;
		this.slots = [];
		for(var i = 0; i < this.nSlots; i++) this.slots.push({id: i + 1, item: null});
		this.calculateLevelXp();
	},

	
	draw: function() {
		var x = this.screenX();
		ctx.drawImage(tiles[this.tileName], this.screenX(), this.screenY());
	}
});