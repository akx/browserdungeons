from __future__ import with_statement
import glob, os, simplejson

tiles = {}
for tile in glob.glob("default/*.png"):
	tiles[os.path.splitext(os.path.basename(tile))[0]] = file(tile, "rb").read().encode("base64").strip()

with file("tiledata.js", "wb") as tileJSFile:
	tileJSFile.write("var _tileData = %s;" % simplejson.dumps(tiles))