# Decision Labs Edge ist da

> Language: de

- HTML: https://decision-labs.com/de/blog/announcing-decision-labs-edge
- LLM: https://decision-labs.com/llm/de/blog/announcing-decision-labs-edge.md

Wir starten [Decision Labs Edge](https://edge.decision-labs.com/): Gewichte und Werkzeuge für KI auf dem Gerät, für Hardware ohne stabile Cloud-Verbindung.

Geräte im Feld, etwa Kamerafallen, Bojen, Drohnen und Sensorknoten, arbeiten oft mit lückenhafter Verbindung, knappem Strom und engen Latenzgrenzen. Ein Umweg über die Cloud scheitert, wenn das Netz abbricht. Inferenz auf dem Gerät ist der Weg, wie diese Systeme Telemetrie und Sensordaten dort auswerten, wo sie anfallen.

## Was es ist

Decision Labs Edge wandelt [LiteRT](https://ai.google.dev/edge/litert)-Checkpoints (`.tflite`) für Zeitreihenprognosen in ein auslieferbares Format um. Modelle zur Wahrnehmung von Geodaten sind geplant. Ein Artefakt soll auf CPU, GPU und NPU laufen, auf Android, iOS, Linux im Feld, im Web und auf eingebetteten Systemen, ohne für jede Plattform eine eigene Pipeline zu bauen.

Im [Modellkatalog](https://edge.decision-labs.com/) verfügbar:

- **Toto-2**, Edge-Checkpoints (ab 4M, auch größere Feldgrößen)
- **Chronos-2** (120M)
- **TimesFM 2.5** (200M)

Gewichte für Erkennung und Segmentierung (Gebäude, Fahrzeuge, Schiffe, Solaranlagen, Landbedeckung und verwandte Klassen) folgen als Nächstes.

## Für wen

Teams, die lokal entscheiden müssen: Telemetrie von Anlagen, Umweltmessnetze und bald auch Luftbilder. Dazu gehören vorausschauende Wartung, Luft- und Wassermessung und Wahrnehmung im Feld, wo jede Wattstunde und jede Sekunde Latenz zählt.

## Einstieg

Modelle und Anwendungsfälle stehen auf [edge.decision-labs.com](https://edge.decision-labs.com/). Wenn Sie Hilfe bei der LiteRT-Integration oder der Ausbringung im Feld brauchen, verlinkt die Edge-Seite auch ein einstündiges Gespräch mit uns.

Fragen: [Schreiben Sie uns](/de/kontakt).
