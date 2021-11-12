import {secureDomainUrl, statusCodes} from '../constatns.js';
import {Ajax} from './ajax.js';
import {logout} from './logout.js';
import {createHeader} from '../templates/header/header.js';

/**
 * функция отправки запроса на сервер, чтобы проверить
 * вошел ли пользователь в аккаунт
 * @param {*} globalEventBus глобальный эмиттер событий
 * @return {Promise} ответ с сервера
 */
export async function isLogged(globalEventBus) {
  const wrapper = document.querySelector('.wrapper');
  let header = document.querySelector('#header');

  if (header != null) {
    header.innerHTML = '';
  } else {
    header = document.createElement('header');
  }
  const headerT = createHeader();
  header.id = 'header';
  wrapper.prepend(header);
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
    authLink.style.display = 'none';
    document.querySelector('.expand-menu__label').style.display = 'flex';
    const links = document.querySelector('.expand-menu__content').childNodes;
    links.forEach((elem) => {
      elem.addEventListener('click', ()=>{
        globalEventBus.emit('profileLinksClick');
      });
    });
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
    localStorage.removeItem('phone');
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
    isLogged(globalEventBus);
  });
}
