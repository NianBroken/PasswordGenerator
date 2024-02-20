function s_(a) {
	document.getElementById(a).focus();
	document.getElementById(a).selectionStart = 0;
	document.getElementById(a).selectionEnd = document.getElementById(a).value.length;
}
function cY_(e) {
	var a = ["apple", "bestbuy", "coffee", "drip", "egg", "fruit", "golf", "hulu", "iphone", "jack", "korean", "laptop", "music", "nut", "omelet", "park", "queen", "rope", "skype", "tokyo", "usa", "visa", "walmart", "xbox", "yelp", "zip"];
	var d = "";
	for (var b = 0; b < e.length; b++) {
		var f = e.charCodeAt(b);
		if (65 <= f && f <= 90) {
			f -= 65;
			d += a[f].toUpperCase();
		} else {
			if (97 <= f && f <= 122) {
				f -= 97;
				d += a[f];
			} else {
				d += e.substring(b, b + 1);
			}
		}
		d += " ";
	}
	return d;
}
function AY_(a, f, b) {
	var d = Math.floor(Math.random() * a.length);
	var c = Math.floor(Math.random() * f);
	var e = b.substring(0, c) + a.substring(d, d + 1) + b.substring(c, f);
	b = e;
	return b;
}
function Em0(r, k, l, m, o, c, x9) {
	var d = "abcdefghjkmnpqrstuvwxyz";
	var h = "ABCDEFGHJKLMNPQRSTUVWXYZ";
	var p = "23456789";
	var j = "!#$%&*+-=?@^_";
	if (!k) {
		d += "ilo";
		h += "IO";
		p += "01";
		j += "|";
	}
	var a = "";
	var g = 0;
	if (!x9) {
		j += "{}[]()/'\"`~,;:.<>\\";
	}
	if (l == 1) {
		a += d;
		g++;
	}
	if (m == 1) {
		a += h;
		g++;
	}
	if (o == 1) {
		a += p;
		g++;
	}
	if (c == 1) {
		a += j;
		g++;
	}
	if (g == 0) {
		q = "You must select at least one character set!";
		return q;
	}
	var n = a.length;
	var f = r - g;
	var q = "";
	for (var e = 0; e < f; e++) {
		var b = Math.floor(Math.random() * n);
		q += a.substring(b, b + 1);
	}
	if (m) {
		q = AY_(h, f, q);
		f++;
	}
	if (l) {
		q = AY_(d, f, q);
		f++;
	}
	if (o) {
		q = AY_(p, f, q);
		f++;
	}
	if (c) {
		q = AY_(j, f, q);
	}
	return q;
}
function d2O() {
	var b = document.getElementById("pgLength").value;
	var f = 0;
	if (document.getElementById("Nosimilar").checked) {
		f = 1;
	}
	var a = 0;
	if (document.getElementById("Symbols").checked) {
		a = 1;
	}
	var a6 = 0;
	if (document.getElementById("NoAmb").checked) {
		a6 = 1;
	}
	var g = 0;
	if (document.getElementById("Lowercase").checked) {
		g = 1;
	}
	var l = 0;
	if (document.getElementById("Uppercase").checked) {
		l = 1;
	}
	var p = 0;
	if (document.getElementById("Numbers").checked) {
		p = 1;
	}
	var e = true;
	if (e) {
		var o = Em0(b, f, g, l, p, a, a6);
		var k = cY_(o);
		document.getElementById("final_pass").value = o;
		if (b > 50) k = "";
	} else {
		var c = null;
		if (window.ActiveXObject) {
			c = new ActiveXObject("Microsoft.XMLHTTP");
		} else {
			if (window.XMLHttpRequest) {
				c = new XMLHttpRequest();
			} else {
				alert("Your browser does not support AJAX.");
				return;
			}
		}
		var j = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
		var n = 3;
		var m = 0;
		var h = document.getElementById("final_pass").value;
		for (var d = 0; d < h.length; d++) {
			m += h.charCodeAt(d);
		}
		if (c != null) {
			c.onreadystatechange = function () {
				if (c.readyState == 4) {
					var q = c.responseText;
					var r = q.search("Phonetic=");
					var i = q.length;
					document.getElementById("final_pass").value = q.substring(0, r);
				}
			};
			c.open("GET", "calc.php?Length=" + b + "&Symbols=" + a + "&Lowercase=" + g + "&Uppercase=" + l + "&Numbers=" + p + "&Nosimilar=" + f + "&Last=" + m, true);
			c.send();
		}
	}
}
function Jm0(b) {
	var c,
		a,
		e,
		d = document.cookie.split(";");
	for (c = 0; c < d.length; c++) {
		a = d[c].substr(0, d[c].indexOf("="));
		e = d[c].substr(d[c].indexOf("=") + 1);
		a = a.replace(/^\s+|\s+$/g, "");
		if (a == b) {
			return unescape(e);
		}
	}
}
function Jx2(a, d, b) {
	var e = new Date();
	e.setDate(e.getDate() + b);
	var c = escape(d) + (b == null ? "" : "; expires=" + e.toUTCString());
	document.cookie = a + "=" + c;
}
function x2J() {
	var d = document.cookie.split(";");
	for (var c = 0; c < d.length; c++) {
		var b = d[c];
		var e = b.indexOf("=");
		var a = e > -1 ? b.substr(0, e) : b;
		document.cookie = a + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
	}
}
function Q2S(b) {
	var a = Jm0(b);
	if (a != null && a != "") {
		if (a == "true") {
			document.getElementById(b).checked = true;
		} else {
			document.getElementById(b).checked = false;
		}
	} else {
		if ((b == "SaveSettings" || b == "NoAmb") == false) {
			document.getElementById(b).checked = true;
		}
	}
}
function BBB(b, c) {
	var a = document.getElementById(b).checked;
	Jx2(b, a, c);
}
function OIU() {
	if (window.top !== window.self) window.top.location.replace(window.self.location.href);
	Q2S("Symbols");
	Q2S("Lowercase");
	Q2S("Uppercase");
	Q2S("Numbers");
	Q2S("Nosimilar");
	Q2S("NoAmb");
	Q2S("SaveSettings");
	var a = Jm0("pgLength");
	if (a != null && a != "") {
		document.getElementById("pgLength").value = a;
	} else {
		document.getElementById("pgLength").value = 15;
	}
}
function S7P(a) {
	var c = document.getElementById("SaveSettings").checked;
	var d = 60;
	if (c) {
		BBB("Symbols", d);
		BBB("Lowercase", d);
		BBB("Uppercase", d);
		BBB("Numbers", d);
		BBB("Nosimilar", d);
		BBB("NoAmb", d);
		BBB("SaveSettings", d);
		var b = document.getElementById("pgLength").value;
		Jx2("pgLength", b, d);
	} else {
		if (a) {
			x2J();
		}
	}
}

function OnCopy() {
	var copyText = document.getElementById("final_pass");

	copyText.select();
	copyText.setSelectionRange(0, 99999); /*For mobile devices*/

	document.execCommand("copy");

	if (window.getSelection) {
		if (window.getSelection().empty) {
			// Chrome
			window.getSelection().empty();
		} else if (window.getSelection().removeAllRanges) {
			// Firefox
			window.getSelection().removeAllRanges();
		}
	} else if (document.selection) {
		// IE?
		document.selection.empty();
	}
}

function MakeAndCopy() {
	d2O();
	OnCopy();
}
