# Dinghy Duels

An age-of-sail territory battle for phones and desktop. Paint the sea, bring home treasure, and brave the kraken.

**Play:** https://shedu5.github.io/dinghy-duels-/

One self-contained `index.html`, with no build step. Google Fonts is optional; system fonts work offline. Four bot captains compete using the same sailing, combat, treasure, and repair rules.

## Controls

Drag the bottom-left thumbstick toward the direction you want to sail; release to hold course. Dragging on the water also provides a floating thumbstick. A/D and Left/Right arrows turn the boat.

There are exactly two gameplay buttons:

- **FIRE:** Each tap immediately fires both broadsides, with no player reload delay. Space, Q, or E also fire both sides. You can fire with one thumb while steering with the other.
- **ANCHOR:** Tap to stop and hold position; tap again to sail. Keyboard shortcut: X. Its green pressed state means the anchor is down.

Sails are automatic. Sound can be toggled on the title screen. Touch cancellation, screen rotation, sinking, and focus loss clear steering input.

## Endless ocean

The map wraps horizontally and vertically. Sail off the right edge to enter from the left, or off the top to enter from the bottom (and vice versa). Speed, heading, hull, cargo and anchor state are preserved. The camera follows smoothly, scenery and territory continue across the seam, and cannon fire and navigation take the shortest route across the map. The minimap still shows your position on the full chart.

## Treasure and scoring

A match lasts 2 minutes 30 seconds. Each 1% of sea controlled is worth 1 point. Collect a chest by sailing over it, then return to your own colored HOME dock to bank 2 bonus points. Royal treasure is worth 4. Each captain can bank at most 8 treasure points, so controlling territory still matters. Results show sea points and banked gold separately.

Carry one chest at a time. Cargo is visible on the minimap with a gold ring; sinking drops it for any captain to steal after a one-second delay. Unbanked cargo is worth no points at the bell. The HUD points toward treasure, HOME when carrying cargo, or a repair dock when damaged. Square chart markers are docks; H is home; gold dots are chests.

## Hull and repairs

Sail through your own colored HOME dock ring to instantly restore full hull health. No anchor, slowing down, sail adjustment, or damage cooldown is required. Other captains' docks do not repair you. A green flash and HULL RESTORED message confirm the repair; the navigation hint points toward your own dock when damaged. Bots also repair at their own docks.

Hits flash the hull, show damage numbers, and leave visible scars as health falls. Sinking a rival paints nearby sea in your color. Respawn takes 4.5 seconds, followed by 2.5 seconds of protection.

## Kraken waters

One encounter begins 35 seconds into the match at the chart center, with royal treasure. The red ring warns before any damage. After the opening warning, strikes occur every five seconds, with a 2.5-second warning before each strike. Each strike deals 22 hull damage to exposed ships inside the ring.

Sail outside the ring or destroy a tentacle with three cannonball hits to open a green safe gap. The kraken retreats after 30 seconds or when all five tentacles are destroyed. Unclaimed royal treasure remains. Bots avoid danger, fire at tentacles, deliver cargo, and seek repairs.

## Development and checks

Serve this directory with any static HTTP server, or open `index.html` directly. Run the dependency-free mechanics smoke checks with:

```sh
node tests/gameplay.cjs
```

The checks run game logic with a mock DOM/canvas. They cover treasure pickup/delivery and the score cap, sinking and cargo loss, instant own-color repairs, immediate repeat firing, anchor braking/holding/release and respawn reset, kraken warning/strike timing and safe gaps, thumbstick direction and release, low-speed turn response, independent second-finger firing, cancellation and focus loss, all four map edges and corners, cross-edge cannon hits and territory, camera continuity, a full simulated match, and restart. Browser checks are still needed for rendering, input, and sound.

## Deployment

GitHub Pages publishes `main` from the repository root. Pushes trigger deployment automatically.
