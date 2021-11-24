'use strict';
import {createFooter} from './templates/footer/footer';
import {isLogged} from './modules/isLogged';
import {createModal} from './templates/modal/modal';
import Router from './modules/Router';
import EventBus from './modules/EventBus';
import MainPageController from './controllers/mainPageController';
import ProfilePageController from './controllers/profilePageController';
import SalesmanPageController from './controllers/salesmanPageController';
import NewAdPageController from './controllers/newAdController';
import AdvertPageController from './controllers/advertPageController';
import {egg, eggTemplate} from './templates/easterEgg/easterEgg';

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

  const wrapper = document.querySelector('.wrapper') as HTMLDivElement;
  const root = document.createElement('div');
  root.id = 'root';
  root.classList.add('content');

  const globalEventBus = new EventBus([
    'modalClick',
    'checkAutorisation',
    'logout',
    'loggedIn',
  ]);
  const router = new Router(wrapper);
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
  router.setRoute('^\/search/', MainPage.view.search);
  router.setRoute('^\/category/', MainPage.view.category);
  router.setRoute('^\/logout$', MainPage.view.render);
  router.setRoute('^\/profile$', ProfilePage.view.renderAds);
  router.setRoute('^\/profile\/archive$', ProfilePage.view.renderArchive);
  router.setRoute('^\/profile\/favorite$', ProfilePage.view.renderFavorite);
  router.setRoute('^\/profile\/settings$', ProfilePage.view.renderSettings);
  router.setRoute('^\/profile\/cart$', ProfilePage.view.renderCart);
  router.setRoute('^\/profile\/chat$', ProfilePage.view.renderChat);
  router.setRoute('^\/profile\/chat\/(?<toID>\\d+)\/(?<advertID>\\d+)', ProfilePage.view.renderChatMessage);
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
