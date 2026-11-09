# Charte graphique commune · Ornano Suite v1

## Structure

- **City Hub** (bleu) : uniquement un point d'entrée donnant accès aux applications.
- **City Équipe** (émeraude) : horaires, équipe et demandes ; outils sensibles seulement pour l'administrateur.
- **FreshDesk** (vert frais + orange du logo) : catalogue, quantités, commande, impression et historique.

Aucune application métier ne doit devenir un tableau de bord général. Le portail ne doit pas dupliquer les données des deux outils.

## Identité commune

- Fond : `#F5F6F4` ; surface : `#FFFFFF` ; texte : `#172B2D`.
- Bordures : `#DFE7E1` ; texte secondaire : `#60746E` à `#64756D`.
- Menus latéraux des applications : `#172C2B`, avec texte clair et élément actif dans la couleur de l'app.
- Accent City Hub : `#245CDB`.
- Accent City Équipe : `#087451`.
- Accent FreshDesk : `#16834E`. Orange seulement dans l'identité FreshDesk, sans l'imposer aux actions communes.
- Rayons : 10–14 px. Ombres très légères, pas de dégradés ou photos génériques décoratives.
- Typographie : DM Sans pour les textes, Manrope pour les titres, avec polices système en secours.
- Taille des cibles tactiles : 44 px minimum, navigation mobile visible.
- Même manière de présenter boutons, filtres, listes, états actifs, fenêtres modales et messages.
- Mode sombre : mêmes surfaces sombres neutres, contrastes suffisants et accent adapté.

## Simplicité pour les salariés

1. Une action principale par écran, vocabulaire métier simple.
2. Éviter les cartes de statistiques fictives, les widgets non nécessaires, les menus imbriqués et les longues explications.
3. Les actions réservées à l'admin ne doivent pas encombrer les écrans des employés.
4. Retour facile vers City Hub ; liens de lancement sans nouveaux onglets intempestifs.
5. Ne jamais déplacer ou modifier les données existantes en même temps qu'une refonte visuelle.
6. Ne pas dégrader l'impression de FLE ni les fonctions de gestion / historique / CP du planning.

## Fichiers déployés

- `city-hub/suite-v1.css` (GitHub main).
- `city-equipe/public/suite-v1.css` (branche `release/city-equipe`, Cloudflare Worker).
- `freshdesk/ornano-suite-v1.css` (GitHub main, Pages).

Ces fichiers reprennent les mêmes règles ; les changements futurs doivent être coordonnés pour éviter de nouveaux décalages entre les sites.

## Limites

Les nouveaux styles ne créent aucune fonction métier présentée dans les maquettes d'inspiration. Les fonctions réelles sont celles des versions existantes. La publication automatique doit être vérifiée dans Cloudflare / GitHub Pages.
