# PayéMark

PayéMark est une application permettant d'appliquer un filigrane "PAYÉ" sur des fichiers PDF. Elle dispose d'une interface React fonctionnant aussi bien dans un navigateur que dans une application Electron.

## Fonctionnalités

- Ajout de filigranes personnalisables (texte, taille, position, rotation, couleur, opacité).
- Sélection des pages à traiter.
- Prévisualisation des PDF avant et après traitement.
- Version bureau grâce à Electron avec dialogues natifs d'ouverture et de sauvegarde de fichiers.

## Installation

```bash
npm install
```

## Développement

Pour lancer l'application en mode développement :

```bash
npm run dev
```

Pour la version Electron durant le développement :

```bash
npm run electron:dev
```

## Construction

Générer la version de production (web) :

```bash
npm run build
```

Créer un paquet Electron :

```bash
npm run electron:package
```

