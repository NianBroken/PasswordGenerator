var strArray = [];
var nCurPWD = 0;
var bWaiting = 0;
var bBreak = 0;
var nNum = 0;
var nVer = 2;

// 正则表达式匹配常见的手机设备标识符
var mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

// 检查用户代理字符串是否匹配手机设备
if (mobileRegex.test(navigator.userAgent)) {
    // 获取当前页面的 URL
    var currentUrl = window.location.href;
    // 提取当前页面的域名
    var currentOrigin = window.location.origin;
    // 构建移动路径
    var mobilePath = currentUrl + "/mobile/";
    // 将页面重定向到移动路径
    window.location.href = mobilePath;
}


function SelectAll(id) {
	$(id).focus();
	$(id).select();
}

function OnCopy() {
	var copyText = $("final_pass");

	copyText.select();
	copyText.setSelectionRange(0, 999999); /*For mobile devices*/

	document.execCommand("copy");

	$("tooltip1").style.display = "inline";
	setTimeout(function () {
		$("tooltip1").style.display = "none";
	}, 1000);
}

function OnCopy2() {
	if (bWaiting == 1) return;
	$("tooltip2").style.display = "inline";
	setTimeout(function () {
		$("tooltip2").style.display = "none";
	}, 1000);

	if (nNum > nCurPWD) {
		navigator.clipboard.writeText(strArray[nCurPWD]);
		bWaiting = 1;
		setTimeout(function () {
			ChangeBtnTitle();
		}, 470);
	}
}

function ChangeBtnTitle() {
	var nQuantity = nNum;
	if (nCurPWD < nQuantity - 1) {
		nCurPWD++;
		var strTitle = "";
		var nIndex = nCurPWD + 1;
		if (nCurPWD == 1) strTitle = "复制第 2 行";
		else if (nCurPWD == 2) strTitle = "复制第 3 行";
		else strTitle = "复制第 " + nIndex.toString() + " 行";

		$("CopyOne").innerHTML = strTitle;
	}

	bWaiting = 0;
}

function auto_grow(element) {
	//element.style.height = "5px";
	element.style.height = element.scrollHeight + 10 + "px";
}

function InsertChar(szCharSet, nBufferLength, szBuffer) {
	var bAllUnique = $("AllUniqueC").checked;
	if (bAllUnique == false) {
		var nPos = 0;
		var nInsertPos = 0;
		if (nVer == 1) {
			nPos = Math.floor(Math.random() * szCharSet.length);
			nInsertPos = Math.floor(Math.random() * nBufferLength);
		} else {
			const array1 = new Uint32Array(1);
			nPos = crypto.getRandomValues(array1) % szCharSet.length;

			const array2 = new Uint32Array(1);
			nInsertPos = crypto.getRandomValues(array2) % nBufferLength;
		}

		var szSwap = szBuffer.substring(0, nInsertPos) + szCharSet.substring(nPos, nPos + 1) + szBuffer.substring(nInsertPos, nBufferLength);
		szBuffer = szSwap;
		return szBuffer;
	}

	var szSwap = "";
	var szCharSetCopy = szCharSet;

	var today1 = new Date();
	var s1 = today1.getSeconds();

	while (true) {
		var today2 = new Date();
		var s2 = today2.getSeconds();
		if (s2 - s1 >= 2) {
			bBreak = 1;
			break;
		}

		if (szCharSetCopy.length == 0) {
			break;
		}
		var nPos = 0;

		if (nVer == 1) nPos = Math.floor(Math.random() * szCharSetCopy.length);
		else {
			const array3 = new Uint32Array(1);
			nPos = crypto.getRandomValues(array3) % szCharSetCopy.length;
		}

		var szNewTmp = szCharSetCopy.substring(nPos, nPos + 1);
		var nTmp = szBuffer.indexOf(szNewTmp);

		if (nTmp == -1) {
			var nInsertPos = 0;
			if (nVer == 1) nInsertPos = Math.floor(Math.random() * nBufferLength);
			else {
				const array4 = new Uint32Array(1);
				nInsertPos = crypto.getRandomValues(array4) % nBufferLength;
			}
			szSwap = szBuffer.substring(0, nInsertPos) + szNewTmp + szBuffer.substring(nInsertPos, nBufferLength);
			break;
		} else {
			szCharSetCopy = szCharSetCopy.replace(szNewTmp, "");
		}
	}

	szBuffer = szSwap;
	return szBuffer;
}

