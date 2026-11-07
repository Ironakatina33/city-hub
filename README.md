# Ornano / City Hub — V2

Portail du magasin en HTML, CSS et JavaScript, déployé sur Cloudflare Workers avec les fichiers statiques de ce dépôt.

## Site
- Domaine : https://city-ornano.fr
- Compte GitHub : Ironakatina33
- Worker Cloudflare : city-hub
- Site responsive et installable comme PWA, avec thème clair/sombre.

## Applications
Modifier **apps.js** pour changer les liens ou ajouter d'autres applications. Les cartes sont générées automatiquement. Garder les liens des applications existantes tant que leur migration vers Cloudflare n'est pas terminée.

Les photos d'illustration sont des images génériques Unsplash : elles ne montrent **pas** le magasin Carrefour City Mérignac Ornano.
- Photo rayon épicerie : https://images.unsplash.com/photo-1534723452862-4c874018d66d (illustration Unsplash, allée de magasin).
- Photo fruits et légumes : https://images.unsplash.com/photo-1542838132-92c53300491e (illustration Unsplash, produits frais).

Pour utiliser **une vraie photo du magasin**, remplacer le champ `image` de l'entrée `planning` dans apps.js par une image dont vous avez l'autorisation.

## Publication
Les modifications poussées sur `main` sont publiées par l'intégration GitHub de Cloudflare Workers. La configuration du Worker courant utilise une commande de déploiement Wrangler avec assets statiques.

## Fonctions V2
- Accueil simplifié avec deux grandes cartes photographiques et dégradés.
- Barre de navigation et marque Ornano simplifiées.
- Liens FreshDesk et City Équipe inchangés.
- Raccourcis personnels stockés localement (`cityhub.shortcuts.v1`) : conservés depuis la V1.
- Mode sombre stocké localement (`cityhub.theme.v1`) : conservé.
- Installation PWA conservée, mise à jour du cache en V2.

**Sécurité** : `apps.js` et les autres fichiers du hub sont publics. Ne jamais y stocker de données internes sensibles, mots de passe ni secrets. Le hub est indépendant et n'est pas un service officiel Carrefour.
