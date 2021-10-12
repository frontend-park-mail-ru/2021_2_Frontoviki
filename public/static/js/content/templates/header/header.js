import {secureDomainUrl, statusCodes} from '../../../constatns.js';
import {Ajax} from '../../../modules/ajax.js';

/**
  * Создает хедер страницы, при этом происходит
  * запрос на сервер, чтобы узнать, авторизован ли
  * пользователь. В зависимости от этого рисуется
  * разные виды хедера
*/
export function createHeader() {
  // отправляем запрос до начала отрисовки на получение пользователя
  const res = Ajax.asyncGetUsingFetch({
    url: secureDomainUrl + 'users/profile',
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
  wrapper.prepend(header);
  const headerTemplate = Handlebars.templates.header;
  res.then(({status, parsedBody}) => {
    if (status != statusCodes.OK) {
      return;
    }
    let isAuthorized = false;
    const {code, body} = parsedBody;
    if (code === statusCodes.OK) {
      isAuthorized = true;
    }
    if (isAuthorized) {
      let {name, image} = body.profile;
      if (image != null) {
        image = 'static/img/default_image.jpg';
      }
      header.innerHTML = headerTemplate({userName: name, userAvatar: image});
      const authLink = document.getElementById('auth');
      authLink.style.display = 'none';
      document.querySelector('.expand-menu__label').style.display = 'flex';
    } else {
      header.innerHTML = headerTemplate({userName: undefined, userAvatar: undefined});
      document.querySelector('.expand-menu__label').style.display = 'none';
      document.getElementById('auth').style.display = 'flex';
    }
    const title = document.querySelector('.logo__capture');
    title.dataset.section = 'menu';
    const authLink = document.getElementById('auth');
    authLink.dataset.section = 'modal';
  });
}
