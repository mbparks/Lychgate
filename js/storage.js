/* LYCHGATE :: storage.js :: v5.3.0 */
(function () {
  'use strict';

  var U = window.LG_UTIL;
  var KEY = 'LYCHGATE_SAVE_V1';

  function baseUI() {
    return {
      station:'field', mapMode:'survey', rangeM:1000, highContrast:false, muted:false, debug:false,
      railCollapsed:(window.innerWidth <= 720), walkMode:false, ledgerView:'ground', sigilPractice:false, sigilAssist:false,
      sigilDifficulty:'auto', mapView:{center:null, spanM:1700}, ambience:false, dismissedEncounterId:null, ritesView:'available', relicSort:'found', groundMetric:'area', expeditionView:'plan', replaySpeed:1, selectedExpeditionId:null, scenarioView:'play', selectedScenarioId:null, selectedScenarioNodeId:null
    };
  }

  function defaultState() {
    var center = window.LYCHGATE_SAMPLE_REGION ? {lat:window.LYCHGATE_SAMPLE_REGION.center[0],lon:window.LYCHGATE_SAMPLE_REGION.center[1]} : null;
    return {
      schema:'LYCHGATE_SAVE_1', version:U.VERSION, createdAt:U.isoNow(), updatedAt:U.isoNow(), firstRunAccepted:false,
      player:{
        id:U.randomId('walker'), callSign:'Walker', faction:null, defected:false, degree:1, practiceScore:0, aether:40,
        inventory:{salt:2,iron:2,ash:1}, home:null, sigilPracticeHistory:[], riteHistory:[], encounterHistory:[]
      },
      world:{
        salt:U.WORLD_SALT,
        geometry:window.LYCHGATE_SAMPLE_REGION ? U.deepClone(window.LYCHGATE_SAMPLE_REGION) : null,
        geometrySource:'bundled sample', geometryImportedAt:null,
        region:{schema:'LYCHGATE_REGION_STATE_1',metadata:{name:'Local Region',author:'',description:'',license:'GPL-3.0',source:'local authoring',sourceLicenseNotes:'',packageId:null,installedAt:null,updatedAt:U.isoNow()},customAnchors:[],suppressedThresholds:{},annotations:[],suggestedWalks:[],illustrations:[],lore:{},packageHistory:[]}
      },
      position:{
        source:'manual',
        fix:center ? {lat:center.lat,lon:center.lon,accuracy:5,heading:null,speed:0,simulated:true,source:'manual',at:U.isoNow()} : null,
        history:[], track:null
      },
      thresholds:{}, relics:{}, links:[], shroudRecords:{}, importedStones:[], encounters:[], encounterKeys:{},
      artifacts:{seen:{},stateHashes:{},incoming:[],outgoing:[],outgoingBatches:[]},
      registry:{},
      expeditions:{items:{},order:[],activeId:null}, scenarios:{items:{},order:[],active:null,completions:[]}, relay:{inbox:[],outbox:[],settings:{transport:'broadcast',channel:'LYCHGATE-FIELD',wsUrl:'ws://127.0.0.1:8787'}},
      session:{id:U.randomId('session'),number:1,startedAt:U.isoNow(),actions:[],notes:[]},
      sessions:[], journalCounter:1, archive:[], ui:baseUI(), identity:{schema:'LYCHGATE_IDENTITY_1',status:'pending',algorithm:'ECDSA-P256-SHA256',createdAt:null,keyId:null,fingerprint:null,publicJwk:null,privateJwk:null,retiredKeys:[],legacySigner:U.randomId('sig'),lastError:null}
    };
  }

  function ensureRecord(rec, id) {
    rec = rec && typeof rec === 'object' ? rec : {};
    rec.id = rec.id || id;
    rec.vigils = Array.isArray(rec.vigils) ? rec.vigils : [];
    rec.petitionCount = Math.max(0, Number(rec.petitionCount) || 0);
    rec.bestSigil = Math.max(0, Number(rec.bestSigil) || 0);
    rec.sigilHistory = Array.isArray(rec.sigilHistory) ? rec.sigilHistory : [];
    rec.updatedAt = rec.updatedAt || null;
    rec.history = Array.isArray(rec.history) ? rec.history : [];
    rec.notes = Array.isArray(rec.notes) ? rec.notes : [];
    rec.photos = Array.isArray(rec.photos) ? rec.photos : [];
    rec.rites = Array.isArray(rec.rites) ? rec.rites : [];
    rec.riteEffects = rec.riteEffects && typeof rec.riteEffects === 'object' ? rec.riteEffects : {};
    rec.loreWitnesses = Array.isArray(rec.loreWitnesses) ? rec.loreWitnesses : [];
    rec.artifactProvenance = Array.isArray(rec.artifactProvenance) ? rec.artifactProvenance : [];
    rec.lastArtifactStateHash = rec.lastArtifactStateHash || null;
    rec.provenance = rec.provenance || (String(id).indexOf('th-') === 0 ? 'deterministic' : 'local record');
    rec.discoveredAt = rec.discoveredAt || (rec.snapshot ? rec.updatedAt || U.isoNow() : null);
    return rec;
  }

  function ensureRelic(relic, key, state) {
    relic = relic && typeof relic === 'object' ? relic : {};
    var thresholdId = relic.thresholdId || key || '';
    var seed = U.hash32(String(thresholdId)+'|relic|'+String((state&&state.world&&state.world.salt)||U.WORLD_SALT));
    var rarities = ['common','common','common','uncommon','uncommon','rare','exceptional'];
    var marks = ['a scored ring','three pinpricks','a split cross','a ladder of four cuts','a crescent nick','a barred eye','two opposing chevrons','a tiny eight-point star'];
    relic.id = relic.id || ('relic-'+thresholdId);
    relic.thresholdId = thresholdId;
    relic.thresholdName = relic.thresholdName || thresholdId || 'Unknown Threshold';
    relic.foundAt = relic.foundAt || U.isoNow();
    relic.kind = relic.kind || 'generic';
    relic.provenance = relic.provenance || 'petition';
    relic.factionAtFinding = relic.factionAtFinding || null;
    relic.rarity = relic.rarity || rarities[seed % rarities.length];
    relic.condition = relic.condition || 'sound';
    relic.conditionScore = U.clamp(Number(relic.conditionScore == null ? 100 : relic.conditionScore),0,100);
    relic.inscription = relic.inscription || marks[(seed >>> 4) % marks.length];
    relic.resonance = U.clamp(Number(relic.resonance == null ? 20 + ((seed >>> 8) % 81) : relic.resonance),0,100);
    relic.attunement = U.clamp(Number(relic.attunement)||0,0,100);
    relic.attunedFaction = relic.attunedFaction || null;
    relic.transferCount = Math.max(0,Number(relic.transferCount)||0);
    relic.history = Array.isArray(relic.history) ? relic.history : [];
    relic.artifactProvenance = Array.isArray(relic.artifactProvenance) ? relic.artifactProvenance : [];
    relic.lastArtifactStateHash = relic.lastArtifactStateHash || null;
    if (!relic.history.length) relic.history.push({type:'found',at:relic.foundAt,note:'Recovered at '+relic.thresholdName+'.'});
    return relic;
  }

  function ensureLink(link) {
    link = link && typeof link === 'object' ? link : {};
    link.id = link.id || U.randomId('line');
    link.createdAt = link.createdAt || U.isoNow();
    link.distanceM = Math.max(0,Number(link.distanceM)||0);
    link.stability = U.clamp(Number(link.stability == null ? 100 : link.stability),0,100);
    link.strength = U.clamp(Number(link.strength == null ? 100 : link.strength),0,100);
    link.decayPerHour = Math.max(.02,Number(link.decayPerHour)||.18);
    link.lastEvaluatedAt = link.lastEvaluatedAt || link.createdAt;
    link.reinforcedAt = link.reinforcedAt || null;
    link.reinforcementCount = Math.max(0,Number(link.reinforcementCount)||0);
    link.relicId = link.relicId || null;
    link.survey = link.survey && typeof link.survey === 'object' ? link.survey : {};
    link.history = Array.isArray(link.history) ? link.history : [];
    if (!link.history.length) link.history.push({type:'drawn',at:link.createdAt,note:'Ley line entered into the ledger.'});
    return link;
  }

  function migrateState(input) {
    var defaults = defaultState();
    input.version = U.VERSION;
    input.updatedAt = U.isoNow();
    input.ui = Object.assign({}, baseUI(), input.ui || {});
    input.ui.mapView = Object.assign({center:null,spanM:1700}, (input.ui && input.ui.mapView) || {});
    var priorIdentity=input.identity&&typeof input.identity==='object'?input.identity:{};
    if(priorIdentity.schema!=='LYCHGATE_IDENTITY_1'){input.identity={schema:'LYCHGATE_IDENTITY_1',status:'pending',algorithm:'ECDSA-P256-SHA256',createdAt:null,keyId:null,fingerprint:null,publicJwk:null,privateJwk:null,retiredKeys:[],legacySigner:priorIdentity.signer||priorIdentity.legacySigner||U.randomId('sig'),lastError:null};}
    input.identity.retiredKeys=Array.isArray(input.identity.retiredKeys)?input.identity.retiredKeys:[];
    input.identity.legacySigner=input.identity.legacySigner||priorIdentity.signer||U.randomId('sig');
    input.identity.algorithm=input.identity.algorithm||'ECDSA-P256-SHA256';
    input.world.region=input.world.region&&typeof input.world.region==='object'?input.world.region:{schema:'LYCHGATE_REGION_STATE_1',metadata:{name:'Local Region',author:'',description:'',license:'GPL-3.0',source:'local authoring',sourceLicenseNotes:'',packageId:null,installedAt:null,updatedAt:U.isoNow()},customAnchors:[],suppressedThresholds:{},annotations:[],suggestedWalks:[],illustrations:[],lore:{},packageHistory:[]};
    input.world.region.metadata=Object.assign({name:'Local Region',author:'',description:'',license:'GPL-3.0',source:'local authoring',sourceLicenseNotes:'',packageId:null,installedAt:null,updatedAt:U.isoNow()},input.world.region.metadata||{});
    input.world.region.customAnchors=Array.isArray(input.world.region.customAnchors)?input.world.region.customAnchors:[];input.world.region.suppressedThresholds=input.world.region.suppressedThresholds&&typeof input.world.region.suppressedThresholds==='object'?input.world.region.suppressedThresholds:{};input.world.region.annotations=Array.isArray(input.world.region.annotations)?input.world.region.annotations:[];input.world.region.suggestedWalks=Array.isArray(input.world.region.suggestedWalks)?input.world.region.suggestedWalks:[];input.world.region.illustrations=Array.isArray(input.world.region.illustrations)?input.world.region.illustrations:[];input.world.region.lore=input.world.region.lore&&typeof input.world.region.lore==='object'?input.world.region.lore:{};input.world.region.packageHistory=Array.isArray(input.world.region.packageHistory)?input.world.region.packageHistory:[];
    input.registry=input.registry&&typeof input.registry==='object'?input.registry:{};
    input.expeditions=input.expeditions&&typeof input.expeditions==='object'?input.expeditions:{items:{},order:[],activeId:null};input.expeditions.items=input.expeditions.items&&typeof input.expeditions.items==='object'?input.expeditions.items:{};input.expeditions.order=Array.isArray(input.expeditions.order)?input.expeditions.order:[];if(input.expeditions.activeId&&!input.expeditions.items[input.expeditions.activeId])input.expeditions.activeId=null;
    input.scenarios=input.scenarios&&typeof input.scenarios==='object'?input.scenarios:{items:{},order:[],active:null,completions:[]};input.scenarios.items=input.scenarios.items&&typeof input.scenarios.items==='object'?input.scenarios.items:{};input.scenarios.order=Array.isArray(input.scenarios.order)?input.scenarios.order:[];input.scenarios.completions=Array.isArray(input.scenarios.completions)?input.scenarios.completions:[];if(input.scenarios.active&&(!input.scenarios.active.scenarioId||!input.scenarios.items[input.scenarios.active.scenarioId]))input.scenarios.active=null;
    input.relay=input.relay&&typeof input.relay==='object'?input.relay:{inbox:[],outbox:[],settings:{}};input.relay.inbox=Array.isArray(input.relay.inbox)?input.relay.inbox:[];input.relay.outbox=Array.isArray(input.relay.outbox)?input.relay.outbox:[];input.relay.settings=Object.assign({transport:'broadcast',channel:'LYCHGATE-FIELD',wsUrl:'ws://127.0.0.1:8787'},input.relay.settings||{});
    Object.keys(input.registry).forEach(function(fp){var r=input.registry[fp]&&typeof input.registry[fp]==='object'?input.registry[fp]:{};r.fingerprint=r.fingerprint||fp;r.trust=['unknown','known','trusted','blocked'].indexOf(r.trust)>=0?r.trust:'unknown';r.firstSeen=r.firstSeen||U.isoNow();r.lastSeen=r.lastSeen||r.firstSeen;r.artifactCount=Math.max(0,Number(r.artifactCount)||0);r.thresholdIds=Array.isArray(r.thresholdIds)?r.thresholdIds:[];r.relicCount=Math.max(0,Number(r.relicCount)||0);r.notes=U.safeText(r.notes||'',1200);r.signatureStatus=r.signatureStatus||'unknown';input.registry[fp]=r;});
    input.relics = input.relics && typeof input.relics === 'object' ? input.relics : {};
    Object.keys(input.relics).forEach(function (key) { input.relics[key] = ensureRelic(input.relics[key], key, input); });
    input.importedStones = Array.isArray(input.importedStones) ? input.importedStones : [];
    input.artifacts = input.artifacts && typeof input.artifacts === 'object' ? input.artifacts : {};
    input.artifacts.seen = input.artifacts.seen && typeof input.artifacts.seen === 'object' ? input.artifacts.seen : {};
    input.artifacts.stateHashes = input.artifacts.stateHashes && typeof input.artifacts.stateHashes === 'object' ? input.artifacts.stateHashes : {};
    input.artifacts.incoming = Array.isArray(input.artifacts.incoming) ? input.artifacts.incoming : [];
    input.artifacts.outgoing = Array.isArray(input.artifacts.outgoing) ? input.artifacts.outgoing : [];
    input.artifacts.outgoingBatches = Array.isArray(input.artifacts.outgoingBatches) ? input.artifacts.outgoingBatches : [];
    input.encounters = Array.isArray(input.encounters) ? input.encounters : [];
    input.encounterKeys = input.encounterKeys && typeof input.encounterKeys === 'object' ? input.encounterKeys : {};
    input.sessions = Array.isArray(input.sessions) ? input.sessions : [];
    input.archive = Array.isArray(input.archive) ? input.archive : [];
    input.links = Array.isArray(input.links) ? input.links.map(ensureLink) : [];
    input.shroudRecords = input.shroudRecords && typeof input.shroudRecords === 'object' ? input.shroudRecords : {};
    input.thresholds = input.thresholds && typeof input.thresholds === 'object' ? input.thresholds : {};
    Object.keys(input.thresholds).forEach(function (id) { input.thresholds[id] = ensureRecord(input.thresholds[id], id); });
    if (!input.session || !Array.isArray(input.session.actions)) input.session = defaults.session;
    input.session.notes = Array.isArray(input.session.notes) ? input.session.notes : [];
    input.session.number = Math.max(1, Number(input.session.number) || (input.sessions.length + 1));
    input.journalCounter = Math.max(input.session.number, Number(input.journalCounter) || (input.sessions.length + 1));
    if (!input.position.history) input.position.history = [];
    if (!input.player.inventory) input.player.inventory = {salt:2,iron:2,ash:1};
    if (!Array.isArray(input.player.sigilPracticeHistory)) input.player.sigilPracticeHistory = [];
    if (!Array.isArray(input.player.riteHistory)) input.player.riteHistory = [];
    if (!Array.isArray(input.player.encounterHistory)) input.player.encounterHistory = [];
    return input;
  }

  function validateState(input) {
    if (!input || typeof input !== 'object') throw new Error('Save must be a JSON object.');
    if (input.schema !== 'LYCHGATE_SAVE_1') throw new Error('Unsupported save schema.');
    if (!input.player || typeof input.player !== 'object') throw new Error('Save is missing player data.');
    if (!input.world || typeof input.world !== 'object') throw new Error('Save is missing world data.');
    if (!input.position || typeof input.position !== 'object') throw new Error('Save is missing position data.');
    return migrateState(input);
  }

  var S = {
    state:null, onSaveStatus:null, saveTimer:null,

    load:function () {
      var raw = null;
      try { raw = localStorage.getItem(KEY); } catch (e) { raw = null; }
      if (!raw) { this.state = defaultState(); return this.state; }
      try { this.state = validateState(JSON.parse(raw)); }
      catch (err) {
        this.state = defaultState();
        this.state.archive.push({type:'corrupt-save-note',archivedAt:U.isoNow(),note:U.safeText(err.message,300)});
      }
      return this.state;
    },

    markDirty:function () {
      var self = this;
      if (typeof this.onSaveStatus === 'function') this.onSaveStatus('saving');
      clearTimeout(this.saveTimer);
      this.saveTimer = setTimeout(function () { self.saveNow(); }, 180);
    },

    saveNow:function () {
      if (!this.state) return;
      this.state.updatedAt = U.isoNow();
      try {
        localStorage.setItem(KEY, JSON.stringify(this.state));
        if (typeof this.onSaveStatus === 'function') this.onSaveStatus('saved');
      } catch (err) {
        if (typeof this.onSaveStatus === 'function') this.onSaveStatus('error');
      }
    },

    exportSave:function () { this.saveNow(); return JSON.stringify(this.state,null,2); },
    importSave:function (text) { this.state = validateState(JSON.parse(text)); this.saveNow(); return this.state; },

    archiveCurrentSession:function (reason) {
      if (!this.state.session) return;
      var archived = U.deepClone(this.state.session);
      archived.endedAt = U.isoNow();
      archived.reason = reason || 'manual archive';
      this.state.sessions.push(archived);
      this.state.journalCounter = Math.max(Number(this.state.journalCounter)||1, Number(archived.number)||1) + 1;
      this.state.session = {id:U.randomId('session'),number:this.state.journalCounter,startedAt:U.isoNow(),actions:[],notes:[]};
      this.markDirty();
    },

    freshStart:function () {
      var prior = this.state ? U.deepClone(this.state) : null;
      var next = defaultState();
      if (prior) next.archive.push({type:'recovery-save',archivedAt:U.isoNow(),label:'Pre-reset recovery',payload:prior});
      this.state = next;
      this.saveNow();
      return this.state;
    },

    softArchive:function (type,label,payload) {
      this.state.archive.push({type:type,label:U.safeText(label,120),archivedAt:U.isoNow(),payload:U.deepClone(payload)});
      this.markDirty();
    },

    addAction:function (type,data) {
      var action = {id:U.randomId('act'),type:type,at:U.isoNow(),data:U.deepClone(data||{})};
      this.state.session.actions.push(action);
      if (window.LG_EXPEDITIONS && typeof window.LG_EXPEDITIONS.recordAction === 'function') window.LG_EXPEDITIONS.recordAction(action);
      if (window.LG_SCENARIOS && typeof window.LG_SCENARIOS.recordAction === 'function') window.LG_SCENARIOS.recordAction(action);
      this.markDirty();
      return action;
    },

    addJournalNote:function (text) {
      text = U.safeText(text,1200);
      if (!text) return null;
      var note = {id:U.randomId('note'),at:U.isoNow(),text:text};
      this.state.session.notes.push(note);
      this.addAction('journal-note',{text:text});
      return note;
    },

    validateState:validateState,
    defaultState:defaultState,
    ensureRecord:ensureRecord,
    ensureRelic:ensureRelic,
    ensureLink:ensureLink,
    key:KEY
  };

  window.LG_STORAGE = S;
}());
