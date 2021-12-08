import {secureDomainUrl, statusCodes, userInfo} from '../constatns';
import {Ajax} from './ajax';
import {logout} from './logout';
import {createHeader, LangButtonImg} from '../templates/header/header';
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
    find: window.localizer.getLocaleItem('find'),
    search: window.localizer.getLocaleItem('search'),
    newAd: window.localizer.getLocaleItem('newAd'),
    signIn: window.localizer.getLocaleItem('signIn'),
    profile: window.localizer.getLocaleItem('profile'),
    favorite: window.localizer.getLocaleItem('favorite'),
    settings: window.localizer.getLocaleItem('settings'),
    logout: window.localizer.getLocaleItem('logout'),
  });
  const res = await Ajax.getUsingFetch({
    url: secureDomainUrl + 'users/profile',
    body: null,
  });
  const {status, parsedBody} = res;
  if (status != statusCodes.OK) {
    return;
  }
  let isAuthorized = false;
  const {code, body} = parsedBody;
  if (code === statusCodes.OK) {
    isAuthorized = true;
  }
  if (isAuthorized) {
    const rating = body?.rating?.avg;
    const {name, surname, email, id, phone} = body?.profile;
    let {image} = body?.profile;
    if (image == null) {
      image = '/static/img/default_image.jpg';
    }
    userInfo.set('id', id);
    userInfo.set('name', name);
    userInfo.set('surname', surname);
    userInfo.set('email', email);
    userInfo.set('image', `/${image}`);
    userInfo.set('rating', rating);
    userInfo.set('phone', phone);
    header.innerHTML = headerT({
      userName: name,
      userAvatar: `/${image}`,
      format: '.' + image.split('__')[1],
      find: window.localizer.getLocaleItem('find'),
      search: window.localizer.getLocaleItem('search'),
      newAd: window.localizer.getLocaleItem('newAd'),
      signIn: window.localizer.getLocaleItem('signIn'),
      profile: window.localizer.getLocaleItem('profile'),
      favorite: window.localizer.getLocaleItem('favorite'),
      settings: window.localizer.getLocaleItem('settings'),
      logout: window.localizer.getLocaleItem('logout'),
    });
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
      find: window.localizer.getLocaleItem('find'),
      search: window.localizer.getLocaleItem('search'),
      newAd: window.localizer.getLocaleItem('newAd'),
      signIn: window.localizer.getLocaleItem('signIn'),
      profile: window.localizer.getLocaleItem('profile'),
      favorite: window.localizer.getLocaleItem('favorite'),
      settings: window.localizer.getLocaleItem('settings'),
      logout: window.localizer.getLocaleItem('logout'),
    });
    const expand = document.querySelector('.expand-menu__label') as HTMLElement;
    expand.style.display = 'none';
    const expandMenu = document.querySelector('.expand-menu') as HTMLElement;
    expandMenu.style.display = 'none';
    const auth = document.getElementById('auth');
    if (auth != null) {
      auth.style.display = 'flex';
    }
    userInfo.delete('id');
    userInfo.delete('name');
    userInfo.delete('surname');
    userInfo.delete('email');
    userInfo.delete('image');
    userInfo.delete('rating');
    userInfo.delete('phone');
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
  logoutHref?.addEventListener('click', () => {
    const togle = document.getElementById('mini-profile__toogle') as HTMLInputElement;
    togle.checked = false;
    logout(globalEventBus);
    isLogged(globalEventBus).catch(()=> console.log('Logged Error'));
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
    header.querySelector('.header__left-block__mobile-search-bar') as HTMLElement;
  mobileSearch.addEventListener('submit', (e)=>{
    e.preventDefault();
    e.stopPropagation();
    globalEventBus.emit('onMobileSeachClicked');
  });
  document.addEventListener('click', (e)=> {
    const mobileSearchInput =
    document.querySelector('.header__left-block__mobile-search-bar__input') as HTMLInputElement;

    const mobileSearchBtn = document.querySelector('.header__left-block__mobile-search-bar__button');
    if (e.target == mobileSearchInput || e.target == mobileSearchBtn) {
      mobileSearch.classList.add('mobile-search__active');
      mobileSearch.classList.remove('mobile-search__inactive');
    } else {
      mobileSearch.classList.remove('mobile-search__active');
      mobileSearch.classList.add('mobile-search__inactive');
      mobileSearchInput.value = '';
    }
  });
  LangButtonImg();

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
