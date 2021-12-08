import { templateFunc } from '../../types';
import headerT from './header.handlebars';
import './header.sass';
import './mobile-search.sass';
import './expand-menu.sass';
import './langButton.sass';
import Router from '../../modules/Router';

export function createHeader(): templateFunc {
  return <templateFunc>headerT;
}

export function LangButtonLogic(router: Router) {
  const img = (<HTMLImageElement>document.querySelector('.lang-box__img'));

  if (window.localizer.userLang == 'ru') {
    img.src = '/static/img/us.png';
  } else {
    img.src = '/static/img/ru.png';
  }

  document.querySelector('.lang-box')?.addEventListener('click', ()=> {
    if (window.localizer.userLang == 'ru') {
      window.localizer.userLang = 'en';
      img.src = '/static/img/ru.png';
    } else {
      window.localizer.userLang = 'ru';
      img.src = '/static/img/us.png';
    }
    router.go(window.location.pathname);
  });
}

export function LangButtonImg() {
  const img = (<HTMLImageElement>document.querySelector('.lang-box__img'));
  if (window.localizer.userLang == 'ru') {
    img.src = '/static/img/us.png';
  } else {
    img.src = '/static/img/ru.png';
  }
}