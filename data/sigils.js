/* LYCHGATE :: sigils.js :: v5.3.0
   Original bundled vector sigil data, written for LYCHGATE and licensed GPL-3.0. */
(function () {
  'use strict';

  function P(list) { return list.map(function (xy) { return {x:xy[0], y:xy[1]}; }); }
  function S() { return Array.prototype.slice.call(arguments).map(P); }

  window.LYCHGATE_SIGILS = [
    {name:'The Gate', family:'threshold', difficulty:1, revealMs:1700, strokes:S([[.24,.78],[.24,.28],[.76,.28],[.76,.78]],[[.17,.78],[.83,.78]])},
    {name:'The Lantern', family:'light', difficulty:1, revealMs:1650, strokes:S([[.50,.15],[.72,.49],[.50,.84],[.28,.49],[.50,.15]],[[.32,.49],[.68,.49]])},
    {name:'The Crossing', family:'road', difficulty:1, revealMs:1600, strokes:S([[.20,.20],[.80,.80]],[[.80,.20],[.20,.80]],[[.50,.08],[.50,.92]])},
    {name:'The Bell', family:'tolling', difficulty:1, revealMs:1750, strokes:S([[.29,.68],[.34,.38],[.50,.20],[.66,.38],[.71,.68],[.29,.68]],[[.50,.68],[.50,.84]])},
    {name:'The Well', family:'water', difficulty:1, revealMs:1700, strokes:S([[.24,.38],[.76,.38],[.68,.78],[.32,.78],[.24,.38]],[[.18,.28],[.82,.28]])},
    {name:'The Rook', family:'watch', difficulty:1, revealMs:1650, strokes:S([[.25,.72],[.38,.28],[.50,.52],[.62,.28],[.75,.72]],[[.31,.58],[.69,.58]])},
    {name:'The Ash', family:'binding', difficulty:1, revealMs:1650, strokes:S([[.50,.16],[.50,.84]],[[.27,.32],[.73,.68]],[[.73,.32],[.27,.68]])},
    {name:'The Ford', family:'water', difficulty:1, revealMs:1700, strokes:S([[.18,.38],[.32,.28],[.46,.38],[.60,.28],[.82,.40]],[[.18,.66],[.34,.56],[.50,.66],[.66,.56],[.82,.66]])},

    {name:'The Name', family:'ledger', difficulty:2, revealMs:1500, strokes:S([[.23,.78],[.23,.25],[.75,.78],[.75,.25]],[[.34,.52],[.64,.52]])},
    {name:'The Watch', family:'watch', difficulty:2, revealMs:1450, strokes:S([[.16,.50],[.32,.31],[.50,.24],[.68,.31],[.84,.50],[.68,.69],[.50,.76],[.32,.69],[.16,.50]],[[.50,.39],[.50,.61]])},
    {name:'The Iron', family:'binding', difficulty:2, revealMs:1450, strokes:S([[.31,.18],[.31,.82]],[[.69,.18],[.69,.82]],[[.21,.32],[.79,.32]],[[.21,.68],[.79,.68]])},
    {name:'The Salt', family:'binding', difficulty:2, revealMs:1500, strokes:S([[.18,.30],[.82,.30],[.18,.70],[.82,.70]],[[.28,.18],[.28,.82]],[[.72,.18],[.72,.82]])},
    {name:'The Bridge', family:'crossing', difficulty:2, revealMs:1550, strokes:S([[.16,.69],[.30,.43],[.50,.34],[.70,.43],[.84,.69]],[[.16,.69],[.84,.69]],[[.30,.43],[.30,.76]],[[.70,.43],[.70,.76]])},
    {name:'The Hollow', family:'ground', difficulty:2, revealMs:1450, strokes:S([[.19,.35],[.32,.66],[.50,.76],[.68,.66],[.81,.35]],[[.31,.39],[.50,.57],[.69,.39]])},
    {name:'The Candle', family:'light', difficulty:2, revealMs:1500, strokes:S([[.38,.82],[.38,.37],[.62,.37],[.62,.82],[.38,.82]],[[.50,.13],[.39,.30],[.50,.35],[.61,.30],[.50,.13]])},
    {name:'The Ledger', family:'ledger', difficulty:2, revealMs:1500, strokes:S([[.23,.19],[.23,.81],[.77,.81]],[[.38,.33],[.70,.33]],[[.38,.49],[.70,.49]],[[.38,.65],[.70,.65]])},

    {name:'The Procession', family:'passage', difficulty:3, revealMs:1300, strokes:S([[.16,.72],[.27,.54],[.38,.72],[.49,.54],[.60,.72],[.71,.54],[.84,.72]],[[.16,.31],[.84,.31]],[[.28,.20],[.28,.44]],[[.72,.20],[.72,.44]])},
    {name:'The Adjoining', family:'threshold', difficulty:3, revealMs:1300, strokes:S([[.18,.78],[.18,.25],[.50,.25],[.50,.78]],[[.50,.78],[.50,.25],[.82,.25],[.82,.78]],[[.12,.78],[.88,.78]])},
    {name:'The Cold Spot', family:'weather', difficulty:3, revealMs:1350, strokes:S([[.50,.13],[.50,.87]],[[.17,.50],[.83,.50]],[[.26,.26],[.74,.74]],[[.74,.26],[.26,.74]])},
    {name:'The Rail Cut', family:'rail', difficulty:3, revealMs:1300, strokes:S([[.25,.16],[.25,.84]],[[.75,.16],[.75,.84]],[[.25,.28],[.75,.38]],[[.25,.48],[.75,.58]],[[.25,.68],[.75,.78]])},
    {name:'The Adit', family:'mine', difficulty:3, revealMs:1350, strokes:S([[.18,.78],[.26,.42],[.50,.20],[.74,.42],[.82,.78]],[[.34,.78],[.34,.50],[.66,.50],[.66,.78]])},
    {name:'The Boundary', family:'ground', difficulty:3, revealMs:1300, strokes:S([[.20,.20],[.80,.20],[.80,.80],[.20,.80],[.20,.20]],[[.34,.34],[.66,.66]],[[.66,.34],[.34,.66]])},
    {name:'The Witness', family:'ledger', difficulty:3, revealMs:1300, strokes:S([[.22,.72],[.36,.26],[.50,.72],[.64,.26],[.78,.72]],[[.30,.57],[.70,.57]],[[.50,.17],[.50,.31]])},
    {name:'The Quiet Yard', family:'churchyard', difficulty:3, revealMs:1400, strokes:S([[.22,.78],[.22,.36],[.78,.36],[.78,.78]],[[.50,.17],[.50,.58]],[[.38,.29],[.62,.29]])},

    {name:'The Returning Light', family:'light', difficulty:4, revealMs:1150, strokes:S([[.20,.60],[.32,.32],[.56,.20],[.78,.34],[.82,.56],[.68,.76],[.45,.80],[.27,.68]],[[.36,.57],[.49,.43],[.65,.49],[.57,.65],[.42,.67]])},
    {name:'The Four Roads', family:'crossing', difficulty:4, revealMs:1150, strokes:S([[.50,.08],[.50,.92]],[[.08,.50],[.92,.50]],[[.25,.25],[.75,.75]],[[.75,.25],[.25,.75]],[[.38,.38],[.62,.38],[.62,.62],[.38,.62],[.38,.38]])},
    {name:'The Black Dog', family:'watch', difficulty:4, revealMs:1200, strokes:S([[.18,.66],[.27,.42],[.43,.37],[.57,.43],[.72,.39],[.82,.52],[.74,.67],[.56,.66],[.45,.77],[.30,.76],[.18,.66]],[[.29,.42],[.24,.27],[.36,.39]],[[.71,.39],[.77,.25],[.79,.46]])},
    {name:'The False Door', family:'threshold', difficulty:4, revealMs:1150, strokes:S([[.22,.82],[.22,.19],[.78,.19],[.78,.82]],[[.35,.82],[.35,.34],[.65,.34],[.65,.82]],[[.48,.57],[.53,.57]])},
    {name:'The Unmarked Grave', family:'ground', difficulty:4, revealMs:1200, strokes:S([[.29,.83],[.35,.28],[.50,.17],[.65,.28],[.71,.83]],[[.22,.83],[.78,.83]],[[.36,.48],[.64,.48]],[[.50,.36],[.50,.65]])},
    {name:'The Harmonic', family:'tolling', difficulty:4, revealMs:1150, strokes:S([[.16,.64],[.28,.40],[.40,.64],[.52,.40],[.64,.64],[.76,.40],[.84,.57]],[[.16,.31],[.84,.31]],[[.27,.22],[.27,.40]],[[.73,.22],[.73,.40]])},
    {name:'The Sealed Name', family:'binding', difficulty:4, revealMs:1100, strokes:S([[.20,.27],[.80,.27],[.80,.73],[.20,.73],[.20,.27]],[[.31,.62],[.31,.39],[.69,.62],[.69,.39]],[[.24,.18],[.76,.82]])},
    {name:'The Toll House', family:'tolling', difficulty:4, revealMs:1200, strokes:S([[.16,.78],[.28,.35],[.50,.18],[.72,.35],[.84,.78]],[[.30,.78],[.30,.47],[.70,.47],[.70,.78]],[[.43,.47],[.43,.67],[.57,.67],[.57,.47]])},

    {name:'The Long Watch', family:'watch', difficulty:5, revealMs:950, strokes:S([[.12,.50],[.26,.29],[.50,.18],[.74,.29],[.88,.50],[.74,.71],[.50,.82],[.26,.71],[.12,.50]],[[.36,.50],[.50,.37],[.64,.50],[.50,.63],[.36,.50]],[[.50,.18],[.50,.05]],[[.50,.82],[.50,.95]])},
    {name:'The Mine Bell', family:'mine', difficulty:5, revealMs:1000, strokes:S([[.18,.78],[.27,.38],[.50,.17],[.73,.38],[.82,.78]],[[.30,.68],[.70,.68]],[[.50,.68],[.50,.86]],[[.34,.37],[.66,.37]],[[.50,.17],[.50,.05]])},
    {name:'The Last Crossing', family:'passage', difficulty:5, revealMs:950, strokes:S([[.13,.76],[.27,.55],[.41,.76],[.55,.55],[.69,.76],[.85,.55]],[[.13,.34],[.29,.21],[.45,.34],[.61,.21],[.77,.34]],[[.20,.49],[.80,.49]],[[.50,.10],[.50,.90]])},
    {name:'The Keeper', family:'ledger', difficulty:5, revealMs:1000, strokes:S([[.20,.79],[.20,.21],[.80,.21],[.80,.79],[.20,.79]],[[.34,.34],[.66,.34],[.66,.66],[.34,.66],[.34,.34]],[[.50,.34],[.50,.66]],[[.34,.50],[.66,.50]])},
    {name:'The Open Veil', family:'passage', difficulty:5, revealMs:950, strokes:S([[.18,.80],[.30,.20],[.50,.52],[.70,.20],[.82,.80]],[[.28,.67],[.50,.42],[.72,.67]],[[.21,.80],[.79,.80]],[[.50,.52],[.50,.90]])}
  ];
}());
