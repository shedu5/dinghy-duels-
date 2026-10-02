# Dinghy Duels

An age-of-sail territory battle for phones. Paint the sea with your wake, fire broadsides, rule the wind.

- One self-contained file: `index.html`. No build step, no dependencies beyond Google Fonts (falls back to system fonts if blocked).
- Runs entirely in the browser. Works on phones (portrait or landscape) and desktop.
- Wind physics (polar speed curve, in-irons stall, shifting wind), broadside combat with speed-dependent accuracy, wake-painted territory, four bot captains, synthesized audio.

## Play

Open `index.html` in a browser, or serve the folder with any static host.

Controls: drag anywhere on the water to steer; ▲/▼ set sails; Port / Starboard fire the broadsides. Keyboard: A/D steer, W/S sails, Q/E fire, Space fires the side with a target.

## Deploy with GitHub Pages

Push to `main`, then in the repo Settings → Pages set the source to deploy from the `main` branch, root folder. The game is served at the repo's Pages URL.
