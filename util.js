var marV = 362436069;
var marU = 521288629;

function MSeed(s) {
	s = 0 | s;
	marV = (s >> 16) & 0xFFFF;
	marU = s & 0xFFFF;
}

function Marsaglia() {
	marV = 36969 * (marV & 65535) + (marV >> 16);
	marU = 18000 * (marU & 65535) + (marU >> 16);
	return (marV << 16) + (marU & 65535);
}

function MarsagliaF() {
	return Math.abs(Marsaglia() / 2147483648.0);
}

function rnd(a, b) {
	return MarsagliaF() * (b - a) + a;
}

function irnd(a, b) {
	if(a === undefined || b === undefined) throw "Hissy fit";
	return Math.floor(rnd(a, b));
}

function rndc(any_number_of_arguments) {
	return arguments[irnd(0, arguments.length)];
}

function log(message) {
	var args = arguments;
	if(window.console && window.console.log) console.log.apply(null, args);
}

function spliceMatching(arr, matcher) {
	if(!_.isArray(arr)) {
		throw "Trying to splice non-array " + arr.toString() + ". C'mon.";
	}
	for(var i = 0; i < arr.length; i++) {
		if(matcher(arr[i], i)) {
			arr.splice(i, 1);
			i --;
			continue;
		}
	}
}

function str_repeat(i, m) { for (var o = []; m > 0; o[--m] = i){} return(o.join('')); }

/**
 * Formats a string with objects according to a format.
 * Available specifiers:
 * %b - binary  %c - char   %d - integer  %e - exponential
 * %f - float   %o - octal  %s - string   %u - unsigned
 * %x - hex     %X - HEX
 */
function sprintf () {
  var i = 0, a, f = arguments[i++], o = [], m, p, c, x;
  while (f) {
    if (m = /^[^\x25]+/.exec(f)) o.push(m[0]);
    else if (m = /^\x25{2}/.exec(f)) o.push('%');
    else if (m = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(f)) {
      if (((a = arguments[m[1] || i++]) == null) || (a == undefined)) throw("Too few arguments.");
      if (/[^s]/.test(m[7]) && (typeof(a) != 'number'))
        throw("Expecting number but found " + typeof(a));
      switch (m[7]) {
        case 'b': a = a.toString(2); break;
        case 'c': a = String.fromCharCode(a); break;
        case 'd': a = parseInt(a); break;
        case 'e': a = m[6] ? a.toExponential(m[6]) : a.toExponential(); break;
        case 'f': a = m[6] ? parseFloat(a).toFixed(m[6]) : parseFloat(a); break;
        case 'o': a = a.toString(8); break;
        case 's': a = ((a = String(a)) && m[6] ? a.substring(0, m[6]) : a); break;
        case 'u': a = Math.abs(a); break;
        case 'x': a = a.toString(16); break;
        case 'X': a = a.toString(16).toUpperCase(); break;
      }
      a = (/[def]/.test(m[7]) && m[2] && a > 0 ? '+' + a : a);
      c = m[3] ? m[3] == '0' ? '0' : m[3].charAt(1) : ' ';
      x = m[5] - String(a).length;
      p = m[5] ? str_repeat(c, x) : '';
      o.push(m[4] ? a + p : p + a);
    }
    else throw ("Huh ?!");
    f = f.substring(m[0].length);
  }
  return o.join('');
}
/** end of sprintf.js */