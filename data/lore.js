/* LYCHGATE :: lore.js :: v5.3.0
   Original bundled fictional text data, written for LYCHGATE and licensed GPL-3.0.
   Generated lore is game fiction. It is never presented as historical evidence. */
(function () {
  'use strict';

  window.LYCHGATE_LORE = {
    surnames: ['Alden','Bell','Bishop','Carver','Crowe','Dale','Dunn','Eames','Frost','Gable','Hale','Harrow','Keel','Lamb','Mercer','Morrow','Pike','Rook','Sayer','Toll','Vale','Ward','Webb','Wren'],
    given: ['Ada','Agnes','Clara','Edith','Eliza','Ephraim','Franklin','Hannah','Isaac','Jonas','Lena','Martha','Nell','Orin','Pearl','Ruth','Silas','Thomas','Walter','Will'],
    occupations: ['bridge tender','canal hand','clerk','grave digger','lamp lighter','mill hand','night watchman','rail worker','school teacher','sexton','stone cutter','teamster','telegraph operator','washerwoman'],
    registers: ['parish copy','county copy','loose ledger leaf','survey margin','vestry memorandum','station book','bridge book','unfiled deposition','road overseer note','family memorandum'],
    seasons: ['January','February','March','April','May','June','July','August','September','October','November','December','the first frost','high summer','the thaw','the long rain'],
    epithets: [
      'where the second bell is never counted',
      'where a light waits after the walker has gone',
      'where the road seems one pace longer returning',
      'where names are spoken more softly than elsewhere',
      'where still water keeps the wrong reflection',
      'where iron feels warm in winter',
      'where footsteps answer from the other side',
      'where a closed gate is found open at dawn',
      'where the same bird is heard from two directions',
      'where the shadow arrives before the cloud'
    ],
    phenomena: [
      'a bell heard without a visible hand',
      'a lantern moving against the wind',
      'three knocks from stone or timber',
      'a sudden absence of ordinary sound',
      'footsteps keeping pace without drawing nearer',
      'a reflection that lags behind the person casting it',
      'cold air holding in one narrow place',
      'a counting sound that stops when answered',
      'a warm patch of ground in cold weather',
      'a familiar voice heard too far away to identify'
    ],
    warnings: [
      'Do not answer a second time.',
      'Count the way back as carefully as the way in.',
      'Leave no light burning after you depart.',
      'Do not cross a barrier, fence, track, road, or posted boundary for the sake of the account.',
      'If the ordinary world gives a safer explanation, keep it.',
      'Make the observation from lawful ground and carry no object away.',
      'If the place is occupied, private, closed, or unsafe, leave the record unfinished.',
      'Never wake a household, disturb worship, or enter burial ground for the game.',
      'Record what happened before deciding what it meant.',
      'A warning in the ledger is not permission to take a risk.'
    ],
    kindledReadings: [
      'The Kindled read this as pressure from a passage left too narrow.',
      'The Kindled say the repeated sign is an unanswered request for witness.',
      'The Kindled hold that the place wants a door acknowledged, not forced.',
      'The Kindled treat the warmth as evidence that passage remains possible.',
      'The Kindled say the account describes delay, not hostility.'
    ],
    sextonReadings: [
      'The Sextons read this as leakage across a boundary that should remain named and kept.',
      'The Sextons say repetition is exactly why the place should be measured before it is opened.',
      'The Sextons hold that a door which answers without being called should be watched, not widened.',
      'The Sextons treat the warmth as a warning that the boundary is under strain.',
      'The Sextons say the account describes persistence, which is reason for a careful seal.'
    ],
    contradictions: [
      'A later hand crosses out the location but leaves the date untouched.',
      'A second copy gives the same witness but reverses the direction of travel.',
      'The margin says the event happened twice, while the main entry records it once.',
      'A later clerk marks the account as weather, then adds a question mark.',
      'The page number is correct, but the neighboring entries belong to another year.',
      'Two copies agree on the words and disagree on who first reported them.'
    ],

    encounters: [
      {id:'tolling',title:'Tolling',kinds:['churchyard','cemetery','monument','historic'],times:['dusk','night'],weight:8,text:'One measured bell note arrives from a direction that does not agree with the map.',kindled:'The Kindled call it a request to be noticed.',sextons:'The Sextons call it a boundary announcing strain.'},
      {id:'lantern',title:'Lantern',kinds:['path','rail','road','bridge'],times:['dusk','night'],weight:10,text:'A small light seems to move ahead at walking pace, then is gone when the route bends.',kindled:'The Kindled say a passage sometimes borrows the shape of a guide.',sextons:'The Sextons say a guide that cannot be verified should not be followed.'},
      {id:'procession',title:'Procession',kinds:['churchyard','cemetery','road'],times:['night'],weight:4,requiresAction:'petition',text:'For a few seconds the ordinary rhythm of the place suggests many footsteps moving together.',kindled:'The Kindled read company where the ledger records solitude.',sextons:'The Sextons read a pattern that should be observed from where you already stand.'},
      {id:'cold-spot',title:'Cold Spot',kinds:['water','tunnel','mine','quarry'],times:['day','dusk','night','dawn'],weight:14,text:'The air changes temperature sharply across only a few paces.',kindled:'The Kindled call the edge a seam in the passage.',sextons:'The Sextons call the edge a useful place to mark the boundary.'},
      {id:'lost-voice',title:'Lost Voice',kinds:['mine','tunnel','ruin'],times:['dusk','night'],weight:6,text:'A word or breath seems close enough to understand, but no second hearing resolves it.',kindled:'The Kindled say not every voice arrives whole.',sextons:'The Sextons say uncertainty is a reason not to answer.'},
      {id:'black-dog',title:'Black Dog',kinds:['crossroads','path','road'],times:['night'],weight:5,text:'A dark animal shape is briefly suggested at the edge of the route, then ordinary darkness replaces it.',kindled:'The Kindled treat the sighting as an escort that keeps its distance.',sextons:'The Sextons treat it as a reminder to stay on the known way.'},
      {id:'familiar-footsteps',title:'Familiar Footsteps',kinds:['rail','path','road'],times:['dusk','night'],weight:12,text:'Footsteps settle into your cadence without becoming nearer or farther away.',kindled:'The Kindled say a traveler may borrow a living rhythm for a little while.',sextons:'The Sextons say a copied rhythm is still an intrusion.'},
      {id:'knock',title:'Knock',kinds:['industrial','ruin','historic','bridge'],times:['dusk','night'],weight:11,text:'Three hard knocks come from a structure or surface with no obvious source.',kindled:'The Kindled say a threshold sometimes asks whether anyone is listening.',sextons:'The Sextons say a knock is not an invitation to enter.'},
      {id:'false-threshold',title:'False Threshold',kinds:['generic','road','path','crossroads'],times:['day','dusk','night','dawn'],weight:5,minAether:60,text:'For a moment an ordinary object carries the visual certainty of a Threshold, then the impression collapses.',kindled:'The Kindled say excess Aether can make the eye generous.',sextons:'The Sextons say excess Aether can make the eye unreliable.'},
      {id:'unmarked-grave',title:'Unmarked Ground',kinds:['boundary','cemetery','churchyard','historic'],times:['day','dawn','dusk'],weight:5,text:'The arrangement of ground and stone suggests a remembered boundary without providing evidence for what it marked.',kindled:'The Kindled say absence can still deserve witness.',sextons:'The Sextons say an unknown boundary should remain undisturbed.'},
      {id:'returning-light',title:'Returning Light',kinds:['water','bridge'],times:['dawn','dusk'],weight:7,faction:'kindled',text:'A reflection returns after the light that made it should have moved on.',kindled:'The Kindled read the delayed light as a passage taking its time.',sextons:'The Sextons would call delay another kind of persistence.'},
      {id:'walker-behind',title:'The Walker Behind',kinds:['path','road','rail'],times:['night'],weight:8,requiresAction:'sigil',text:'The sense of another walker keeps the same distance behind you until ordinary sound interrupts it.',kindled:'The Kindled say witness can travel in both directions.',sextons:'The Sextons say the safest response is to keep to the public route and do nothing else.'},
      {id:'counting',title:'Counting',kinds:['boundary','industrial','monument','generic'],times:['night','dusk'],weight:7,faction:'sextons',text:'A faint mechanical count seems to begin in the middle of a sequence and end before reaching a round number.',kindled:'The Kindled would ask who was being counted and why.',sextons:'The Sextons enter the count without completing it aloud.'}
    ],

    rites: [
      {id:'witness',order:'neutral',name:'Witness',degree:1,cost:0,summary:'Enter the generated account in your own hand after petitioning the place.',requirements:['Petition this Threshold first'],effect:'Reveals and records a lore witness. Awards a small amount of practice.'},
      {id:'watch',order:'neutral',name:'Watch',degree:1,cost:2,summary:'Stand with the current condition of the place without changing it.',requirements:['At least one active Vigil'],effect:'Records Vigil condition and the present Threshold state. May reveal an encounter omen.'},
      {id:'light',order:'kindled',name:'Light',degree:1,cost:6,summary:'Tend the lights already set and make the passage easier to perceive.',requirements:['At least one Kindled Vigil'],effect:'Restores condition to Kindled Vigils and marks the Threshold as lit for six hours.'},
      {id:'invitation',order:'kindled',name:'Invitation',degree:2,cost:9,summary:'Invite an answer without commanding one.',requirements:['Petitioned Threshold','Best Sigil score 60 or better'],effect:'For twelve hours, petitions yield more Aether and rare encounters are slightly more likely.'},
      {id:'passage',order:'kindled',name:'Passage',degree:3,cost:14,summary:'Open the worked Threshold deliberately and accept that keeping it open has a cost.',requirements:['Threshold held by the Kindled','Relic from this Threshold'],effect:'Consumes the Relic, increases petition yield for twenty four hours, and slightly increases Vigil decay.'},
      {id:'vigil',order:'kindled',name:'Vigil of the Open Door',degree:2,cost:8,summary:'Keep watch without closing what has been opened.',requirements:['At least five Kindled Vigils'],effect:'Reduces Vigil decay for twelve hours and records a sustained watch.'},
      {id:'seal',order:'sextons',name:'Seal',degree:1,cost:6,summary:'Name the edge and strengthen the lights that keep it.',requirements:['At least one Sexton Vigil'],effect:'Restores condition to Sexton Vigils and marks the Threshold as sealed for six hours.'},
      {id:'binding',order:'sextons',name:'Binding',degree:2,cost:9,summary:'Bind the measured pattern to the boundary already recorded.',requirements:['Petitioned Threshold','Best Sigil score 60 or better'],effect:'Substantially reduces Vigil decay for twelve hours.'},
      {id:'reckoning',order:'sextons',name:'Reckoning',degree:3,cost:12,summary:'Count what has happened here before deciding what should happen next.',requirements:['Threshold held by the Sextons','At least three recorded Threshold actions'],effect:'Awards practice from a careful accounting and records the current ownership history.'},
      {id:'interment',order:'sextons',name:'Interment',degree:4,cost:18,summary:'Close the working for a full day and leave the place quieter than you found it.',requirements:['Threshold held by the Sextons','At least six Sexton Vigils','One packet of cold ash'],effect:'Consumes cold ash, restores Sexton Vigils, and strongly reduces their decay for twenty four hours.'}
    ]
  };
}());
