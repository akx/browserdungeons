Cobra.install();

var Level = new Class({
	__init__: function(self) {
		self.w = 20;
		self.h = 20;
		self.clear();
	},
	clear: function(self) {
		self.data = {};
	},
	_get: function(self, kind, x, y) {
		if(y<0||x<0||y>self.h||x>self.w) return 0;
		x = 0 | x; y = 0 | y;
		return (self[kind][y * self.w + x] || 0);
	},
	
	_set: function(self, kind, x, y, v) {
		
		if(y<0||x<0||y>self.h||x>self.w) return;
		x = 0 | x; y = 0 | y;
		self[kind][y * self.w + x] = v;
	},
	
	get: function(self, x, y) { return self._get("data", x, y); },
	set: function(self, x, y, v) { return self._set("data", x, y, v); },
	isDiscovered: function(self, x, y) { return true; },
	
	generate: function(self) {
		for(var y = 0; y < self.h; y++) {
			for(var x = 0; x < self.w; x++) {
				if(x==0||y==0||x==self.w-1||y==self.h-1) self.set(x, y, 1);
			}
		}
		for(var i = 0; i < 30; i++) self.set(rnd(0, self.w), rnd(0, self.h), 1);
	}
});


var LevelObj = new Class({
	__init__: function(self) {
		console.log("LO InIT");
		self.x = self.y = 0;
	},
	draw: function(self) {
		
	},
	screenX: function(self) {
		return self.x * 20;
	},
	screenY: function(self) {
		return self.y * 20;
	}
});

var Character = new Class({
	__extends__: LevelObj,
	__init__: function(self) {
		Class.ancestor(Character, '__init__', self);
		console.log("Ch InIT");
		self.maxHealth = self.health = 10;
   }
});

var HERO_CLASSES = ["warrior", "priest", "thief", "wizard"];
var Hero = new Class({
	__extends__: Character,
	
	__init__: function(self) {
		Class.ancestor(Hero, '__init__', self);
		console.log("He InIT");
		self.klass = "warrior";
		self.race = "human";
		self.tileName = "Hero" + self.klass.charAt(0).toUpperCase() + self.klass.substring(1);
	},
	
	draw: function(self) {
		var x = self.screenX();
		ctx.drawImage(tiles[self.tileName], self.screenX(), self.screenY());
	}
});