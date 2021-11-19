import {Ajax} from './ajax.js';
import {secureDomainUrl, statusCodes} from '../constatns.js';
import {isLogged} from './isLogged.js';

/**
 * Функция выхода из авторизации
 * @param {*} globalEventBus глобальный эммитер событий
*/
export function logout(globalEventBus) {
  const res = Ajax.postUsingFetch({
    url: secureDomainUrl + 'logout',
    body: null,
  });
  res.then(({status})=> {
    if (status != statusCodes.OK) {
      return;
    }
    globalEventBus.emit('logout');
    isLogged(globalEventBus);
  });
}
