# Dinghy Duels

An age-of-sail territory battle for phones and desktop. Paint the sea, bring home treasure, and brave the kraken.

**Play:** https://shedu5.github.io/dinghy-duels-/

One self-contained `index.html`, with no build step. Google Fonts is optional; system fonts work offline. Four bot captains compete using the same sailing, combat, treasure, and repair rules.

## Controls

Drag horizontally on the water to steer, or use A/D or the arrow keys. W/S or ▲/▼ change sails. Q/E or Port/Starboard fire broadsides; Space chooses a side with a target. Cannons fire sideways, and slower sailing improves accuracy.

## Treasure and scoring

A match lasts 2 minutes 30 seconds. Each 1% of sea controlled is worth 1 point. Collect a chest by sailing over it, then return to your own colored HOME dock to bank 2 bonus points. Royal treasure is worth 4. Each captain can bank at most 8 treasure points, so controlling territory still matters. Results show sea points and banked gold separately.

Carry one chest at a time. Cargo is visible on the minimap with a gold ring; sinking drops it for any captain to steal after a one-second delay. Unbanked cargo is worth no points at the bell. The HUD points toward treasure, HOME when carrying cargo, or a repair dock when damaged. Square chart markers are docks; H is home; gold dots are chests.

## Hull and repairs

Your hull meter is always visible. Hits flash the hull, show damage numbers, and leave visible scars as health falls. Sinking a rival still paints nearby sea in your color. Respawn takes 4.5 seconds, followed by 2.5 seconds of protection.

Any dock repairs you at 12 hull per second when all sails are lowered and speed falls below 35. Taking damage pauses repairs for two seconds. There is no passive repair at sea. Delivering treasure does not require stopping.

## Kraken waters

One encounter begins 35 seconds into the match at the chart center, with royal treasure. The red ring warns before any damage. After the opening warning, strikes occur every five seconds, with a 2.5-second warning before each strike. Each strike deals 22 hull damage to exposed ships inside the ring.

Sail outside the ring or destroy a tentacle with three cannonball hits to open a green safe gap. The kraken retreats after 30 seconds or when all five tentacles are destroyed. Unclaimed royal treasure remains. Bots avoid danger, fire at tentacles, deliver cargo, and seek repairs.

## Development and checks

Serve this directory with any static HTTP server, or open `index.html` directly. Run the dependency-free mechanics smoke checks with:

```sh
node tests/gameplay.cjs
```

The checks run game logic with a mock DOM/canvas. They cover treasure pickup/delivery and the score cap, sinking and cargo loss, repair cooldowns, kraken warning/strike timing and safe gaps, a full simulated match, and restart. Browser checks are still needed for rendering, input, and sound.

## Deployment

GitHub Pages publishes `main` from the repository root. Pushes trigger deployment automatically.
