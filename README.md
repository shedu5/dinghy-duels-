# Dinghy Duels

A solo sailing campaign for phones and desktop, with ten missions on a simplified Earth chart.

**Play:** https://shedu5.github.io/dinghy-duels-/

One self-contained `index.html`; no build step or runtime map download. Google Fonts is optional.

## Controls

Point the bottom-left thumbstick where you want to sail; release to hold course. Dragging on the sea also provides a floating thumbstick. A/D or Left/Right arrows turn the boat. Sails are automatic.

- **FIRE:** Tap or hold for both broadsides, at most once every 0.24 seconds. Space, Q or E also work. Steer and fire with separate fingers.
- **ANCHOR:** Stop and hold position; tap again to sail. Keyboard: X.

These are the two gameplay buttons. Sound is on the title screen. Gameplay blocks double-tap/pinch gestures and default touch scrolling; menus remain scrollable. Cancellation, focus loss, rotation and sinking reset held controls. Physical iOS Safari testing is still recommended because desktop viewport testing does not reproduce every mobile browser gesture.

## Ten-level voyage

| Level | Mission | Difficulty | Objective |
|---|---|---|---|
| 1 | Learn the Ropes | Easy | Untimed, enemy-free tutorial: collect treasure, return home, anchor and fire |
| 2 | Island Signals | Easy | Anchor at two island signals in order |
| 3 | Merchant Passage | Easy | Escort a merchant through two waypoints |
| 4 | Weather the Squall | Medium | Survive 35 seconds of storm strikes |
| 5 | Indian Ocean Admiral | Medium | Sink a stronger flagship with an escort |
| 6 | Three Island Code | Medium | Capture three signals in order |
| 7 | Convoy Under Fire | Hard | Escort a merchant through three waypoints |
| 8 | Eye of the Storm | Hard | Survive 50 seconds, including predicted strikes |
| 9 | Four Beacon Lock | Hard | Capture four signals under pressure |
| 10 | The Storm Admiral | Expert | Sink the armored flagship during a storm |

Level 1 has no enemies, storms or time limit, and steady wind. On-screen instructions advance through collecting treasure, banking it at HOME, dropping anchor and firing a practice broadside. You can also explore safely before completing the tutorial.

Island signals charge only while anchored inside the current numbered ring. The merchant waits if you are more than 340 world units away. Red storm circles warn for two seconds before striking. The final flagship alternates closed and open armor every four seconds.

Sinking ends a campaign mission; merchant loss also fails an escort. Retry keeps earned upgrades. Completed levels can be replayed. Progress and upgrades save in this browser's local storage, with no account or cross-device sync.

## Bonus rounds and upgrades

After each of the first nine completed levels, play a separate 60-second territory round. Claim at least 5% of navigable water to earn one permanent improvement:

- Hull: +20 maximum health.
- Cannons: +15% damage.
- Speed: +7% maximum sailing speed.

Each upgrade stacks up to nine times. Missing the target still lets you proceed. Territory painting and respawning are confined to bonus rounds; they are not campaign victory conditions.

## Earth chart and repairs

The chart uses simplified real continent outlines from [Natural Earth 1:110m land](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_land.geojson), which is [public domain](https://www.naturalearthdata.com/about/terms-of-use/). The geometry is embedded in the game. Coastlines block ships and cannonballs; route generation checks for navigable water. The chart now covers the full latitude range, without artificial polar ocean margins. Longitude wraps across the date line. Crossing a pole reflects latitude, shifts longitude by 180 degrees and reverses north/south heading; the Arctic does not connect directly to Antarctica. Terrain rendering, ship/projectile movement, distances and territory follow this topology. It remains a flat gameplay projection.

The Bering Strait, Canada–Greenland route (Davis Strait/Baffin Bay), and Northwest Passage are deliberately widened in both the visible coastlines and collision map to accommodate oversized game boats. These are navigable game channels, not a geographically exact sailing chart.

Sail through your own colored HOME dock ring for instant full repair, including upgraded hull capacity. No anchoring or slowing required. Other colors do not repair your boat. Bots use their own colored docks.

## Treasure

Each campaign mission includes six royal treasure chests in Arctic waters, plus local mission treasure (one guided chest in the tutorial). Chests have optional treasure pickups with visible gold pickup circles. A chest is collected automatically once the entire hull fits inside its circle; the boat's center need not touch the chest. Carry one at a time and return HOME to bank it in your saved voyage total. Each mission permits up to eight banked treasure. Treasure is a collectible; ship upgrades come from bonus rounds.

Sinking drops cargo for another captain to collect after a one-second delay. A gold ring on the minimap marks cargo. Square chart markers show docks. The HUD points toward the mission objective and adds a HOME direction when carrying treasure or needing repairs.

## Development and checks

Serve the directory with a static HTTP server. Run the dependency-free mechanics suite:

```sh
node tests/gameplay.cjs
```

Checks cover the enemy-free, untimed tutorial and its completion sequence, Arctic treasure placement, hull clearance along northern channels, polar/date-line crossings, cannonball hits across poles, territory across poles, all ten mission setups and simulations, Earth navigation, objective success/failure, merchant routes, storm warnings, boss armor, treasure collection/banking, instant repair, bonus reward idempotency, persisted upgrades, held fire, pointer isolation and touch-gesture guards. Browser checks cover the phone layout, title, gameplay and upgrade flow. Local QA fixtures are not deployed.
