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
  const headerTemplate = Handlebars.templates.header;
  header.innerHTML = headerTemplate({userName: 'Василий', userAvatar: 'https://i.pinimg.com/236x/e3/31/57/e33157ea21bd33ddea822beb78f6df16.jpg'});

  // res.then(({status, parsedBody}) => {
  //   if (status != statusCodes.OK) {
  //     return;
  //   }
  //   let isAuthorized = false;
  //   const {code} = parsedBody;
  //   if (code === statusCodes.OK) {
  //     isAuthorized = true;
  //   }
  //   if (isAuthorized) {
  //     el3.style.display = 'none';
  //     const {profilePic} = parsedBody;
  //     img.src = 'static/img/default_image.jpg';
  //     if (profilePic != null) {
  //       img.src = profilePic;
  //     }
  //   } else {
  //     profile.style.display = 'none';
  //   }
  // });
  wrapper.prepend(header);
}
