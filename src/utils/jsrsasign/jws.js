import {b64utoutf8, b64utohex} from './base64x';
import jsonParse from './jsonParse';

let KJUR = {};
KJUR.jws = {};
KJUR.jws.JWS = function () {
    var ns1 = KJUR.jws.JWS;

    this.parseJWS = function (sJWS, sigValNotNeeded) {
        if ((this.parsedJWS !== undefined) &&
            (sigValNotNeeded || (this.parsedJWS.sigvalH !== undefined))) {
            return;
        }
        var matchResult = sJWS.match(/^([^.]+)\.([^.]+)\.([^.]+)$/);
        if (matchResult == null) {
            throw "JWS signature is not a form of 'Head.Payload.SigValue'.";
        }
        var b6Head = matchResult[1];
        var b6Payload = matchResult[2];
        var b6SigVal = matchResult[3];
        var sSI = b6Head + "." + b6Payload;
        this.parsedJWS = {};
        this.parsedJWS.headB64U = b6Head;
        this.parsedJWS.payloadB64U = b6Payload;
        this.parsedJWS.sigvalB64U = b6SigVal;
        this.parsedJWS.si = sSI;

        if (!sigValNotNeeded) {
            var hSigVal = b64utohex(b6SigVal);
            var biSigVal = parseBigInt(hSigVal, 16);
            this.parsedJWS.sigvalH = hSigVal;
            this.parsedJWS.sigvalBI = biSigVal;
        }

        var sHead = b64utoutf8(b6Head);
        var sPayload = b64utoutf8(b6Payload);
        this.parsedJWS.headS = sHead;
        this.parsedJWS.payloadS = sPayload;

        if (!ns1.isSafeJSONString(sHead, this.parsedJWS, 'headP'))
            throw "malformed JSON string for JWS Head: " + sHead;
    };
};


KJUR.jws.JWS.sign = function (alg, spHeader, spPayload, key, pass) {
    var ns1 = KJUR.jws.JWS;
    var sHeader, pHeader, sPayload;

    // 1. check signatureInput(Header, Payload) is string or object
    if (typeof spHeader != 'string' && typeof spHeader != 'object')
        throw "spHeader must be JSON string or object: " + spHeader;

    if (typeof spHeader == 'object') {
        pHeader = spHeader;
        sHeader = JSON.stringify(pHeader);
    }

    if (typeof spHeader == 'string') {
        sHeader = spHeader;
        if (!ns1.isSafeJSONString(sHeader))
            throw "JWS Head is not safe JSON string: " + sHeader;
        pHeader = ns1.readSafeJSONString(sHeader);

    }

    sPayload = spPayload;
    if (typeof spPayload == 'object') sPayload = JSON.stringify(spPayload);

    // 2. use alg if defined in sHeader
    if ((alg == '' || alg == null) &&
        pHeader['alg'] !== undefined) {
        alg = pHeader['alg'];
    }

    // 3. update sHeader to add alg if alg undefined
    if ((alg != '' && alg != null) &&
        pHeader['alg'] === undefined) {
        pHeader['alg'] = alg;
        sHeader = JSON.stringify(pHeader);
    }

    // 4. check explicit algorithm doesn't match with JWS header.
    if (alg !== pHeader.alg)
        throw "alg and sHeader.alg doesn't match: " + alg + "!=" + pHeader.alg;

    // 5. set signature algorithm like SHA1withRSA
    var sigAlg = null;
    if (ns1.jwsalg2sigalg[alg] === undefined) {
        throw "unsupported alg name: " + alg;
    } else {
        sigAlg = ns1.jwsalg2sigalg[alg];
    }

    var uHeader = utf8tob64u(sHeader);
    var uPayload = utf8tob64u(sPayload);
    var uSignatureInput = uHeader + "." + uPayload
    // 6. sign
    var hSig = "";
    if (sigAlg.substr(0, 4) == "Hmac") {
        if (key === undefined)
            throw "mac key shall be specified for HS* alg";
        //alert("sigAlg=" + sigAlg);
        var mac = new KJUR.crypto.Mac({'alg': sigAlg, 'prov': 'cryptojs', 'pass': key});
        mac.updateString(uSignatureInput);
        hSig = mac.doFinal();
    } else if (sigAlg.indexOf("withECDSA") != -1) {
        var sig = new KJUR.crypto.Signature({'alg': sigAlg});
        sig.init(key, pass);
        sig.updateString(uSignatureInput);
        hASN1Sig = sig.sign();
        hSig = KJUR.crypto.ECDSA.asn1SigToConcatSig(hASN1Sig);
    } else if (sigAlg != "none") {
        var sig = new KJUR.crypto.Signature({'alg': sigAlg});
        sig.init(key, pass);
        sig.updateString(uSignatureInput);
        hSig = sig.sign();
    }

    var uSig = hextob64u(hSig);
    return uSignatureInput + "." + uSig;
};

