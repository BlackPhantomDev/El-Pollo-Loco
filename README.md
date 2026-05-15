# El Pollo Loco

Ein 2D-Jump-and-Run-Spiel, das mit reinem HTML5 Canvas, CSS und JavaScript (ohne Framework) umgesetzt ist. Der Spieler steuert Pepe durch eine Wüstenlandschaft, sammelt Münzen und Salsa-Flaschen, besiegt Chickens und stellt sich am Ende dem Endboss.

## Features

- Charakter-Animationen für Walk, Jump, Hurt, Idle/Sleep und Death
- Gegner: Normale Chickens, Baby-Chickens und ein Endboss mit eigener AI (zufällige Idle/Walk-Wechsel, Hurt-State)
- Sammelbare Münzen und Salsa-Flaschen als Wurfgeschoss
- HUD mit Health-Bar, Endboss-Bar, Coin- und Bottle-Counter
- Win- und Lose-End-Screen mit zufälligen Bildern
- Sounds für Walking, Jumping, Hurt, Sleeping, Collect, Throw, Splash sowie Endboss-Alert und -Death
- Hintergrundmusik und Stummschalt-Funktion (gespeichert in `localStorage`)
- Fullscreen-Modus, Restart und Home-Button
- Responsive: Mobile/Tablet-Detection via UserAgent + Media Queries, Touch-Buttons im Querformat, Portrait-Warnung mit Animation

## Steuerung

| Taste | Aktion |
|-------|--------|
| `A` | Nach links bewegen |
| `D` | Nach rechts bewegen |
| `W` / `Space` | Springen |
| `K` | Salsa-Flasche werfen |

Auf Mobile/Tablet werden im Querformat automatisch Touch-Buttons eingeblendet.

## Lokal starten

Das Projekt benötigt keinen Build-Schritt. Einfach `index.html` mit einem statischen Webserver ausliefern:

```bash
python3 -m http.server 8000
# danach http://localhost:8000 im Browser öffnen
```

Hinweis: Direktes Öffnen über `file://` funktioniert nicht zuverlässig (Browser blockiert Audio-Autoplay und einzelne Asset-Pfade).

## Projektstruktur

```
.
├── index.html             # Einstiegspunkt, Game-Wrapper, Dialoge
├── style.css              # Layout, Responsive Rules, Mobile-Modus
├── script.js              # Orientation-Check, Mobile-Mode-Toggle, Dialog-Handler
├── js/
│   └── game.js            # Game-Init, Sound-Mute, Fullscreen, Restart, End-Screen
├── classes/               # Spielobjekte als ES6-Klassen
│   ├── world.class.js
│   ├── hud-renderer.class.js
│   ├── character.class.js
│   ├── chicken.class.js / baby-chicken.class.js / endboss.class.js
│   ├── bottle.class.js / coin.class.js
│   ├── moveable-object.class.js / drawable-object.class.js / background-object.class.js / cloud.class.js
│   ├── status-bar.class.js / keyboard.class.js / level.class.js
├── levels/
│   └── level1.js          # Level-Daten (Gegner, Items, Hintergrund)
└── assets/                # Bilder, Sounds, Schriftarten, Icons
```

## Technologien

- HTML5 Canvas
- Vanilla JavaScript (ES6 Klassen)
- CSS3 (Flexbox, Media Queries, `:has` / `~` Selektoren)
- Web Audio über `<audio>`-Elemente
- `localStorage` für Mute-State

## Credits

- Sounds: [Pixabay](https://pixabay.com/sound-effects/) (Künstler im Impressum aufgeführt)
- Musik: [Ievgen Poltavskyi auf Pixabay](https://pixabay.com/music/)
- Hintergrundbild: KI-generiert via [flatai.org](https://flatai.org/)
- Icons: [Icons8](https://icons8.com)
- Basis-Sprites/Charakter: Vorlage der Developer Akademie

## Rechtlicher Hinweis zu den Assets

Sämtliche im Spiel verwendeten Grafiken, Sprites, Hintergründe und sonstigen Assets sind Eigentum der **Developer Akademie GmbH**. Eine Weiternutzung, Vervielfältigung, Veröffentlichung oder ein Verkauf dieser Assets — ganz oder in Teilen — ist ohne ausdrückliche schriftliche Genehmigung der Developer Akademie GmbH nicht gestattet.

---

# El Pollo Loco (English)

A 2D jump-and-run game built with plain HTML5 Canvas, CSS and JavaScript (no framework). The player steers Pepe through a desert landscape, collects coins and salsa bottles, defeats chickens and eventually faces the endboss.

## Features

- Character animations for walk, jump, hurt, idle/sleep and death
- Enemies: regular chickens, baby chickens and an endboss with its own AI (random idle/walk switches, hurt state)
- Collectable coins and salsa bottles used as throwable weapons
- HUD with health bar, endboss bar, coin and bottle counters
- Win and lose end screens with randomised images
- Sounds for walking, jumping, hurt, sleeping, collecting, throwing, splash plus endboss alert and death
- Background music and mute toggle (persisted in `localStorage`)
- Fullscreen mode, restart and home buttons
- Responsive: mobile/tablet detection via user agent and media queries, touch buttons in landscape, animated portrait-rotation hint

## Controls

| Key | Action |
|-----|--------|
| `A` | Move left |
| `D` | Move right |
| `W` / `Space` | Jump |
| `K` | Throw salsa bottle |

On mobile and tablet devices touch buttons appear automatically in landscape orientation.

## Run locally

The project needs no build step. Just serve `index.html` from any static web server:

```bash
python3 -m http.server 8000
# then open http://localhost:8000 in the browser
```

Note: opening the file directly via `file://` does not work reliably — browsers block audio autoplay and some asset paths.

## Project structure

```
.
├── index.html             # Entry point, game wrapper, dialogs
├── style.css              # Layout, responsive rules, mobile mode
├── script.js              # Orientation check, mobile-mode toggle, dialog handlers
├── js/
│   └── game.js            # Game init, mute, fullscreen, restart, end screen
├── classes/               # Game objects as ES6 classes
│   ├── world.class.js
│   ├── hud-renderer.class.js
│   ├── character.class.js
│   ├── chicken.class.js / baby-chicken.class.js / endboss.class.js
│   ├── bottle.class.js / coin.class.js
│   ├── moveable-object.class.js / drawable-object.class.js / background-object.class.js / cloud.class.js
│   ├── status-bar.class.js / keyboard.class.js / level.class.js
├── levels/
│   └── level1.js          # Level data (enemies, items, background)
└── assets/                # Images, sounds, fonts, icons
```

## Tech stack

- HTML5 Canvas
- Vanilla JavaScript (ES6 classes)
- CSS3 (Flexbox, media queries, sibling combinators)
- Web audio via `<audio>` elements
- `localStorage` for the mute state

## Credits

- Sounds: [Pixabay](https://pixabay.com/sound-effects/) (individual artists listed in the imprint)
- Music: [Ievgen Poltavskyi on Pixabay](https://pixabay.com/music/)
- Background image: AI-generated via [flatai.org](https://flatai.org/)
- Icons: [Icons8](https://icons8.com)
- Base sprites / character: provided by Developer Akademie

## Legal notice on assets

All graphics, sprites, backgrounds and other assets used in this game are property of **Developer Akademie GmbH**. Any further use, reproduction, publication or sale of these assets — in whole or in part — without the express written permission of Developer Akademie GmbH is prohibited.