function GeneratePassword(nLength, bNosimilar, bLowercase, bUppercase, bNumbers, bSymbols) {
	var szLower = "abcdefghjkmnpqrstuvwxyz";
	var szUpper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
	var szNumber = "23456789";
	var szSymbols = ""; //"!\"#$%&'()*+,-./:;<=>?@[]^_`{}~";

	if (bSymbols == 1) szSymbols = $("CustomizeSymbols").value;

	if (!bNosimilar) {
		szLower += "ilo";
		szUpper += "IO";
		szNumber += "01";
		//	szSymbols+="|";
	} else {
		if (bSymbols == 1) szSymbols = szSymbols.replace("|", "");
	}

	var szAll = "";
	var nSetNumber = 0;
	if (bLowercase == 1) {
		szAll += szLower;
		nSetNumber++;
	}
	if (bUppercase == 1) {
		szAll += szUpper;
		nSetNumber++;
	}
	if (bNumbers == 1) {
		szAll += szNumber;
		nSetNumber++;
	}
	if (bSymbols == 1) {
		szAll += szSymbols;
		nSetNumber++;
	}

	if (nSetNumber == 0) {
		szBuffer = "您必须至少选择一个字符集！";
		return szBuffer;
	}

	var nAllLength = szAll.length;
	var nBufferLength = nLength - nSetNumber;
	var szBuffer = "";

	var bAllUnique = $("AllUniqueC").checked;

	if (bAllUnique && nAllLength < nLength) {
		szBuffer = "没有足够的字符集可选！";
		return szBuffer;
	}

	if ($("BeginWithC").checked) {
		if ($("Lowercase").checked == false && $("Uppercase").checked == false) {
			szBuffer = "未选择小写或大写字母！";
			return szBuffer;
		}
	}

	if (!bAllUnique) {
		for (var i = 0; i < nBufferLength; i++) {
			var nPos = 0;
			if (nVer == 1) nPos = Math.floor(Math.random() * nAllLength);
			else {
				const array5 = new Uint32Array(1);
				nPos = crypto.getRandomValues(array5) % nAllLength;
			}
			szBuffer += szAll.substring(nPos, nPos + 1);
		}
	} else {
		var szAllCopy = szAll;
		var bStop = false;
		for (var i = 0; i < nBufferLength && bStop == false; i++) {
			var today = new Date();
			var s1 = today.getSeconds();

			while (true) {
				var today2 = new Date();
				var s2 = today2.getSeconds();
				if (s2 - s1 >= 2) {
					bBreak = 1;
					break;
				}

				var nAllLengthLeft = szAllCopy.length;
				if (nAllLengthLeft == 0) {
					bStop = true;
					break;
				}

				var nPos = 0;
				if (nVer == 1) nPos = Math.floor(Math.random() * nAllLengthLeft);
				else {
					const array6 = new Uint32Array(1);
					nPos = crypto.getRandomValues(array6) % nAllLengthLeft;
				}

				var strNewTmp = szAllCopy.substring(nPos, nPos + 1);
				var nTmp = szBuffer.indexOf(strNewTmp);

				if (nTmp == -1) {
					szBuffer += strNewTmp;
					break;
				} else {
					szAllCopy = szAllCopy.replace(strNewTmp, "");
				}
			}
		}
	}

	if (bUppercase) {
		szBuffer = InsertChar(szUpper, nBufferLength, szBuffer);
		nBufferLength++;
	}

	if (bLowercase) {
		szBuffer = InsertChar(szLower, nBufferLength, szBuffer);
		nBufferLength++;
	}

	if (bNumbers) {
		szBuffer = InsertChar(szNumber, nBufferLength, szBuffer);
		nBufferLength++;
	}

	if (bSymbols) szBuffer = InsertChar(szSymbols, nBufferLength, szBuffer);

	if ($("NoSeqC").checked) {
		var bSeq = false;
		for (var j = 0; j < szBuffer.length - 1; j++) {
			var n1 = szBuffer.charCodeAt(j);
			var n2 = szBuffer.charCodeAt(j + 1);

			if (n2 - n1 == 1 && ((n1 >= 48 && n1 <= 56) || (n1 >= 65 && n1 <= 89) || (n1 >= 97 && n1 <= 121))) {
				bSeq = true;
				szBuffer = "Seq";
				break;
			}
		}
	}

	if ($("BeginWithC").checked) {
		var n3 = szBuffer.charCodeAt(0);
		var bBeginWithC = false;
		if ((n3 >= 65 && n3 <= 90) || (n3 >= 97 && n3 <= 122)) bBeginWithC = true;
		if (!bBeginWithC) szBuffer = "NoC";
	}

	return szBuffer;
}

