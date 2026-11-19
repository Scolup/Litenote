# Litenote

SDK TypeScript pour les espaces élèves PRONOTE hébergés par Index Éducation. La recherche autour de coordonnées suit l'API utilisée par [Blocksnote](https://github.com/BlocksHub/Blocksnote). L'association au navigateur via le QR officiel et la reprise de session utilisent [Pawnote](https://github.com/LiterateInk/Pawnote).

`nearbySchools` renvoie les établissements hébergés autour d'un point. `Litenote` fournit la session, les notes et moyennes officielles, l'emploi du temps, le cahier de textes, les absences et la lecture des discussions.

Le constructeur accepte un transport HTTP personnalisé. Le transport navigateur par défaut utilise `https://proxy.api.scolup.com`, le Worker `procsy-scolup`. Les identifiants ENT sont saisis sur le portail officiel.

Pour le développement local, place les dépôts Litenote et Scolup côte à côte dans `vfinal` et lance `bun install` dans Scolup.
