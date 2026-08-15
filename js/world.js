/* LYCHGATE :: world.js :: v5.3.0 */
(function () {
  'use strict';

  var U = window.LG_UTIL;
  var BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';

  var EFFECTS = {
    generic:{aether:1,decay:1,label:'Unclassified ground'},
    water:{aether:1.45,decay:.92,label:'Aether gathers near moving water'},
    bridge:{aether:1.35,decay:.94,label:'Crossings carry stronger currents'},
    tunnel:{aether:1.20,decay:1.18,label:'Enclosed passages fade faster'},
    churchyard:{aether:1.10,decay:.82,label:'Quiet ground holds a vigil longer'},
    cemetery:{aether:1.10,decay:.82,label:'Quiet ground holds a vigil longer'},
    crossroads:{aether:1.25,decay:1,label:'Multiple ways meet here'},
    rail:{aether:1.18,decay:1.08,label:'Old grades carry a linear current'},
    mine:{aether:1.32,decay:1.12,label:'Deep workings disturb the boundary'},
    quarry:{aether:1.16,decay:1.05,label:'Cut stone exposes old ground'},
    monument:{aether:1.08,decay:.96,label:'Named memory steadies the place'},
    historic:{aether:1.12,decay:.94,label:'Recorded use lends the place persistence'},
    ruin:{aether:1.18,decay:1.02,label:'Broken structures hold incomplete patterns'},
    boundary:{aether:1.20,decay:.88,label:'Marked boundaries favor keeping rites'},
    path:{aether:1.05,decay:1,label:'Foot traffic leaves a faint current'},
    road:{aether:1.00,decay:1,label:'Ordinary traveled ground'},
    industrial:{aether:1.12,decay:1.04,label:'Worked ground retains mechanical rhythm'},
    track:{aether:1.00,decay:1,label:'Imported route geometry'}
  };

  function geohashEncode(lat, lon, precision) {
    precision = precision || 6;
    var latRange=[-90,90], lonRange=[-180,180], hash='',bits=0,ch=0,even=true;
    while (hash.length < precision) {
      var range=even?lonRange:latRange, value=even?lon:lat, mid=(range[0]+range[1])/2;
      ch <<= 1;
      if (value >= mid) { ch |= 1; range[0]=mid; } else { range[1]=mid; }
      even=!even; bits+=1;
      if (bits===5) { hash += BASE32[ch]; bits=0; ch=0; }
    }
    return hash;
  }

  function geohashBounds(hash) {
    var latRange=[-90,90], lonRange=[-180,180], even=true;
    for (var i=0;i<hash.length;i+=1) {
      var idx=BASE32.indexOf(hash[i]);
      if (idx<0) throw new Error('Invalid geohash.');
      for (var bit=4;bit>=0;bit-=1) {
        var one=(idx>>bit)&1, range=even?lonRange:latRange, mid=(range[0]+range[1])/2;
        if (one) range[0]=mid; else range[1]=mid;
        even=!even;
      }
    }
    return {minLat:latRange[0],maxLat:latRange[1],minLon:lonRange[0],maxLon:lonRange[1]};
  }

  function pointSegmentDistanceM(p,a,b) {
    var pa=U.localMeters(p,a), pb=U.localMeters(p,b), vx=pb.x-pa.x,vy=pb.y-pa.y, wx=-pa.x,wy=-pa.y;
    var c2=vx*vx+vy*vy, t=c2?U.clamp((vx*wx+vy*wy)/c2,0,1):0;
    var x=pa.x+t*vx,y=pa.y+t*vy;
    return Math.sqrt(x*x+y*y);
  }

  function closestPointOnSegment(p,a,b) {
    var pa=U.localMeters(p,a), pb=U.localMeters(p,b), vx=pb.x-pa.x,vy=pb.y-pa.y, wx=-pa.x,wy=-pa.y;
    var c2=vx*vx+vy*vy, t=c2?U.clamp((vx*wx+vy*wy)/c2,0,1):0;
    return U.offsetLatLon(p,pa.x+t*vx,pa.y+t*vy);
  }

  function inferKind(tags) {
    tags = tags || {};
    var railway=String(tags.railway||'').toLowerCase();
    var highway=String(tags.highway||'').toLowerCase();
    var amenity=String(tags.amenity||'').toLowerCase();
    var historic=String(tags.historic||'').toLowerCase();
    var manMade=String(tags.man_made||'').toLowerCase();
    var natural=String(tags.natural||'').toLowerCase();
    if (tags.kind) return String(tags.kind).toLowerCase();
    if (railway && ['abandoned','disused','razed'].indexOf(railway)>=0) return 'rail';
    if (railway) return 'active_rail';
    if (tags.bridge && tags.bridge !== 'no') return 'bridge';
    if (tags.tunnel && tags.tunnel !== 'no') return 'tunnel';
    if (['motorway','motorway_link','trunk','trunk_link'].indexOf(highway)>=0) return 'highway';
    if (highway === 'path' || highway === 'footway' || highway === 'bridleway' || highway === 'steps') return 'path';
    if (highway) return 'road';
    if (tags.waterway || natural === 'water' || tags.water) return 'water';
    if (amenity === 'place_of_worship') return 'churchyard';
    if (amenity === 'grave_yard' || tags.landuse === 'cemetery') return 'cemetery';
    if (historic === 'monument' || historic === 'memorial') return 'monument';
    if (historic === 'ruins' || tags.ruins) return 'ruin';
    if (historic) return 'historic';
    if (manMade === 'mineshaft' || tags.mining || tags.mine) return 'mine';
    if (tags.landuse === 'quarry') return 'quarry';
    if (manMade === 'boundary_stone' || historic === 'boundary_stone') return 'boundary';
    if (tags.industrial || tags.landuse === 'industrial') return 'industrial';
    return 'survey';
  }

  function normalizeKind(kind) {
    kind=String(kind||'generic').toLowerCase();
    if (kind==='stream'||kind==='river'||kind==='spring'||kind==='waterway') return 'water';
    if (kind==='place_of_worship') return 'churchyard';
    if (kind==='grave_yard') return 'cemetery';
    if (kind==='abandoned_railway'||kind==='disused_railway') return 'rail';
    if (kind==='memorial') return 'monument';
    if (kind==='mineshaft'||kind==='adit') return 'mine';
    if (kind==='footway'||kind==='steps') return 'path';
    return kind;
  }

  function geometryAnchors(geometry) {
    if (!geometry || !Array.isArray(geometry.features)) return [];
    var out=[];
    geometry.features.forEach(function (f) {
      var kind=normalizeKind(f.kind||'generic');
      if (kind.indexOf('exclusion_')===0 || kind==='active_rail' || kind==='highway') return;
      if (f.type==='point' && Array.isArray(f.point)) out.push({lat:Number(f.point[0]),lon:Number(f.point[1]),kind:kind,name:f.name||'',source:'point'});
      if ((f.type==='line'||f.type==='polygon') && Array.isArray(f.points) && f.points.length) {
        var step=Math.max(1,Math.floor(f.points.length/8));
        for (var i=0;i<f.points.length;i+=step) out.push({lat:Number(f.points[i][0]),lon:Number(f.points[i][1]),kind:kind,name:f.name||'',source:f.type});
      }
    });
    return out;
  }

  function featureInBounds(feature,bounds) {
    return feature.lat>=bounds.minLat&&feature.lat<=bounds.maxLat&&feature.lon>=bounds.minLon&&feature.lon<=bounds.maxLon;
  }

  function makeName(rng,kind) {
    var N=window.LG_REGION?window.LG_REGION.activeNames():window.LYCHGATE_NAMES;
    kind=normalizeKind(kind);
    var first=N.first[Math.floor(rng()*N.first.length)], types=N.featureTitles[kind]||N.featureTitles.generic;
    var second=types[Math.floor(rng()*types.length)];
    return rng()<.3 ? first+' '+second+' '+N.suffix[Math.floor(rng()*N.suffix.length)] : first+' '+second;
  }

  function latentProperties(rng,kind) {
    var temp=['still','restless','watchful','hollow','warm','cold'][Math.floor(rng()*6)];
    var depth=1+Math.floor(rng()*8);
    var N=window.LG_REGION?window.LG_REGION.activeNames():window.LYCHGATE_NAMES;
    return {temperament:temp,depth:depth,answer:N.observations[Math.floor(rng()*N.observations.length)],affinity:normalizeKind(kind||'generic')};
  }

  function lineFeatureKind(tags) {
    var kind=inferKind(tags);
    if (kind==='survey' && tags.junction) kind='crossroads';
    return kind;
  }

  function safeNum(n) { n=Number(n); return isFinite(n)?n:null; }

  function pickDeterministic(list,rng) {
    return list && list.length ? list[Math.floor(rng()*list.length)] : '';
  }

  function loreForThreshold(threshold,salt) {
    var L=window.LG_REGION?window.LG_REGION.activeLore():(window.LYCHGATE_LORE||{}),seed=U.hash32(String(threshold.id)+'|lore|'+String(salt||'')),rng=U.mulberry32(seed);
    var year=1785+Math.floor(rng()*151),season=pickDeterministic(L.seasons||[],rng);
    var witness=pickDeterministic(L.given||[],rng)+' '+pickDeterministic(L.surnames||[],rng)+', '+pickDeterministic(L.occupations||[],rng);
    var leaf=1+Math.floor(rng()*48),register=pickDeterministic(L.registers||[],rng),bias=U.safeText(threshold.featureBias||'',90);
    var reference=(register||'loose ledger leaf')+' '+leaf+(bias?' near '+bias:'');
    var regionalFlavor=window.LG_REGION?window.LG_REGION.regionFlavor(normalizeKind(threshold.kind||'generic'),rng):'';
    if(regionalFlavor)reference+=' · regional term: '+regionalFlavor;
    return {
      schema:'LYCHGATE_LORE_1',
      thresholdId:threshold.id,
      epithet:pickDeterministic(L.epithets||[],rng),
      dateFragment:season+' '+year,
      witness:witness,
      reference:reference,
      phenomenon:pickDeterministic(L.phenomena||[],rng),
      warning:pickDeterministic(L.warnings||[],rng),
      contradiction:pickDeterministic(L.contradictions||[],rng),
      kindledReading:pickDeterministic(L.kindledReadings||[],rng),
      sextonReading:pickDeterministic(L.sextonReadings||[],rng),
      fictionNotice:'Generated LYCHGATE field tradition. Not historical evidence.'
    };
  }

  function localSolarHour(nowMs,lon) {
    var d=new Date(nowMs),utc=d.getUTCHours()+d.getUTCMinutes()/60+d.getUTCSeconds()/3600;
    return (utc+Number(lon||0)/15+24)%24;
  }

  function dayPart(hour) {
    if(hour>=5&&hour<8)return'dawn';
    if(hour>=8&&hour<17)return'day';
    if(hour>=17&&hour<20)return'dusk';
    return'night';
  }

  function encounterCandidate(fix,nowMs,salt,context) {
    context=context||{};nowMs=Number(nowMs)||Date.now();
    var L=window.LYCHGATE_LORE||{},catalog=L.encounters||[];
    if(!fix||!isFinite(fix.lat)||!isFinite(fix.lon)||!catalog.length)return null;
    var cell=geohashEncode(fix.lat,fix.lon,7),slot=Math.floor(nowMs/(30*60*1000)),hour=localSolarHour(nowMs,fix.lon),part=dayPart(hour),kind=normalizeKind(context.kind||'generic');
    var seedText=[cell,slot,String(salt||''),kind,context.faction||'none',context.degree||1,context.actionCount||0].join('|');
    var rng=U.mulberry32(U.hash32(seedText)),chance=.065;
    if(kind!=='generic'&&kind!=='road'&&kind!=='path')chance+=.025;
    if(context.invited)chance+=.035;
    if(context.actionCount>=5)chance+=.01;
    chance=U.clamp(chance,.04,.18);
    if(rng()>=chance)return null;
    var pool=catalog.filter(function(e){
      if(e.kinds&&e.kinds.length&&e.kinds.indexOf(kind)<0&&e.kinds.indexOf('generic')<0)return false;
      if(e.times&&e.times.length&&e.times.indexOf(part)<0)return false;
      if(e.faction&&e.faction!==context.faction)return false;
      if(e.minAether&&Number(context.aether||0)<e.minAether)return false;
      if(e.requiresAction&&!(context.actionTypes||{})[e.requiresAction])return false;
      return true;
    });
    if(!pool.length)pool=catalog.filter(function(e){return(!e.times||e.times.indexOf(part)>=0)&&(!e.faction||e.faction===context.faction)&&(!e.minAether||Number(context.aether||0)>=e.minAether)&&(!e.requiresAction||(context.actionTypes||{})[e.requiresAction]);});
    if(!pool.length)return null;
    var total=pool.reduce(function(sum,e){return sum+Math.max(1,Number(e.weight)||1);},0),roll=rng()*total,picked=pool[0];
    for(var i=0;i<pool.length;i+=1){roll-=Math.max(1,Number(pool[i].weight)||1);if(roll<=0){picked=pool[i];break;}}
    return {
      id:'enc-'+cell+'-'+slot+'-'+picked.id,
      key:cell+'|'+slot,
      type:picked.id,
      title:picked.title,
      text:picked.text,
      kind:kind,
      dayPart:part,
      solarHour:hour,
      kindled:picked.kindled,
      sextons:picked.sextons,
      cell:cell,
      slot:slot,
      at:new Date(nowMs).toISOString(),
      chance:chance,
      deterministicSeed:U.hash32(seedText)
    };
  }

  var W = {
    geohashEncode:geohashEncode,
    geohashBounds:geohashBounds,
    inferKind:inferKind,
    normalizeKind:normalizeKind,
    effects:EFFECTS,
    loreForThreshold:loreForThreshold,
    encounterCandidate:encounterCandidate,
    localSolarHour:localSolarHour,
    dayPart:dayPart,

    featureEffect:function (kind) { return EFFECTS[normalizeKind(kind)] || EFFECTS.generic; },

    generateCell:function (cellHash,salt,geometry) {
      var seed=U.hash32(cellHash+'|'+salt),rng=U.mulberry32(seed),bounds=geohashBounds(cellHash);
      var features=geometryAnchors(geometry).filter(function (f) { return featureInBounds(f,bounds); });
      var count=1+(rng()>.68?1:0), thresholds=[];
      for (var i=0;i<count;i+=1) {
        var kind='generic',lat,lon,biasName='';
        if (features.length && rng()<.78) {
          var f=features[Math.floor(rng()*features.length)]; kind=f.kind; biasName=f.name;
          var biased=U.offsetLatLon({lat:f.lat,lon:f.lon},(rng()-.5)*24,(rng()-.5)*24);
          lat=biased.lat;lon=biased.lon;
        } else {
          lat=U.lerp(bounds.minLat,bounds.maxLat,.12+rng()*.76);
          lon=U.lerp(bounds.minLon,bounds.maxLon,.12+rng()*.76);
        }
        var point={lat:lat,lon:lon};
        if (this.isExcluded(point,geometry)) {
          lat=U.lerp(bounds.minLat,bounds.maxLat,.18+rng()*.64);lon=U.lerp(bounds.minLon,bounds.maxLon,.18+rng()*.64);point={lat:lat,lon:lon};
        }
        if (this.isExcluded(point,geometry)) continue;
        thresholds.push({
          id:'th-'+cellHash+'-'+i,cell:cellHash,lat:U.round(lat,7),lon:U.round(lon,7),kind:normalizeKind(kind),
          name:makeName(rng,kind),latent:latentProperties(rng,kind),provenance:'deterministic',featureBias:biasName||null
        });
      }
      return thresholds;
    },

    thresholdsNear:function (fix,rangeM,salt,geometry) {
      if (!fix) return [];
      var samples=[],ring=Math.ceil((rangeM+1000)/650);
      for (var y=-ring;y<=ring;y+=1) for (var x=-ring;x<=ring;x+=1) {
        var p=U.offsetLatLon(fix,x*650,y*650);samples.push(geohashEncode(p.lat,p.lon,6));
      }
      var unique={};samples.forEach(function (h) { unique[h]=true; });
      var out=[],self=this;
      Object.keys(unique).forEach(function (h) {
        self.generateCell(h,salt,geometry).forEach(function (t) {
          var d=U.distanceM(fix,t);
          if (d<=rangeM) { t.distanceM=d;t.bearing=U.bearingDeg(fix,t);out.push(t); }
        });
      });
      if(window.LG_REGION){out=out.filter(function(t){return !window.LG_REGION.isSuppressed(t.id);});window.LG_REGION.anchorsNear(fix,rangeM).forEach(function(a){if(!out.some(function(t){return t.id===a.id;}))out.push(a);});}
      out.sort(function (a,b) { return a.distanceM-b.distanceM; });
      return out;
    },

    isExcluded:function (point,geometry) {
      if (!geometry || !Array.isArray(geometry.features)) return false;
      for (var i=0;i<geometry.features.length;i+=1) {
        var f=geometry.features[i],kind=String(f.kind||'');
        if (f.type==='polygon' && kind.indexOf('exclusion_')===0 && Array.isArray(f.points)) {
          var poly=f.points.map(function (p) { return {lat:Number(p[0]),lon:Number(p[1])}; });
          if (U.pointInPolygon(point,poly)) return true;
        }
        if (f.type==='line' && (kind==='active_rail'||kind==='highway') && Array.isArray(f.points)) {
          var limit=kind==='active_rail'?35:25;
          for (var j=1;j<f.points.length;j+=1) {
            var a={lat:Number(f.points[j-1][0]),lon:Number(f.points[j-1][1])},b={lat:Number(f.points[j][0]),lon:Number(f.points[j][1])};
            if (pointSegmentDistanceM(point,a,b)<limit) return true;
          }
        }
      }
      return false;
    },

    nearestFeature:function (point,geometry,maxM) {
      if (!geometry || !Array.isArray(geometry.features)) return null;
      var best=null;
      geometry.features.forEach(function (f) {
        var kind=normalizeKind(f.kind||'generic');
        if (kind.indexOf('exclusion_')===0||kind==='highway'||kind==='active_rail') return;
        if (f.type==='point' && f.point) {
          var p={lat:Number(f.point[0]),lon:Number(f.point[1])},d=U.distanceM(point,p);
          if (d<=(maxM||100) && (!best||d<best.distanceM)) best={kind:kind,name:f.name||kind,distanceM:d,point:p};
        }
        if (f.type==='line' && f.points) for (var i=1;i<f.points.length;i+=1) {
          var a={lat:Number(f.points[i-1][0]),lon:Number(f.points[i-1][1])},b={lat:Number(f.points[i][0]),lon:Number(f.points[i][1])};
          var d2=pointSegmentDistanceM(point,a,b);
          if (d2<=(maxM||100) && (!best||d2<best.distanceM)) best={kind:kind,name:f.name||kind,distanceM:d2,point:closestPointOnSegment(point,a,b)};
        }
      });
      return best;
    },

    normalizeGeoJSON:function (obj) {
      if (!obj||typeof obj!=='object') throw new Error('GeoJSON must be an object.');
      var features=obj.type==='FeatureCollection'?obj.features:[obj];
      if (!Array.isArray(features)) throw new Error('GeoJSON feature list is invalid.');
      var out=[];
      features.slice(0,5000).forEach(function (feature,index) {
        var g=feature.geometry||feature;if(!g||!g.type||!g.coordinates)return;
        var props=feature.properties||{},kind=normalizeKind(inferKind(props)),name=U.safeText(props.name||('Imported feature '+(index+1)),100);
        if (g.type==='Point') {
          var lat=safeNum(g.coordinates[1]),lon=safeNum(g.coordinates[0]);if(lat!==null&&lon!==null)out.push({type:'point',kind:kind,name:name,point:[lat,lon],source:'imported'});
        }
        if (g.type==='LineString') out.push({type:'line',kind:kind,name:name,points:g.coordinates.slice(0,3000).map(function(c){return[Number(c[1]),Number(c[0])];}).filter(function(p){return isFinite(p[0])&&isFinite(p[1]);}),source:'imported'});
        if (g.type==='Polygon'&&g.coordinates[0]) out.push({type:'polygon',kind:kind,name:name,points:g.coordinates[0].slice(0,3000).map(function(c){return[Number(c[1]),Number(c[0])];}).filter(function(p){return isFinite(p[0])&&isFinite(p[1]);}),source:'imported'});
      });
      if(!out.length)throw new Error('No supported Point, LineString, or Polygon features were found.');
      return{name:U.safeText(obj.name||'Imported GeoJSON',100),provenance:'User-imported GeoJSON',center:null,features:out};
    },

    parseGPX:function (text) {
      var xml=new DOMParser().parseFromString(text,'application/xml');if(xml.querySelector('parsererror'))throw new Error('GPX XML could not be parsed.');
      var points=[];Array.prototype.slice.call(xml.querySelectorAll('trkpt, rtept')).slice(0,10000).forEach(function(n){points.push([Number(n.getAttribute('lat')),Number(n.getAttribute('lon'))]);});
      if(points.length<2)throw new Error('GPX needs at least two track or route points.');
      return{name:'Imported GPX',provenance:'User-imported GPX',center:null,features:[{type:'line',kind:'track',name:'Imported track',points:points,source:'imported'}]};
    },

    parseTrack:function(text,filename) {
      if(/\.gpx$/i.test(filename||'')||/^\s*</.test(text)){
        var xml=new DOMParser().parseFromString(text,'application/xml');
        if(!xml.querySelector('parsererror')){
          var pts=[];Array.prototype.slice.call(xml.querySelectorAll('trkpt, rtept')).slice(0,20000).forEach(function(n){pts.push({lat:Number(n.getAttribute('lat')),lon:Number(n.getAttribute('lon'))});});
          if(pts.length>=2)return pts;
        }
      }
      var obj=JSON.parse(text),features=obj.type==='FeatureCollection'?obj.features:[obj],out=[];
      features.forEach(function(f){var g=f.geometry||f;if(g&&g.type==='LineString')g.coordinates.forEach(function(c){out.push({lat:Number(c[1]),lon:Number(c[0])});});});
      if(out.length<2)throw new Error('Track file has no usable line.');return out.slice(0,20000);
    },

    parseOSM:function(text) {
      var xml=new DOMParser().parseFromString(text,'application/xml');if(xml.querySelector('parsererror'))throw new Error('OSM XML could not be parsed.');
      var nodes={},nodeTags={},out=[];
      Array.prototype.slice.call(xml.querySelectorAll('node')).slice(0,60000).forEach(function(n){
        var id=n.getAttribute('id'),lat=Number(n.getAttribute('lat')),lon=Number(n.getAttribute('lon'));nodes[id]=[lat,lon];
        var tags={};Array.prototype.slice.call(n.querySelectorAll(':scope > tag')).forEach(function(t){tags[t.getAttribute('k')]=t.getAttribute('v');});nodeTags[id]=tags;
        if(Object.keys(tags).length){var kind=normalizeKind(inferKind(tags));if(kind!=='survey')out.push({type:'point',kind:kind,name:U.safeText(tags.name||('OSM '+kind),100),point:[lat,lon],source:'imported'});}
      });
      Array.prototype.slice.call(xml.querySelectorAll('way')).slice(0,12000).forEach(function(way,idx){
        var tags={};Array.prototype.slice.call(way.querySelectorAll(':scope > tag')).forEach(function(t){tags[t.getAttribute('k')]=t.getAttribute('v');});
        var points=Array.prototype.slice.call(way.querySelectorAll(':scope > nd')).map(function(n){return nodes[n.getAttribute('ref')];}).filter(Boolean);if(points.length<2)return;
        var kind=normalizeKind(lineFeatureKind(tags)),name=U.safeText(tags.name||('OSM way '+(idx+1)),100);
        var closed=points.length>3&&points[0][0]===points[points.length-1][0]&&points[0][1]===points[points.length-1][1];
        if(tags.access==='private'||tags.private==='yes')kind='exclusion_private';
        if(closed&&(tags.landuse==='cemetery'||tags.amenity==='grave_yard'))kind='cemetery';
        out.push({type:closed?'polygon':'line',kind:kind,name:name,points:points.slice(0,3000),source:'imported'});
      });
      if(!out.length)throw new Error('OSM extract contains no usable features.');
      return{name:'Imported OSM extract',provenance:'User-imported OSM XML',center:null,features:out};
    },

    detectAndParseGeometry:function(text,filename){if(/\.(osm|xml)$/i.test(filename||''))return this.parseOSM(text);if(/\.gpx$/i.test(filename||''))return this.parseGPX(text);if(/^\s*</.test(text)){if(/<osm[\s>]/i.test(text))return this.parseOSM(text);return this.parseGPX(text);}return this.normalizeGeoJSON(JSON.parse(text));},

    geometryCenter:function(geometry,fallback){if(geometry&&geometry.center&&geometry.center.length===2)return{lat:Number(geometry.center[0]),lon:Number(geometry.center[1])};var pts=[];if(geometry&&Array.isArray(geometry.features))geometry.features.forEach(function(f){if(f.type==='point'&&f.point)pts.push({lat:f.point[0],lon:f.point[1]});if((f.type==='line'||f.type==='polygon')&&f.points)f.points.slice(0,50).forEach(function(p){pts.push({lat:p[0],lon:p[1]});});});return pts.length?U.centroid(pts):fallback;},

    geometryStats:function(geometry){var stats={total:0};if(!geometry||!Array.isArray(geometry.features))return stats;geometry.features.forEach(function(f){var k=normalizeKind(f.kind||'survey');stats.total+=1;stats[k]=(stats[k]||0)+1;});return stats;}
  };

  window.LG_WORLD=W;
}());
