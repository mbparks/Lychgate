/* LYCHGATE :: utils.js :: v5.3.0 */
(function () {
  'use strict';

  var U = {};

  U.VERSION = '5.3.0';
  U.WORLD_SALT = 'LYCHGATE-WORLD-1';
  U.INTERACTION_RANGE_M = 75;
  U.SPEED_GATE_MPS = 7.0;
  U.JITTER_MIN_M = 3;
  U.MAX_PHOTO_BYTES = 1500000;

  U.clamp = function (v, min, max) { return Math.max(min, Math.min(max, v)); };
  U.lerp = function (a, b, t) { return a + (b - a) * t; };
  U.toRad = function (deg) { return deg * Math.PI / 180; };
  U.toDeg = function (rad) { return rad * 180 / Math.PI; };
  U.round = function (n, places) {
    var p = Math.pow(10, places || 0);
    return Math.round(n * p) / p;
  };

  U.distanceM = function (a, b) {
    var R = 6371008.8;
    var p1 = U.toRad(a.lat);
    var p2 = U.toRad(b.lat);
    var dp = U.toRad(b.lat - a.lat);
    var dl = U.toRad(b.lon - a.lon);
    var x = Math.sin(dp / 2) * Math.sin(dp / 2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  };

  U.bearingDeg = function (a, b) {
    var p1 = U.toRad(a.lat);
    var p2 = U.toRad(b.lat);
    var dl = U.toRad(b.lon - a.lon);
    var y = Math.sin(dl) * Math.cos(p2);
    var x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl);
    return (U.toDeg(Math.atan2(y, x)) + 360) % 360;
  };

  U.offsetLatLon = function (origin, eastM, northM) {
    var dLat = northM / 111320;
    var c = Math.cos(U.toRad(origin.lat));
    var dLon = eastM / (111320 * (Math.abs(c) < 0.0001 ? 0.0001 : c));
    return {lat: origin.lat + dLat, lon: origin.lon + dLon};
  };

  U.localMeters = function (origin, point) {
    var north = (point.lat - origin.lat) * 111320;
    var east = (point.lon - origin.lon) * 111320 * Math.cos(U.toRad(origin.lat));
    return {x: east, y: north};
  };

  U.hash32 = function (text) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < String(text).length; i += 1) {
      h ^= String(text).charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  };

  U.mulberry32 = function (seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0;
      a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  };

  U.randomId = function (prefix) {
    var bytes = new Uint32Array(2);
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(bytes);
    } else {
      bytes[0] = Math.floor(Math.random() * 0xffffffff);
      bytes[1] = Date.now() >>> 0;
    }
    return (prefix || 'id') + '-' + bytes[0].toString(36) + bytes[1].toString(36);
  };

  U.isoNow = function () { return new Date().toISOString(); };

  U.formatDistance = function (m) {
    if (!isFinite(m)) return 'Unknown';
    if (m < 1000) return Math.round(m) + ' m';
    return (m / 1000).toFixed(m < 10000 ? 2 : 1) + ' km';
  };

  U.formatArea = function (m2) {
    if (!isFinite(m2)) return 'Unknown';
    if (m2 < 1000000) return Math.round(m2).toLocaleString() + ' m2';
    return (m2 / 1000000).toFixed(m2 < 10000000 ? 2 : 1) + ' km2';
  };

  U.formatBearing = function (deg) {
    if (!isFinite(deg)) return 'Unknown';
    var names = ['N','NE','E','SE','S','SW','W','NW'];
    return Math.round(deg) + '° ' + names[Math.round(deg / 45) % 8];
  };

  U.formatTime = function (iso) {
    try { return new Date(iso).toLocaleString(); } catch (e) { return iso || ''; }
  };

  U.formatDate = function (iso) {
    try { return new Date(iso).toLocaleDateString(); } catch (e) { return iso || ''; }
  };

  U.formatDuration = function (ms) {
    ms = Math.max(0, Number(ms) || 0);
    var sec = Math.round(ms / 1000);
    var h = Math.floor(sec / 3600);
    var m = Math.floor((sec % 3600) / 60);
    var s = sec % 60;
    if (h) return h + 'h ' + m + 'm';
    if (m) return m + 'm ' + s + 's';
    return s + 's';
  };

  U.safeText = function (value, maxLen) {
    var s = String(value == null ? '' : value);
    s = s.replace(/[\u0000-\u001f\u007f]/g, ' ').trim();
    return s.slice(0, maxLen || 500);
  };

  U.downloadText = function (filename, text, type) {
    var blob = new Blob([text], {type: type || 'text/plain;charset=utf-8'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 500);
  };

  U.readFileText = function (file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () { resolve(String(reader.result || '')); };
      reader.onerror = function () { reject(reader.error || new Error('Unable to read file')); };
      reader.readAsText(file);
    });
  };

  U.readFileDataURL = function (file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () { resolve(String(reader.result || '')); };
      reader.onerror = function () { reject(reader.error || new Error('Unable to read file')); };
      reader.readAsDataURL(file);
    });
  };

  U.deepClone = function (obj) { return JSON.parse(JSON.stringify(obj)); };

  U.utf8ToBase64Url = function (text) {
    var bin = unescape(encodeURIComponent(String(text == null ? '' : text)));
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  };

  U.base64UrlToUtf8 = function (text) {
    var b64 = String(text || '').replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    return decodeURIComponent(escape(atob(b64)));
  };

  U.copyText = function (text) {
    text = String(text == null ? '' : text);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () { return U.copyTextFallback(text); });
    }
    return U.copyTextFallback(text);
  };

  U.copyTextFallback = function (text) {
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', 'readonly');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try {
        if (!document.execCommand || !document.execCommand('copy')) throw new Error('Copy command was rejected.');
        resolve();
      } catch (e) { reject(e); }
      finally { ta.remove(); }
    });
  };

  U.stableStringify = function (value) {
    if (value === null || typeof value !== 'object') return JSON.stringify(value);
    if (Array.isArray(value)) return '[' + value.map(U.stableStringify).join(',') + ']';
    var keys = Object.keys(value).sort();
    return '{' + keys.map(function (k) { return JSON.stringify(k) + ':' + U.stableStringify(value[k]); }).join(',') + '}';
  };

  U.simpleSignature = function (payload, signer) {
    var text = U.stableStringify(payload) + '|' + String(signer || '');
    var a = U.hash32('A|' + text).toString(16).padStart(8, '0');
    var b = U.hash32('B|' + text.split('').reverse().join('')).toString(16).padStart(8, '0');
    var c = U.hash32('C|' + a + b + text.length).toString(16).padStart(8, '0');
    return a + b + c;
  };

  U.escapeCsv = function (value) {
    var s = String(value == null ? '' : value);
    return '"' + s.replace(/"/g, '""') + '"';
  };

  U.pointInPolygon = function (point, polygon) {
    var inside = false;
    for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      var xi = polygon[i].lon, yi = polygon[i].lat;
      var xj = polygon[j].lon, yj = polygon[j].lat;
      var intersect = ((yi > point.lat) !== (yj > point.lat)) &&
        (point.lon < (xj - xi) * (point.lat - yi) / ((yj - yi) || 1e-12) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  U.triangleAreaM2 = function (a, b, c) {
    var p2 = U.localMeters(a, b);
    var p3 = U.localMeters(a, c);
    return Math.abs((p2.x * p3.y - p3.x * p2.y) / 2);
  };

  U.centroid = function (points) {
    var lat = 0, lon = 0;
    points.forEach(function (p) { lat += Number(p.lat); lon += Number(p.lon); });
    return {lat: lat / points.length, lon: lon / points.length};
  };

  U.polylineDistanceM = function (points) {
    var total = 0;
    for (var i = 1; i < (points || []).length; i += 1) total += U.distanceM(points[i - 1], points[i]);
    return total;
  };

  U.resampleStroke = function (pts, count) {
    if (!pts || pts.length === 0) return [];
    if (pts.length === 1) return Array(count).fill(0).map(function () { return {x:pts[0].x,y:pts[0].y}; });
    var dist = [0];
    for (var i = 1; i < pts.length; i += 1) {
      var dx = pts[i].x - pts[i - 1].x;
      var dy = pts[i].y - pts[i - 1].y;
      dist.push(dist[i - 1] + Math.sqrt(dx * dx + dy * dy));
    }
    var total = dist[dist.length - 1] || 1;
    var out = [];
    for (var n = 0; n < count; n += 1) {
      var target = total * n / Math.max(1, count - 1);
      var idx = 1;
      while (idx < dist.length && dist[idx] < target) idx += 1;
      if (idx >= dist.length) idx = dist.length - 1;
      var d0 = dist[idx - 1], d1 = dist[idx];
      var t = d1 === d0 ? 0 : (target - d0) / (d1 - d0);
      out.push({x: U.lerp(pts[idx - 1].x, pts[idx].x, t), y: U.lerp(pts[idx - 1].y, pts[idx].y, t)});
    }
    return out;
  };

  U.normalizeStroke = function (pts) {
    if (!pts.length) return [];
    var xs = pts.map(function (p) { return p.x; });
    var ys = pts.map(function (p) { return p.y; });
    var minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs);
    var minY = Math.min.apply(null, ys), maxY = Math.max.apply(null, ys);
    var size = Math.max(maxX - minX, maxY - minY, 0.000001);
    return pts.map(function (p) { return {x: (p.x - minX) / size, y: (p.y - minY) / size}; });
  };

  U.normalizePattern = function (strokes) {
    var all = [];
    (strokes || []).forEach(function (s) { s.forEach(function (p) { all.push(p); }); });
    if (!all.length) return [];
    var cx = all.reduce(function (a,p) { return a + p.x; }, 0) / all.length;
    var cy = all.reduce(function (a,p) { return a + p.y; }, 0) / all.length;
    var maxR = Math.max.apply(null, all.map(function (p) { var dx=p.x-cx,dy=p.y-cy; return Math.sqrt(dx*dx+dy*dy); })) || 1;
    return strokes.map(function (s) { return s.map(function (p) { return {x:(p.x-cx)/maxR,y:(p.y-cy)/maxR}; }); });
  };

  U.bestRotation = function (targetStrokes, userStrokes) {
    var a = U.normalizePattern(targetStrokes);
    var b = U.normalizePattern(userStrokes);
    var sumCross = 0, sumDot = 0, pairs = 0;
    for (var i=0;i<Math.min(a.length,b.length);i+=1) {
      var ar=U.resampleStroke(a[i],24), br=U.resampleStroke(b[i],24);
      for (var j=0;j<Math.min(ar.length,br.length);j+=1) {
        sumDot += br[j].x*ar[j].x + br[j].y*ar[j].y;
        sumCross += br[j].x*ar[j].y - br[j].y*ar[j].x;
        pairs += 1;
      }
    }
    return pairs ? Math.atan2(sumCross, sumDot) : 0;
  };

  U.rotatePattern = function (strokes, angle) {
    var c=Math.cos(angle), s=Math.sin(angle);
    return strokes.map(function (stroke) { return stroke.map(function (p) { return {x:p.x*c-p.y*s,y:p.x*s+p.y*c}; }); });
  };

  U.create = function (tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text != null) el.textContent = String(text);
    return el;
  };

  window.LG_UTIL = U;
}());
