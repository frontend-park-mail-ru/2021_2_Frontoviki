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
import Localizer from './modules/localizer';
import { LangButtonLogic } from './templates/header/header';


document.addEventListener('DOMContentLoaded', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', {scope: '/'})
        .then((registration) => {
          console.log('sw registration on scope:', registration.scope);
        })
        .catch((err) => {
          console.error(err);
    });
  }
  
  const myLocalizer = new Localizer();
  window.localizer = myLocalizer;

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
  isLogged(globalEventBus).then(()=> {
    createModal(globalEventBus);
    wrapper.appendChild(root);
    LangButtonLogic(router);
    createFooter();

    const MainPage = new MainPageController(router, globalEventBus);
    const ProfilePage = new ProfilePageController(router, globalEventBus);
    const SalesmanPage = new SalesmanPageController(router, globalEventBus);
    const NewAdPage = new NewAdPageController(router, globalEventBus);
    const AdvertPage = new AdvertPageController(router, globalEventBus);

    router.setRoute('^/$', MainPage.view.render.bind(MainPage.view));
    router.setRoute('^/search/', MainPage.view.search.bind(MainPage.view));
    router.setRoute('^/category/', MainPage.view.category.bind(MainPage.view));
    router.setRoute('^/logout$', MainPage.view.render.bind(MainPage.view));
    router.setRoute('^/profile$', ProfilePage.view.renderAds.bind(ProfilePage.view));
    router.setRoute('^/profile/archive$', ProfilePage.view.renderArchive.bind(ProfilePage.view));
    router.setRoute('^/profile/favorite$', ProfilePage.view.renderFavorite.bind(ProfilePage.view));
    router.setRoute('^/profile/settings$', ProfilePage.view.renderSettings.bind(ProfilePage.view));
    router.setRoute('^/profile/cart$', ProfilePage.view.renderCart.bind(ProfilePage.view));
    router.setRoute('^/profile/chat$', ProfilePage.view.renderChat.bind(ProfilePage.view));
    router.setRoute('^/profile/chat/(?<toID>\\d+)/(?<advertID>\\d+)', ProfilePage.view.renderChatMessage.bind(ProfilePage.view));
    router.setRoute('^/newAd$', NewAdPage.view.render.bind(NewAdPage.view));
    router.setRoute('^/ad/(?<advertID>\\d+)$', AdvertPage.view.render.bind(AdvertPage.view));
    router.setRoute('^/ad/(?<advertID>\\d+)/edit$', NewAdPage.view.edit.bind(NewAdPage.view));
    router.setRoute('^/salesman/(?<salesmanID>\\d+)$', SalesmanPage.view.render.bind(SalesmanPage.view));

    router.go(window.location.pathname);
    if (navigator.onLine !== true) {
      setTimeout(()=> {
        root.innerHTML = eggTemplate();
        egg();
      }, 1000);
    }
    }).catch((err)=> {
      root.innerHTML='Ошибка связи с сервером';
      console.log(err);
    });
});
