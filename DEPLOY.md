# Elektromax – Deployment Gids
## OVHcloud Hosting + maxelektro.be

---

## Stap 1 – Formspree instellen (verplicht vóór deploy)

1. Ga naar **https://formspree.io** en maak een gratis account aan
2. Klik **New Form** → kies "Free" → geef als e-mailadres **a.maxelektro@gmail.com** op
3. Kopieer je **Form ID** (bv. `xabc1234`)
4. Open `src/pages/Contact.tsx` en vervang:
   ```ts
   const FORMSPREE_ID = "YOUR_FORM_ID"; // ← vervang dit
   ```
   door:
   ```ts
   const FORMSPREE_ID = "xabc1234"; // jouw echte ID
   ```
5. Sla op

---

## Stap 2 – Build aanmaken

```bash
npm install
npm run build
```

De `dist/` map bevat de volledige website (typisch 2-5 MB).

---

## Stap 3 – Upload naar OVHcloud

### Via FTP/SFTP (FileZilla aanbevolen)
- Host: `ftp.cluster0XX.hosting.ovh.net` (zie OVH control panel)
- Gebruikersnaam & wachtwoord: in het OVH control panel > Hosting > FTP-SSH
- Upload de **inhoud van de `dist/` map** (niet de map zelf) naar de root van je hosting:
  - `/www/` of `/htdocs/` (controleer welke map OVH als root gebruikt)

### Controleer na upload
- `index.html` staat in de root
- `.htaccess` staat in de root (zorg dat verborgen bestanden zichtbaar zijn in FileZilla: Server > Verborgen bestanden weergeven)
- `assets/` map staat in de root

---

## Stap 4 – DNS instellen voor maxelektro.be

In het OVH-configuratiepaneel (Domain > DNS-zone):

| Type  | Naam | Waarde                         |
|-------|------|--------------------------------|
| A     | @    | IP-adres van je OVH hosting    |
| A     | www  | IP-adres van je OVH hosting    |
| CNAME | www  | maxelektro.be.                 |

**Het IP-adres van je OVH hosting** vind je in:
OVH Control Panel > Web Cloud > Hosting > Algemene informatie > IPv4

> ⏱ DNS-propagatie duurt 24–48 uur. Je kunt de site controleren via `https://maxelektro.be` of tijdelijk via het directe IP.

---

## Stap 5 – HTTPS (SSL)

OVH shared hosting bevat gratis SSL (Let's Encrypt).
Activeer het in: OVH Control Panel > Hosting > SSL-certificaat

De `.htaccess` stuurt al automatisch HTTP → HTTPS door.

---

## Stap 6 – Testen na deploy

- [ ] `https://maxelektro.be` laadt correct
- [ ] `https://maxelektro.be/diensten` werkt (geen 404)
- [ ] `https://maxelektro.be/contact` werkt
- [ ] Taalwisselaar (NL / EN / TR) functioneert
- [ ] WhatsApp-knop opent juiste chat
- [ ] Contactformulier verstuurt (test met je eigen e-mailadres)
- [ ] HTTPS-certificaat actief (groen slotje in browser)

---

## GitHub (optioneel – versiecontrole)

Je kunt nog steeds code bewaren op GitHub, maar de **live site draait op OVHcloud**.
Voor de GitHub Pages-deploy verwijder je de GitHub Actions workflow, of disable je GitHub Pages in de repo-instellingen.

Voordeel OVHcloud vs GitHub Pages:
- Echte URL's zonder `#` (BrowserRouter werkt dankzij .htaccess)
- Betere SEO: subpagina's worden geïndexeerd door Google
- Eigen domein (maxelektro.be) direct gekoppeld

---

## Onderhoud & updates

1. Maak wijzigingen in de broncode
2. `npm run build`
3. Upload de nieuwe `dist/` inhoud via FTP (overschrijf bestaande bestanden)
