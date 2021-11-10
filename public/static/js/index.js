'use strict';
import {createFooter} from './templates/footer/footer.js';
import {isLogged} from './modules/isLogged.js';
import {createModal} from './templates/modal/modal.js';
import Router from './modules/Router.js';
import EventBus from './modules/EventBus.js';
import MainPageController from './controllers/mainPageController.js';
import ProfilePageController from './controllers/profilePageController.js';
import SalesmanPageController from './controllers/salesmanPageController.js';
import NewAdPageController from './controllers/newAdController.js';
import AdvertPageController from './controllers/advertPageController.js';
import {egg, eggTemplate} from './templates/easterEgg/easterEgg.js';

document.addEventListener('DOMContentLoaded', async () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', {scope: '/'})
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
  await isLogged(globalEventBus);
  createModal(globalEventBus);
  wrapper.appendChild(root);
  createFooter();

  const MainPage = new MainPageController(router, globalEventBus);
  const ProfilePage = new ProfilePageController(router, globalEventBus);
  const SalesmanPage = new SalesmanPageController(router, globalEventBus);
  const NewAdPage = new NewAdPageController(router, globalEventBus);
  const AdvertPage = new AdvertPageController(router, globalEventBus);

  router.setRoute('^\/$', MainPage.view.render);
  router.setRoute('^\/logout$', MainPage.view.render);
  router.setRoute('^\/profile$', ProfilePage.view.renderAds);
  router.setRoute('^\/profile\/archive$', ProfilePage.view.renderArchive);
  router.setRoute('^\/profile\/favorite$', ProfilePage.view.renderFavorite);
  router.setRoute('^\/profile\/settings$', ProfilePage.view.renderSettings);
  router.setRoute('^\/profile\/cart$', ProfilePage.view.renderCart);
  router.setRoute('^\/newAd$', NewAdPage.view.render);
  router.setRoute('^\/ad\/(?<advertID>\\d+)$', AdvertPage.view.render);
  router.setRoute('^\/ad\/(?<advertID>\\d+)\/edit$', NewAdPage.view.edit);
  router.setRoute('^\/salesman\/(?<salesmanID>\\d+)$', SalesmanPage.view.render);

  router.go(window.location.pathname);
  if (navigator.onLine !== true) {
    console.log('offline');
    setTimeout(()=> {
      root.innerHTML = eggTemplate();
      egg();
    }, 1000);
  }
});