KJUR.jws.JWS.verify = function (sJWS, key, acceptAlgs) {
    var jws = KJUR.jws.JWS;
    var a = sJWS.split(".");
    var uHeader = a[0];
    var uPayload = a[1];
    var uSignatureInput = uHeader + "." + uPayload;
    var hSig = b64utohex(a[2]);

    // 1. parse JWS header
    var pHeader = jws.readSafeJSONString(b64utoutf8(a[0]));
    var alg = null;
    var algType = null; // HS|RS|PS|ES|no
    if (pHeader.alg === undefined) {
        throw "algorithm not specified in header";
    } else {
        alg = pHeader.alg;
        algType = alg.substr(0, 2);
    }

    // 2. check whether alg is acceptable algorithms
    if (acceptAlgs != null &&
        Object.prototype.toString.call(acceptAlgs) === '[object Array]' &&
        acceptAlgs.length > 0) {
        var acceptAlgStr = ":" + acceptAlgs.join(":") + ":";
        if (acceptAlgStr.indexOf(":" + alg + ":") == -1) {
            throw "algorithm '" + alg + "' not accepted in the list";
        }
    }

    // 3. check whether key is a proper key for alg.
    if (alg != "none" && key === null) {
        throw "key shall be specified to verify.";
    }

    // 3.1. There is no key check for HS* because Mac will check it.
    //      since jsrsasign 5.0.0.

    // 3.2. convert key object if key is a public key or cert PEM string
    if (typeof key == "string" &&
        key.indexOf("-----BEGIN ") != -1) {
        key = KEYUTIL.getKey(key);
    }

    // 3.3. check whether key is RSAKey obj if alg is RS* or PS*.
    if (algType == "RS" || algType == "PS") {
        if (!(key instanceof RSAKey)) {
            throw "key shall be a RSAKey obj for RS* and PS* algs";
        }
    }

    // 3.4. check whether key is ECDSA obj if alg is ES*.
    if (algType == "ES") {
        if (!(key instanceof KJUR.crypto.ECDSA)) {
            throw "key shall be a ECDSA obj for ES* algs";
        }
    }

    // 3.5. check when alg is 'none'
    if (alg == "none") {
    }

    // 4. check whether alg is supported alg in jsjws.
    var sigAlg = null;
    if (jws.jwsalg2sigalg[pHeader.alg] === undefined) {
        throw "unsupported alg name: " + alg;
    } else {
        sigAlg = jws.jwsalg2sigalg[alg];
    }

    // 5. verify
    if (sigAlg == "none") {
        throw "not supported";
    } else if (sigAlg.substr(0, 4) == "Hmac") {
        var hSig2 = null;
        if (key === undefined)
            throw "hexadecimal key shall be specified for HMAC";
        //try {
        var mac = new KJUR.crypto.Mac({'alg': sigAlg, 'pass': key});
        mac.updateString(uSignatureInput);
        hSig2 = mac.doFinal();
        //} catch(ex) {};
        return hSig == hSig2;
    } else if (sigAlg.indexOf("withECDSA") != -1) {
        var hASN1Sig = null;
        try {
            hASN1Sig = KJUR.crypto.ECDSA.concatSigToASN1Sig(hSig);
        } catch (ex) {
            return false;
        }
        var sig = new KJUR.crypto.Signature({'alg': sigAlg});
        sig.init(key)
        sig.updateString(uSignatureInput);
        return sig.verify(hASN1Sig);
    } else {
        var sig = new KJUR.crypto.Signature({'alg': sigAlg});
        sig.init(key)
        sig.updateString(uSignatureInput);
        return sig.verify(hSig);
    }
};

