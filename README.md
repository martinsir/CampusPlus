# Campus+ App - Kategori A (Lærere og Studerende)

## Om Opgaven
Campus Køge ønsker en digital løsning til at modernisere og effektivisere uddannelsesmessen **CAMPUS+**, som afholdes hvert år i forbindelse med Køge Festuge. Appen skal samle al information, tilmelding og kommunikation ét sted og skabe en bedre oplevelse for både arrangører, lærere og studerende.

## Fokusområde
Denne løsning fokuserer på **Kategori A**: **Lærere og deres studerende**. Formålet er at udvikle en prototype, der gør det muligt for lærere at:
- Logge ind og registrere deres skole, klasser og elever.
- Fordele elever i grupper med tildelte aktivitetspas.
- Administrere undervisningsmaterialer, billetter og evaluering.

Studerende får adgang til deres aktivitetspas, undervisningsmaterialer og mulighed for at indsende evaluering.

## Leverancer
- En **interaktiv prototype** i Figma.
- En **kodet central brugerrejse** for lærere, som inkluderer login og klasseregistrering.

Denne løsning lægger fundamentet for en fuldt funktionel app, der kan implementeres til CAMPUS+ i 2025.

# **Campus+ React Mappestruktur**

```plaintext
campusplus/
├── public/
│   ├── index.html         # HTML-indgangspunktet
│   └── favicon.ico        # Appens ikon
├── src/
│   ├── components/        # Genanvendelige komponenter
│   │   ├── Header.js      # Header-komponent
│   │   ├── Login.js       # Login-komponent
│   │   └── Footer.js      # Footer-komponent
│   ├── pages/             # Sidekomponenter
│   │   ├── Teacher.js     # Dashboard for lærere
│   │   ├── Student.js     # Dashboard for studerende
│   │   └── NotFound.js    # 404-fejlside
│   ├── context/           # Context API til deling af global state
│   │   └── ThemeContext.js # Dark/Light Mode context
│   ├── styles/            # CSS/SCSS-filer
│   │   ├── App.css        # Global styling
│   │   ├── variables.scss # SCSS-variabler (hvis nødvendigt)
│   ├── utils/             # Hjælpefunktioner
│   │   └── api.js         # Funktioner til API-kald
│   ├── App.js             # Hovedkomponent
│   ├── index.js           # Hovedindgangspunkt
│   └── reportWebVitals.js # (Valgfri) Ydelsesmåling
├── package.json           # Projektkonfiguration og afhængigheder
├── .gitignore             # Git-ignorede filer
├── README.md              # Dokumentation af projektet
