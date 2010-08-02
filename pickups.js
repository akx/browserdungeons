var Pickup = LevelObj.extend({
	kind:	"Pickup",
	canAutoPickup:	false,
	tileName:		"",
	
	constructor: function() {
		this.base();
	},
	
	draw: function() {
		ctx.drawImage(tiles[this.tileName], this.screenX(), this.screenY());
	},
	
	onPickup: function(picker) {
		
	}
}, {
	kind:	"Pickup",
});

var HealthPotion = Pickup.extend({
		canAutoPickup:	true,
		tileName:		"HealthPotion",
		
		onPickup: function(picker) {
			picker.healthPotions ++;
			picker.xp += 10;
			addRandomMessage(
				"You found a healthy, delicious health potion. Now with added Vitamin D.",
				"Ooohh! A health potion! AWESOME!"
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
