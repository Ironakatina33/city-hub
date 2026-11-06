/**
 * APPLICATIONS PARTAGÉES DU HUB
 * Pour ajouter une application à tous les utilisateurs, ajoutez un objet ci-dessous.
 * category: "equipe", "rayon" ou "autre".
 * icon: "calendar", "basket", "grid", "box" ou "link".
 * N'ajoutez pas de mots de passe, jetons ou informations confidentielles : ce fichier est public.
 */
window.CITY_HUB_APPS = [
  {
    id: "planning",
    title: "City Équipe",
    label: "PLANNING & ÉQUIPE",
    description: "Consultez les horaires, les plannings et les journées de l'équipe.",
    url: "https://ironakatina.eu.pythonanywhere.com/",
    category: "equipe",
    icon: "calendar",
    color: "blue",
    featured: true,
    tags: ["Planning", "Horaires"]
  },
  {
    id: "freshdesk",
    title: "FreshDesk",
    label: "COMMANDES · FRUITS & LÉGUMES",
    description: "Préparez vos commandes du rayon frais et imprimez vos bons.",
    url: "https://ironakatina33.github.io/freshdesk/",
    category: "rayon",
    icon: "basket",
    color: "orange",
    featured: true,
    tags: ["Commandes", "Rayon frais"]
  }
];
