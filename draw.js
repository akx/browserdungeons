var drawInited = false;
var floorPattern;
var statusBarGradient;
var healthGradient;
var manaGradient;
var xpGradient;
var font = '"warnock pro", palatino, "palatino linotype", georgia';

function linearGradient(x0, y0, x1, y1, stop, color) {
	var grad = ctx.createLinearGradient(x0, y0, x1, y1);
	for(var i = 4; i < arguments.length; i += 2) grad.addColorStop(arguments[i], arguments[i+1]);
	return grad;
}

function setFont(size, baseline, align, fillStyle, fontOverride, variant) {
	ctx.font = (variant ? variant + " " : "") + size + "px " + (fontOverride || font);
	ctx.textBaseline = baseline || "alphabetic";
	ctx.textAlign = align || "left";
	if(fillStyle) ctx.fillStyle = fillStyle;
}

function initDraw() {
	statusDrawInited = true;
	
	floorPattern = ctx.createPattern(tiles.Dirt, 'repeat');
	
	statusBarGradient = linearGradient(
		0,	0,	0,	80,
		0,		'#433a32',
		0.49,	'#867764',
		0.51,	'#433a32',
		1,		'#1d1916'
	);
	healthGradient = linearGradient(
		0,	0,	0,	70,
		0,		'#c44d58',
		1,		'#541D22'
	);
	manaGradient = linearGradient(
		0,	0,	0,	70,
		0,		'#489FFF',
		1,		'#252845'
	);
	xpGradient = linearGradient(
		0,	0,	0,	70,
		0,		'#EC6704',
		1,		'#582601'
	);
	
	slotGradient = linearGradient(
		0,	0,	0,	70,
		0,		'#433527',
		1,		'#181716'
	);
	
}



function drawVertBar(x0, y0, w, h, filled, fillStyle, strokeStyle, bgStyle, counter, label) {
	if(bgStyle) {
		ctx.fillStyle = bgStyle;
		ctx.fillRect(x0, y0, w, h);
	}
	ctx.fillStyle = fillStyle;
	var fh = filled * h;
	ctx.fillRect(x0, y0 + h - fh, w, fh);
	ctx.strokeStyle = strokeStyle;
	ctx.lineWidth = 1;
	ctx.strokeRect(x0, y0, w, h);
	if(counter !== undefined) {
		setFont(15, null, "center", "#FFF");
		ctx.fillText(counter.toString(), x0 + w * .5, y0 + h - 5);
	}
	if(label !== undefined) {
		setFont(12, null, "center", "#FFF");
		ctx.fillText(label.toString(), x0 + w * .5, y0 + 13);
	}
}

function drawSlot(slot) {
	ctx.fillStyle = slotGradient;
	ctx.fillRect(0, 0, 60, 70);
	ctx.strokeStyle = "#FFF";
	ctx.strokeRect(0, 0, 60, 70);
	ctx.font = "20px " + font;
	ctx.textBaseline = "alphabetic";
	ctx.textAlign = "left";
	ctx.fillStyle = (slot.item ? "#FFF" : (pickupUnderHero ? "#FFD" : "#666"));
	ctx.fillText(slot.id, 3, 63);
}


function drawStatus() {
	
	ctx.save();
	ctx.translate(0, 20 * level.h);
	ctx.fillStyle = statusBarGradient;
	ctx.fillRect(0, 0, 400, 80);
	drawVertBar(5, 5, 15, 70, hero.health / hero.maxHealth, healthGradient, "#c44d58", "#3F0304", hero.healthPotions, "H");
	drawVertBar(22, 5, 15, 70, hero.mana / hero.maxMana, manaGradient, "#489FFF", "#021133", hero.manaPotions, "M");
	drawVertBar(39, 5, 15, 70, hero.xp / hero.levelXp, xpGradient, "#EC6704", "#200E00", hero.level);
	
	_.each(hero.slots, function(slot) {
		ctx.save();
		ctx.translate(65 + (slot.id - 1) * 65, 5);
		drawSlot(slot);
		ctx.restore();
	});
	
	ctx.restore();
}

function _drawObj(obj) {
	if(level.isDiscovered(obj.x, obj.y)) obj.draw();
}

function drawLevel() {
	ctx.fillStyle = floorPattern;
	ctx.fillRect(0, 0, 20 * level.w, 20 * level.h);
	for(var y = 0; y < level.h; y ++) {
		var cy = y * 20;
		for(var x = 0; x < level.w; x ++) {
			var cx = x * 20;
			var dst = 0;//Math.sqrt((x - hero.x) * (x - hero.x) + (y - hero.y) * (y - hero.y));
			var disc = level.isDiscovered(x, y);
			if(!disc) {
				var light = Math.max(0, 0 | (32 - dst * 2));
				ctx.fillStyle = "rgb("+light+","+light+","+light+")";
				ctx.fillRect(cx, cy, 20, 20);
				continue;
			} else {
				var tile = level.get(x, y);
				if(tile) {
					ctx.drawImage(tiles.Wall, cx, cy);
				}
			}
			ctx.fillStyle = "rgba(0,0,0," + Math.min(0.7, dst * .05) + ")";
			ctx.fillRect(cx, cy, 20, 20);
		}
	}
	_.each(level.doodads, _drawObj);
	_.each(level.pickups, _drawObj);
	_.each(level.chars, _drawObj);
	hero.draw();
}

function draw() {
	if(!drawInited) initDraw();
	drawLevel();
	drawStatus();
}