KJUR.jws.JWS.parse = function (sJWS) {
    var a = sJWS.split(".");
    var result = {};
    var uHeader, uPayload, uSig;
    if (a.length != 2 && a.length != 3)
        throw "malformed sJWS: wrong number of '.' splitted elements";

    uHeader = a[0];
    uPayload = a[1];
    if (a.length == 3) uSig = a[2];

    result.headerObj = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(uHeader));
    result.payloadObj = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(uPayload));

    result.headerPP = JSON.stringify(result.headerObj, null, "  ");
    if (result.payloadObj == null) {
        result.payloadPP = b64utoutf8(uPayload);
    } else {
        result.payloadPP = JSON.stringify(result.payloadObj, null, "  ");
    }

    if (uSig !== undefined) {
        result.sigHex = b64utohex(uSig);
    }

    return result;
};

KJUR.jws.JWS.verifyJWT = function (sJWT, key, acceptField) {
    var ns1 = KJUR.jws.JWS;

    // 1. parse JWT
    var a = sJWT.split(".");
    var uHeader = a[0];
    var uPayload = a[1];
    var uSignatureInput = uHeader + "." + uPayload;
    var hSig = b64utohex(a[2]);

    // 2. parse JWS header
    var pHeader = ns1.readSafeJSONString(b64utoutf8(uHeader));

    // 3. parse JWS payload
    var pPayload = ns1.readSafeJSONString(b64utoutf8(uPayload));

    // 4. algorithm ('alg' in header) check
    if (pHeader.alg === undefined) return false;
    if (acceptField.alg === undefined)
        throw "acceptField.alg shall be specified";
    if (!ns1.inArray(pHeader.alg, acceptField.alg)) return false;

    // 5. issuer ('iss' in payload) check
    if (pPayload.iss !== undefined && typeof acceptField.iss === "object") {
        if (!ns1.inArray(pPayload.iss, acceptField.iss)) return false;
    }

    // 6. subject ('sub' in payload) check
    if (pPayload.sub !== undefined && typeof acceptField.sub === "object") {
        if (!ns1.inArray(pPayload.sub, acceptField.sub)) return false;
    }

    // 7. audience ('aud' in payload) check
    if (pPayload.aud !== undefined && typeof acceptField.aud === "object") {
        if (typeof pPayload.aud == "string") {
            if (!ns1.inArray(pPayload.aud, acceptField.aud))
                return false;
        } else if (typeof pPayload.aud == "object") {
            if (!ns1.includedArray(pPayload.aud, acceptField.aud))
                return false;
        }
    }

    // 8. time validity
    //   (nbf - gracePeriod < now < exp + gracePeriod) && (iat - gracePeriod < now)
    var now = KJUR.jws.IntDate.getNow();
    if (acceptField.verifyAt !== undefined && typeof acceptField.verifyAt === "number") {
        now = acceptField.verifyAt;
    }
    if (acceptField.gracePeriod === undefined ||
        typeof acceptField.gracePeriod !== "number") {
        acceptField.gracePeriod = 0;
    }

    // 8.1 expired time 'exp' check
    if (pPayload.exp !== undefined && typeof pPayload.exp == "number") {
        if (pPayload.exp + acceptField.gracePeriod < now) return false;
    }

    // 8.2 not before time 'nbf' check
    if (pPayload.nbf !== undefined && typeof pPayload.nbf == "number") {
        if (now < pPayload.nbf - acceptField.gracePeriod) return false;
    }

    // 8.3 issued at time 'iat' check
    if (pPayload.iat !== undefined && typeof pPayload.iat == "number") {
        if (now < pPayload.iat - acceptField.gracePeriod) return false;
    }

    // 9 JWT id 'jti' check
    if (pPayload.jti !== undefined && acceptField.jti !== undefined) {
        if (pPayload.jti !== acceptField.jti) return false;
    }

    // 10 JWS signature check
    if (!KJUR.jws.JWS.verify(sJWT, key, acceptField.alg)) return false;

    // 11 passed all check
    return true;
};

