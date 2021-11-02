import {isLogged} from '../../modules/isLogged.js';
import {logout} from '../../modules/logout.js';
import {statusCodes} from '../../constatns.js';
import headerT from './header.handlebars';
import './header.css';
/**
  * Создает хедер страницы, при этом происходит
  * запрос на сервер, чтобы узнать, авторизован ли
  * пользователь. В зависимости от этого рисуется
  * разные виды хедера
  * @param {*} globalEventBus глобальный эмиттер событий
*/
export async function createHeader(globalEventBus) {
  const wrapper = document.querySelector('.wrapper');
  let header = document.querySelector('#header');

  if (header != null) {
    header.innerHTML = '';
  } else {
    header = document.createElement('header');
  }

  header.id = 'header';
  wrapper.prepend(header);
  header.innerHTML = headerT({
    userName: undefined,
    userAvatar: undefined,
  });
  const {status, parsedBody} = await isLogged();
    if (status != statusCodes.OK) {
      return;
    }
    let isAuthorized = false;
    const {code, body} = parsedBody;
    if (code === statusCodes.OK) {
      isAuthorized = true;
    }
    if (isAuthorized) {
      let {name, surname, email, image, id, rating} = body.profile;
      if (image == null) {
        image = '/static/img/default_image.jpg';
      }
      localStorage.setItem('id', id);
      localStorage.setItem('name', name);
      localStorage.setItem('surname', surname);
      localStorage.setItem('email', email);
      localStorage.setItem('image', '/' + image);
      localStorage.setItem('rating', rating);
      console.log('header done');
      header.innerHTML = headerT({userName: name, userAvatar: '/' + image});
      const authLink = document.getElementById('auth');
      authLink.style.display = 'none';
      document.querySelector('.expand-menu__label').style.display = 'flex';
    } else {
      header.innerHTML = headerT({
        userName: undefined,
        userAvatar: undefined,
      });
      document.querySelector('.expand-menu__label').style.display = 'none';
      document.querySelector('.expand-menu').style.display = 'none';
      document.getElementById('auth').style.display = 'flex';
      localStorage.removeItem('id');
      localStorage.removeItem('name');
      localStorage.removeItem('surname');
      localStorage.removeItem('email');
      localStorage.removeItem('image');
      localStorage.removeItem('rating');
    }
    const title = document.querySelector('.logo__capture');
    title.dataset.section = 'menu';
    const authLink = document.getElementById('auth');
    authLink.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      globalEventBus.emit('clickModal');
    });
    const logoutHref = document.getElementById('logout');
    logoutHref.addEventListener('click', (e) => {
      document.getElementById('mini-profile__toogle').checked = false;
      logout(globalEventBus);
      createHeader(globalEventBus);
    });
}

