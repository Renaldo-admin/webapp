# Solution Prerequisites Hub

Een lichte, config-gedreven webapp waarmee je per oplossing de *Prerequisites* toont, exporteert en deelt. Voeg oplossingen toe door `data/solutions.json` te bewerken.

## Features
- 🔘 Dynamisch gegenereerde knoppen per oplossing
- ✅ Checklist met checkboxen
- 🧾 Copy-as-Markdown en JSON-download
- 🔎 Zoeken en filteren
- ⚙️ Config-first (geen backend nodig)

## Snel starten
1. Open `index.html` in je browser (lokaal), of
2. Publiceer als **Azure Static Web App** of via **GitHub Pages**.

## Publiceren als Azure Static Web Apps
1. Push deze map naar een GitHub repo (root of `/website`).
2. Maak in Azure Portal een *Static Web App* en koppel aan de repo/branch.
3. Build presets: *Custom*, App location: `/`, Output location: `/`.
4. Na deploy is de app publiek of achter Entra ID te zetten met *Enterprise auth*.

## Oplossingen toevoegen
Bewerk `data/solutions.json`. Voorbeeld:

```json
{
  "id": "nieuwe-oplossing",
  "title": "Mijn Oplossing",
  "description": "Korte beschrijving",
  "prerequisites": [
    {"type":"Access","text":"RBAC rol"},
    {"type":"Platform","text":"Resource provider X"}
  ],
  "links": [
    {"label":"Docs","url":"https://example.com"}
  ]
}
```

## Ideeën voor uitbreidingen
- Markdown bronbestanden parsen en genereren
- Export naar PDF (client-side) of Planner-taken via Graph API
- RACI/rol-kolommen en status per check-punt
- Teams-app met dezelfde webview (Tab)
