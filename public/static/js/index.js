'use strict';
import {createFooter} from './templates/footer/footer.js';
import {createHeader} from './templates/header/header.js';
import {createModal} from './templates/modal/modal.js';
import Router from './modules/Router.js';
import EventBus from './modules/EventBus.js';
import MainPageController from './controllers/mainPageController.js';
import ProfilePageController from './controllers/profilePageController.js';
import {egg} from './templates/easterEgg/easterEgg.js';

document.addEventListener('DOMContentLoaded', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js', {scope: '/'})
        .then((registration) => {
          console.log('sw registration on scope:', registration.scope);
        })
        .catch((err) => {
          console.error(err);
        });
  };

  const wrapper = document.querySelector('.wrapper');
  const root = document.createElement('div');
  root.id = 'root';
  root.classList.add('content');

  const globalEventBus = new EventBus([
    'modalClick',
    'checkAutorisation',
    'logout',
    'loggedIn',
  ]);
  const router = new Router(wrapper, globalEventBus);
  createHeader(globalEventBus);
  createModal(globalEventBus);
  wrapper.appendChild(root);
  createFooter();

  const MainPage = new MainPageController(router, globalEventBus);
  const ProfilePage = new ProfilePageController(router, globalEventBus);

  router.setRoute('^\/$', MainPage.view.render);
  router.setRoute('^\/logout', MainPage.view.render);
  router.setRoute('^\/profile', ProfilePage.view.render);
  router.setRoute('^\/profile\/settings', ProfilePage.view.render);

  router.go(window.location.pathname);
  if (navigator.onLine !== true) {
    console.log('jeje');
    const easterEggTemplate = Handlebars.templates.easterEgg;
    root.innerHTML = easterEggTemplate();
    egg();
  }
});

/**
 * Функция создания профиля
 */
// function profile() {
//   const res = Ajax.asyncGetUsingFetch({
//     url: secureDomainUrl + 'users/profile',
//     body: null,
//   });
//   res.then(({status, parsedBody})=> {
//     if (status != statusCodes.OK) {
//       return;
//     }
//     const {code} = parsedBody;
//     let isAuthorized = false;
//     if (code === statusCodes.OK) {
//       isAuthorized = true;
//     }
//     if (isAuthorized) {
//       const profilepg = new ProfilePage(root);
//       const {body} = parsedBody;
//       const {profile} = body;
//       const {email, profilePic, rating, ads} = profile;
//       profilepg.render(email, rating, profilePic, ads);
//     }
//   });
// }
