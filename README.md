# Handy Remote Pro

Mobile Webapp für Handy REST API v3.

## Funktionen
- Verbindungstest
- HAMP Start/Stop
- großer globaler STOP-Button
- Geschwindigkeit + Schnellpresets
- HAMP-Hubbereich
- HDSP-Bewegungsmuster: Smooth, Pulse, Wave, Random
- Auto-Modus mit automatischem Muster-/Intensitätswechsel
- 2D-Joystick: Y = Zielposition, X = Fahrzeit/Tempo
- Live-Positionsanzeige über `slider/state`
- PWA/Zum-Home-Bildschirm geeignet
- lokale Speicherung der Zugangsdaten optional
- Diagnose-Log

## API v3 Zugangsdaten
Benötigt werden:
1. Application ID -> `X-Api-Key`
2. Handy Connection Key -> `X-Connection-Key`

Die Application Key und der Account Access Token werden nicht benötigt.

## Verwendete Endpunkte
- `GET /connected`
- `GET /slider/state`
- `PUT /mode2`
- `PUT /hamp/start`
- `PUT /hamp/stop`
- `PUT /hamp/velocity`
- `PUT /hamp/stroke`
- `PUT /hdsp/xpt`

## Hosting
Die Webapp sollte über HTTPS geöffnet werden, z. B. GitHub Pages.

### GitHub Pages
1. Settings -> Pages
2. Deploy from a branch
3. Branch `main`
4. Ordner `/(root)`
5. Save

## Joystick
- vertikal: Zielposition 0-100 %
- horizontal: langsam bis schnell
- Requests sind gedrosselt, um die API nicht unnötig zu belasten.

## STOP
Der STOP-Button beendet lokale Muster/Auto-Steuerung, wechselt zurück in HAMP und sendet anschließend `hamp/stop`.