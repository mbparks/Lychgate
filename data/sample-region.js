/* LYCHGATE :: sample-region.js :: v5.3.0
   Asset provenance: hand-authored schematic sample geometry centered near Cumberland, Maryland.
   It is illustrative local vector geometry, not authoritative street, parcel, access, or safety data.
   License: GPL-3.0.
*/
window.LYCHGATE_SAMPLE_REGION = {
  name: 'North Branch Sample Survey',
  provenance: 'Hand-authored schematic sample for offline first-open play. Not navigation data.',
  center: [39.6515, -78.7625],
  features: [
    {type:'line', kind:'road', name:'Ridge Road', points:[[39.6475,-78.7740],[39.6500,-78.7685],[39.6527,-78.7620],[39.6552,-78.7560],[39.6570,-78.7510]]},
    {type:'line', kind:'road', name:'Mill Street', points:[[39.6457,-78.7595],[39.6491,-78.7608],[39.6527,-78.7620],[39.6560,-78.7640],[39.6591,-78.7662]]},
    {type:'line', kind:'water', name:'North Branch', points:[[39.6440,-78.7725],[39.6471,-78.7697],[39.6502,-78.7675],[39.6522,-78.7645],[39.6540,-78.7608],[39.6564,-78.7580],[39.6595,-78.7540]]},
    {type:'line', kind:'rail', name:'Old Grade', points:[[39.6461,-78.7770],[39.6485,-78.7708],[39.6508,-78.7648],[39.6531,-78.7585],[39.6554,-78.7522]]},
    {type:'point', kind:'bridge', name:'Sample Iron Bridge', point:[39.6503,-78.7670]},
    {type:'point', kind:'crossroads', name:'Four Ways', point:[39.6527,-78.7620]},
    {type:'point', kind:'monument', name:'Survey Stone', point:[39.6551,-78.7562]},
    {type:'point', kind:'churchyard', name:'Quiet Ground', point:[39.6570,-78.7660]},
    {type:'polygon', kind:'exclusion_private', name:'Posted Sample Parcel', points:[[39.6530,-78.7722],[39.6555,-78.7714],[39.6552,-78.7680],[39.6528,-78.7688],[39.6530,-78.7722]]},
    {type:'polygon', kind:'exclusion_highway', name:'Fast Road Exclusion', points:[[39.6445,-78.7770],[39.6454,-78.7758],[39.6587,-78.7750],[39.6591,-78.7765],[39.6445,-78.7770]]}
  ]
};
