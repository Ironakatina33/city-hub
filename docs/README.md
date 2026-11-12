# Carrefour City Ornano — portail complémentaire

Cette version du portail utilise `docs/` dans le dépôt `Ironakatina33/city-hub`. Elle n'écrase pas l'application Cloudflare de `city-ornano.fr`.

## Publication sous carrefour.city-ornano.fr

1. Dans le dépôt GitHub, Settings → Pages, activer **Deploy from a branch**, branche **main**, dossier **/docs**, puis enregistrer.
2. Dans Settings → Pages, configurer le domaine personnalisé **carrefour.city-ornano.fr** et activer HTTPS lorsqu'il est disponible. Vérifier si le domaine appartient au propriétaire GitHub avant de modifier le DNS.
3. Dans la zone DNS Cloudflare pour `city-ornano.fr`, ajouter **CNAME** `carrefour` → `ironakatina33.github.io` (DNS only pour commencer), sans toucher aux enregistrements du domaine racine ou de `fle` et `planning`.
4. Vérifier le certificat HTTPS et la disponibilité du portail avant de communiquer l'URL aux collègues. L'ouverture sur des ordinateurs gérés par Carrefour reste soumise aux règles et autorisations informatiques.

## Fonctionnement

- Accès à FreshDesk sur `fle.city-ornano.fr`.
- Préparation de planning hors ligne (en mémoire uniquement) avec sélection d'horaires rapides, Repos, CP, case inchangée, annulation et navigation par semaine.
- Export/import JSON `city-equipe-draft/v1` — l'import s'effectue dans le planning officiel depuis un appareil autorisé avec un compte manager.
- Aucune écriture directe dans l'API, aucune duplication de la base D1. Un brouillon ne se synchronise pas et ne devient jamais un planning officiel automatiquement.
- Les fichiers exportés contiennent des données de personnel : suivre les procédures de transfert autorisées, supprimer les copies présentes sur les ordinateurs partagés.

## Validation

Les fichiers HTML et leurs changements ont été contrôlés statiquement lors de la préparation. Vérifier le rendu sur smartphone et PC et effectuer un test d'import sans enregistrer de vrais horaires. Le domaine, DNS, l'hébergement GitHub Pages, le filtrage du magasin et le parcours complet ne sont **pas validés** par ces changements de code.
