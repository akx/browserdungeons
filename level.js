var Level = Base.extend({
	constructor: function() {
		this.w = 20;
		this.h = 20;
		this.clear();
	},
	clear: function() {
		this.data = {};
		this.discovered = {};
		this.doodads = [];
		this.pickups = [];
		this.chars = [];
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
		for(var i = 0; i < 10; i++) {
			this.placeRandomly(this.add(new HealthPotion));
			this.placeRandomly(this.add(new ManaPotion));
		}
		var enemyClasses = [Imp, Warlock];
		for(var level = 1; level < 9; level ++) {
			var n = Math.max(1, (9 - level) / 2 + 1);
			for(var i = 0; i < n; i++) {
				var enemy = new (rndc.apply(null, enemyClasses));
				enemy.initLevel(level);
				this.placeRandomly(this.add(enemy));
			}
		}
	},
	
	placeRandomly: function(levelObj) {
		var px, py, tries = 0;
		levelObj.x = levelObj.y = -999;
		do {
			px = irnd(0, this.w);
			py = irnd(0, this.h);
			tries++;
			if(tries > 50) {
				throw "Hissy fit, tries exceeded when placing an object";
			}
		} while(this.get(px, py) || this.objectInTile(px, py));
		levelObj.x = px;
		levelObj.y = py;
	},
	
	objectInTile: function(x, y, filter) {
		var located = function(o) { return o.x == x && o.y == y; }, obj;
		if(!filter || filter == "Pickup") if((obj = _.detect(this.pickups, located))) return obj;
		if(!filter || filter == "Character") if((obj = _.detect(this.chars, located))) return obj;
		return null;
	},
	
	add: function(levelObj) {
		if(levelObj.kind === "Pickup") {
			this.pickups.push(levelObj);
			return levelObj;
		}
		else if(levelObj.kind === "Enemy") {
			this.chars.push(levelObj);
			return levelObj;
		}
		else if(levelObj.kind === "Doodad") {
			this.doodads.push(levelObj);
			return levelObj;
		}
		throw "Unknown kind of levelobj: " + (levelObj.kind.toString());
	},
	
	remove: function(levelObj) {
		var eq = function(obj) { return obj === levelObj; };
		if(levelObj.kind === "Pickup") return spliceMatching(this.pickups, eq);
		else if(levelObj.kind === "Enemy") return spliceMatching(this.chars, eq);
		else if(levelObj.kind === "Doodad") return spliceMatching(this.doodads, eq);
		else return null;
	},
	
	setAllDiscovered: function() {
		for(var y = 0; y < this.h; y++) for(var x = 0; x < this.w; x++) this.discover(x, y);
	}
});
