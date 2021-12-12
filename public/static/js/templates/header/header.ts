import { templateFunc } from '../../types';
import headerT from './header.handlebars';
import './header.sass';
import './mobile-search.sass';
import './expand-menu.sass';
import './langButton.sass';
import Router from '../../modules/Router';
import Bus from '../../modules/EventBus';
import { userInfo } from '../../constatns';

export function createHeader(): templateFunc {
  return <templateFunc>headerT;
}

export function LangButtonLogic(router: Router) {
  const img = (<HTMLImageElement>document.querySelector('.lang-box__img'));

  if (window.localizer.userLang == 'ru') {
    img.src = '/img/us.png';
  } else {
    img.src = '/img/ru.png';
  }

  document.querySelector('.lang-box')?.addEventListener('click', ()=> {
    if (window.localizer.userLang == 'ru') {
      window.localizer.userLang = 'en';
      img.src = '/img/ru.png';
    } else {
      window.localizer.userLang = 'ru';
      img.src = '/img/us.png';
    }

    const searchInput = document.querySelector('.search__input') as HTMLInputElement;
    if (searchInput != null)
      searchInput.placeholder = <string> window.localizer.getLocaleItem('search');
    const searchBtn = document.querySelector('.search__button') as HTMLInputElement;
    if (searchBtn != null)
      searchBtn.innerHTML = <string> window.localizer.getLocaleItem('find');
    const newAd = document.querySelector('.new-advert-capture') as HTMLInputElement;
    if (newAd != null)
      newAd.innerHTML = <string> window.localizer.getLocaleItem('newAd');
    const logo = document.querySelector('.logo__capture') as HTMLInputElement;
    if (logo != null)
      logo.innerHTML = <string> window.localizer.getLocaleItem('signIn');

    const links = document.querySelectorAll('.expand-menu__link');
    links.forEach((elem, i) => {
      switch (i) {
        case 0:
          elem.innerHTML = <string> window.localizer.getLocaleItem('profile');
          break;
        case 1:
          elem.innerHTML = <string> window.localizer.getLocaleItem('favorite');
          break;
        case 2:
          elem.innerHTML = <string> window.localizer.getLocaleItem('settings');
          break;
        case 3:
          elem.innerHTML = <string> window.localizer.getLocaleItem('logout');
          break;
      }
    })
    
    router.go(window.location.pathname);
  });
}

export function LangButtonImg() {
  const img = (<HTMLImageElement>document.querySelector('.lang-box__img'));
  if (window.localizer.userLang == 'ru') {
    img.src = '/img/us.png';
  } else {
    img.src = '/img/ru.png';
  }
}