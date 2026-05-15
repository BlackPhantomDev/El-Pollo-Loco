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
