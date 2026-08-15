/* LYCHGATE :: positions.js :: v5.3.0 */
(function () {
  'use strict';

  var U = window.LG_UTIL;

  var P = {
    source: 'manual',
    watchId: null,
    onFix: null,
    onStatus: null,
    lastFix: null,
    track: {points:[], index:0, segmentProgress:0, playing:false, timer:null, multiplier:1},

    emitStatus: function (text) {
      if (typeof this.onStatus === 'function') this.onStatus(text);
    },

    emitFix: function (fix, force) {
      if (!fix || !isFinite(fix.lat) || !isFinite(fix.lon)) return false;
      fix.lat = Number(fix.lat);
      fix.lon = Number(fix.lon);
      fix.speed = isFinite(fix.speed) ? Number(fix.speed) : 0;
      fix.heading = isFinite(fix.heading) ? Number(fix.heading) : null;
      fix.accuracy = isFinite(fix.accuracy) ? Number(fix.accuracy) : null;
      fix.at = fix.at || U.isoNow();
      fix.source = this.source;
      fix.simulated = this.source !== 'live';
      if (!force && this.lastFix) {
        var d = U.distanceM(this.lastFix, fix);
        var elapsed = Math.abs(new Date(fix.at).getTime() - new Date(this.lastFix.at).getTime());
        if (d < U.JITTER_MIN_M && elapsed < 5000) return false;
      }
      this.lastFix = Object.assign({}, fix);
      if (typeof this.onFix === 'function') this.onFix(Object.assign({}, fix));
      return true;
    },

    setSource: function (source) {
      if (['manual','live','track'].indexOf(source) < 0) throw new Error('Unknown position source.');
      if (this.source === 'live' && source !== 'live') this.stopLive();
      if (this.source === 'track' && source !== 'track') this.pauseTrack();
      this.source = source;
      this.emitStatus(source === 'manual' ? 'Manual position is active.' : source === 'live' ? 'Live position selected.' : 'Simulated track position selected.');
    },

    setManual: function (lat, lon) {
      this.setSource('manual');
      this.emitFix({lat:Number(lat), lon:Number(lon), accuracy:5, heading:null, speed:0, simulated:true, at:U.isoNow()}, true);
    },

    nudgeManual: function (eastM, northM) {
      if (this.source !== 'manual' || !this.lastFix) return;
      var p = U.offsetLatLon(this.lastFix, eastM, northM);
      this.setManual(p.lat, p.lon);
    },

    startLive: function () {
      var self = this;
      this.setSource('live');
      if (!navigator.geolocation) {
        this.emitStatus('This browser does not expose geolocation. Use Manual or Track.');
        return;
      }
      if (this.watchId != null) navigator.geolocation.clearWatch(this.watchId);
      this.emitStatus('Requesting live position permission.');
      this.watchId = navigator.geolocation.watchPosition(function (pos) {
        var c = pos.coords;
        self.emitStatus('Live position active.');
        self.emitFix({lat:c.latitude, lon:c.longitude, accuracy:c.accuracy, heading:c.heading, speed:c.speed, simulated:false, at:new Date(pos.timestamp).toISOString()});
      }, function (err) {
        self.emitStatus('Live position unavailable: ' + U.safeText(err.message || 'permission denied', 140) + '. Manual and Track remain available.');
      }, {enableHighAccuracy:true, maximumAge:2000, timeout:12000});
    },

    stopLive: function () {
      if (this.watchId != null && navigator.geolocation) navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      if (this.source === 'live') this.emitStatus('Live position stopped.');
    },

    loadTrack: function (points) {
      if (!Array.isArray(points) || points.length < 2) throw new Error('Track needs at least two points.');
      this.pauseTrack();
      this.track.points = points.map(function (p) { return {lat:Number(p.lat), lon:Number(p.lon)}; }).filter(function (p) { return isFinite(p.lat) && isFinite(p.lon); });
      if (this.track.points.length < 2) throw new Error('Track points are invalid.');
      this.track.index = 0;
      this.track.segmentProgress = 0;
      this.setSource('track');
      this.emitFix(Object.assign({}, this.track.points[0], {accuracy:3, heading:U.bearingDeg(this.track.points[0], this.track.points[1]), speed:0, at:U.isoNow()}), true);
      this.emitStatus('Track loaded with ' + this.track.points.length + ' points. Position is simulated.');
    },

    setTrackMultiplier: function (multiplier) {
      this.track.multiplier = U.clamp(Number(multiplier) || 1, 0.5, 8);
    },

    playTrack: function () {
      var self = this;
      if (this.track.points.length < 2) return false;
      this.setSource('track');
      if (this.track.playing) return true;
      this.track.playing = true;
      var last = performance.now();
      function step(now) {
        if (!self.track.playing) return;
        var dt = Math.min(1, Math.max(0, (now - last) / 1000));
        last = now;
        self.advanceTrack(dt);
        self.track.timer = requestAnimationFrame(step);
      }
      this.track.timer = requestAnimationFrame(step);
      this.emitStatus('Track playback running. Position is simulated.');
      return true;
    },

    advanceTrack: function (dt) {
      var pts = this.track.points;
      if (this.track.index >= pts.length - 1) {
        this.pauseTrack();
        this.emitStatus('Track playback complete. Position remains simulated.');
        return;
      }
      var baseSpeed = 1.4 * this.track.multiplier;
      var remaining = baseSpeed * dt;
      while (remaining > 0 && this.track.index < pts.length - 1) {
        var a = pts[this.track.index], b = pts[this.track.index + 1];
        var seg = U.distanceM(a, b);
        if (seg < 0.1) { this.track.index += 1; this.track.segmentProgress = 0; continue; }
        var left = seg * (1 - this.track.segmentProgress);
        if (remaining >= left) {
          remaining -= left;
          this.track.index += 1;
          this.track.segmentProgress = 0;
        } else {
          this.track.segmentProgress += remaining / seg;
          remaining = 0;
        }
      }
      if (this.track.index >= pts.length - 1) {
        this.emitFix(Object.assign({}, pts[pts.length - 1], {accuracy:3, heading:null, speed:0, at:U.isoNow()}), true);
        return;
      }
      var p0 = pts[this.track.index], p1 = pts[this.track.index + 1];
      var lat = U.lerp(p0.lat, p1.lat, this.track.segmentProgress);
      var lon = U.lerp(p0.lon, p1.lon, this.track.segmentProgress);
      this.emitFix({lat:lat, lon:lon, accuracy:3, heading:U.bearingDeg(p0,p1), speed:baseSpeed, simulated:true, at:U.isoNow()}, true);
    },

    pauseTrack: function () {
      this.track.playing = false;
      if (this.track.timer != null) cancelAnimationFrame(this.track.timer);
      this.track.timer = null;
    },

    resetTrack: function () {
      this.pauseTrack();
      this.track.index = 0;
      this.track.segmentProgress = 0;
      if (this.track.points.length) this.emitFix(Object.assign({}, this.track.points[0], {accuracy:3, heading:null, speed:0, at:U.isoNow()}), true);
    }
  };

  window.LG_POSITIONS = P;
}());
