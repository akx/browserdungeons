function rnd(a, b) {
	return Math.random() * (b - a) + a;
}

function irnd(a, b) {
	if(a === undefined || b === undefined) throw "Hissy fit";
	return Math.floor(rnd(a, b));
}
