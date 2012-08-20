// This program was compiled from OCaml by js_of_ocaml 1.0
function caml_raise_with_arg (tag, arg) { throw [0, tag, arg]; }
function caml_raise_with_string (tag, msg) {
  caml_raise_with_arg (tag, new MlWrappedString (msg));
}
function caml_invalid_argument (msg) {
  caml_raise_with_string(caml_global_data[4], msg);
}
function caml_array_bound_error () {
  caml_invalid_argument("index out of bounds");
}
function caml_str_repeat(n, s) {
  if (!n) { return ""; }
  if (n & 1) { return caml_str_repeat(n - 1, s) + s; }
  var r = caml_str_repeat(n >> 1, s);
  return r + r;
}
function MlString(param) {
  if (param != null) {
    this.bytes = this.fullBytes = param;
    this.last = this.len = param.length;
  }
}
MlString.prototype = {
  string:null,
  bytes:null,
  fullBytes:null,
  array:null,
  len:null,
  last:0,
  toJsString:function() {
    return this.string = decodeURIComponent (escape(this.getFullBytes()));
  },
  toBytes:function() {
    if (this.string != null)
      var b = unescape (encodeURIComponent (this.string));
    else {
      var b = "", a = this.array, l = a.length;
      for (var i = 0; i < l; i ++) b += String.fromCharCode (a[i]);
    }
    this.bytes = this.fullBytes = b;
    this.last = this.len = b.length;
    return b;
  },
  getBytes:function() {
    var b = this.bytes;
    if (b == null) b = this.toBytes();
    return b;
  },
  getFullBytes:function() {
    var b = this.fullBytes;
    if (b !== null) return b;
    b = this.bytes;
    if (b == null) b = this.toBytes ();
    if (this.last < this.len) {
      this.bytes = (b += caml_str_repeat(this.len - this.last, '\0'));
      this.last = this.len;
    }
    this.fullBytes = b;
    return b;
  },
  toArray:function() {
    var b = this.bytes;
    if (b == null) b = this.toBytes ();
    var a = [], l = this.last;
    for (var i = 0; i < l; i++) a[i] = b.charCodeAt(i);
    for (l = this.len; i < l; i++) a[i] = 0;
    this.string = this.bytes = this.fullBytes = null;
    this.last = this.len;
    this.array = a;
    return a;
  },
  getArray:function() {
    var a = this.array;
    if (!a) a = this.toArray();
    return a;
  },
  getLen:function() {
    var len = this.len;
    if (len !== null) return len;
    this.toBytes();
    return this.len;
  },
  toString:function() { var s = this.string; return s?s:this.toJsString(); },
  valueOf:function() { var s = this.string; return s?s:this.toJsString(); },
  blitToArray:function(i1, a2, i2, l) {
    var a1 = this.array;
    if (a1)
      for (var i = 0; i < l; i++) a2 [i2 + i] = a1 [i1 + i];
    else {
      var b = this.bytes;
      if (b == null) b = this.toBytes();
      var l1 = this.last - i1;
      if (l <= l1)
        for (var i = 0; i < l; i++) a2 [i2 + i] = b.charCodeAt(i1 + i);
      else {
        for (var i = 0; i < l1; i++) a2 [i2 + i] = b.charCodeAt(i1 + i);
        for (; i < l; i++) a2 [i2 + i] = 0;
      }
    }
  },
  get:function (i) {
    var a = this.array;
    if (a) return a[i];
    var b = this.bytes;
    if (b == null) b = this.toBytes();
    return (i<this.last)?b.charCodeAt(i):0;
  },
  safeGet:function (i) {
    if (!this.len) this.toBytes();
    if ((i < 0) || (i >= this.len)) caml_array_bound_error ();
    return this.get(i);
  },
  set:function (i, c) {
    var a = this.array;
    if (!a) {
      if (this.last == i) {
        this.bytes += String.fromCharCode (c & 0xff);
        this.last ++;
        return 0;
      }
      a = this.toArray();
    } else if (this.bytes != null) {
      this.bytes = this.fullBytes = this.string = null;
    }
    a[i] = c & 0xff;
    return 0;
  },
  safeSet:function (i, c) {
    if (this.len == null) this.toBytes ();
    if ((i < 0) || (i >= this.len)) caml_array_bound_error ();
    this.set(i, c);
  },
  fill:function (ofs, len, c) {
    if (ofs >= this.last && this.last && c == 0) return;
    var a = this.array;
    if (!a) a = this.toArray();
    else if (this.bytes != null) {
      this.bytes = this.fullBytes = this.string = null;
    }
    var l = ofs + len;
    for (var i = ofs; i < l; i++) a[i] = c;
  },
  compare:function (s2) {
    if (this.string != null && s2.string != null) {
      if (this.string < s2.string) return -1;
      if (this.string > s2.string) return 1;
      return 0;
    }
    var b1 = this.getFullBytes ();
    var b2 = s2.getFullBytes ();
    if (b1 < b2) return -1;
    if (b1 > b2) return 1;
    return 0;
  },
  equal:function (s2) {
    if (this.string != null && s2.string != null)
      return this.string == s2.string;
    return this.getFullBytes () == s2.getFullBytes ();
  },
  lessThan:function (s2) {
    if (this.string != null && s2.string != null)
      return this.string < s2.string;
    return this.getFullBytes () < s2.getFullBytes ();
  },
  lessEqual:function (s2) {
    if (this.string != null && s2.string != null)
      return this.string <= s2.string;
    return this.getFullBytes () <= s2.getFullBytes ();
  }
}
function MlWrappedString (s) { this.string = s; }
MlWrappedString.prototype = new MlString();
function MlMakeString (l) { this.bytes = ""; this.len = l; }
MlMakeString.prototype = new MlString ();
function caml_array_get (array, index) {
  if ((index < 0) || (index >= array.length - 1)) caml_array_bound_error();
  return array[index+1];
}
function caml_array_set (array, index, newval) {
  if ((index < 0) || (index >= array.length - 1)) caml_array_bound_error();
  array[index+1]=newval; return 0;
}
function caml_blit_string(s1, i1, s2, i2, len) {
  if (len === 0) return;
  if (i2 === s2.last && s2.bytes != null) {
    var b = s1.bytes;
    if (b == null) b = s1.toBytes ();
    if (i1 > 0 || s1.last > len) b = b.slice(i1, i1 + len);
    s2.bytes += b;
    s2.last += b.length;
    return;
  }
  var a = s2.array;
  if (!a) a = s2.toArray(); else { s2.bytes = s2.string = null; }
  s1.blitToArray (i1, a, i2, len);
}
function caml_call_gen(f, args) {
  if(f.fun)
    return caml_call_gen(f.fun, args);
  var n = f.length;
  var d = n - args.length;
  if (d == 0)
    return f.apply(null, args);
  else if (d < 0)
    return caml_call_gen(f.apply(null, args.slice(0,n)), args.slice(n));
  else
    return function (x){ return caml_call_gen(f, args.concat([x])); };
}
function caml_classify_float (x) {
  if (isFinite (x)) {
    if (Math.abs(x) >= 2.2250738585072014e-308) return 0;
    if (x != 0) return 1;
    return 2;
  }
  return isNaN(x)?4:3;
}
function caml_create_string(len) {
  if (len < 0) caml_invalid_argument("String.create");
  return new MlMakeString(len);
}
function caml_fill_string(s, i, l, c) { s.fill (i, l, c); }
function caml_parse_format (fmt) {
  fmt = fmt.toString ();
  var len = fmt.length;
  if (len > 31) caml_invalid_argument("format_int: format too long");
  var f =
    { justify:'+', signstyle:'-', filler:' ', alternate:false,
      base:0, signedconv:false, width:0, uppercase:false,
      sign:1, prec:-1, conv:'f' };
  for (var i = 0; i < len; i++) {
    var c = fmt.charAt(i);
    switch (c) {
    case '-':
      f.justify = '-'; break;
    case '+': case ' ':
      f.signstyle = c; break;
    case '0':
      f.filler = '0'; break;
    case '#':
      f.alternate = true; break;
    case '1': case '2': case '3': case '4': case '5':
    case '6': case '7': case '8': case '9':
      f.width = 0;
      while (c=fmt.charCodeAt(i) - 48, c >= 0 && c <= 9) {
        f.width = f.width * 10 + c; i++
      }
      i--;
     break;
    case '.':
      f.prec = 0;
      i++;
      while (c=fmt.charCodeAt(i) - 48, c >= 0 && c <= 9) {
        f.prec = f.prec * 10 + c; i++
      }
      i--;
    case 'd': case 'i':
      f.signedconv = true; /* fallthrough */
    case 'u':
      f.base = 10; break;
    case 'x':
      f.base = 16; break;
    case 'X':
      f.base = 16; f.uppercase = true; break;
    case 'o':
      f.base = 8; break;
    case 'e': case 'f': case 'g':
      f.signedconv = true; f.conv = c; break;
    case 'E': case 'F': case 'G':
      f.signedconv = true; f.uppercase = true;
      f.conv = c.toLowerCase (); break;
    }
  }
  return f;
}
function caml_finish_formatting(f, rawbuffer) {
  if (f.uppercase) rawbuffer = rawbuffer.toUpperCase();
  var len = rawbuffer.length;
  if (f.signedconv && (f.sign < 0 || f.signstyle != '-')) len++;
  if (f.alternate) {
    if (f.base == 8) len += 1;
    if (f.base == 16) len += 2;
  }
  var buffer = "";
  if (f.justify == '+' && f.filler == ' ')
    for (var i = len; i < f.width; i++) buffer += ' ';
  if (f.signedconv) {
    if (f.sign < 0) buffer += '-';
    else if (f.signstyle != '-') buffer += f.signstyle;
  }
  if (f.alternate && f.base == 8) buffer += '0';
  if (f.alternate && f.base == 16) buffer += "0x";
  if (f.justify == '+' && f.filler == '0')
    for (var i = len; i < f.width; i++) buffer += '0';
  buffer += rawbuffer;
  if (f.justify == '-')
    for (var i = len; i < f.width; i++) buffer += ' ';
  return new MlWrappedString (buffer);
}
function caml_format_float (fmt, x) {
  var s, f = caml_parse_format(fmt);
  var prec = (f.prec < 0)?6:f.prec;
  if (x < 0) { f.sign = -1; x = -x; }
  if (isNaN(x)) { s = "nan"; f.filler = ' '; }
  else if (!isFinite(x)) { s = "inf"; f.filler = ' '; }
  else
    switch (f.conv) {
    case 'e':
      var s = x.toExponential(prec);
      var i = s.length;
      if (s.charAt(i - 3) == 'e')
        s = s.slice (0, i - 1) + '0' + s.slice (i - 1);
      break;
    case 'f':
      s = x.toFixed(prec); break;
    case 'g':
      prec = prec?prec:1;
      s = x.toExponential(prec - 1);
      var j = s.indexOf('e');
      var exp = +s.slice(j + 1);
      if (exp < -4 || x.toFixed(0).length > prec) {
        var i = j - 1; while (s.charAt(i) == '0') i--;
        if (s.charAt(i) == '.') i--;
        s = s.slice(0, i + 1) + s.slice(j);
        i = s.length;
        if (s.charAt(i - 3) == 'e')
          s = s.slice (0, i - 1) + '0' + s.slice (i - 1);
        break;
      } else {
        var p = prec;
        if (exp < 0) { p -= exp + 1; s = x.toFixed(p); }
        else while (s = x.toFixed(p), s.length > prec + 1) p--;
        if (p) {
          var i = s.length - 1; while (s.charAt(i) == '0') i--;
          if (s.charAt(i) == '.') i--;
          s = s.slice(0, i + 1);
        }
      }
      break;
    }
  return caml_finish_formatting(f, s);
}
function caml_format_int(fmt, i) {
  if (fmt.toString() == "%d") return new MlWrappedString(""+i);
  var f = caml_parse_format(fmt);
  if (i < 0) { if (f.signedconv) { f.sign = -1; i = -i; } else i >>>= 0; }
  var s = i.toString(f.base);
  if (f.prec >= 0) {
    f.filler = ' ';
    var n = f.prec - s.length;
    if (n > 0) s = caml_str_repeat (n, '0') + s;
  }
  return caml_finish_formatting(f, s);
}
function caml_int64_is_negative(x) {
  return (x[3] << 16) < 0;
}
function caml_int64_neg (x) {
  var y1 = - x[1];
  var y2 = - x[2] + (y1 >> 24);
  var y3 = - x[3] + (y2 >> 24);
  return [255, y1 & 0xffffff, y2 & 0xffffff, y3 & 0xffff];
}
function caml_int64_of_int32 (x) {
  return [255, x & 0xffffff, (x >> 24) & 0xffffff, (x >> 31) & 0xffff]
}
function caml_int64_ucompare(x,y) {
  if (x[3] > y[3]) return 1;
  if (x[3] < y[3]) return -1;
  if (x[2] > y[2]) return 1;
  if (x[2] < y[2]) return -1;
  if (x[1] > y[1]) return 1;
  if (x[1] < y[1]) return -1;
  return 0;
}
function caml_int64_lsl1 (x) {
  x[3] = (x[3] << 1) | (x[2] >> 23);
  x[2] = ((x[2] << 1) | (x[1] >> 23)) & 0xffffff;
  x[1] = (x[1] << 1) & 0xffffff;
}
function caml_int64_lsr1 (x) {
  x[1] = ((x[1] >>> 1) | (x[2] << 23)) & 0xffffff;
  x[2] = ((x[2] >>> 1) | (x[3] << 23)) & 0xffffff;
  x[3] = x[3] >>> 1;
}
function caml_int64_sub (x, y) {
  var z1 = x[1] - y[1];
  var z2 = x[2] - y[2] + (z1 >> 24);
  var z3 = x[3] - y[3] + (z2 >> 24);
  return [255, z1 & 0xffffff, z2 & 0xffffff, z3 & 0xffff];
}
function caml_int64_udivmod (x, y) {
  var offset = 0;
  var modulus = x.slice ();
  var divisor = y.slice ();
  var quotient = [255, 0, 0, 0];
  while (caml_int64_ucompare (modulus, divisor) > 0) {
    offset++;
    caml_int64_lsl1 (divisor);
  }
  while (offset >= 0) {
    offset --;
    caml_int64_lsl1 (quotient);
    if (caml_int64_ucompare (modulus, divisor) >= 0) {
      quotient[1] ++;
      modulus = caml_int64_sub (modulus, divisor);
    }
    caml_int64_lsr1 (divisor);
  }
  return [0,quotient, modulus];
}
function caml_int64_to_int32 (x) {
  return x[1] | (x[2] << 24);
}
function caml_int64_is_zero(x) {
  return (x[3]|x[2]|x[1]) == 0;
}
function caml_int64_format (fmt, x) {
  var f = caml_parse_format(fmt);
  if (f.signedconv && caml_int64_is_negative(x)) {
    f.sign = -1; x = caml_int64_neg(x);
  }
  var buffer = "";
  var wbase = caml_int64_of_int32(f.base);
  var cvtbl = "0123456789abcdef";
  do {
    var p = caml_int64_udivmod(x, wbase);
    x = p[1];
    buffer = cvtbl.charAt(caml_int64_to_int32(p[2])) + buffer;
  } while (! caml_int64_is_zero(x));
  if (f.prec >= 0) {
    f.filler = ' ';
    var n = f.prec - buffer.length;
    if (n > 0) buffer = caml_str_repeat (n, '0') + buffer;
  }
  return caml_finish_formatting(f, buffer);
}
function caml_parse_sign_and_base (s) {
  var i = 0, base = 10, sign = s.get(0) == 45?(i++,-1):1;
  if (s.get(i) == 48)
    switch (s.get(i + 1)) {
    case 120: case 88: base = 16; i += 2; break;
    case 111: case 79: base =  8; i += 2; break;
    case  98: case 66: base =  2; i += 2; break;
    }
  return [i, sign, base];
}
function caml_parse_digit(c) {
  if (c >= 48 && c <= 57)  return c - 48;
  if (c >= 65 && c <= 90)  return c - 55;
  if (c >= 97 && c <= 122) return c - 87;
  return -1;
}
var caml_global_data = [0];
function caml_failwith (msg) {
  caml_raise_with_string(caml_global_data[3], msg);
}
function caml_int_of_string (s) {
  var r = caml_parse_sign_and_base (s);
  var i = r[0], sign = r[1], base = r[2];
  var threshold = -1 >>> 0;
  var c = s.get(i);
  var d = caml_parse_digit(c);
  if (d < 0 || d >= base) caml_failwith("int_of_string");
  var res = d;
  for (;;) {
    i++;
    c = s.get(i);
    if (c == 95) continue;
    d = caml_parse_digit(c);
    if (d < 0 || d >= base) break;
    res = base * res + d;
    if (res > threshold) caml_failwith("int_of_string");
  }
  if (i != s.getLen()) caml_failwith("int_of_string");
  res = sign * res;
  if ((res | 0) != res) caml_failwith("int_of_string");
  return res;
}
function caml_is_printable(c) { return +(c > 31 && c < 127); }
function caml_js_call(f, o, args) { return f.apply(o, args.slice(1)); }
function caml_js_get_console () {
  var c = window.console?window.console:{};
  var m = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml",
           "trace", "group", "groupCollapsed", "groupEnd", "time", "timeEnd"];
  function f () {}
  for (var i = 0; i < m.length; i++) if (!c[m[i]]) c[m[i]]=f;
  return c;
}
function caml_js_wrap_callback(f) {
  var toArray = Array.prototype.slice;
  return function () {
    var args = (arguments.length > 0)?toArray.call (arguments):[undefined];
    return caml_call_gen(f, args);
  }
}
function caml_make_vect (len, init) {
  var b = [0]; for (var i = 1; i <= len; i++) b[i] = init; return b;
}
function caml_ml_out_channels_list () { return 0; }
function caml_mul(x,y) {
  return ((((x >> 16) * y) << 16) + (x & 0xffff) * y)|0;
}
function caml_register_global (n, v) { caml_global_data[n + 1] = v; }
var caml_named_values = {};
function caml_register_named_value(nm,v) {
  caml_named_values[nm] = v; return 0;
}
function caml_sys_get_config () {
  return [0, new MlWrappedString("Unix"), 32];
}
(function(){function gd(hm,hn,ho,hp,hq,hr,hs){return hm.length==6?hm(hn,ho,hp,hq,hr,hs):caml_call_gen(hm,[hn,ho,hp,hq,hr,hs]);}function bV(hi,hj,hk,hl){return hi.length==3?hi(hj,hk,hl):caml_call_gen(hi,[hj,hk,hl]);}function co(hf,hg,hh){return hf.length==2?hf(hg,hh):caml_call_gen(hf,[hg,hh]);}function aY(hd,he){return hd.length==1?hd(he):caml_call_gen(hd,[he]);}var a=[0,new MlString("Failure")],b=[0,new MlString("Invalid_argument")];caml_register_global(5,[0,new MlString("Division_by_zero")]);caml_register_global(3,b);caml_register_global(2,a);var U=[0,new MlString("Assert_failure")],T=new MlString("%.12g"),S=new MlString("."),R=new MlString("%d"),Q=new MlString("true"),P=new MlString("false"),O=new MlString("Pervasives.do_at_exit"),N=new MlString("\\b"),M=new MlString("\\t"),L=new MlString("\\n"),K=new MlString("\\r"),J=new MlString("\\\\"),I=new MlString("\\'"),H=new MlString("String.blit"),G=new MlString("String.sub"),F=new MlString("Buffer.add: cannot grow buffer"),E=new MlString("%"),D=new MlString(""),C=new MlString(""),B=new MlString("\""),A=new MlString("\""),z=new MlString("'"),y=new MlString("'"),x=new MlString("."),w=new MlString("printf: bad positional specification (0)."),v=new MlString("%_"),u=[0,new MlString("printf.ml"),144,8],t=new MlString("''"),s=new MlString("Printf: premature end of format string ``"),r=new MlString("''"),q=new MlString(" in format string ``"),p=new MlString(", at char number "),o=new MlString("Printf: bad conversion %"),n=new MlString("Sformat.index_of_int: negative argument "),m=new MlString("on"),l=new MlString("canvas"),k=new MlString("mouseup"),j=new MlString("mousemove"),i=new MlString("2d"),h=new MlString("Dom_html.Canvas_not_available"),g=new MlString("#000000"),f=new MlString("%d,%d");function e(c){throw [0,a,c];}function V(d){throw [0,b,d];}function ae(W,Y){var X=W.getLen(),Z=Y.getLen(),_=caml_create_string(X+Z|0);caml_blit_string(W,0,_,0,X);caml_blit_string(Y,0,_,X,Z);return _;}function af($){return caml_format_int(R,$);}function ag(ad){var aa=caml_ml_out_channels_list(0);for(;;){if(aa){var ab=aa[2];try {}catch(ac){}var aa=ab;continue;}return 0;}}caml_register_named_value(O,ag);function at(ah,aj){var ai=caml_create_string(ah);caml_fill_string(ai,0,ah,aj);return ai;}function au(am,ak,al){if(0<=ak&&0<=al&&!((am.getLen()-al|0)<ak)){var an=caml_create_string(al);caml_blit_string(am,ak,an,0,al);return an;}return V(G);}function av(aq,ap,as,ar,ao){if(0<=ao&&0<=ap&&!((aq.getLen()-ao|0)<ap)&&0<=ar&&!((as.getLen()-ao|0)<ar))return caml_blit_string(aq,ap,as,ar,ao);return V(H);}var aw=caml_sys_get_config(0)[2],ax=caml_mul(aw/8|0,(1<<(aw-10|0))-1|0)-1|0;function aP(ay){var az=1<=ay?ay:1,aA=ax<az?ax:az,aB=caml_create_string(aA);return [0,aB,0,aA,aB];}function aQ(aC){return au(aC[1],0,aC[2]);}function aJ(aD,aF){var aE=[0,aD[3]];for(;;){if(aE[1]<(aD[2]+aF|0)){aE[1]=2*aE[1]|0;continue;}if(ax<aE[1])if((aD[2]+aF|0)<=ax)aE[1]=ax;else e(F);var aG=caml_create_string(aE[1]);av(aD[1],0,aG,0,aD[2]);aD[1]=aG;aD[3]=aE[1];return 0;}}function aR(aH,aK){var aI=aH[2];if(aH[3]<=aI)aJ(aH,1);aH[1].safeSet(aI,aK);aH[2]=aI+1|0;return 0;}function aS(aN,aL){var aM=aL.getLen(),aO=aN[2]+aM|0;if(aN[3]<aO)aJ(aN,aM);av(aL,0,aN[1],aN[2],aM);aN[2]=aO;return 0;}function aW(aT){return 0<=aT?aT:e(ae(n,af(aT)));}function aX(aU,aV){return aW(aU+aV|0);}var aZ=aY(aX,1);function a6(a0){return au(a0,0,a0.getLen());}function a8(a1,a2,a4){var a3=ae(q,ae(a1,r)),a5=ae(p,ae(af(a2),a3));return V(ae(o,ae(at(1,a4),a5)));}function b1(a7,a_,a9){return a8(a6(a7),a_,a9);}function b2(a$){return V(ae(s,ae(a6(a$),t)));}function bx(ba,bi,bk,bm){function bh(bb){if((ba.safeGet(bb)-48|0)<0||9<(ba.safeGet(bb)-48|0))return bb;var bc=bb+1|0;for(;;){var bd=ba.safeGet(bc);if(48<=bd){if(!(58<=bd)){var bf=bc+1|0,bc=bf;continue;}var be=0;}else if(36===bd){var bg=bc+1|0,be=1;}else var be=0;if(!be)var bg=bb;return bg;}}var bj=bh(bi+1|0),bl=aP((bk-bj|0)+10|0);aR(bl,37);var bn=bm,bo=0;for(;;){if(bn){var bp=bn[2],bq=[0,bn[1],bo],bn=bp,bo=bq;continue;}var br=bj,bs=bo;for(;;){if(br<=bk){var bt=ba.safeGet(br);if(42===bt){if(bs){var bu=bs[2];aS(bl,af(bs[1]));var bv=bh(br+1|0),br=bv,bs=bu;continue;}throw [0,U,u];}aR(bl,bt);var bw=br+1|0,br=bw;continue;}return aQ(bl);}}}function dr(bD,bB,bA,bz,by){var bC=bx(bB,bA,bz,by);if(78!==bD&&110!==bD)return bC;bC.safeSet(bC.getLen()-1|0,117);return bC;}function b3(bK,bU,bZ,bE,bY){var bF=bE.getLen();function bW(bG,bT){var bH=40===bG?41:125;function bS(bI){var bJ=bI;for(;;){if(bF<=bJ)return aY(bK,bE);if(37===bE.safeGet(bJ)){var bL=bJ+1|0;if(bF<=bL)var bM=aY(bK,bE);else{var bN=bE.safeGet(bL),bO=bN-40|0;if(bO<0||1<bO){var bP=bO-83|0;if(bP<0||2<bP)var bQ=1;else switch(bP){case 1:var bQ=1;break;case 2:var bR=1,bQ=0;break;default:var bR=0,bQ=0;}if(bQ){var bM=bS(bL+1|0),bR=2;}}else var bR=0===bO?0:1;switch(bR){case 1:var bM=bN===bH?bL+1|0:bV(bU,bE,bT,bN);break;case 2:break;default:var bM=bS(bW(bN,bL+1|0)+1|0);}}return bM;}var bX=bJ+1|0,bJ=bX;continue;}}return bS(bT);}return bW(bZ,bY);}function cr(b0){return bV(b3,b2,b1,b0);}function cH(b4,cd,cn){var b5=b4.getLen()-1|0;function cp(b6){var b7=b6;a:for(;;){if(b7<b5){if(37===b4.safeGet(b7)){var b8=0,b9=b7+1|0;for(;;){if(b5<b9)var b_=b2(b4);else{var b$=b4.safeGet(b9);if(58<=b$){if(95===b$){var cb=b9+1|0,ca=1,b8=ca,b9=cb;continue;}}else if(32<=b$)switch(b$-32|0){case 1:case 2:case 4:case 5:case 6:case 7:case 8:case 9:case 12:case 15:break;case 0:case 3:case 11:case 13:var cc=b9+1|0,b9=cc;continue;case 10:var ce=bV(cd,b8,b9,105),b9=ce;continue;default:var cf=b9+1|0,b9=cf;continue;}var cg=b9;c:for(;;){if(b5<cg)var ch=b2(b4);else{var ci=b4.safeGet(cg);if(126<=ci)var cj=0;else switch(ci){case 78:case 88:case 100:case 105:case 111:case 117:case 120:var ch=bV(cd,b8,cg,105),cj=1;break;case 69:case 70:case 71:case 101:case 102:case 103:var ch=bV(cd,b8,cg,102),cj=1;break;case 33:case 37:case 44:var ch=cg+1|0,cj=1;break;case 83:case 91:case 115:var ch=bV(cd,b8,cg,115),cj=1;break;case 97:case 114:case 116:var ch=bV(cd,b8,cg,ci),cj=1;break;case 76:case 108:case 110:var ck=cg+1|0;if(b5<ck){var ch=bV(cd,b8,cg,105),cj=1;}else{var cl=b4.safeGet(ck)-88|0;if(cl<0||32<cl)var cm=1;else switch(cl){case 0:case 12:case 17:case 23:case 29:case 32:var ch=co(cn,bV(cd,b8,cg,ci),105),cj=1,cm=0;break;default:var cm=1;}if(cm){var ch=bV(cd,b8,cg,105),cj=1;}}break;case 67:case 99:var ch=bV(cd,b8,cg,99),cj=1;break;case 66:case 98:var ch=bV(cd,b8,cg,66),cj=1;break;case 41:case 125:var ch=bV(cd,b8,cg,ci),cj=1;break;case 40:var ch=cp(bV(cd,b8,cg,ci)),cj=1;break;case 123:var cq=bV(cd,b8,cg,ci),cs=bV(cr,ci,b4,cq),ct=cq;for(;;){if(ct<(cs-2|0)){var cu=co(cn,ct,b4.safeGet(ct)),ct=cu;continue;}var cv=cs-1|0,cg=cv;continue c;}default:var cj=0;}if(!cj)var ch=b1(b4,cg,ci);}var b_=ch;break;}}var b7=b_;continue a;}}var cw=b7+1|0,b7=cw;continue;}return b7;}}cp(0);return 0;}function eG(cI){var cx=[0,0,0,0];function cG(cC,cD,cy){var cz=41!==cy?1:0,cA=cz?125!==cy?1:0:cz;if(cA){var cB=97===cy?2:1;if(114===cy)cx[3]=cx[3]+1|0;if(cC)cx[2]=cx[2]+cB|0;else cx[1]=cx[1]+cB|0;}return cD+1|0;}cH(cI,cG,function(cE,cF){return cE+1|0;});return cx[1];}function dm(cJ,cM,cU,cK){var cL=cJ.safeGet(cK);if((cL-48|0)<0||9<(cL-48|0))return co(cM,0,cK);var cN=cL-48|0,cO=cK+1|0;for(;;){var cP=cJ.safeGet(cO);if(48<=cP){if(!(58<=cP)){var cS=cO+1|0,cR=(10*cN|0)+(cP-48|0)|0,cN=cR,cO=cS;continue;}var cQ=0;}else if(36===cP)if(0===cN){var cT=e(w),cQ=1;}else{var cT=co(cM,[0,aW(cN-1|0)],cO+1|0),cQ=1;}else var cQ=0;if(!cQ)var cT=co(cM,0,cK);return cT;}}function dh(cV,cW){return cV?cW:aY(aZ,cW);}function c8(cX,cY){return cX?cX[1]:cY;}function gc(e7,c0,fh,e8,eL,fn,cZ){var c1=aY(c0,cZ);function eK(c6,fm,c2,c$){var c5=c2.getLen();function eH(fe,c3){var c4=c3;for(;;){if(c5<=c4)return aY(c6,c1);var c7=c2.safeGet(c4);if(37===c7){var dd=function(c_,c9){return caml_array_get(c$,c8(c_,c9));},dj=function(dl,de,dg,da){var db=da;for(;;){var dc=c2.safeGet(db)-32|0;if(!(dc<0||25<dc))switch(dc){case 1:case 2:case 4:case 5:case 6:case 7:case 8:case 9:case 12:case 15:break;case 10:return dm(c2,function(df,dk){var di=[0,dd(df,de),dg];return dj(dl,dh(df,de),di,dk);},de,db+1|0);default:var dn=db+1|0,db=dn;continue;}var dp=c2.safeGet(db);if(124<=dp)var dq=0;else switch(dp){case 78:case 88:case 100:case 105:case 111:case 117:case 120:var ds=dd(dl,de),dt=caml_format_int(dr(dp,c2,c4,db,dg),ds),dv=du(dh(dl,de),dt,db+1|0),dq=1;break;case 69:case 71:case 101:case 102:case 103:var dw=dd(dl,de),dx=caml_format_float(bx(c2,c4,db,dg),dw),dv=du(dh(dl,de),dx,db+1|0),dq=1;break;case 76:case 108:case 110:var dy=c2.safeGet(db+1|0)-88|0;if(dy<0||32<dy)var dz=1;else switch(dy){case 0:case 12:case 17:case 23:case 29:case 32:var dA=db+1|0,dB=dp-108|0;if(dB<0||2<dB)var dC=0;else{switch(dB){case 1:var dC=0,dD=0;break;case 2:var dE=dd(dl,de),dF=caml_format_int(bx(c2,c4,dA,dg),dE),dD=1;break;default:var dG=dd(dl,de),dF=caml_format_int(bx(c2,c4,dA,dg),dG),dD=1;}if(dD){var dH=dF,dC=1;}}if(!dC){var dI=dd(dl,de),dH=caml_int64_format(bx(c2,c4,dA,dg),dI);}var dv=du(dh(dl,de),dH,dA+1|0),dq=1,dz=0;break;default:var dz=1;}if(dz){var dJ=dd(dl,de),dK=caml_format_int(dr(110,c2,c4,db,dg),dJ),dv=du(dh(dl,de),dK,db+1|0),dq=1;}break;case 83:case 115:var dL=dd(dl,de);if(115===dp)var dM=dL;else{var dN=[0,0],dO=0,dP=dL.getLen()-1|0;if(!(dP<dO)){var dQ=dO;for(;;){var dR=dL.safeGet(dQ),dS=14<=dR?34===dR?1:92===dR?1:0:11<=dR?13<=dR?1:0:8<=dR?1:0,dT=dS?2:caml_is_printable(dR)?1:4;dN[1]=dN[1]+dT|0;var dU=dQ+1|0;if(dP!==dQ){var dQ=dU;continue;}break;}}if(dN[1]===dL.getLen())var dV=dL;else{var dW=caml_create_string(dN[1]);dN[1]=0;var dX=0,dY=dL.getLen()-1|0;if(!(dY<dX)){var dZ=dX;for(;;){var d0=dL.safeGet(dZ),d1=d0-34|0;if(d1<0||58<d1)if(-20<=d1)var d2=1;else{switch(d1+34|0){case 8:dW.safeSet(dN[1],92);dN[1]+=1;dW.safeSet(dN[1],98);var d3=1;break;case 9:dW.safeSet(dN[1],92);dN[1]+=1;dW.safeSet(dN[1],116);var d3=1;break;case 10:dW.safeSet(dN[1],92);dN[1]+=1;dW.safeSet(dN[1],110);var d3=1;break;case 13:dW.safeSet(dN[1],92);dN[1]+=1;dW.safeSet(dN[1],114);var d3=1;break;default:var d2=1,d3=0;}if(d3)var d2=0;}else var d2=(d1-1|0)<0||56<(d1-1|0)?(dW.safeSet(dN[1],92),dN[1]+=1,dW.safeSet(dN[1],d0),0):1;if(d2)if(caml_is_printable(d0))dW.safeSet(dN[1],d0);else{dW.safeSet(dN[1],92);dN[1]+=1;dW.safeSet(dN[1],48+(d0/100|0)|0);dN[1]+=1;dW.safeSet(dN[1],48+((d0/10|0)%10|0)|0);dN[1]+=1;dW.safeSet(dN[1],48+(d0%10|0)|0);}dN[1]+=1;var d4=dZ+1|0;if(dY!==dZ){var dZ=d4;continue;}break;}}var dV=dW;}var dM=ae(A,ae(dV,B));}if(db===(c4+1|0))var d5=dM;else{var d6=bx(c2,c4,db,dg);try {var d7=0,d8=1;for(;;){if(d6.getLen()<=d8)var d9=[0,0,d7];else{var d_=d6.safeGet(d8);if(49<=d_)if(58<=d_)var d$=0;else{var d9=[0,caml_int_of_string(au(d6,d8,(d6.getLen()-d8|0)-1|0)),d7],d$=1;}else{if(45===d_){var eb=d8+1|0,ea=1,d7=ea,d8=eb;continue;}var d$=0;}if(!d$){var ec=d8+1|0,d8=ec;continue;}}var ed=d9;break;}}catch(ee){if(ee[1]!==a)throw ee;var ed=a8(d6,0,115);}var ef=ed[1],eg=dM.getLen(),eh=0,el=ed[2],ek=32;if(ef===eg&&0===eh){var ei=dM,ej=1;}else var ej=0;if(!ej)if(ef<=eg)var ei=au(dM,eh,eg);else{var em=at(ef,ek);if(el)av(dM,eh,em,0,eg);else av(dM,eh,em,ef-eg|0,eg);var ei=em;}var d5=ei;}var dv=du(dh(dl,de),d5,db+1|0),dq=1;break;case 67:case 99:var en=dd(dl,de);if(99===dp)var eo=at(1,en);else{if(39===en)var ep=I;else if(92===en)var ep=J;else{if(14<=en)var eq=0;else switch(en){case 8:var ep=N,eq=1;break;case 9:var ep=M,eq=1;break;case 10:var ep=L,eq=1;break;case 13:var ep=K,eq=1;break;default:var eq=0;}if(!eq)if(caml_is_printable(en)){var er=caml_create_string(1);er.safeSet(0,en);var ep=er;}else{var es=caml_create_string(4);es.safeSet(0,92);es.safeSet(1,48+(en/100|0)|0);es.safeSet(2,48+((en/10|0)%10|0)|0);es.safeSet(3,48+(en%10|0)|0);var ep=es;}}var eo=ae(y,ae(ep,z));}var dv=du(dh(dl,de),eo,db+1|0),dq=1;break;case 66:case 98:var eu=db+1|0,et=dd(dl,de)?Q:P,dv=du(dh(dl,de),et,eu),dq=1;break;case 40:case 123:var ev=dd(dl,de),ew=bV(cr,dp,c2,db+1|0);if(123===dp){var ex=aP(ev.getLen()),eB=function(ez,ey){aR(ex,ey);return ez+1|0;};cH(ev,function(eA,eD,eC){if(eA)aS(ex,v);else aR(ex,37);return eB(eD,eC);},eB);var eE=aQ(ex),dv=du(dh(dl,de),eE,ew),dq=1;}else{var eF=dh(dl,de),eI=aX(eG(ev),eF),dv=eK(function(eJ){return eH(eI,ew);},eF,ev,c$),dq=1;}break;case 33:aY(eL,c1);var dv=eH(de,db+1|0),dq=1;break;case 37:var dv=du(de,E,db+1|0),dq=1;break;case 41:var dv=du(de,D,db+1|0),dq=1;break;case 44:var dv=du(de,C,db+1|0),dq=1;break;case 70:var eM=dd(dl,de);if(0===dg){var eN=caml_format_float(T,eM),eO=0,eP=eN.getLen();for(;;){if(eP<=eO)var eQ=ae(eN,S);else{var eR=eN.safeGet(eO),eS=48<=eR?58<=eR?0:1:45===eR?1:0;if(eS){var eT=eO+1|0,eO=eT;continue;}var eQ=eN;}var eU=eQ;break;}}else{var eV=bx(c2,c4,db,dg);if(70===dp)eV.safeSet(eV.getLen()-1|0,103);var eW=caml_format_float(eV,eM);if(3<=caml_classify_float(eM))var eX=eW;else{var eY=0,eZ=eW.getLen();for(;;){if(eZ<=eY)var e0=ae(eW,x);else{var e1=eW.safeGet(eY)-46|0,e2=e1<0||23<e1?55===e1?1:0:(e1-1|0)<0||21<(e1-1|0)?1:0;if(!e2){var e3=eY+1|0,eY=e3;continue;}var e0=eW;}var eX=e0;break;}}var eU=eX;}var dv=du(dh(dl,de),eU,db+1|0),dq=1;break;case 97:var e4=dd(dl,de),e5=aY(aZ,c8(dl,de)),e6=dd(0,e5),e_=db+1|0,e9=dh(dl,e5);if(e7)co(e8,c1,co(e4,0,e6));else co(e4,c1,e6);var dv=eH(e9,e_),dq=1;break;case 116:var e$=dd(dl,de),fb=db+1|0,fa=dh(dl,de);if(e7)co(e8,c1,aY(e$,0));else aY(e$,c1);var dv=eH(fa,fb),dq=1;break;default:var dq=0;}if(!dq)var dv=b1(c2,db,dp);return dv;}},fg=c4+1|0,fd=0;return dm(c2,function(ff,fc){return dj(ff,fe,fd,fc);},fe,fg);}co(fh,c1,c7);var fi=c4+1|0,c4=fi;continue;}}function du(fl,fj,fk){co(e8,c1,fj);return eH(fl,fk);}return eH(fm,0);}var fo=co(eK,fn,aW(0)),fp=eG(cZ);if(fp<0||6<fp){var fC=function(fq,fw){if(fp<=fq){var fr=caml_make_vect(fp,0),fu=function(fs,ft){return caml_array_set(fr,(fp-fs|0)-1|0,ft);},fv=0,fx=fw;for(;;){if(fx){var fy=fx[2],fz=fx[1];if(fy){fu(fv,fz);var fA=fv+1|0,fv=fA,fx=fy;continue;}fu(fv,fz);}return co(fo,cZ,fr);}}return function(fB){return fC(fq+1|0,[0,fB,fw]);};},fD=fC(0,0);}else switch(fp){case 1:var fD=function(fF){var fE=caml_make_vect(1,0);caml_array_set(fE,0,fF);return co(fo,cZ,fE);};break;case 2:var fD=function(fH,fI){var fG=caml_make_vect(2,0);caml_array_set(fG,0,fH);caml_array_set(fG,1,fI);return co(fo,cZ,fG);};break;case 3:var fD=function(fK,fL,fM){var fJ=caml_make_vect(3,0);caml_array_set(fJ,0,fK);caml_array_set(fJ,1,fL);caml_array_set(fJ,2,fM);return co(fo,cZ,fJ);};break;case 4:var fD=function(fO,fP,fQ,fR){var fN=caml_make_vect(4,0);caml_array_set(fN,0,fO);caml_array_set(fN,1,fP);caml_array_set(fN,2,fQ);caml_array_set(fN,3,fR);return co(fo,cZ,fN);};break;case 5:var fD=function(fT,fU,fV,fW,fX){var fS=caml_make_vect(5,0);caml_array_set(fS,0,fT);caml_array_set(fS,1,fU);caml_array_set(fS,2,fV);caml_array_set(fS,3,fW);caml_array_set(fS,4,fX);return co(fo,cZ,fS);};break;case 6:var fD=function(fZ,f0,f1,f2,f3,f4){var fY=caml_make_vect(6,0);caml_array_set(fY,0,fZ);caml_array_set(fY,1,f0);caml_array_set(fY,2,f1);caml_array_set(fY,3,f2);caml_array_set(fY,4,f3);caml_array_set(fY,5,f4);return co(fo,cZ,fY);};break;default:var fD=co(fo,cZ,[0]);}return fD;}function gb(f5){return aP(2*f5.getLen()|0);}function f_(f8,f6){var f7=aQ(f6);f6[2]=0;return aY(f8,f7);}function gg(f9){var ga=aY(f_,f9);return gd(gc,1,gb,aR,aS,function(f$){return 0;},ga);}var gh=[0,0],gi=null,gj=undefined,gk=true;function go(gf){return co(gg,function(ge){return ge;},gf);}var gn=false,gm=Array;function gp(gl){return gl instanceof gm?0:[0,new MlWrappedString(gl.toString())];}gh[1]=[0,gp,gh[1]];function gr(gq){return gq;}function gM(gt){return gr(caml_js_wrap_callback(function(gs){if(gs){var gu=aY(gt,gs);if(!(gu|0))gs.preventDefault();return gu;}var gv=event,gw=aY(gt,gv);gv.returnValue=gw;return gw;}));}function gN(gx){return gx.toString();}function gO(gy,gz,gC,gJ){if(gy.addEventListener===gj){var gA=m.toString().concat(gz),gH=function(gB){var gG=[0,gC,gB,[0]];return aY(function(gF,gE,gD){return caml_js_call(gF,gE,gD);},gG);};gy.attachEvent(gA,gH);return function(gI){return gy.detachEvent(gA,gH);};}gy.addEventListener(gz,gC,gJ);return function(gK){return gy.removeEventListener(gz,gC,gJ);};}function gP(gL){return aY(gL,0);}var gQ=gN(k),gR=gN(j),gS=window,gT=gS.document,gV=i.toString(),gU=[0,h];window.HTMLElement===gj;var g4=caml_js_get_console(0);function g2(gW){return gW.toString();}gS.onload=gM(function(hc){var gX=gT.createElement(l.toString());if(1-(gX.getContext==gi?1:0)){gX.width=640;gX.height=480;gT.body.appendChild(gX);var g5=function(g3,gY){var gZ=gY[2],g0=gY[1],g1=gX.getContext(gV);g1.beginPath();g1.strokeStyle=g2(g);g1.lineWidth=1;g1.moveTo(g3[1],g3[2]);g1.lineTo(g0,gZ);g1.stroke();g1.closePath();return g4.log(g2(bV(go,f,g0,gZ)));};gX.onmousedown=gM(function(g6){var g7=[0,[0,g6.clientX,g6.clientY]],g_=[0,gi],ha=gO(gT,gR,gM(function(g8){var g9=[0,g8.clientX,g8.clientY];g5(g7[1],g9);g7[1]=g9;return gk;}),gk);g_[1]=gr(gO(gT,gQ,gM(function(g$){g5(g7[1],[0,g$.clientX,g$.clientY]);gP(ha);var hb=g_[1];if(hb!=gi)gP(hb);return gk;}),gk));return gk;});return gn;}throw [0,gU];});ag(0);return;}());
