var Pickup = LevelObj.extend({
	kind:	"Pickup",
	canAutoPickup:	false,
	tileName:		"",
	
	constructor: function() {
		this.base();
	},
	
	
	onPickup: function(picker) {
		
	}
});

var HealthPotion = Pickup.extend({
	canAutoPickup:	true,
	tileName:		"HealthPotion",
	
	onPickup: function(picker) {
		picker.healthPotions ++;
		picker.xp += 10;
		addRandomMessage(
			"You found a healthy, delicious health potion. Now with added Vitamin D.",
			"Ooohh! A health potion! AWESOME!",
			"That's either a strawberry or a troll tooth floating around in that potion."
		);
	}
});

var ManaPotion = Pickup.extend({
	canAutoPickup:	true,
	tileName:		"ManaPotion",
	
	onPickup: function(picker) {
		picker.manaPotions ++;
		picker.xp += 10;
		addRandomMessage(
			"Mana mana. (Do dooh, do do doh.)",
			"Another phial full of mhystical phower!"
		);
	}
});

var HealthBoost = Pickup.extend({
	canAutoPickup:	true,
	tileName:		"HPBoost",
	
	onPickup: function(picker) {
		picker.maxHealth += 3;
		picker.xp += 2;
		addRandomMessage(
			"Whoa! You feel stronger than ever! Well... maybe not ever, but anyway!",
			"Package full of veggies makes " + (picker.klass || "thing") + " strooooong!",
			"Your muscles grow visibly more muscular.",
			"Your skin seems a little bit tougher. Must've been some kind of anti-cosmetic."
		);
	}
});

var ManaBoost = Pickup.extend({
	canAutoPickup:	true,
	tileName:		"MPBoost",
	
	onPickup: function(picker) {
		picker.maxMana += 3;
		picker.xp += 2;
		addRandomMessage(
			"Oooh, that tickles!",
			"More mana? Like you really needed that...",
			"You feel a strange sort of tingling under your skin (and clothes, for that matter).",
			"A cosmic magical force courses through you for a moment. Then it stops."
		);
	}
});