/* LYCHGATE :: app.js :: v5.3.0 */
(function(){
  'use strict';
  async function boot(){
    window.LG_STORAGE.load();
    if(window.LG_IDENTITY){try{await window.LG_IDENTITY.ensure();}catch(e){window.LG_STORAGE.state.identity.lastError=e.message||String(e);}}
    window.LG_UI.init();
    if(location.protocol==='http:'||location.protocol==='https:'){
      if('serviceWorker' in navigator){
        navigator.serviceWorker.register('sw.js').then(function(reg){
          reg.addEventListener('updatefound',function(){var worker=reg.installing;if(!worker)return;worker.addEventListener('statechange',function(){if(worker.state==='installed'&&navigator.serviceWorker.controller&&window.LG_UI){window.LG_UI.toast('A local LYCHGATE update is ready. Reload when convenient.');}});});
        }).catch(function(){if(window.LG_STORAGE.state.ui.debug&&window.console)console.log('[LYCHGATE] Optional service worker unavailable. Core game is unaffected.');});
      }
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
}());
