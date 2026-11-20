<p align="center">
  <picture>
    <source media="(prefers-color-scheme: light)" srcset="https://shieldcn.dev/header/glow.svg?title=Contribuer+%C3%A0+Litenote&amp;subtitle=D%C3%A9velopper+et+tester+le+SDK+Litenote&amp;logo=lu%3AHandshake&amp;mode=light&amp;theme=blue&amp;align=left" />
    <img alt="Contribuer à Litenote — Développer et tester le SDK Litenote" src="https://shieldcn.dev/header/glow.svg?title=Contribuer+%C3%A0+Litenote&amp;subtitle=D%C3%A9velopper+et+tester+le+SDK+Litenote&amp;logo=lu%3AHandshake&amp;mode=dark&amp;theme=green&amp;align=left" />
  </picture>
</p>

## 🚀 Préparer le projet

Installe [Bun](https://bun.sh/), puis lance cette commande dans ta copie locale de Litenote.

```bash
bun install
```

## 🗂️ Structure du projet

```text
src/
├── index.ts        API publique, transport Procsy et accès aux données
└── host.ts         Validation des hôtes et normalisation des URL élèves
tests/             Tests Bun du transport et des fonctions du SDK
```

## 🧪 Tester et compiler

```bash
bun test
bun run build
```

Pour couvrir les échanges PRONOTE dans les tests, utilise un transport de test et des données fictives.

## 🤝 Proposer une modification

1. Crée une branche dédiée. Si la proposition modifie l’API publique, présente-la dans une issue avant d’ouvrir la pull request.
2. Ajoute ou adapte les tests en fonction du comportement modifié. Actualise les exemples du README si l’utilisation du SDK change.
3. Dans la pull request, décris le problème résolu, le comportement attendu et les vérifications effectuées.

Pour une vulnérabilité, suis la [politique de sécurité](./SECURITY.md).

---

<p align="center"><a href="./README.md">Retour au README</a></p>