KJUR.jws.JWS.includedArray = function (a1, a2) {
    var inArray = KJUR.jws.JWS.inArray;
    if (a1 === null) return false;
    if (typeof a1 !== "object") return false;
    if (typeof a1.length !== "number") return false;

    for (var i = 0; i < a1.length; i++) {
        if (!inArray(a1[i], a2)) return false;
    }
    return true;
};

KJUR.jws.JWS.inArray = function (item, a) {
    if (a === null) return false;
    if (typeof a !== "object") return false;
    if (typeof a.length !== "number") return false;
    for (var i = 0; i < a.length; i++) {
        if (a[i] == item) return true;
    }
    return false;
};

/**
 * static associative array of general signature algorithm name from JWS algorithm name
 * @since jws 3.0.0
 */
KJUR.jws.JWS.jwsalg2sigalg = {
    "HS256": "HmacSHA256",
    "HS384": "HmacSHA384",
    "HS512": "HmacSHA512",
    "RS256": "SHA256withRSA",
    "RS384": "SHA384withRSA",
    "RS512": "SHA512withRSA",
    "ES256": "SHA256withECDSA",
    "ES384": "SHA384withECDSA",
    //"ES512":	"SHA512withECDSA", // unsupported because of jsrsasign's bug
    "PS256": "SHA256withRSAandMGF1",
    "PS384": "SHA384withRSAandMGF1",
    "PS512": "SHA512withRSAandMGF1",
    "none": "none",
};

// === utility static method ==================================================

KJUR.jws.JWS.isSafeJSONString = function (s, h, p) {
    var o = null;
    try {
        o = jsonParse(s);
        if (typeof o != "object") return 0;
        if (o.constructor === Array) return 0;
        if (h) h[p] = o;
        return 1;
    } catch (ex) {
        return 0;
    }
};

KJUR.jws.JWS.readSafeJSONString = function (s) {
    var o = null;
    try {
        o = jsonParse(s);
        if (typeof o != "object") return null;
        if (o.constructor === Array) return null;
        return o;
    } catch (ex) {
        return null;
    }
};

KJUR.jws.JWS.getEncodedSignatureValueFromJWS = function (sJWS) {
    var matchResult = sJWS.match(/^[^.]+\.[^.]+\.([^.]+)$/);
    if (matchResult == null) {
        throw "JWS signature is not a form of 'Head.Payload.SigValue'.";
    }
    return matchResult[1];
};

