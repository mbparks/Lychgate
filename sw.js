/* LYCHGATE :: sw.js :: v5.3.0
   Optional PWA layer. Core play never depends on this file.
*/
'use strict';
var CACHE='lychgate-v5.3.0';
var ASSETS=[
  './','./index.html','./css/lychgate.css','./data/names.js','./data/lore.js','./data/sigils.js','./data/sample-region.js',
  './js/utils.js','./js/storage.js','./js/region.js','./js/world.js','./js/positions.js','./js/audio.js','./js/game.js','./vendor/qrcode.js','./js/identity.js','./js/artifacts.js','./js/expeditions.js','./js/scenarios.js','./js/relay.js','./js/ui.js','./js/tests.js','./js/app.js',
  './manifest.webmanifest','./assets/icon-192.svg','./assets/icon-512.svg'
];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ASSETS);}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(keys){return Promise.all(keys.filter(function(k){return k.indexOf('lychgate-')===0&&k!==CACHE;}).map(function(k){return caches.delete(k);}));}));});
self.addEventListener('fetch',function(e){if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(function(hit){return hit||fetch(e.request);}));});
