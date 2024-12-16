# Guide til Opsætning af Projektet

Denne guide dækker trinnene fra `npm install` til opsætning af SQL-databasen og sikring af, at den medfølgende kode fungerer som forventet.

---

## Forudsætninger

Sørg for, at følgende er installeret:

- [Node.js](https://nodejs.org/) (v14+ anbefales)
- [npm](https://www.npmjs.com/) (inkluderet med Node.js)
- MySQL Server (sørg for at have admin-adgang)

---

## 1. Initial Opsætning

### Klon Repositoriet
```bash
git clone <repository-url>
cd <project-folder>
```

### Installer Afhængigheder
Kør følgende kommando for at installere nødvendige npm-pakker:
```bash
npm install
```

---

## 2. Konfigurer Miljøvariabler

Opret en `.env`-fil i roden af dit projekt med følgende indhold:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=<din-adgangskode>
DB_NAME=itloesninger_dk_db
JWT_SECRET=<din-hemmelige-nøgle>
```

Erstat `<din-adgangskode>` og `<din-hemmelige-nøgle>` med passende værdier.

---

## 3. Opsæt MySQL-databasen

### Log ind på MySQL
```bash
mysql -u root -p
```

### Opret Databasen
```sql
CREATE DATABASE itloesninger_dk_db;
USE itloesninger_dk_db;
```

### Opret `Users`-tabellen
```sql
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Role VARCHAR(50) NOT NULL,
    PhoneNumber VARCHAR(20),
    SchoolID INT
);
```

---

## 4. Back-End Opsætning

### Express Server
Sørg for, at din serverkode inkluderer følgende:

#### Installer Nødvendige Pakker
```bash
npm install express mysql2 bcrypt jsonwebtoken dotenv cors
```

#### `server.js`
```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server kører på port ${PORT}`);
});
```

#### `routes/users.js`
```javascript
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';

const router = express.Router();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO Users (Name, Email, Password, Role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );
        res.status(201).json({ message: 'Bruger registreret med succes' });
    } catch (error) {
        res.status(500).json({ error: 'Registrering fejlede' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM Users WHERE Name = ?', [username]);
        if (rows.length === 0) return res.status(401).json({ error: 'Ugyldige legitimationsoplysninger' });

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) return res.status(401).json({ error: 'Ugyldige legitimationsoplysninger' });

        const token = jwt.sign({ id: user.UserID, role: user.Role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login lykkedes', token });
    } catch (error) {
        res.status(500).json({ error: 'Login fejlede' });
    }
});

export default router;
```

---

## 5. Front-End Opsætning

### Installer Vite
```bash
npm create vite@latest
```
Vælg den passende framework (f.eks. Vanilla, React).

### Opdater `index.html`
Sørg for, at strukturen inkluderer nødvendige IDs og klasser til `login`, `register` og `content-container`.

### Opret `scripts`
Opret separate filer til:
- `login.js`
- `register.js`
- `main.js`

#### Eksempel `login.js`
```javascript
document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('brugernavn').value.trim();
    const password = document.getElementById('kodeord').value.trim();
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const result = await response.json();
        if (response.ok) {
            localStorage.setItem('token', result.token);
            document.getElementById('login-page').style.display = 'none';
            document.getElementById('content').style.display = 'block';
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error(error);
    }
});
```

---

## 6. Test Opsætningen

### Start Serveren
```bash
node server.js
```

### Start Front-End
```bash
npm run dev
```

### Åbn Appen
Åbn din browser og naviger til:
```
http://localhost:5173
```

---

## 7. Fejlfindingstips
- **Databaseforbindelsesproblemer:** Dobbelttjek `.env`-variabler.
- **Login-/Registreringsfejl:** Tjek netværksfanen i browserens udviklerværktøjer.
- **CSS-indlæsning fejler:** Sørg for, at alle stylesheets er korrekt linket.

---

Følger du denne guide, sikrer du en velfungerende applikation med login, registrering og hovedindhold.


--

Se vedhæftet campus_db.SQL for complete database eksemple

---


Opret en .env-fil i roden af dit projekt med følgende indhold:

PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=<din-adgangskode>
DB_NAME=www.database
JWT_SECRET=<din-hemmelige-nøgle>


Mappe struktur
/project-folder
```
└── 📁server
    └── 📁routes
        └── api.js
    └── .env
    └── db.js
    └── server.js
└── 📁src
    └── 📁assets
        └── AnimationHead.json
        └── 📁fonts
            └── 📁Licenses
                └── TNB Standard License Agreement.html
            └── TheNorthernBlockLtd_Metral-Bold.woff2
            └── TheNorthernBlockLtd_Metral-BoldItalic.woff2
            └── TheNorthernBlockLtd_Metral-Metral-ExtraBold.woff2
            └── TheNorthernBlockLtd_Metral-Metral-Italic.woff2
            └── TheNorthernBlockLtd_Metral-Metral-Light.woff2
            └── TheNorthernBlockLtd_Metral-Regular.woff2
        └── 📁images
            └── 05092023-campus+dagen-103.jpg
            └── 05092023-campus+dagen-104.jpg
            └── 05092023-campus+dagen-119.jpg
            └── 05092023-campus+dagen-165.jpg
            └── 05092023-campus+dagen-54.jpg
            └── bot-map.png
            └── bot-program.png
            └── bot-ticket.png
            └── logo_page.png
            └── Marcus Eckhoff - Campus+-29.jpg
            └── Marcus Eckhoff - Campus+-30.jpg
            └── Marcus Eckhoff - Campus+-37.jpg
            └── Marcus Eckhoff - Campus+-42.jpg
            └── Marcus Eckhoff - Campus+-49.jpg
            └── Marcus Eckhoff - Campus+-55.jpg
            └── Marcus Eckhoff - Campus+-87.jpg
            └── Marcus Eckhoff - Campus+-95.jpg
            └── Marcus Eckhoff - Campus+-97.jpg
            └── Marcus Eckhoff - kryd-10.jpg
            └── Marcus Eckhoff - kryd-7.jpg
            └── SA109506.jpg
            └── SA109654.jpg
            └── Schneider Foto - Campus + dagen-2.jpg
            └── Schneider Foto - Campus + dagen-24.jpg
            └── seprogram.png
            └── Silje Louw - Campus-6.jpg
    └── 📁css
        └── bottom.nav.css
        └── login.css
        └── splash.css
        └── styles.css
    └── 📁scripts
        └── bottom-nav.js
        └── login.js
        └── main.js
        └── profile.js
        └── register.js
        └── splash.js
    └── index.html
```
│
├── /dist                 # Production build output (generated by Vite)
│
├── /node_modules         # Installed dependencies (auto-generated)
│
├── vite.config.js        # Vite configuration file
├── package.json          # Project metadata and dependencies
├── .env                  # Environment variables (for sensitive data like DB credentials)
├── README.md             # You are reading it