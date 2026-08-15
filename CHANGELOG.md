# LYCHGATE Changelog

## v5.3.0

Deep UI and UX cleanup release. No new gameplay subsystem. Batch 20 remains deferred.

### Design system

- Rebuilt the interface styling around a unified bone, iron, brass, ember, and cold-blue field palette.
- Split typography into display, interface, and technical roles using only local system fonts.
- Reworked cards, registers, fields, status chips, buttons, dialogs, toasts, and empty states into a consistent hierarchy.
- Reduced box-on-box visual noise in Threshold registers and other dense lists.
- Added restrained corner survey marks and ruled field-paper texture without image assets.
- Preserved the engraved parish-survey character while making controls read as modern instrument controls.

### Navigation and workflow

- Grouped stations into Field Work, Authoring, and System sections.
- Replaced ambiguous station glyphs with stable station numbers 01 through 10.
- Added station hover titles for collapsed navigation.
- Station changes now return the workspace to the top and focus the main work area.
- Escape exits Walk Mode first and closes the mobile station drawer when Walk Mode is inactive.
- Menu button accessibility text now reflects Open stations or Close stations.

### Field and mobile refinement

- Increased map visual priority and simplified its surrounding chrome.
- Made position controls sticky on wide screens and naturally stacked on smaller screens.
- Converted nearby Thresholds to a quieter ruled field register.
- Reworked the mobile header into a single compact row and retained the default collapsed drawer behavior.
- Added a dimmed content treatment behind the open mobile navigation drawer.
- Confirmed 390 px layouts remain free of horizontal overflow in the visual smoke pass.

### Accessibility

- Preserved keyboard operation, semantic controls, visible focus outlines, Reduced Motion, and High Contrast.
- Restored a minimum 44 px target size across interactive controls after the visual compaction pass.
- Raised secondary text contrast used by technical labels and microcopy.

### Compatibility

- No save-schema change.
- Existing `LYCHGATE_SAVE_1` data continues to load without migration loss.
- No gameplay, world-generation, identity, artifact, Region Package, Expedition, or Scenario formats changed.
- No new external dependency was added.

## v5.2.0

Batch 24: Scenario Authoring. Batch 20 remains deferred.

### Scenario definition and authoring

- Added `LYCHGATE_SCENARIO_1` standalone Scenario schema.
- Added `.lychgate-scenario` import and export.
- Added Scenarios as a primary station with Play and Author views.
- Added metadata, summary, starting clue, author, prerequisites, geographic bounds, and fiction notice.
- Added objective graph editor with stable node IDs and graph validation.
- Added clue, location, Threshold, action, Rite, Sigil, Relic, choice, fictional encounter, and ending node types.
- Added ordered and branching transitions plus alternate ending codes.
- Added optional local time windows per objective.
- Added Degree, order, required-Relic, absolute opening/closing time, and geographic start prerequisites.
- Added current-fix and selected-Threshold helpers for authoring geographic objectives.
- Added optional custom normalized Sigil stroke data for scenario-specific memory tracing.
- Added soft archive for Scenario definitions and nodes.

### Scenario runtime

- Added local active-run state and completion register.
- Scenario location objectives advance from the normal position stream and respect the Field safety gate.
- Action, Threshold, Rite, and ordinary Sigil objectives advance from real LYCHGATE action records.
- Custom Scenario Sigils use the existing tracing/scoring instrument without granting normal field Aether.
- Choice nodes record the selected branch.
- Ending nodes seal `LYCHGATE_SCENARIO_COMPLETION_1` records with ending code and visited path.
- Abandoned runs are preserved locally.

### Region Package integration

- Region Packages now carry authored Scenario definitions.
- Active Scenario runs and completion records are excluded from Region Package exports.
- Valid Scenario definitions from a Region Package merge into the local Scenario cabinet.
- Replaced definitions with the same ID are soft archived.

### Compatibility and validation

- Retained the `LYCHGATE_SAVE_1` complete-save envelope.
- Added Scenario state migration for older saves.
- Added seven Scenario release assertions, bringing the suite to 55.
- All 55 assertions pass in a WebCrypto-capable source harness.
- Chromium in-memory DOM validation passes 50/55, with only the five expected secure-context WebCrypto tests unavailable there.
- Batch 20 Meshtastic-specific functionality remains absent.

## v5.1.0

Batches 21 through 23. Batch 20 remains deferred.

### Batch 21: Region Packages

- Added `LYCHGATE_REGION_1` portable region schema.
- Added `.lychgate-region` import and export.
- Added package metadata, package ID, version, provenance, source/license notes, and World Salt recommendation.
- Added normalized geometry, exclusions, authored Threshold anchors, deterministic Threshold suppressions, annotations, suggested walks, Lore Cabinet vocabulary, and regional plates to package contents.
- Region Package import archives the prior regional state before replacement.
- Region Package import never silently changes the active World Salt.
- Added PNG, JPEG, and WebP regional plates with attribution, license notes, and strict image budgets.
- Added schema caps for features, geometry points, annotations, walks, anchors, lore terms, and illustrations.

### Batch 22: Surveyor

- Added Surveyor as a primary station.
- Added feature inspector and reclassification tools.
- Added feature provenance display.
- Added current-fix point authoring.
- Added current-fix safety exclusion authoring.
- Added deterministic Threshold suppression and restoration.
- Added custom Threshold anchors that enter the normal nearby-Threshold engine.
- Added regional access, hazard, historic, parking, trailhead, quiet-area, and observation annotations.
- Added suggested-walk capture from a selected Expedition.
- Suggested walks omit private Expedition replay data and actual event timelines.
- Added soft archive behavior for edited-out geometry and regional illustrations.

### Batch 23: Lore Cabinet

- Added regional place-name first-word and suffix tables.
- Added regional witness names, occupations, registers, epithets, phenomena, warnings, faction readings, and contradiction tables.
- Added local industry, waterway, landform, church, mining, railway, plant, weather, historic-building, and folklore vocabulary.
- Deterministic Threshold naming now consumes active regional name tables.
- Deterministic field tradition now consumes active regional lore tables.
- Extra regional vocabulary can color generated record references.
- Empty regional tables fall back to bundled LYCHGATE vocabulary.
- Added deterministic Lore Cabinet preview.
- Generated lore remains explicitly marked as fiction, not historical evidence.

### Compatibility

- Retained the `LYCHGATE_SAVE_1` complete-save envelope.
- Added forward migration for `world.region` state.
- Existing v4.x geometry, Expeditions, cryptographic identity, Passage Stones, territory, and Registry data remain intact.
- Batch 20 Meshtastic-specific functionality is not present.

### Release validation

- 48 total release assertions.
- 43 non-WebCrypto assertions passed in Chromium's in-memory DOM harness.
- The five WebCrypto-only assertions passed separately in a WebCrypto-capable runtime.
- 362 unique HTML IDs.
- No missing local resources.
- No missing JavaScript-referenced interface IDs.
- No application `eval`.
- No executable `new Function`.
- No application `innerHTML` assignment.
- 390 px Surveyor layout has no horizontal overflow.
