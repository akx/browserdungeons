

var tiles = {};
var tilesToLoad = 0;
var allTilesLoaded = false;
function loadTiles() {

	_.each(window._tileData, function(tileData, tile) {
		tilesToLoad ++;
		tiles[tile] = _.extend(new Image(), {
			src: 'data:image/png;base64,'+tileData,
			onload: function() {
				tilesToLoad--;
				if(tilesToLoad == 0) allTilesLoaded = true;
			}
		});
	});
	delete window._tileData;
	/*
	 var tilesetPath = 'default';
	 var tileNames = [
"Altar", "AltarWorship", "AniArmour", "Attackboost", "Bandit", "Bang", "Blood",
"Dirt", "Dirt_crypt", "Dirt_forest", "Dirt_industrial", "Dirt_library",
"Dirt_snakepit", "Dragon", "EnemyGeneric", "GlyphSelector", "Goat", "Goblin",
"Gold", "Golem", "Goo", "Gorgon", "G_Blood", "G_Converter", "G_Empty", "G_Endwall",
"G_Fireball", "G_FirstStrike", "G_Generic", "G_Heal", "G_KillProtect", "G_Might",
"G_Petrify", "G_Poison", "G_Reveal", "G_Summon", "G_TeleMonster", "G_TeleSelf",
"HealthPotion", "HeroBase", "HeroPriest", "HeroThief", "HeroWizard", "HPBoost",
"Imp", "ManaPotion", "MeatMan", "MPBoost", "Naga", "Piety", "Plant", "PowerupGeneric",
"Serpent", "Shop", "tiles", "Vampire", "Wall", "Wall2", "Wall_crypt", "Wall_forest",
"Wall_industrial", "Wall_library", "Wall_snakepit", "Warlock", "Wraith", "Zombie"
];
		_.each(tileNames, function(tile) { tiles[tile] = _.extend(new Image(), {
			src: tilesetPath + '/' + tile + '.png',
			onLoad: function() { }
		}); });
	}*/
}