function $(id) {
	return document.getElementById(id);
}

/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS 180-1
 * Version 2.2 Copyright Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance   */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_sha1(s) {
	return rstr2hex(rstr_sha1(str2rstr_utf8(s)));
}

function b64_sha1(s) {
	return rstr2b64(rstr_sha1(str2rstr_utf8(s)));
}

function any_sha1(s, e) {
	return rstr2any(rstr_sha1(str2rstr_utf8(s)), e);
}

function hex_hmac_sha1(k, d) {
	return rstr2hex(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)));
}

function b64_hmac_sha1(k, d) {
	return rstr2b64(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)));
}

function any_hmac_sha1(k, d, e) {
	return rstr2any(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)), e);
}

/*
 * Perform a simple self-test to see if the VM is working
 */
function sha1_vm_test() {
	return hex_sha1("abc").toLowerCase() == "a9993e364706816aba3e25717850c26c9cd0d89d";
}

/*
 * Calculate the SHA1 of a raw string
 */
function rstr_sha1(s) {
	return binb2rstr(binb_sha1(rstr2binb(s), s.length * 8));
}

/*
 * Calculate the HMAC-SHA1 of a key and some data (raw strings)
 */
function rstr_hmac_sha1(key, data) {
	var bkey = rstr2binb(key);
	if (bkey.length > 16) bkey = binb_sha1(bkey, key.length * 8);

	var ipad = Array(16),
		opad = Array(16);
	for (var i = 0; i < 16; i++) {
		ipad[i] = bkey[i] ^ 0x36363636;
		opad[i] = bkey[i] ^ 0x5c5c5c5c;
	}

	var hash = binb_sha1(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
	return binb2rstr(binb_sha1(opad.concat(hash), 512 + 160));
}

/*
 * Convert a raw string to a hex string
 */
function rstr2hex(input) {
	try {
		hexcase;
	} catch (e) {
		hexcase = 0;
	}
	var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
	var output = "";
	var x;
	for (var i = 0; i < input.length; i++) {
		x = input.charCodeAt(i);
		output += hex_tab.charAt((x >>> 4) & 0x0f) + hex_tab.charAt(x & 0x0f);
	}
	return output;
}

/*
 * Convert a raw string to a base-64 string
 */
function rstr2b64(input) {
	try {
		b64pad;
	} catch (e) {
		b64pad = "";
	}
	var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var output = "";
	var len = input.length;
	for (var i = 0; i < len; i += 3) {
		var triplet = (input.charCodeAt(i) << 16) | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
		for (var j = 0; j < 4; j++) {
			if (i * 8 + j * 6 > input.length * 8) output += b64pad;
			else output += tab.charAt((triplet >>> (6 * (3 - j))) & 0x3f);
		}
	}
	return output;
}

/*
 * Convert a raw string to an arbitrary string encoding
 */
function rstr2any(input, encoding) {
	var divisor = encoding.length;
	var remainders = Array();
	var i, q, x, quotient;

	/* Convert to an array of 16-bit big-endian values, forming the dividend */
	var dividend = Array(Math.ceil(input.length / 2));
	for (i = 0; i < dividend.length; i++) {
		dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
	}

	/*
	 * Repeatedly perform a long division. The binary array forms the dividend,
	 * the length of the encoding is the divisor. Once computed, the quotient
	 * forms the dividend for the next step. We stop when the dividend is zero.
	 * All remainders are stored for later use.
	 */
	while (dividend.length > 0) {
		quotient = Array();
		x = 0;
		for (i = 0; i < dividend.length; i++) {
			x = (x << 16) + dividend[i];
			q = Math.floor(x / divisor);
			x -= q * divisor;
			if (quotient.length > 0 || q > 0) quotient[quotient.length] = q;
		}
		remainders[remainders.length] = x;
		dividend = quotient;
	}

	/* Convert the remainders to the output string */
	var output = "";
	for (i = remainders.length - 1; i >= 0; i--) output += encoding.charAt(remainders[i]);

	/* Append leading zero equivalents */
	var full_length = Math.ceil((input.length * 8) / (Math.log(encoding.length) / Math.log(2)));
	for (i = output.length; i < full_length; i++) output = encoding[0] + output;

	return output;
}

/*
 * Encode a string as utf-8.
 * For efficiency, this assumes the input is valid utf-16.
 */
function str2rstr_utf8(input) {
	var output = "";
	var i = -1;
	var x, y;

	while (++i < input.length) {
		/* Decode utf-16 surrogate pairs */
		x = input.charCodeAt(i);
		y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
		if (0xd800 <= x && x <= 0xdbff && 0xdc00 <= y && y <= 0xdfff) {
			x = 0x10000 + ((x & 0x03ff) << 10) + (y & 0x03ff);
			i++;
		}

		/* Encode output as utf-8 */
		if (x <= 0x7f) output += String.fromCharCode(x);
		else if (x <= 0x7ff) output += String.fromCharCode(0xc0 | ((x >>> 6) & 0x1f), 0x80 | (x & 0x3f));
		else if (x <= 0xffff) output += String.fromCharCode(0xe0 | ((x >>> 12) & 0x0f), 0x80 | ((x >>> 6) & 0x3f), 0x80 | (x & 0x3f));
		else if (x <= 0x1fffff) output += String.fromCharCode(0xf0 | ((x >>> 18) & 0x07), 0x80 | ((x >>> 12) & 0x3f), 0x80 | ((x >>> 6) & 0x3f), 0x80 | (x & 0x3f));
	}
	return output;
}

/*
 * Encode a string as utf-16
 */
function str2rstr_utf16le(input) {
	var output = "";
	for (var i = 0; i < input.length; i++) output += String.fromCharCode(input.charCodeAt(i) & 0xff, (input.charCodeAt(i) >>> 8) & 0xff);
	return output;
}

function str2rstr_utf16be(input) {
	var output = "";
	for (var i = 0; i < input.length; i++) output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xff, input.charCodeAt(i) & 0xff);
	return output;
}

