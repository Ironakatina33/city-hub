# City Hub — Portail d'applications magasin

Un portail **mobile / ordinateur** pour regrouper City Équipe, FreshDesk et les futurs outils du magasin. Interface responsive, mode sombre, recherche, raccourcis personnels et **PWA installable**. Entièrement statique : pas besoin de serveur Python ni de base de données.

## Publier à l'adresse courte (gratuit)

Pour obtenir **https://ironakatina33.github.io/** :

1. Connectez-vous à GitHub sur le compte `Ironakatina33`.
2. Cliquez sur **New repository** : https://github.com/new
3. Nommez-le **`Ironakatina33.github.io`** (même nom que votre compte GitHub, sans `freshdesk`).
4. Choisissez **Public** et créez le dépôt (sans README initial pour faciliter l'import).
5. Dans le dépôt, cliquez sur **Add file → Upload files**.
6. **Déposez les fichiers ET le dossier `icons/` contenus dans cette archive à la racine** du dépôt. Ne déposez pas l'archive ZIP elle-même, ni le dossier parent `CityHub`.
7. Validez via **Commit changes**.
8. Allez dans **Settings → Pages → Build and deployment**. Sélectionnez **Deploy from a branch**, branche **main**, dossier **/(root)**, puis **Save**.
9. Une fois le déploiement terminé, ouvrez **https://ironakatina33.github.io/**.

> GitHub Pages peut mettre quelques minutes à publier le site. Cette adresse est gratuite et ne modifie pas l'URL existante de FreshDesk (`.../freshdesk/`). Ne déplacez pas le dépôt FreshDesk.

### À propos de l'import GitHub

GitHub peut masquer les fichiers qui commencent par un point, comme `.nojekyll`, lors de certains téléversements. Ce fichier n'est pas indispensable pour ce projet : les fichiers restants fonctionnent sans lui.

## Installer sur téléphone

**Android / Chrome :** ouvrez l'URL en HTTPS → menu ⋮ → *Installer l’application* ou *Ajouter à l’écran d’accueil*.

**iPhone / Safari :** ouvrez l'URL dans Safari → *Partager* → *Sur l’écran d’accueil* → *Ajouter*.

La PWA démarre depuis l'écran d'accueil. L'interface du hub peut se réafficher sans connexion après une première visite. Les **applications liées ont toujours besoin d'une connexion et conservent leurs propres systèmes d'accès**.

## Ajouter une application officielle au portail

Modifiez le fichier **`apps.js`** sur GitHub (icône du crayon), et ajoutez une nouvelle entrée au tableau :

```js
{
  id: "inventaire",
  title: "Inventaire",
  label: "STOCKS & MAGASIN",
  description: "Consulter les stocks et les inventaires.",
  url: "https://exemple.fr/",
  category: "rayon", // "equipe", "rayon", "autre"
  icon: "box",        // "calendar", "basket", "grid", "box", "link"
  color: "green",     // "blue", "orange", "purple", "green"
  tags: ["Stocks", "Inventaire"]
},
```

Le lien apparaîtra automatiquement sur le portail après la publication GitHub Pages. Le champ `featured` est facultatif. Veillez à mettre une **virgule** entre chaque entrée du tableau.

**Attention :** `apps.js` est public. N'y mettez aucun mot de passe, code de gestion ou jeton d'API.

## Raccourcis personnels

Le bouton **Ajouter un raccourci** enregistre le lien *localement sur l'appareil*, dans ce navigateur. Il ne le partage **pas** avec les autres employés et il ne se synchronise pas entre appareils. Pour publier un lien à toute l'équipe, utilisez `apps.js`.

## Nom de domaine personnalisé

Vous pouvez ultérieurement utiliser un nom de domaine acheté, par exemple `hub.votredomaine.fr`, via **Settings → Pages → Custom domain**, puis configurer le DNS chez votre registraire. Il faut posséder le domaine ; le coût dépend du fournisseur.

## Personnalisation

- `index.html` : textes, sections, structure.
- `styles.css` : design et couleurs.
- `apps.js` : catalogue d'applications partagées.
- `app.js` : recherche, filtres, mode sombre, installation et raccourcis personnels.
- `manifest.webmanifest` : nom, icône et configuration installable.
- `service-worker.js` : fonctionnement hors connexion de l'interface du hub.

Les fichiers du hub sont récupérés en priorité sur Internet, et gardés en cache pour un accès hors connexion au portail. Les ajouts dans `apps.js` sont donc visibles après rechargement sans intervention supplémentaire. Si vous changez la structure du service worker, vous pouvez également changer `CACHE_NAME` (ex. `city-hub-v1.0.1`).

## Respect et sécurité

Portail indépendant, **non officiel**, créé pour simplifier l'accès à des outils magasin. Pas d'authentification centrale, pas de synchronisation des données des applications, pas de mots de passe stockés par le hub. Pour des informations sensibles ou une utilisation interne restreinte, la publication GitHub Pages publique seule **ne convient pas** comme contrôle d'accès.
