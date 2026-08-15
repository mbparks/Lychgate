/* LYCHGATE :: audio.js :: v5.3.0
   Procedural WebAudio only. No recorded audio assets are shipped. */
(function () {
  'use strict';

  var U = window.LG_UTIL;
  var S = window.LG_STORAGE;

  var A = {
    context:null,
    ambienceNodes:[],

    ensure:function () {
      if (S.state && S.state.ui && S.state.ui.muted) return null;
      if (!this.context) {
        var AC=window.AudioContext||window.webkitAudioContext;
        if(!AC)return null;
        this.context=new AC();
      }
      if(this.context.state==='suspended')this.context.resume();
      return this.context;
    },

    envelope:function (gain,now,peak,attack,release) {
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(.0001,now);
      gain.gain.exponentialRampToValueAtTime(Math.max(.0002,peak),now+attack);
      gain.gain.exponentialRampToValueAtTime(.0001,now+attack+release);
    },

    partial:function (freq,when,duration,peak,type,destination) {
      var ac=this.ensure();if(!ac)return;
      var osc=ac.createOscillator(),g=ac.createGain();osc.type=type||'sine';osc.frequency.value=freq;
      this.envelope(g,when,peak,.01,Math.max(.04,duration-.01));osc.connect(g);g.connect(destination||ac.destination);osc.start(when);osc.stop(when+duration+.05);
    },

    bell:function () {
      var ac=this.ensure();if(!ac)return;var n=ac.currentTime;
      [[330,1,.08],[481,.8,.04],[712,.62,.03],[1060,.42,.02]].forEach(function(p){A.partial(p[0],n,p[1],p[2],'sine');});
    },

    counter:function () {
      var ac=this.ensure();if(!ac)return;var n=ac.currentTime;
      this.partial(920,n,.055,.035,'square');this.partial(520,n+.045,.045,.025,'triangle');
    },

    iron:function () {
      var ac=this.ensure();if(!ac)return;var n=ac.currentTime;
      this.partial(210,n,.35,.07,'triangle');this.partial(690,n+.008,.16,.03,'square');
    },

    candle:function () {
      var ac=this.ensure();if(!ac)return;var n=ac.currentTime;
      this.partial(740,n,.08,.025,'triangle');this.partial(360,n+.06,.16,.018,'sine');
    },

    book:function () {
      var ac=this.ensure();if(!ac)return;var n=ac.currentTime;
      this.partial(180,n,.32,.05,'sine');this.partial(235,n+.03,.27,.025,'sine');
    },

    threshold:function () {
      var ac=this.ensure();if(!ac)return;var n=ac.currentTime;
      this.partial(145,n,.7,.035,'sine');this.partial(217,n+.05,.62,.025,'triangle');this.partial(289,n+.10,.5,.018,'sine');
    },

    confirm:function () {
      var ac=this.ensure();if(!ac)return;var n=ac.currentTime;
      this.partial(440,n,.16,.035,'sine');this.partial(660,n+.10,.25,.04,'sine');
    },

    error:function () {
      var ac=this.ensure();if(!ac)return;var n=ac.currentTime;
      this.partial(180,n,.16,.035,'sawtooth');this.partial(145,n+.1,.18,.025,'sawtooth');
    },

    bearing:function (bearing,distance,isHome) {
      var ac=this.ensure();if(!ac)return;
      var pan=ac.createStereoPanner?ac.createStereoPanner():null,gain=ac.createGain(),out=pan||gain;
      gain.gain.value=.9;if(pan){pan.pan.value=Math.sin(U.toRad(bearing));pan.connect(gain);}gain.connect(ac.destination);
      var pulses=distance<100?4:distance<300?3:distance<800?2:1;
      for(var i=0;i<pulses;i+=1){this.partial(isHome?294:466,ac.currentTime+i*.16,.1,.055,'sine',out);}
      if(navigator.vibrate){var ms=Math.round(40+((bearing%360)/360)*70);navigator.vibrate([ms,65,ms]);}
    },

    startAmbience:function () {
      var ac=this.ensure();if(!ac||this.ambienceNodes.length)return;
      var master=ac.createGain();master.gain.value=.025;master.connect(ac.destination);
      var drone=ac.createOscillator(),drone2=ac.createOscillator(),dg=ac.createGain();
      drone.type='sine';drone.frequency.value=73.4;drone2.type='triangle';drone2.frequency.value=110;
      dg.gain.value=.35;drone.connect(dg);drone2.connect(dg);dg.connect(master);drone.start();drone2.start();

      var len=ac.sampleRate*2,buf=ac.createBuffer(1,len,ac.sampleRate),data=buf.getChannelData(0);
      for(var i=0;i<len;i+=1)data[i]=(Math.random()*2-1)*.14;
      var noise=ac.createBufferSource(),ng=ac.createGain(),filter=ac.createBiquadFilter();noise.buffer=buf;noise.loop=true;filter.type='lowpass';filter.frequency.value=1500;ng.gain.value=.18;
      noise.connect(filter);filter.connect(ng);ng.connect(master);noise.start();
      this.ambienceNodes=[master,drone,drone2,dg,noise,ng,filter];
    },

    stopAmbience:function () {
      this.ambienceNodes.forEach(function(n){try{if(n.stop)n.stop();}catch(e){}try{n.disconnect();}catch(e2){}});this.ambienceNodes=[];
    },

    sync:function () {
      if(!S.state||!S.state.ui)return;
      if(S.state.ui.muted||!S.state.ui.ambience)this.stopAmbience();else this.startAmbience();
    }
  };

  window.LG_AUDIO=A;
}());
