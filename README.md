# LYCHGATE v5.3.0

LYCHGATE is a local-first supernatural territory game and field practice. It runs without a required server, account, tile service, CDN, analytics endpoint, or build system.

v5.3.0 is a deep interface cleanup release. It does not add another game subsystem. It consolidates the visual language, navigation, control hierarchy, mobile behavior, accessibility, and field readability across the complete v5.2 feature set. Scenario Authoring remains the most recent gameplay system, introduced in v5.2.0.

Batch 20, the planned Meshtastic-specific relay, remains intentionally deferred. The generic optional peer relay from v4.0.0 remains available.


## v5.3 interface system

The v5.3 cleanup establishes one consistent interface grammar across every station:

- navigation is grouped into Field Work, Authoring, and System
- numbered station markers replace ambiguous decorative glyphs
- display typography is separated from UI and technical typography
- primary actions use a restrained brass treatment while secondary actions stay quiet
- working surfaces, registers, status chips, empty states, and destructive actions now have distinct visual roles
- dense lists use ruled registers instead of repeated boxed cards where possible
- Field gives the map visual priority and keeps position controls sticky on larger screens
- mobile uses a compact top bar and a real slide-out station drawer
- selecting a station returns the workspace to its top and moves focus to the main work area
- Escape exits Walk Mode first, then closes the mobile station drawer
- all interactive controls retain at least 44 px touch targets
- visible focus outlines and the High Contrast theme remain first-class
- reduced-motion behavior remains honored

The redesign uses only local CSS and system fonts. It adds no CDN, font download, telemetry, or network dependency.

## Core rule

The game is designed to remain playable with the radio off. Location data stays on the device unless the player explicitly chooses to place location-bearing information into an artifact or Region Package and export it.

## Install and run

1. Unzip the project.
2. Open `index.html` directly in a browser.
3. Accept the safety code on first open.
4. Choose a faction when ready.
5. Use Manual Fix if live geolocation is unavailable under `file://`.

There is no npm install, build command, local server, or bundler.

The application uses classic scripts in an explicit load order so core play does not depend on ES module loading from `file://`.

## Script load order

1. `data/names.js`
2. `data/lore.js`
3. `data/sigils.js`
4. `data/sample-region.js`
5. `js/utils.js`
6. `js/storage.js`
7. `js/region.js`
8. `js/world.js`
9. `js/positions.js`
10. `js/audio.js`
11. `js/game.js`
12. `vendor/qrcode.js`
13. `js/identity.js`
14. `js/artifacts.js`
15. `js/expeditions.js`
16. `js/scenarios.js`
17. `js/relay.js`
18. `js/ui.js`
19. `js/tests.js`
20. `js/app.js`

The manifest and service worker are optional PWA extras. They are never load-bearing.

## Stations

### Field

The live field view, local vector survey, Dowsing View, position controls, nearby Thresholds, encounters, safety gate, Home bearing, and walking loop.

### Threshold

Work the currently selected Threshold. Petition, place Vigils, trace Sigils, perform faction actions and Rites, inspect generated field tradition, attach local notes and photographs, draw Ley lines, and inspect territorial relationships.

### Satchel

Relics, materials, attunement, transfer preparation, condition, resonance, and provenance.

### Ledger

Ground control, persistent Shrouds, Ley lines, collapse records, encounter register, and Field Journal.

### Rites

Degrees of Sight, faction progression, Sigil practice, Rite requirements, effects, and worked-Rite history.

### Expeditions

Plan a field excursion, record its lifecycle, track checkpoints and actual fixes, complete or abandon the walk, and replay the sealed local field record.

### Surveyor

Author and curate a portable local world.

Surveyor can:

- edit feature classifications and names
- add point features at the current fix
- add local safety exclusions around the current fix
- suppress inappropriate deterministic Thresholds
- add authored Threshold anchors
- record public-access, hazard, historic, parking, trailhead, quiet-area, and observation notes
- capture a selected Expedition as a suggested regional walk
- manage Region Package metadata and provenance
- attach small local PNG, JPEG, or WebP regional plates with attribution and source-license notes
- edit regional vocabulary in the Lore Cabinet
- import and export `.lychgate-region` packages

### Scenarios

Author and play finite local field narratives. Scenario Authoring supports prerequisites, geographic bounds, time windows, ordered and branching objectives, Threshold and action requirements, Rites, Relics, Sigils, custom scenario Sigils, fictional encounters, alternate endings, standalone `.lychgate-scenario` files, and completion records. Scenario definitions are also included in Region Package exports. Personal scenario runs and completion history are not included in Region Packages.

### Cabinet

Complete-save import/export, survey import, Passage Stone exchange, cryptographic identity, Registry, QR exchange, optional peer relay, World Salt, and Archive.

### About

Version, privacy statement, safety code, license, asset notes, and Self-Test.

## Region Packages

The portable Region Package schema is:

`LYCHGATE_REGION_1`

