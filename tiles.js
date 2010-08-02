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
}