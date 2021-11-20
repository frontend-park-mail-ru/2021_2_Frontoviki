import {secureDomainUrl, statusCodes} from '../constatns';
import {Ajax} from './ajax';
import {logout} from './logout';
import {createHeader} from '../templates/header/header';
import Bus from './EventBus';

/**
 * функция отправки запроса на сервер, чтобы проверить
 * вошел ли пользователь в аккаунт
 * @param {*} globalEventBus глобальный эмиттер событий
 * @return {Promise} ответ с сервера
 */
export async function isLogged(globalEventBus: Bus) {
  const wrapper = document.querySelector('.wrapper');
  let header = document.querySelector('#header');

  if (header != null) {
    header.innerHTML = '';
  } else {
    header = document.createElement('header');
  }
  const headerT = createHeader();
  header.id = 'header';
  wrapper?.prepend(header);
  header.innerHTML = headerT({
    userName: undefined,
    userAvatar: undefined,
  });
  const res = await Ajax.getUsingFetch({
    url: secureDomainUrl + 'users/profile',
    body: null,
  });
  const {status, parsedBody} = await res;
  if (status != statusCodes.OK) {
    return;
  }
  let isAuthorized = false;
  const {code, body} = parsedBody;
  if (code === statusCodes.OK) {
    isAuthorized = true;
  }
  if (isAuthorized) {
    const rating = body.rating.avg;
    let {name, surname, email, image, id, phone} = body.profile;
    if (image == null) {
      image = '/static/img/default_image.jpg';
    }
    localStorage.setItem('id', id);
    localStorage.setItem('name', name);
    localStorage.setItem('surname', surname);
    localStorage.setItem('email', email);
    localStorage.setItem('image', '/' + image);
    localStorage.setItem('rating', rating);
    localStorage.setItem('phone', phone);
    header.innerHTML = headerT({userName: name, userAvatar: '/' + image});
    const authLink = document.getElementById('auth');
    if (authLink != null) {
      authLink.style.display = 'none';
    }
    const expand = document.querySelector('.expand-menu__label') as HTMLElement;
    expand.style.display = 'flex';
    const links = document.querySelector('.expand-menu__content')?.childNodes;
    document.querySelector('.new-advert-capture-container')?.
        addEventListener('click', LoggedNewAd);
    if (links != undefined) {
      links.forEach((elem) => {
        elem.addEventListener('click', ()=>{
          globalEventBus.emit('profileLinksClick');
        });
      }); 
    }
  } else {
    header.innerHTML = headerT({
      userName: undefined,
      userAvatar: undefined,
    });
    const expand = document.querySelector('.expand-menu__label') as HTMLElement;
    expand.style.display = 'none';
    const expandMenu = document.querySelector('.expand-menu') as HTMLElement;
    expandMenu.style.display = 'none';
    const auth = document.getElementById('auth');
    if (auth != null) {
      auth.style.display = 'flex';
    }
    localStorage.removeItem('id');
    localStorage.removeItem('name');
    localStorage.removeItem('surname');
    localStorage.removeItem('email');
    localStorage.removeItem('image');
    localStorage.removeItem('rating');
    localStorage.removeItem('phone');
    document.querySelector('.new-advert-capture-container')?.
        addEventListener('click', notLoggedNewAd);
  }
  const authLink = document.getElementById('auth');
  authLink?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    globalEventBus.emit('clickModal');
  });
  const logoutHref = document.getElementById('logout');
  logoutHref?.addEventListener('click', (e) => {
    const togle = document.getElementById('mini-profile__toogle') as HTMLInputElement;
    togle.checked = false;
    logout(globalEventBus);
    isLogged(globalEventBus);
  });
  const searchBtn = document.querySelector('.search__button');
  searchBtn?.addEventListener('click', () => {
    globalEventBus.emit('onSearchClicked');
  });
  const searchInput = document.querySelector('.search__input');
  searchInput?.addEventListener('keydown', (e): void=>{
    const event = e as KeyboardEvent;
    if (event.key === 'Enter') {
      globalEventBus.emit('onSearchClicked');
    }
  });
  const mobileSearch =
    document.querySelector('.header__left-block__mobile-search-bar') as HTMLElement;
  mobileSearch.addEventListener('submit', (e)=>{
    e.preventDefault();
    e.stopPropagation();
    mobileSearch.style.zIndex = '3';
    globalEventBus.emit('onMobileSeachClicked');
  });
  document.addEventListener('click', (e)=> {
    e.stopPropagation();
    const mobileSearchInput =
    document.querySelector('.header__left-block__mobile-search-bar__input');
    if (e.target == mobileSearchInput) {
      mobileSearch.style.zIndex = '3';
    } else {
      mobileSearch.style.zIndex = '1';
    }
  });

  /**
   * Хотим добавить объявления когда не зарегистрированы
   */
  function notLoggedNewAd() {
    globalEventBus.emit('clickModal');
  }

  /**
   * Хотим добавить объявления когда зарегистрированы
   */
  function LoggedNewAd() {
    globalEventBus.emit('goToNewAd');
  }
}
