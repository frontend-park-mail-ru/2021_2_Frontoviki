'use strict';
import {ProfilePage} from './content/pages/profilePage.js';
import {ErrorPage} from './content/pages/404Page.js';
import {createFooter} from './content/templates/footer/footer.js';
import {MainPage} from './content/pages/mainPage.js';
import {navigation, secureDomainUrl,
  statusCodes} from './constatns.js';
import {Ajax} from './modules/ajax.js';
import {createHeader} from './content/templates/header/header.js';
import {createModal} from './content/templates/modal/modal.js';

const wrapper = document.querySelector('.wrapper');
const root = document.createElement('div');
root.id = 'root';
root.classList.add('content');


createHeader();
createModal();
wrapper.appendChild(root);
createFooter();

main();

/**
 * Функция генерации основного окна
 */
export function main() {
  // const res = Ajax.asyncGetUsingFetch({
  //   url: secureDomainUrl + 'adverts', body: null,
  // });
  // res.then(({status, parsedBody})=> {
  //   if (status != statusCodes.OK) {
  //     return;
  //   }
  //   console.log(parsedBody);
  //   const {code} = parsedBody;
  //   if (code === statusCodes.OK) {
  //     const mainPg = new MainPage(root);
  //     const {body} = parsedBody;
  //     const {advert} = body;
  //     mainPg.render(navigation, advert);
  //   }
  // });
  const ad = {
    href: '#',
    image: 'https://volchock.ru/static/img/2spooky4me.jpg',
    name: 'Картина A',
    location: 'Moscow',
    price: 100,
  };
  const advert = [
    ad,
    ad,
  ];
  const mainPg = new MainPage(root);
  mainPg.render(undefined, navigation, advert);
}
/**
 * Функция создания профиля
 */
function profile() {
  const res = Ajax.asyncGetUsingFetch({
    url: secureDomainUrl + 'users/profile',
    body: null,
  });
  res.then(({status, parsedBody})=> {
    if (status != statusCodes.OK) {
      return;
    }
    const {code} = parsedBody;
    let isAuthorized = false;
    if (code === statusCodes.OK) {
      isAuthorized = true;
    }
    if (isAuthorized) {
      const profilepg = new ProfilePage(root);
      const {body} = parsedBody;
      const {profile} = body;
      const {email, profilePic, rating, ads} = profile;
      profilepg.render(email, rating, profilePic, ads);
    }
  });
}

/**
 * Функция выхода из авторизации
*/
function logout() {
  const res = Ajax.asyncPostUsingFetch({
    url: secureDomainUrl + 'logout',
    body: null,
  });
  res.then(({status})=> {
    if (status != statusCodes.OK) {
      return;
    }
    createHeader();
    main();
  });
}

/**
 * Геренация страницы с ошибкой
 */
function err() {
  const err = new ErrorPage(root);
  err.render();
}

// этот код нужен чтобы привязывать переход по ссылкам к функциям отрисовки
// но пока из за него много ошибок в консоли
wrapper.addEventListener('click', (e) => {
  const {target} = e;

  if (target instanceof HTMLAnchorElement) {
    e.preventDefault();
    configApp[target.dataset.section].open();
  }
});

const configApp = {
  menu: {
    href: '/',
    name: 'Меню',
    open: main,
  },
  profile: {
    href: '/profile',
    name: 'Профиль',
    open: profile,
  },
  logout: {
    href: '/logout',
    name: 'Выйти',
    open: logout,
  },
  error: {
    href: '/404',
    name: 'Ошибка',
    open: err,
  },
  modal: {
    href: '#',
    name: 'Войти',
    open: modal,
  },
  crutch: {
    href: '#',
    name: 'Костыль',
    open: () => {},
  },
};

/**
 * Костыль для кнопки войти чтобы в консоли не было ошибки
 */
function modal() {
  const modal = document.querySelector('.modal-window');
  const blackout = document.querySelector('.blackout');
  modal.classList.add('active');
  blackout.classList.add('active');
};