KJUR.jws.JWS.getJWKthumbprint = function (o) {
    if (o.kty !== "RSA" &&
        o.kty !== "EC" &&
        o.kty !== "oct")
        throw "unsupported algorithm for JWK Thumprint";

    // 1. get canonically ordered json string
    var s = '{';
    if (o.kty === "RSA") {
        if (typeof o.n != "string" || typeof o.e != "string")
            throw "wrong n and e value for RSA key";
        s += '"' + 'e' + '":"' + o.e + '",';
        s += '"' + 'kty' + '":"' + o.kty + '",';
        s += '"' + 'n' + '":"' + o.n + '"}';
    } else if (o.kty === "EC") {
        if (typeof o.crv != "string" ||
            typeof o.x != "string" ||
            typeof o.y != "string")
            throw "wrong crv, x and y value for EC key";
        s += '"' + 'crv' + '":"' + o.crv + '",';
        s += '"' + 'kty' + '":"' + o.kty + '",';
        s += '"' + 'x' + '":"' + o.x + '",';
        s += '"' + 'y' + '":"' + o.y + '"}';
    } else if (o.kty === "oct") {
        if (typeof o.k != "string")
            throw "wrong k value for oct(symmetric) key";
        s += '"' + 'kty' + '":"' + o.kty + '",';
        s += '"' + 'k' + '":"' + o.k + '"}';
    }
    //alert(s);

    // 2. get thumb print
    var hJWK = rstrtohex(s);
    var hash = KJUR.crypto.Util.hashHex(hJWK, "sha256");
    var hashB64U = hextob64u(hash);

    return hashB64U;
};

KJUR.jws.IntDate = {};

KJUR.jws.IntDate.get = function (s) {
    if (s == "now") {
        return KJUR.jws.IntDate.getNow();
    } else if (s == "now + 1hour") {
        return KJUR.jws.IntDate.getNow() + 60 * 60;
    } else if (s == "now + 1day") {
        return KJUR.jws.IntDate.getNow() + 60 * 60 * 24;
    } else if (s == "now + 1month") {
        return KJUR.jws.IntDate.getNow() + 60 * 60 * 24 * 30;
    } else if (s == "now + 1year") {
        return KJUR.jws.IntDate.getNow() + 60 * 60 * 24 * 365;
    } else if (s.match(/Z$/)) {
        return KJUR.jws.IntDate.getZulu(s);
    } else if (s.match(/^[0-9]+$/)) {
        return parseInt(s);
    }
    throw "unsupported format: " + s;
};

KJUR.jws.IntDate.getZulu = function (s) {
    var matchResult = s.match(/(\d+)(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)Z/);
    if (matchResult) {
        var sYear = matchResult[1];
        var year = parseInt(sYear);
        if (sYear.length == 4) {
        } else if (sYear.length == 2) {
            if (50 <= year && year < 100) {
                year = 1900 + year;
            } else if (0 <= year && year < 50) {
                year = 2000 + year;
            } else {
                throw "malformed year string for UTCTime";
            }
        } else {
            throw "malformed year string";
        }
        var month = parseInt(matchResult[2]) - 1;
        var day = parseInt(matchResult[3]);
        var hour = parseInt(matchResult[4]);
        var min = parseInt(matchResult[5]);
        var sec = parseInt(matchResult[6]);
        var d = new Date(Date.UTC(year, month, day, hour, min, sec));
        return ~~(d / 1000);
    }
    throw "unsupported format: " + s;
};

KJUR.jws.IntDate.getNow = function () {
    var d = ~~(new Date() / 1000);
    return d;
};

KJUR.jws.IntDate.intDate2UTCString = function (intDate) {
    var d = new Date(intDate * 1000);
    return d.toUTCString();
};

KJUR.jws.IntDate.intDate2Zulu = function (intDate) {
    var d = new Date(intDate * 1000);
    var year = ("0000" + d.getUTCFullYear()).slice(-4);
    var mon = ("00" + (d.getUTCMonth() + 1)).slice(-2);
    var day = ("00" + d.getUTCDate()).slice(-2);
    var hour = ("00" + d.getUTCHours()).slice(-2);
    var min = ("00" + d.getUTCMinutes()).slice(-2);
    var sec = ("00" + d.getUTCSeconds()).slice(-2);
    return year + mon + day + hour + min + sec + "Z";
};


exports.jws = KJUR.jws;