The normal file extension is:

`.lychgate-region`

A package may contain:

- region metadata
- package version and package ID
- source and license notes
- local GeoJSON/OSM/GPX-derived normalized geometry
- safety exclusion geometry
- feature classifications
- authored Threshold anchors
- suppressed deterministic Threshold IDs
- local access, hazard, and historic annotations
- suggested walks copied from local Expedition plans
- regional vocabulary and lore tables
- up to eight small regional illustration plates
- a World Salt recommendation
- provenance metadata
- authored `LYCHGATE_SCENARIO_1` definitions, without personal run or completion history

### World Salt behavior

Importing a Region Package never silently changes the active World Salt.

A package can carry a recommendation so two players can intentionally choose the same deterministic world, but applying that salt remains an explicit action in Cabinet.

### Import behavior

Before a Region Package replaces the active regional authoring state, LYCHGATE stores the prior geometry and region state in Archive.

Imported data is size-capped, normalized, sanitized, and rendered as text. Region illustration data accepts PNG, JPEG, and WebP data URLs only. SVG is not accepted as a Region Package illustration.

## Surveyor provenance

Surveyor does not erase where information came from.

Examples include:

- `bundled sample`
- `user import`
- `surveyor`
- `surveyor anchor`
- `Region package`
- original package metadata

Editing a feature appends an edit note to its local provenance record.

Archiving a feature or illustration uses LYCHGATE's normal soft-delete model.

## Lore Cabinet

The Lore Cabinet is regional vocabulary, not a database of historical claims.

One entry is entered per line. If a regional table is non-empty, it replaces the matching bundled vocabulary for the active region. Empty regional tables fall back to the bundled LYCHGATE vocabulary.

Editable tables include:

- place-name first words
- place-name suffixes
- surnames
- given names
- occupations
- record and ledger terms
- Threshold epithets
- phenomena
- warnings
- Kindled readings
- Sexton readings
- contradictions and marginal notes
- local industries
- waterway terms
- landform terms
- church and parish terms
- mining terms
- railway terms
- local plants
- weather language
- historic building terms
- folklore motifs

Regional vocabulary is consumed by the deterministic world and lore generators. The same Region Package, World Salt, coordinates, and game state derive the same underlying generated material.

Generated field tradition remains explicitly labeled fiction and must not be treated as evidence about real local history.

## Scenario Authoring

Scenario definitions use the schema:

`LYCHGATE_SCENARIO_1`

The normal standalone extension is:

`.lychgate-scenario`

A Scenario contains metadata, optional geographic bounds, prerequisites, a first node, and a bounded graph of objective nodes. Supported node types are:

- clue
- location
- Threshold
- generic LYCHGATE action
- Rite
- Sigil
- Relic
- choice
- fictional encounter
- ending

Scenario prerequisites can require a minimum Degree, a specific order, a carried Relic, an opening time, a closing time, and a starting position inside a geographic radius.

Objective nodes can require coordinates and a radius, a Threshold ID, an action type such as `petition` or `link`, a Rite ID, a Relic origin, a minimum Sigil score, and a local clock-time window. Choice nodes can branch to alternate destinations. Ending nodes seal a `LYCHGATE_SCENARIO_COMPLETION_1` record with the ending code and visited path.

### Custom scenario Sigils

A Sigil objective may include a scenario-specific mark using the same normalized stroke format as the standard tracing instrument. Custom marks are shown through the existing memory-tracing dialog and scored by the same shape, stroke-order, and direction engine. Scenario-only Sigil attempts do not grant normal field Aether.

### Runtime integration

The Scenario runtime listens to the same local position and action streams used by the rest of LYCHGATE. A location objective advances from position fixes, while action, Rite, Threshold, and Sigil objectives advance from real game actions. The runtime does not create a parallel set of fake gameplay buttons. Location advancement remains subject to LYCHGATE's normal movement speed gate and exclusion geometry.

### Region Package behavior

Region Packages carry Scenario definitions so a regional author can distribute a complete offline walking experience. The package does not carry the author's active Scenario run, visited-node history, or completion register. Importing a Region Package merges valid packaged Scenario definitions into the local Scenario cabinet and archives replaced definitions with the same ID.

## Suggested walks

Surveyor can capture the currently selected Expedition as a suggested walk in a Region Package.

The copied record includes route geometry, purpose, estimated duration, and safety notes. It does not include private Expedition replay events, player actions, encounters, or the actual recorded track.

## Regional illustrations

Region Packages can contain up to eight local illustration plates.

Accepted formats:

- PNG
- JPEG
- WebP

The authoring UI caps each source image at 650 KB. Package validation also applies an encoded-data budget. Attribution and source-license notes travel with the plate.

Illustrations are local package assets. LYCHGATE does not upload them.

## Position sources

LYCHGATE still supports three interchangeable position sources:

