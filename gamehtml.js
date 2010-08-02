function writeHTML() {
	document.body.innerHTML = '\
<table>\
<tr>\
<td><canvas id="game" width="400" height="480"></canvas></td>\
<td><div id="log"></div></td>\
</tr>\
</table>\
<br />\
<a href="#" onclick="doubleSizeOn(); return false">Double size on...</a> \
<a href="#" onclick="doubleSizeOff(); return false">Double size off!</a> \
<a href="#" onclick="startGame(); return false">Rewind!</a> <br />\
<del>Beta</del> <del>Alpha</del> Pre-alpha version. Use numpad to move; H and M to use health and mana potions.<br />\
Inspiration <i>&amp;</i> sprites pilfered from <a href="http://www.qcfdesign.com/?cat=20">Desktop Dungeons</a>.\
';
}