/*
 * Convert a raw string to an array of big-endian words
 * Characters >255 have their high-byte silently ignored.
 */
function rstr2binb(input) {
	var output = Array(input.length >> 2);
	for (var i = 0; i < output.length; i++) output[i] = 0;
	for (var i = 0; i < input.length * 8; i += 8) output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << (24 - (i % 32));
	return output;
}

/*
 * Convert an array of big-endian words to a string
 */
function binb2rstr(input) {
	var output = "";
	for (var i = 0; i < input.length * 32; i += 8) output += String.fromCharCode((input[i >> 5] >>> (24 - (i % 32))) & 0xff);
	return output;
}

/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function binb_sha1(x, len) {
	/* append padding */
	x[len >> 5] |= 0x80 << (24 - (len % 32));
	x[(((len + 64) >> 9) << 4) + 15] = len;

	var w = Array(80);
	var a = 1732584193;
	var b = -271733879;
	var c = -1732584194;
	var d = 271733878;
	var e = -1009589776;

	for (var i = 0; i < x.length; i += 16) {
		var olda = a;
		var oldb = b;
		var oldc = c;
		var oldd = d;
		var olde = e;

		for (var j = 0; j < 80; j++) {
			if (j < 16) w[j] = x[i + j];
			else w[j] = bit_rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
			var t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
			e = d;
			d = c;
			c = bit_rol(b, 30);
			b = a;
			a = t;
		}

		a = safe_add(a, olda);
		b = safe_add(b, oldb);
		c = safe_add(c, oldc);
		d = safe_add(d, oldd);
		e = safe_add(e, olde);
	}
	return Array(a, b, c, d, e);
}

/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d) {
	if (t < 20) return (b & c) | (~b & d);
	if (t < 40) return b ^ c ^ d;
	if (t < 60) return (b & c) | (b & d) | (c & d);
	return b ^ c ^ d;
}

/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t) {
	return t < 20 ? 1518500249 : t < 40 ? 1859775393 : t < 60 ? -1894007588 : -899497514;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y) {
	var lsw = (x & 0xffff) + (y & 0xffff);
	var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	return (msw << 16) | (lsw & 0xffff);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt) {
	return (num << cnt) | (num >>> (32 - cnt));
}

function doWork2() {
	nVer = 2;
	doWork();
}

function doWork1() {
	nVer = 1;
	doWork();
}