- Live fix with `navigator.geolocation.watchPosition` when browser policy permits it
- Manual fix by coordinates, map placement, or Maidenhead locator
- GPX or GeoJSON Track Playback with an explicit simulated-position state

The movement speed gate, jitter handling, safety exclusions, and simulated-position label remain independent of source.

## Safety code

- Stay on public, legal, safely accessible ground.
- Never enter active rail rights of way, highways, private property, posted land, closed areas, or unsafe terrain for the game.
- Do not interact while moving faster than the game permits.
- Treat cemeteries and places of worship as places deserving quiet and respect.
- Stop play when weather, traffic, visibility, fatigue, or local conditions make continuing unwise.
- An authored public-access note is a field note, not legal authority or navigation advice.
- A Region Package never outranks a sign, fence, law, landowner, closure, or common sense.

## Privacy

Location data never leaves the device unless the player explicitly exports or transmits location-bearing material.

LYCHGATE has no required:

- account
- game server
- analytics
- tracking pixel
- map tile service
- remote font
- CDN
- cloud save

Cryptographic identity keys, Registry trust, Expedition tracks, replay records, Scenario run history and completions, Surveyor annotations, regional plates, Lore Cabinet data, and relay logs remain local unless explicitly exported.

## Save compatibility

The complete-save envelope remains:

`LYCHGATE_SAVE_1`

v5.1.x and earlier compatible saves migrate forward with a Scenario store containing definitions, order, active-run state, and completion records. Older regional state, Expeditions, identity, territory, and artifacts remain intact.

A Fresh Start is not required.

## Peer relay

v4.0.0 peer relay remains available through:

- BroadcastChannel
- manual-signaling WebRTC
- user-supplied WebSocket companion
- generic Web Serial text bridge

Peer relay transports Passage Stone text only. It never auto-commits received artifacts.

There is no Meshtastic-specific protocol in v5.3.0. Batch 20 remains deferred.

## Self-Test release gate

v5.3.0 retains all 55 built-in release assertions because the cleanup does not change game rules or data formats.

The in-memory Chromium DOM harness passes 50/55. The five unavailable assertions are the expected secure-context WebCrypto identity cases. The identity and artifact cryptographic implementation is unchanged from v5.2.0 except for the release marker. A separate Node WebCrypto smoke pass for v5.3.0 verifies key generation, ECDSA sign/verify, tamper rejection, and encrypted identity backup restore.

The release also ran a dedicated visual and structural pass across Field, Threshold, Satchel, Ledger, Rites, Expeditions, Surveyor, Scenarios, Cabinet, and About at desktop size, plus a 390 px mobile pass.

## Security and UI review for v5.3.0

The release pass checked:

- no application `eval`
- no executable `new Function`
- no application `innerHTML` assignment
- no missing local script or stylesheet references
- no missing JavaScript-referenced interface IDs
- 429 unique HTML IDs
- no duplicate HTML IDs
- all JavaScript files parse successfully
- no new network dependency or external font
- no prohibited em dash characters in project prose or code outside verbatim license material
- 390 px and 1440 px visual smoke passes have no horizontal overflow
- Chromium visual smoke passes report no page errors or console warnings
- interactive control rules retain at least 44 px minimum touch targets
- secondary technical text was raised to AA-oriented contrast values
- High Contrast and Reduced Motion behavior remain active
- station navigation remains keyboard operable and gains explicit open/close accessibility labels
- mobile Escape behavior closes the station drawer when Walk Mode is inactive

## Known limitations

- Direct `file://` geolocation, camera scanning, WebCrypto, Web Serial, WebRTC, and other browser APIs vary by browser and platform policy.
- The automated Chromium environment used for this release blocks local and synthetic secure-origin navigation. Visual and DOM checks therefore run in an in-memory browser context. Secure-context cryptography is checked separately with Node WebCrypto, and real browser policy still requires device testing.
- Surveyor access annotations are notes, not authoritative access or property records.
- Surveyor exclusions are only as accurate as the person who authored them.
- Region Package geometry is not turn-by-turn navigation data.
- Imported OSM or other third-party data may have licenses that differ from LYCHGATE's application license. Record source-license obligations in Region Package source/license notes.
- Region Package illustrations consume browser storage and should remain small.
- Scenario authors are responsible for keeping routes legal, public, and safe. Geographic objectives are not access permission or navigation authority.
- Scenario time windows use the device local clock and are not tamper-resistant.
- Custom Sigil authoring currently accepts normalized stroke JSON rather than a dedicated drawing editor.
- Direct WebRTC still needs real-device field testing across restrictive NAT and firewall environments.
- Offline artifact exchange cannot establish global uniqueness or scarcity against restoration of old saves.

## Optional PWA

`manifest.webmanifest` and `sw.js` provide an additive PWA layer when the project is served from an origin that permits service workers.

The cache is version stamped `lychgate-v5.3.0`.

Core play does not use the service worker when `index.html` is opened directly from disk.

## License

GPL-3.0
