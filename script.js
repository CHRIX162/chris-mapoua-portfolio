/* =========================================================
   Chris Mapoua — Portfolio — script.js
   Ce fichier est chargé sur les 3 pages (index, projects, contact).
   Chaque bloc ci-dessous est indépendant : si les éléments qu'il
   cherche n'existent pas sur la page en cours, il ne fait rien
   (grâce à la "garde" if (!element) return;).
========================================================= */


/* ---------------------------------------------------------
   MODULE 1 — Année de copyright automatique
   Concept : document.getElementById récupère UN élément par
   son id. .textContent change le texte affiché à l'intérieur.
--------------------------------------------------------- */
const yearEl = document.getElementById('copyright-year');
if (yearEl) {
  // new Date() donne la date actuelle ; .getFullYear() en extrait l'année.
  yearEl.textContent = new Date().getFullYear();
}


/* ---------------------------------------------------------
   MODULE 2 — Onglets Work / Education
   Concept : querySelectorAll renvoie une LISTE d'éléments
   (contrairement à getElementById qui n'en renvoie qu'un).
   On utilise .forEach() pour répéter une action sur chaque
   élément de cette liste — un peu comme le "for" qu'on a vu
   sur le Pomodoro, mais écrit différemment.
--------------------------------------------------------- */
const tabButtons = document.querySelectorAll('.tab-btn');

// Si la page n'a pas d'onglets (ex: contact.html), la liste est
// vide et .forEach() ne fera simplement rien plus bas — pas besoin
// de garde explicite ici, .forEach() sur une liste vide ne plante pas.
tabButtons.forEach((button) => {
  button.addEventListener('click', () => {

    // 1. On lit quel onglet ce bouton représente : "work" ou "education".
    //    C'est écrit dans le HTML via data-tab="work" / data-tab="education".
    const targetTab = button.dataset.tab;

    // 2. On désactive TOUS les boutons, puis on réactive uniquement
    //    celui sur lequel on vient de cliquer.
    tabButtons.forEach((btn) => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });
    button.classList.add('active');
    button.setAttribute('aria-selected', 'true');

    // 3. On cache TOUS les contenus d'onglet, puis on affiche
    //    uniquement celui qui correspond au bouton cliqué.
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach((content) => {
      // content.id vaut soit "work" soit "education" dans le HTML.
      if (content.id === targetTab) {
        content.classList.remove('hidden');
      } else {
        content.classList.add('hidden');
      }
    });
  });
});


/* ---------------------------------------------------------
   MODULE 3 — Bouton thème clair / sombre
   Concept : on stocke l'état actuel directement sur la page
   via un attribut data-theme posé sur <body>. Le CSS lit cet
   attribut (body[data-theme="light"] { ... }) pour changer les
   couleurs — le JS ne connaît aucune couleur, il ne fait que
   poser l'étiquette, exactement comme dataset.mode sur le Pomodoro.

   Remarque : ce choix n'est PAS mémorisé après un rechargement
   de page (pas de sauvegarde). Pour le rendre permanent, l'étape
   suivante serait d'utiliser localStorage — un sujet à part.
--------------------------------------------------------- */
const themeToggle = document.getElementById('theme-toggle');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = document.body.dataset.theme === 'light';

    if (isLight) {
      // On repasse en thème sombre : on supprime l'attribut.
      delete document.body.dataset.theme;
      themeToggle.textContent = '🌙';
    } else {
      // On passe en thème clair.
      document.body.dataset.theme = 'light';
      themeToggle.textContent = '☀️';
    }
  });
}


/* ---------------------------------------------------------
   MODULE 4 — Apparition au scroll (IntersectionObserver)
   Concept : un IntersectionObserver surveille une liste
   d'éléments et exécute une fonction dès que l'un d'eux entre
   (ou sort) de la zone visible de l'écran. C'est plus
   performant qu'écouter l'événement "scroll" en continu.
--------------------------------------------------------- */

// 1. On sélectionne tous les éléments qu'on veut faire apparaître
//    en douceur. La classe .reveal (définie en CSS) les rend
//    invisibles et légèrement décalés au départ.
const revealElements = document.querySelectorAll('.reveal');

// 2. On crée l'observateur, avec la fonction à exécuter à chaque
//    changement de visibilité.
const revealObserver = new IntersectionObserver((entries) => {

  // "entries" est la liste des éléments dont la visibilité vient
  // de changer (pas forcément tous les éléments surveillés).
  entries.forEach((entry) => {

    // entry.isIntersecting vaut "true" si l'élément est actuellement
    // visible à l'écran.
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');

      // Une fois l'animation jouée, on arrête de surveiller cet
      // élément précis : inutile de la refaire à chaque scroll.
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15, // se déclenche dès que 15% de l'élément est visible
});

// 3. On donne à l'observateur la liste des éléments à surveiller.
revealElements.forEach((el) => revealObserver.observe(el));