function doWork() {
	bBreak = 0;
	var today = new Date();
	var s1 = today.getSeconds();

	var strLength = $("pgLength").value;
	var bNosimilar = 0;
	if ($("Nosimilar").checked) bNosimilar = 1;
	var bSymbols = 0;
	if ($("Symbols").checked) bSymbols = 1;
	var bLowercase = 0;
	if ($("Lowercase").checked) bLowercase = 1;
	var bUppercase = 0;
	if ($("Uppercase").checked) bUppercase = 1;
	var bNumbers = 0;
	if ($("Numbers").checked) bNumbers = 1;
	var nQuantity = $("pgQuantity").value;
	if (nQuantity > 1000) nQuantity = 1000;

	var szPassAll = "";
	strArray = [];
	strArray = new Array(nQuantity);

	for (var i = 0; i < nQuantity; i++) {
		var szPass = "";
		while (szPass.length <= 3) {
			var today2 = new Date();
			var s2 = today2.getSeconds();
			if (s2 - s1 >= 2) {
				bBreak = 1;
				break;
			}

			szPass = GeneratePassword(strLength, bNosimilar, bLowercase, bUppercase, bNumbers, bSymbols);
		}
		szPassAll += szPass;
		strArray[i] = new Array(strLength);
		strArray[i] = szPass;

		if (i != nQuantity - 1) szPassAll += "\n";
	}

	$("final_pass").value = szPassAll;

	var textArea = $("final_pass");

	//  auto_grow( textArea );

	var taHeight = $("final_pass").scrollHeight;

	var numberOfLines = nQuantity; //Math.floor(taHeight/( 26 ) );
	var strLineNum = "";

	for (var iLoop = 1; iLoop <= numberOfLines; iLoop++) {
		strLineNum += '<div id="eell' + iLoop.toString() + '" class="each_line">' + iLoop.toString() + "</div>";
	}

	$("line_num").innerHTML = strLineNum;
	$("line_num").style.lineHeight = "26px";
	//  $("line_num" ).style.height = taHeight + 10 + "px";
	$("line_num").style.height = numberOfLines * 26 + "px";
	textArea.style.height = numberOfLines * 26 + "px";
	//element.style.height = (element.scrollHeight + 10 )+"px";
	//  $("line_num" ).scrollTop = $("final_pass" ).scrollTop;

	for (var iLoop = 1; iLoop <= numberOfLines; iLoop++) {
		$("eell" + iLoop.toString()).style.height = "26px";
		$("eell" + iLoop.toString()).style.lineHeight = "26px";
	}

	nCurPWD = 0;
	$("CopyOne").innerHTML = "复制第 1 行";

	if (bBreak == 1) $("final_pass").value = "生成密码失败，请重试！";

	//$( "body" ).style.background = "#333";
	nNum = nQuantity;
}

function getCookie(c_name) {
	var i,
		x,
		y,
		ARRcookies = document.cookie.split(";");
	for (i = 0; i < ARRcookies.length; i++) {
		x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
		y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
		x = x.replace(/^\s+|\s+$/g, "");
		if (x == c_name) {
			return unescape(y);
		}
	}
}

function setCookie(c_name, value, exdays) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value = escape(value) + (exdays == null ? "" : "; expires=" + exdate.toUTCString());
	document.cookie = c_name + "=" + c_value;
}

function deleteAllCookies() {
	var cookies = document.cookie.split(";");

	for (var i = 0; i < cookies.length; i++) {
		var cookie = cookies[i];
		var eqPos = cookie.indexOf("=");
		var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
		document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
	}
}

function OpenAOption(opt_name) {
	var bValue = getCookie(opt_name);
	if (bValue != null && bValue != "") {
		if (bValue == "true") $(opt_name).checked = true;
		else $(opt_name).checked = false;
	} else {
		if (opt_name != "SaveSettings") $(opt_name).checked = true;
	}
}

function SaveAOption(opt_name, ndays) {
	var bValue = $(opt_name).checked;
	setCookie(opt_name, bValue, ndays);
}

/**
 *
 *  Base64 encode / decode
 *  http://www.webtoolkit.info/
 *
 **/
var Base64 = {
	// private property
	_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode: function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
		}

		return output;
	},

	// public method for decoding
	decode: function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
		}

		output = Base64._utf8_decode(output);

		return output;
	},

	// private method for UTF-8 encoding
	_utf8_encode: function (string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if (c > 127 && c < 2048) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode: function (utftext) {
		var string = "";
		var i = 0;
		var c = (c1 = c2 = 0);

		while (i < utftext.length) {
			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if (c > 191 && c < 224) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}

		return string;
	},
};

