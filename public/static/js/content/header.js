import {createModal} from './modal.js';

/**
  * Создает хедер страницы, при этом происходит
  * запрос на сервер, чтобы узнать, авторизован ли
  * пользователь. В зависимости от этого рисуется
  * разные виды хедера
*/
export function createHeader() {
  // отправляем запрос до начала отрисовки
  const res = Ajax.asyncGetUsingFetch({
    url: 'http://89.19.190.83:5001/users/profile',
    body: null,
  });
  const wrapper = document.querySelector('.wrapper');
  let header = document.querySelector('#header');

  if (header != null) {
    header.innerHTML = '';
  } else {
    header = document.createElement('header');
  }

  header.id = 'header';
  const nav = document.createElement('nav');
  nav.classList.add('nav_menu');

  const subnav = document.createElement('ul');
  subnav.classList.add('sub_nav_menu');

  const el1 = document.createElement('li');
  el1.classList.add('main_elements');
  const brand = document.createElement('a');
  brand.href = '';
  brand.innerHTML = 'Volchock';
  brand.dataset.section = 'menu';
  el1.appendChild(brand);
  subnav.appendChild(el1);

  const el2 = document.createElement('li');
  el2.classList.add('main_elements');
  const newAd = document.createElement('a');
  newAd.dataset.section = 'error';
  newAd.innerHTML = 'Создать объявление';
  el2.appendChild(newAd);
  subnav.appendChild(el2);

  const profile = document.createElement('li');
  profile.classList.add('dropdown');
  profile.classList.add('dropdown-9');
  profile.innerHTML = 'Профиль';

  const menu = document.createElement('ul');
  menu.classList.add('dropdown_menu');
  menu.classList.add('dropdown_menu--animated');
  menu.classList.add('dropdown_menu-9');

  const content = document.createElement('li');
  content.classList.add('dropdown_item');

  console.log('profile created');
  const imgref = document.createElement('a');

  const img = document.createElement('img');
  img.dataset.section = 'profile';
  imgref.appendChild(img);
  content.appendChild(imgref);

  const logout = document.createElement('li');
  logout.classList.add('logout_item');

  const logoutBtn = document.createElement('a');
  logoutBtn.dataset.section = 'logout';
  logoutBtn.innerHTML = 'Выход';

  logout.appendChild(logoutBtn);

  menu.appendChild(content);
  menu.appendChild(logout);
  profile.appendChild(menu);
  subnav.appendChild(profile);

  const el3 = document.createElement('li');
  el3.classList.add('main_elements');
  console.log('login created');
  const login = document.createElement('a');
  login.id = 'auth';
  login.href = '';
  login.innerHTML = 'Войти';
  el3.appendChild(login);
  subnav.appendChild(el3);
  res.then(({status, parsedBody}) => {
    let isAuthorized = false;

    if (status === 200) {
      isAuthorized = true;
    }
    if (isAuthorized) {
      el3.style.display = 'none';
      const {profilePic} = parsedBody;
      img.src = 'public/static/img/default_image.jpg';
      if (profilePic != null) {
        img.src = profilePic;
      }
    } else {
      profile.style.display = 'none';
    }
  });
  nav.appendChild(subnav);
  header.appendChild(nav);
  wrapper.prepend(header);
  createModal();
}
