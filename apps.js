/**
 * Les deux outils du magasin. City Hub n'est qu'un portail :
 * les données, permissions et fonctionnalités restent dans chaque application.
 * Aucun secret ou donnée d'employé ici.
 */
window.CITY_HUB_APPS = [
  {
    id: 'planning',
    title: 'City Équipe',
    label: 'PLANNING',
    description: 'Consulter mes horaires et ceux de l’équipe.',
    url: 'https://planning.city-ornano.fr/',
    category: 'equipe'
  },
  {
    id: 'freshdesk',
    title: 'FreshDesk',
    label: 'FRUITS & LÉGUMES',
    description: 'Préparer la commande du rayon.',
    url: 'https://fle.city-ornano.fr/',
    category: 'rayon'
  }
];