function OpenOptions() {
	if (window.top !== window.self) window.top.location.replace(window.self.location.href);

	OpenAOption("Symbols");
	OpenAOption("Lowercase");
	OpenAOption("Uppercase");
	OpenAOption("Numbers");
	OpenAOption("Nosimilar");
	OpenAOption("SaveSettings");

	OpenAOption("BeginWithC");
	OpenAOption("AllUniqueC");
	OpenAOption("NoSeqC");
	OpenAOption("AutoMake");

	var nLength = getCookie("pgLength");
	if (nLength != null && nLength != "") {
		$("pgLength").value = nLength;
	} else $("pgLength").value = 22;

	var nQuantity = getCookie("pgQuantity");
	if (nQuantity != null && nQuantity != "") {
		$("pgQuantity").value = nQuantity;
	} else $("pgQuantity").value = 5;

	var strCustomizeSymbols = getCookie("CustomizeSymbols");
	if (strCustomizeSymbols != null && strCustomizeSymbols != "") {
		$("CustomizeSymbols").value = strCustomizeSymbols;
	} else $("CustomizeSymbols").value = "!\";#$%&'()*+,-./:;<=>?@[]^_`{|}~";

	if ($("AutoMake").checked) doWork();
}

function SaveOptions(bErase) {
	var bSave = $("SaveSettings").checked;
	var ndays = 60;

	if (bSave) {
		SaveAOption("Symbols", ndays);
		SaveAOption("Lowercase", ndays);
		SaveAOption("Uppercase", ndays);
		SaveAOption("Numbers", ndays);
		SaveAOption("Nosimilar", ndays);
		SaveAOption("SaveSettings", ndays);

		SaveAOption("BeginWithC");
		SaveAOption("AllUniqueC");
		SaveAOption("NoSeqC");
		SaveAOption("AutoMake");

		var strCustomizeSymbols = $("CustomizeSymbols").value;
		setCookie("CustomizeSymbols", strCustomizeSymbols, ndays);

		var nLength = $("pgLength").value;
		setCookie("pgLength", nLength, ndays);

		var nQuantity = $("pgQuantity").value;
		setCookie("pgQuantity", nQuantity, ndays);
	} else {
		if (bErase) deleteAllCookies();
	}
}

document.addEventListener("DOMContentLoaded", function () {
	// Function to create and append option elements
	function createOption(value, text) {
		var option = document.createElement("option");
		option.value = value;
		option.text = text;
		return option;
	}

	// Function to populate select element with options
	function populateSelect(selectElement, values) {
		values.forEach(function (value) {
			selectElement.appendChild(createOption(value, value));
		});
	}

	// Populate select elements
	var pgLengthSelect = document.querySelector("select#pgLength");
	var pgQuantitySelect = document.getElementById("pgQuantity");

	// Populating pgLengthSelect
	var weakOptgroup = pgLengthSelect.querySelector('optgroup[label="Weak"]');
	var strongOptgroup = pgLengthSelect.querySelector('optgroup[label="Strong"]');
	for (var i = 6; i <= 50; i++) {
		var option = createOption(i, i);
		if (i <= 15) {
			weakOptgroup.appendChild(option);
		} else {
			strongOptgroup.appendChild(option);
		}
	}

	// Populating pgQuantitySelect
	for (var j = 1; j <= 50; j++) {
		pgQuantitySelect.appendChild(createOption(j, j));
	}

	// Additional values for pgQuantitySelect
	var additionalValues = [100, 200, 300, 500, 1000];
	populateSelect(pgQuantitySelect, additionalValues);
});

document.addEventListener("DOMContentLoaded", function() {
    // 创建版权信息
    function createCopyright() {
        var year = new Date().getFullYear();
        return "Copyright&nbsp;&copy;&nbsp;2021 - " + year + '&nbsp;<a target="_blank" href="https://www.nianbroken.top/" >碎念_Nian</a><br />All&nbsp;Rights&nbsp;Reserved';
    }

    // 创建并插入版权信息
    function insertCopyright() {
        var secBtmDiv = document.createElement("div");
        secBtmDiv.id = "sec_btm";

        var pElement = document.createElement("p");
        pElement.textContent = "我们不存储任何密码";

        secBtmDiv.appendChild(pElement);

        return secBtmDiv;
    }

    // 将元素插入到目标元素之后
    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    // 查找目标元素
    var secPasswordDiv = document.getElementById("sec_password");

    // 创建并插入版权信息
    var secBtmDiv = insertCopyright();

    // 插入版权信息到目标元素之后
    insertAfter(secBtmDiv, secPasswordDiv);

    // 插入版权信息
    secBtmDiv.innerHTML += createCopyright();
});
