/* LYCHGATE :: region.js :: v5.3.0
   Region package, Surveyor, and Lore Cabinet logic.
   All authored data remains local unless the player explicitly exports it.
*/
(function () {
  'use strict';

  var U=window.LG_UTIL,S=window.LG_STORAGE;

  var LORE_FIELDS=[
    {key:'placeFirst',label:'Place-name first words',source:'names.first'},
    {key:'placeSuffix',label:'Place-name suffixes',source:'names.suffix'},
    {key:'surnames',label:'Surnames',source:'lore.surnames'},
    {key:'given',label:'Given names',source:'lore.given'},
    {key:'occupations',label:'Occupations',source:'lore.occupations'},
    {key:'registers',label:'Record and ledger terms',source:'lore.registers'},
    {key:'epithets',label:'Threshold epithets',source:'lore.epithets'},
    {key:'phenomena',label:'Phenomena',source:'lore.phenomena'},
    {key:'warnings',label:'Warnings',source:'lore.warnings'},
    {key:'kindledReadings',label:'Kindled readings',source:'lore.kindledReadings'},
    {key:'sextonReadings',label:'Sexton readings',source:'lore.sextonReadings'},
    {key:'contradictions',label:'Contradictions and marginal notes',source:'lore.contradictions'},
    {key:'industries',label:'Local industries',source:'regional'},
    {key:'waterways',label:'Waterway terms',source:'regional'},
    {key:'landforms',label:'Landform terms',source:'regional'},
    {key:'churchTerms',label:'Church and parish terms',source:'regional'},
    {key:'miningTerms',label:'Mining terms',source:'regional'},
    {key:'railwayTerms',label:'Railway terms',source:'regional'},
    {key:'plants',label:'Local plants',source:'regional'},
    {key:'weather',label:'Weather language',source:'regional'},
    {key:'buildingTerms',label:'Historic building terms',source:'regional'},
    {key:'motifs',label:'Folklore motifs',source:'regional'}
  ];

  var FEATURE_KINDS=['road','path','water','bridge','tunnel','churchyard','cemetery','crossroads','rail','mine','quarry','monument','historic','ruin','boundary','industrial','track','generic'];
  var EXCLUSION_KINDS=['exclusion_private','exclusion_highway','exclusion_closed','exclusion_hazard'];
  var ANNOTATION_KINDS=['public_access','hazard','historic_note','observation','parking','trailhead','quiet_area'];

  function cleanList(value,maxItems,maxLen){
    var rows=Array.isArray(value)?value:String(value||'').split(/\r?\n/);
    var seen={},out=[];
    rows.forEach(function(row){var s=U.safeText(String(row||'').trim(),maxLen||180);if(s&&!seen[s.toLowerCase()]&&out.length<(maxItems||120)){seen[s.toLowerCase()]=true;out.push(s);}});
    return out;
  }

  function defaultRegion(){
    return {
      schema:'LYCHGATE_REGION_STATE_1',
      metadata:{name:'Local Region',author:'',description:'',license:'GPL-3.0',source:'local authoring',sourceLicenseNotes:'',packageId:null,installedAt:null,updatedAt:U.isoNow()},
      customAnchors:[],suppressedThresholds:{},annotations:[],suggestedWalks:[],illustrations:[],lore:{},
      packageHistory:[]
    };
  }

  function ensure(){
    if(!S.state||!S.state.world)return null;
    var r=S.state.world.region&&typeof S.state.world.region==='object'?S.state.world.region:defaultRegion();
    r.schema='LYCHGATE_REGION_STATE_1';
    r.metadata=Object.assign(defaultRegion().metadata,r.metadata||{});
    r.customAnchors=Array.isArray(r.customAnchors)?r.customAnchors:[];
    r.suppressedThresholds=r.suppressedThresholds&&typeof r.suppressedThresholds==='object'?r.suppressedThresholds:{};
    r.annotations=Array.isArray(r.annotations)?r.annotations:[];
    r.suggestedWalks=Array.isArray(r.suggestedWalks)?r.suggestedWalks:[];
    r.illustrations=Array.isArray(r.illustrations)?r.illustrations:[];
    r.lore=r.lore&&typeof r.lore==='object'?r.lore:{};
    r.packageHistory=Array.isArray(r.packageHistory)?r.packageHistory:[];
    LORE_FIELDS.forEach(function(f){r.lore[f.key]=cleanList(r.lore[f.key],160,220);});
    S.state.world.region=r;
    return r;
  }

  function activeLore(){
    var built=window.LYCHGATE_LORE||{},r=ensure(),out={};
    Object.keys(built).forEach(function(k){out[k]=Array.isArray(built[k])?built[k].slice():built[k];});
    LORE_FIELDS.forEach(function(f){var list=r.lore[f.key]||[];if(list.length&&f.source.indexOf('lore.')===0)out[f.key]=list.slice();});
    out.regional={};
    ['industries','waterways','landforms','churchTerms','miningTerms','railwayTerms','plants','weather','buildingTerms','motifs'].forEach(function(k){out.regional[k]=(r.lore[k]||[]).slice();});
    return out;
  }

  function activeNames(){
    var built=window.LYCHGATE_NAMES||{},r=ensure(),out={first:(built.first||[]).slice(),suffix:(built.suffix||[]).slice(),featureTitles:built.featureTitles||{},observations:(built.observations||[]).slice()};
    if((r.lore.placeFirst||[]).length)out.first=r.lore.placeFirst.slice();
    if((r.lore.placeSuffix||[]).length)out.suffix=r.lore.placeSuffix.slice();
    return out;
  }

  function regionFlavor(kind,rng){
    var l=activeLore().regional||{},pool=[];
    if(kind==='water'||kind==='bridge')pool=pool.concat(l.waterways||[]);
    if(kind==='mine'||kind==='quarry'||kind==='industrial')pool=pool.concat(l.industries||[],l.miningTerms||[]);
    if(kind==='rail'||kind==='track')pool=pool.concat(l.railwayTerms||[]);
    if(kind==='churchyard'||kind==='cemetery')pool=pool.concat(l.churchTerms||[]);
    if(kind==='historic'||kind==='ruin')pool=pool.concat(l.buildingTerms||[]);
    pool=pool.concat(l.landforms||[],l.plants||[],l.weather||[],l.motifs||[]);
    if(!pool.length)pool=pool.concat(l.industries||[],l.waterways||[],l.churchTerms||[],l.miningTerms||[],l.railwayTerms||[],l.buildingTerms||[]);
    return pool.length?pool[Math.floor(rng()*pool.length)]:'';
  }

  function sanitizePoint(p){var lat=Number(p&&p.lat),lon=Number(p&&p.lon);if(!isFinite(lat)||!isFinite(lon)||lat<-90||lat>90||lon<-180||lon>180)throw new Error('A region point has invalid latitude or longitude.');return{lat:U.round(lat,7),lon:U.round(lon,7)};}

  function sanitizeFeature(f,index){
    f=f&&typeof f==='object'?f:{};var type=['point','line','polygon'].indexOf(f.type)>=0?f.type:'point',kind=U.safeText(f.kind||'generic',60),name=U.safeText(f.name||('Feature '+(index+1)),120),out={id:U.safeText(f.id||('feature-'+U.hash32(name+'|'+kind+'|'+index+'|'+JSON.stringify(f.point||f.points&&f.points[0]||[])).toString(36)),100),type:type,kind:kind,name:name,source:U.safeText(f.source||'region package',80),provenance:U.safeText(f.provenance||'Region package',200)};
    if(type==='point'){var p=Array.isArray(f.point)?{lat:f.point[0],lon:f.point[1]}:f.point;p=sanitizePoint(p);out.point=[p.lat,p.lon];}
    else{if(!Array.isArray(f.points))throw new Error('Region line or polygon is missing points.');out.points=f.points.slice(0,5000).map(function(p){var q=Array.isArray(p)?{lat:p[0],lon:p[1]}:p;q=sanitizePoint(q);return[q.lat,q.lon];});if(type==='line'&&out.points.length<2)throw new Error('Region line needs at least two points.');if(type==='polygon'&&out.points.length<3)throw new Error('Region polygon needs at least three points.');}
    return out;
  }

  function sanitizeAnchor(a,index){var p=sanitizePoint(a);return{id:U.safeText(a.id||U.randomId('anchor'),100),name:U.safeText(a.name||('Authored Threshold '+(index+1)),120),kind:FEATURE_KINDS.indexOf(a.kind)>=0?a.kind:'generic',lat:p.lat,lon:p.lon,createdAt:a.createdAt||U.isoNow(),provenance:U.safeText(a.provenance||'Surveyor authored Threshold anchor',180),notes:U.safeText(a.notes||'',600)};}
  function sanitizeAnnotation(a,index){var p=sanitizePoint(a);return{id:U.safeText(a.id||U.randomId('annotation'),100),kind:ANNOTATION_KINDS.indexOf(a.kind)>=0?a.kind:'observation',text:U.safeText(a.text||('Annotation '+(index+1)),800),lat:p.lat,lon:p.lon,createdAt:a.createdAt||U.isoNow(),provenance:U.safeText(a.provenance||'Surveyor annotation',180)};}
  function sanitizeWalk(w,index){return{id:U.safeText(w.id||U.randomId('walk'),100),title:U.safeText(w.title||('Suggested Walk '+(index+1)),120),purpose:U.safeText(w.purpose||'',400),distanceM:Math.max(0,Number(w.distanceM)||0),estimatedMinutes:Math.max(0,Number(w.estimatedMinutes)||0),safetyNotes:U.safeText(w.safetyNotes||'',1000),route:Array.isArray(w.route)?w.route.slice(0,1000).map(sanitizePoint):[],sourceExpeditionId:U.safeText(w.sourceExpeditionId||'',100),createdAt:w.createdAt||U.isoNow(),provenance:U.safeText(w.provenance||'Region package suggested walk',180)};}
  function sanitizeIllustration(img,index){img=img&&typeof img==='object'?img:{};var mime=String(img.mime||'').toLowerCase(),data=String(img.dataUrl||'');if(['image/png','image/jpeg','image/webp'].indexOf(mime)<0)throw new Error('Region illustration '+(index+1)+' uses an unsupported image type.');if(!new RegExp('^data:'+mime.replace('/','\/')+';base64,','i').test(data))throw new Error('Region illustration '+(index+1)+' has invalid image data.');if(data.length>900000)throw new Error('Region illustration '+(index+1)+' exceeds the package image budget.');return{id:U.safeText(img.id||U.randomId('plate'),100),name:U.safeText(img.name||('Regional plate '+(index+1)),120),mime:mime,dataUrl:data,attribution:U.safeText(img.attribution||'',300),license:U.safeText(img.license||'User supplied',120),createdAt:img.createdAt||U.isoNow(),provenance:U.safeText(img.provenance||'Region package local illustration',180)};}

  function validatePackage(obj){
    if(!obj||typeof obj!=='object'||obj.schema!=='LYCHGATE_REGION_1')throw new Error('Unsupported Region Package schema.');
    var meta=obj.metadata&&typeof obj.metadata==='object'?obj.metadata:{};
    var geometry=obj.geometry&&typeof obj.geometry==='object'?obj.geometry:{name:'Region geometry',provenance:'Region package',center:null,features:[]};
    var features=Array.isArray(geometry.features)?geometry.features.slice(0,4000).map(sanitizeFeature):[];
    var center=null;if(Array.isArray(geometry.center)&&geometry.center.length===2){var c=sanitizePoint({lat:geometry.center[0],lon:geometry.center[1]});center=[c.lat,c.lon];}
    var lore={};LORE_FIELDS.forEach(function(f){lore[f.key]=cleanList(obj.lore&&obj.lore[f.key],160,220);});
    var suppressed={};if(obj.suppressedThresholds&&typeof obj.suppressedThresholds==='object')Object.keys(obj.suppressedThresholds).slice(0,5000).forEach(function(id){if(obj.suppressedThresholds[id])suppressed[U.safeText(id,120)]=true;});
    return {
      schema:'LYCHGATE_REGION_1',version:U.safeText(obj.version||'1.0',30),packageId:U.safeText(obj.packageId||U.randomId('region'),120),createdAt:obj.createdAt||U.isoNow(),updatedAt:obj.updatedAt||U.isoNow(),
      metadata:{name:U.safeText(meta.name||geometry.name||'Imported Region',120),author:U.safeText(meta.author||'',120),description:U.safeText(meta.description||'',1600),license:U.safeText(meta.license||'GPL-3.0',80),source:U.safeText(meta.source||'Region package',120),sourceLicenseNotes:U.safeText(meta.sourceLicenseNotes||'',1000)},
      worldSaltRecommendation:U.safeText(obj.worldSaltRecommendation||'',80),
      geometry:{name:U.safeText(geometry.name||meta.name||'Region geometry',120),provenance:U.safeText(geometry.provenance||'Region package',300),center:center,features:features},
      customAnchors:Array.isArray(obj.customAnchors)?obj.customAnchors.slice(0,2000).map(sanitizeAnchor):[],suppressedThresholds:suppressed,
      annotations:Array.isArray(obj.annotations)?obj.annotations.slice(0,3000).map(sanitizeAnnotation):[],suggestedWalks:Array.isArray(obj.suggestedWalks)?obj.suggestedWalks.slice(0,200).map(sanitizeWalk):[],illustrations:Array.isArray(obj.illustrations)?obj.illustrations.slice(0,8).map(sanitizeIllustration):[],lore:lore,scenarios:(window.LG_SCENARIOS&&Array.isArray(obj.scenarios))?obj.scenarios.slice(0,100).map(function(sc){if(!sc||sc.schema!=='LYCHGATE_SCENARIO_1')throw new Error('Region Package contains an unsupported Scenario schema.');return window.LG_SCENARIOS.sanitizeScenario(sc);}):[],
      provenance:{application:'LYCHGATE',format:'LYCHGATE_REGION_1',exportedBy:U.safeText(obj.provenance&&obj.provenance.exportedBy||'',120)}
    };
  }

  function buildPackage(){
    var r=ensure(),geom=S.state.world.geometry?U.deepClone(S.state.world.geometry):{name:r.metadata.name+' geometry',provenance:'No geometry in package',center:null,features:[]};
    return validatePackage({schema:'LYCHGATE_REGION_1',version:'1.0',packageId:r.metadata.packageId||U.randomId('region'),createdAt:r.metadata.installedAt||S.state.createdAt||U.isoNow(),updatedAt:U.isoNow(),metadata:r.metadata,worldSaltRecommendation:S.state.world.salt||'',geometry:geom,customAnchors:r.customAnchors,suppressedThresholds:r.suppressedThresholds,annotations:r.annotations,suggestedWalks:r.suggestedWalks,illustrations:r.illustrations,lore:r.lore,scenarios:window.LG_SCENARIOS?window.LG_SCENARIOS.exportable():[],provenance:{exportedBy:S.state.player.callSign||'Walker'}});
  }

  function exportText(){return JSON.stringify(buildPackage(),null,2);}

  function importText(text){
    var pkg=validatePackage(JSON.parse(text));var old={geometry:S.state.world.geometry,geometrySource:S.state.world.geometrySource,region:U.deepClone(ensure())};
    S.softArchive('region-state','Region before '+pkg.metadata.name,old);
    S.state.world.geometry=U.deepClone(pkg.geometry);S.state.world.geometrySource='region package: '+pkg.metadata.name;S.state.world.geometryImportedAt=U.isoNow();
    S.state.world.region={schema:'LYCHGATE_REGION_STATE_1',metadata:{name:pkg.metadata.name,author:pkg.metadata.author,description:pkg.metadata.description,license:pkg.metadata.license,source:pkg.metadata.source,sourceLicenseNotes:pkg.metadata.sourceLicenseNotes,packageId:pkg.packageId,installedAt:U.isoNow(),updatedAt:U.isoNow()},customAnchors:U.deepClone(pkg.customAnchors),suppressedThresholds:U.deepClone(pkg.suppressedThresholds),annotations:U.deepClone(pkg.annotations),suggestedWalks:U.deepClone(pkg.suggestedWalks),illustrations:U.deepClone(pkg.illustrations),lore:U.deepClone(pkg.lore),packageHistory:[{packageId:pkg.packageId,name:pkg.metadata.name,importedAt:U.isoNow()}]};
    if(window.LG_SCENARIOS&&pkg.scenarios&&pkg.scenarios.length)window.LG_SCENARIOS.importDefinitions(pkg.scenarios);
    S.markDirty();return pkg;
  }

  function setMetadata(meta){var r=ensure();r.metadata.name=U.safeText(meta.name||r.metadata.name,120)||'Local Region';r.metadata.author=U.safeText(meta.author||'',120);r.metadata.description=U.safeText(meta.description||'',1600);r.metadata.sourceLicenseNotes=U.safeText(meta.sourceLicenseNotes||r.metadata.sourceLicenseNotes||'',1000);r.metadata.license='GPL-3.0';r.metadata.updatedAt=U.isoNow();S.markDirty();return r.metadata;}
  function setLore(values){var r=ensure();LORE_FIELDS.forEach(function(f){if(Object.prototype.hasOwnProperty.call(values,f.key))r.lore[f.key]=cleanList(values[f.key],160,220);});r.metadata.updatedAt=U.isoNow();S.markDirty();return r.lore;}
  function resetLore(){var r=ensure();r.lore={};LORE_FIELDS.forEach(function(f){r.lore[f.key]=[];});r.metadata.updatedAt=U.isoNow();S.markDirty();return r.lore;}

  function addPoint(name,kind,point){var p=sanitizePoint(point),f={id:U.randomId('feature'),type:'point',kind:FEATURE_KINDS.indexOf(kind)>=0?kind:'generic',name:U.safeText(name||'Survey point',120),point:[p.lat,p.lon],source:'surveyor',provenance:'Surveyor authored '+U.isoNow()};if(!S.state.world.geometry)S.state.world.geometry={name:ensure().metadata.name+' survey',provenance:'Surveyor-authored local geometry',center:[p.lat,p.lon],features:[]};S.state.world.geometry.features=Array.isArray(S.state.world.geometry.features)?S.state.world.geometry.features:[];S.state.world.geometry.features.push(f);S.state.world.geometrySource='surveyor';S.markDirty();return f;}
  function addExclusion(name,kind,point,radiusM){var p=sanitizePoint(point),r=U.clamp(Number(radiusM)||40,10,2000),n=U.offsetLatLon(p,0,r),s=U.offsetLatLon(p,0,-r),e=U.offsetLatLon(p,r,0),w=U.offsetLatLon(p,-r,0),f={id:U.randomId('feature'),type:'polygon',kind:EXCLUSION_KINDS.indexOf(kind)>=0?kind:'exclusion_hazard',name:U.safeText(name||'Survey exclusion',120),points:[[n.lat,w.lon],[n.lat,e.lon],[s.lat,e.lon],[s.lat,w.lon],[n.lat,w.lon]],source:'surveyor',provenance:'Surveyor-authored exclusion '+U.isoNow()};if(!S.state.world.geometry)S.state.world.geometry={name:ensure().metadata.name+' survey',provenance:'Surveyor-authored local geometry',center:[p.lat,p.lon],features:[]};S.state.world.geometry.features=S.state.world.geometry.features||[];S.state.world.geometry.features.push(f);S.state.world.geometrySource='surveyor';S.markDirty();return f;}
  function updateFeature(id,patch){var geom=S.state.world.geometry;if(!geom||!Array.isArray(geom.features))throw new Error('No survey geometry is loaded.');var f=geom.features.filter(function(x){return x.id===id;})[0];if(!f)throw new Error('Survey feature not found.');f.name=U.safeText(patch.name||f.name,120);f.kind=U.safeText(patch.kind||f.kind,60);f.source=f.source||'surveyor';f.provenance=U.safeText((f.provenance||'')+' | edited '+U.isoNow(),300);S.state.world.geometrySource='surveyor';S.markDirty();return f;}
  function archiveFeature(id){var geom=S.state.world.geometry;if(!geom||!Array.isArray(geom.features))throw new Error('No survey geometry is loaded.');var idx=geom.features.findIndex(function(x){return x.id===id;});if(idx<0)throw new Error('Survey feature not found.');var f=geom.features.splice(idx,1)[0];S.softArchive('region-feature',f.name||f.kind,f);S.state.world.geometrySource='surveyor';S.markDirty();return f;}

  function addAnchor(name,kind,point,notes){var r=ensure(),p=sanitizePoint(point),a=sanitizeAnchor({id:U.randomId('anchor'),name:name,kind:kind,lat:p.lat,lon:p.lon,createdAt:U.isoNow(),provenance:'Surveyor authored Threshold anchor',notes:notes||''},r.customAnchors.length);r.customAnchors.push(a);S.markDirty();return a;}
  function suppressThreshold(id,value){var r=ensure(),key=U.safeText(id,120);if(!key)throw new Error('Select a deterministic Threshold first.');if(value===false)delete r.suppressedThresholds[key];else r.suppressedThresholds[key]=true;S.markDirty();return !!r.suppressedThresholds[key];}
  function isSuppressed(id){return !!ensure().suppressedThresholds[id];}
  function anchorsNear(fix,rangeM){if(!fix)return[];return ensure().customAnchors.map(function(a){var x=U.deepClone(a);x.distanceM=U.distanceM(fix,x);x.bearing=U.bearingDeg(fix,x);x.cell=window.LG_WORLD?window.LG_WORLD.geohashEncode(x.lat,x.lon,6):'';x.latent={temperament:'authored',depth:4,answer:'A Threshold entered by the Surveyor.',affinity:x.kind};x.provenance='surveyor anchor';return x;}).filter(function(a){return a.distanceM<=rangeM&&!isSuppressed(a.id);});}

  function addAnnotation(kind,text,point){var r=ensure(),p=sanitizePoint(point),a=sanitizeAnnotation({id:U.randomId('annotation'),kind:kind,text:text,lat:p.lat,lon:p.lon,createdAt:U.isoNow(),provenance:'Surveyor annotation'},r.annotations.length);r.annotations.push(a);S.markDirty();return a;}
  function captureSuggestedWalk(exp){if(!exp)throw new Error('Select an Expedition first.');var route=(exp.route||[]).map(function(p){return{lat:p.lat,lon:p.lon};});if(exp.returnPoint)route.push({lat:exp.returnPoint.lat,lon:exp.returnPoint.lon});var w=sanitizeWalk({id:U.randomId('walk'),title:exp.title,purpose:exp.purpose,distanceM:exp.replay&&exp.replay.distanceM||0,estimatedMinutes:exp.estimatedMinutes,safetyNotes:exp.safetyNotes,route:route,sourceExpeditionId:exp.id,createdAt:U.isoNow(),provenance:'Captured from local Expedition'},ensure().suggestedWalks.length);ensure().suggestedWalks.push(w);S.markDirty();return w;}

  function addIllustration(img){var r=ensure(),plate=sanitizeIllustration(img,r.illustrations.length);r.illustrations.push(plate);r.metadata.updatedAt=U.isoNow();S.markDirty();return plate;}
  function archiveIllustration(id){var r=ensure(),idx=r.illustrations.findIndex(function(x){return x.id===id;});if(idx<0)throw new Error('Regional illustration not found.');var plate=r.illustrations.splice(idx,1)[0];S.softArchive('region-illustration',plate.name,plate);r.metadata.updatedAt=U.isoNow();S.markDirty();return plate;}

  function packageSummary(pkg){pkg=pkg||buildPackage();return{features:pkg.geometry&&pkg.geometry.features?pkg.geometry.features.length:0,anchors:pkg.customAnchors.length,suppressed:Object.keys(pkg.suppressedThresholds).length,annotations:pkg.annotations.length,walks:pkg.suggestedWalks.length,illustrations:(pkg.illustrations||[]).length,scenarios:(pkg.scenarios||[]).length,loreTerms:LORE_FIELDS.reduce(function(n,f){return n+(pkg.lore[f.key]||[]).length;},0)};}

  window.LG_REGION={
    ensure:ensure,defaultRegion:defaultRegion,loreFields:LORE_FIELDS,featureKinds:FEATURE_KINDS,exclusionKinds:EXCLUSION_KINDS,annotationKinds:ANNOTATION_KINDS,
    activeLore:activeLore,activeNames:activeNames,regionFlavor:regionFlavor,validatePackage:validatePackage,buildPackage:buildPackage,exportText:exportText,importText:importText,packageSummary:packageSummary,
    setMetadata:setMetadata,setLore:setLore,resetLore:resetLore,addPoint:addPoint,addExclusion:addExclusion,updateFeature:updateFeature,archiveFeature:archiveFeature,
    addAnchor:addAnchor,suppressThreshold:suppressThreshold,isSuppressed:isSuppressed,anchorsNear:anchorsNear,addAnnotation:addAnnotation,captureSuggestedWalk:captureSuggestedWalk,addIllustration:addIllustration,archiveIllustration:archiveIllustration,cleanList:cleanList
  };
}());
