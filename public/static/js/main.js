'use strict';
import {ProfilePage} from './content/profilePage.js';
import {modalWork} from './modules/modal.js';
import {ErrorPage} from './content/404Page.js';
import {createFooter} from './content/footer.js';
import {MainPage} from './content/mainPage.js';

const wrapper = document.querySelector('.wrapper');
const root = document.createElement('div');
root.id = 'root';
root.classList.add('content');

modalWork();
wrapper.appendChild(root);
createFooter();

const ad = {
  href: '',
  src: './static/img/2spooky4me.jpg',
  name: 'Картина',
  productPrice: '100$',
  location: 'Москва',
};

const ad1 = {
  href: '',
  src: './static/img/shpicz.jpg',
  name: 'Кек',
  productPrice: '100500$',
  location: 'Ракетный завод',
};


main();

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

/**
 * Функция генерации основного окна
 */
function main() {
  const mainPg = new MainPage(root);
  mainPg.render('Новое', 'Картины',
      ['мышка', 'клавиатура', 'монитор'], ad, ad1, ad, ad, ad1);
}
/**
 * Функция создания профиля
 */
function profile() {
  const res = Ajax.asyncGetUsingFetch({url: '/me', body: null});
  res.then(({status, parsedBody})=> {
    console.log(status instanceof Number, parsedBody);
    let isAuthorized = false;

    if (status === 200) {
      isAuthorized = true;
      console.log('kek?');
    }
    if (isAuthorized) {
      console.log('kek?');
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
  const res = Ajax.asyncGetUsingFetch({url: '/logout', body: null});
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
