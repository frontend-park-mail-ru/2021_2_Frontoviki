'use strict';
import {ProfilePage} from './content/pages/profilePage.js';
import {modalWork} from './modules/modalWork.js';
import {ErrorPage} from './content/pages/404Page.js';
import {createFooter} from './content/templates/footer/footer.js';
import {MainPage} from './content/pages/mainPage.js';
import {navigation, categories} from './constatns.js';

const wrapper = document.querySelector('.wrapper');
const root = document.createElement('div');
root.id = 'root';
root.classList.add('content');

modalWork();
wrapper.appendChild(root);
createFooter();

main();

/**
 * Функция генерации основного окна
 */
export function main() {
  const res = Ajax.asyncGetUsingFetch({url: 'http://89.19.190.83:5001', body: null});
  res.then(({status, parsedBody})=> {
    console.log(parsedBody);
    const {code} = parsedBody;
    if (code === 200) {
      const mainPg = new MainPage(root);
      const {body} = parsedBody;
      const {advts} = body;
      mainPg.render(navigation, categories, advts);
    }
  });
}
/**
 * Функция создания профиля
 */
function profile() {
  const res = Ajax.asyncGetUsingFetch({url: 'http://89.19.190.83:5001/users/profile', body: null});
  res.then(({status, parsedBody})=> {
    let isAuthorized = false;

    if (status === 200) {
      isAuthorized = true;
    }
    if (isAuthorized) {
      const profile = new ProfilePage(root);
      const {name, profilePic, rating, ads} = parsedBody;
      profile.render(name, rating, profilePic, ads);
    }
  });
}

/**
 * Функция выхода из авторизации
*/
function logout() {
  const res = Ajax.asyncPostUsingFetch({url: 'http://89.19.190.83:5001/logout', body: null});
  res.then(()=> {
    modalWork();
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

  if (target instanceof HTMLAnchorElement ||
      target instanceof HTMLImageElement) {
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
};
