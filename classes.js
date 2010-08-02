var Level = Base.extend({
	constructor: function() {
		this.w = 20;
		this.h = 20;
		this.clear();
	},
	clear: function() {
		this.data = {};
		this.discovered = {};
	},
	_get: function(kind, x, y) {
		if(y<0||x<0||y>this.h||x>this.w) return 0;
		x = 0 | x; y = 0 | y;
		return (this[kind][y * this.w + x] || 0);
	},
	
	_set: function(kind, x, y, v) {
		
		if(y<0||x<0||y>this.h||x>this.w) return;
		x = 0 | x; y = 0 | y;
		this[kind][y * this.w + x] = v;
	},
	
	get: function(x, y) { return this._get("data", x, y); },
	set: function(x, y, v) { return this._set("data", x, y, v); },
	isDiscovered: function(x, y) { return +(this._get("discovered", x, y)); },
	discover: function(x, y) {
		if(y<0||x<0||y>this.h||x>this.w) return false;
		if(!this.isDiscovered(x, y)) {
			this._set("discovered", x, y, 1);
			return true;
		}
		return false;
	},
	
	generate: function() {
		for(var y = 0; y < this.h; y++) {
			for(var x = 0; x < this.w; x++) {
				if(x==0||y==0||x==this.w-1||y==this.h-1) this.set(x, y, 1);
			}
		}
		for(var i = 0; i < 120; i++) this.set(rnd(0, this.w), rnd(0, this.h), 1);
	}
});


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

var Character = LevelObj.extend({
	constructor: function() {
		this.base();
		this.maxHealth = this.health = 10;
		this.maxMana = this.mana = 10;
		this.level = 1;
		this.xp = this.levelXp = 0;
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