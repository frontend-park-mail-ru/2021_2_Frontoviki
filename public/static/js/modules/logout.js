import {Ajax} from './ajax.js';
import {createHeader} from '../templates/header/header.js';
import {secureDomainUrl, statusCodes} from '../constatns.js';

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
    createHeader(globalEventBus);
  });
}
