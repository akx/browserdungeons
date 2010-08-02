function writeHTML() {
	document.body.innerHTML = '\
<table>\
<tr>\
<td><canvas id="game" width="400" height="480"></canvas></td>\
<td><div id="log"></div></td>\
</tr>\
</table>\
<br /><small>\
<del>Beta</del> <del>Alpha</del> Pre-alpha version. Use numpad to move.<br />\
Inspiration <i>&amp;</i> sprites pilfered from <a href="http://www.qcfdesign.com/?cat=20">Desktop Dungeons</a>.\
</small>\
';
}