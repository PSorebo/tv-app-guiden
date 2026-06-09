# TV App Guiden

En statisk, søkbar nettkatalog over TV- og strømmeapper. Løsningen er laget for gratis publisering på GitHub Pages.

## Innhold

- `index.html` – hovedsiden
- `styles.css` – TV-inspirert responsivt design
- `app.js` – søk, filtrering, sortering, favoritter og detaljvisning
- `data.json` – alle appoppføringene
- `assets/logo.svg` – logo
- `.nojekyll` – gjør GitHub Pages-oppsettet enklere

## Test lokalt

På grunn av nettleserens sikkerhetsregler bør siden åpnes gjennom en enkel lokal webserver, ikke ved å dobbeltklikke på `index.html`.

### Med Python

Åpne terminalen i denne mappen og kjør:

```bash
python -m http.server 8000
```

Åpne deretter:

```text
http://localhost:8000
```

## Publiser på GitHub Pages

1. Opprett et offentlig GitHub-repository, for eksempel `tv-app-guiden`.
2. Last opp **innholdet i denne mappen** til repositoryets rot.
3. Åpne `Settings` → `Pages`.
4. Under `Build and deployment`, velg `Deploy from a branch`.
5. Velg branch `main` og mappe `/ (root)`.
6. Trykk `Save`.

Siden blir tilgjengelig på:

```text
https://DITT-BRUKERNAVN.github.io/tv-app-guiden/
```

## Oppdater data

Rediger `data.json`, eller eksporter nye data fra regnearket og erstatt filen. Behold de samme feltnavnene for at filtrene skal fungere.

## Personvern og kostnader

- Ingen konto kreves for besøkende.
- Favoritter lagres bare lokalt i brukerens nettleser.
- GitHub Pages er gratis for offentlige repositories.
- Ingen brukerdata sendes til en server av denne nettsiden.


## Logoer

Denne versjonen støtter lokale app-logoer. Legg PNG-filene i `assets/logos/`.
Se `LOGOER.md` for riktig filnavn. Dersom en logo ikke finnes, vises et bokstavikon automatisk.
