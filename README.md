<p align="center">
  <picture>
    <source media="(prefers-color-scheme: light)" srcset="https://shieldcn.dev/header/glow.svg?title=Litenote&amp;subtitle=Le+SDK+TypeScript+pour+PRONOTE&amp;logo=data%3Aimage%2Fsvg%2Bxml%2C%253Csvg%2520xmlns%253D%2522http%253A%252F%252Fwww.w3.org%252F2000%252Fsvg%2522%2520viewBox%253D%252259%252059%2520266%2520266%2522%253E%253Cpath%2520fill%253D%2522%2523000%2522%2520d%253D%2522M%252082.84375%252096.695312%2520C%2520128.070312%252093.769531%2520174.402344%2520152.90625%2520191.917969%2520182.839844%2520C%2520209.433594%2520152.90625%2520255.769531%252093.769531%2520300.992188%252096.695312%2520C%2520341.214844%2520100.761719%2520306.066406%2520193.808594%2520274.539062%2520207.625%2520C%2520285.167969%2520221.441406%2520302.007812%2520263.800781%2520264.027344%2520282.796875%2520C%2520221.523438%2520304.054688%2520191.917969%2520239.871094%2520191.917969%2520232.246094%2520C%2520191.917969%2520239.871094%2520162.3125%2520304.054688%2520119.808594%2520282.796875%2520C%252081.828125%2520263.800781%252098.667969%2520221.441406%2520109.296875%2520207.625%2520C%252077.773438%2520193.808594%252042.621094%2520100.761719%252082.84375%252096.695312%2520Z%2520M%252082.84375%252096.695312%2520%2522%252F%253E%253C%252Fsvg%253E&amp;mode=light&amp;theme=green&amp;align=left" />
    <img alt="Litenote — Le SDK TypeScript pour PRONOTE" src="https://shieldcn.dev/header/glow.svg?title=Litenote&amp;subtitle=Le+SDK+TypeScript+pour+PRONOTE&amp;logo=data%3Aimage%2Fsvg%2Bxml%2C%253Csvg%2520xmlns%253D%2522http%253A%252F%252Fwww.w3.org%252F2000%252Fsvg%2522%2520viewBox%253D%252259%252059%2520266%2520266%2522%253E%253Cpath%2520fill%253D%2522%2523fff%2522%2520d%253D%2522M%252082.84375%252096.695312%2520C%2520128.070312%252093.769531%2520174.402344%2520152.90625%2520191.917969%2520182.839844%2520C%2520209.433594%2520152.90625%2520255.769531%252093.769531%2520300.992188%252096.695312%2520C%2520341.214844%2520100.761719%2520306.066406%2520193.808594%2520274.539062%2520207.625%2520C%2520285.167969%2520221.441406%2520302.007812%2520263.800781%2520264.027344%2520282.796875%2520C%2520221.523438%2520304.054688%2520191.917969%2520239.871094%2520191.917969%2520232.246094%2520C%2520191.917969%2520239.871094%2520162.3125%2520304.054688%2520119.808594%2520282.796875%2520C%252081.828125%2520263.800781%252098.667969%2520221.441406%2520109.296875%2520207.625%2520C%252077.773438%2520193.808594%252042.621094%2520100.761719%252082.84375%252096.695312%2520Z%2520M%252082.84375%252096.695312%2520%2522%252F%253E%253C%252Fsvg%253E&amp;mode=dark&amp;theme=green&amp;align=left" />
  </picture>
</p>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: light)" srcset="https://shieldcn.dev/group/badge/TypeScript-3178c6+badge/PRONOTE-22c55e+badge/Licence-AGPL--3.0-2563eb.svg?variant=secondary&amp;theme=green&amp;mode=light" />
    <img alt="TypeScript · PRONOTE · Licence AGPL-3.0" src="https://shieldcn.dev/group/badge/TypeScript-3178c6+badge/PRONOTE-22c55e+badge/Licence-AGPL--3.0-2563eb.svg?variant=secondary&amp;theme=green&amp;mode=dark" />
  </picture>
</p>

**Litenote** est le SDK TypeScript de [Scolup](https://github.com/Scolup/Scolup) pour les espaces élèves PRONOTE hébergés par Index Éducation.

Recherche un établissement, associe un compte avec le QR officiel de PRONOTE et récupère les données scolaires depuis ton application.

---

## ✨ Fonctionnalités

- 📍 **Recherche d’établissements** | Trouve les espaces élèves hébergés autour d’un point géographique.
- 🔐 **Association de session** | Connecte un compte par QR et reprends une session avec ses données de renouvellement.
- 📊 **Notes et moyennes** | Récupère les relevés par période, avec les moyennes disponibles et les moyennes de classe.
- 📅 **Agenda et devoirs** | Lis l’emploi du temps, les devoirs et les contenus de séance. Marque les devoirs comme faits ou à faire.
- 📒 **Carnet et discussions** | Accède aux absences, aux entrées du carnet et aux messages.
- 🛠️ **Transport configurable** | Utilise le Worker Procsy fourni par défaut ou passe ton propre transport HTTP.

---

## 🚀 Démarrage rapide

### 1. Installer le SDK

À la racine du dépôt Litenote, installe les dépendances et compile le SDK.

```bash
bun install
bun run build
```

Si ton application et Litenote se trouvent côte à côte, ajoute le SDK depuis le dossier de ton application.

```bash
bun add ../Litenote
```

### 2. Associer un compte

`nearbySchools({ latitude, longitude })` renvoie les établissements à proposer à l’élève. Récupère l’adresse `url` de celui qu’il sélectionne.

L’élève génère ensuite un QR d’association dans son espace PRONOTE officiel et choisit un code à quatre chiffres. Transmets le contenu du QR scanné, le code et l’adresse sélectionnée.

```typescript
import { Litenote } from "litenote"

export async function connecter(qr: string, pin: string, portailEleve: string) {
  const client = new Litenote()
  const session = await client.connectQr(qr, pin, portailEleve)
  return { client, session }
}
```

### 3. Lire les relevés

```typescript
const { client, session } = await connecter(qr, pin, portailEleve)
const { reports } = await client.grades()

console.log(`${reports.length} période(s) disponible(s)`)
```

Pour reprendre une session plus tard, conserve `session` dans un stockage protégé, passe-la à `client.restore(session)` et remplace-la par les données renouvelées renvoyées par cette méthode. Le QR, le code et les données de renouvellement sont des secrets.

---

## 📚 Projet et documentation

- [Guide de contribution](./CONTRIBUTING.md)
- [Politique de sécurité](./SECURITY.md)
- [Logo Litenote](./docs/assets/litenote.svg)

La recherche géographique suit le protocole utilisé par [Blocksnote](https://github.com/BlocksHub/Blocksnote). L’association et la reprise de session s’appuient sur [Pawnote](https://github.com/LiterateInk/Pawnote).

---

## ⚖️ Licence

Litenote est un projet indépendant d’Index Éducation, distribué sous [licence AGPL-3.0-or-later](./LICENSE.md).

---

<p align="center">
  Développé par <a href="https://github.com/Scolup">Scolup</a>
</p>
