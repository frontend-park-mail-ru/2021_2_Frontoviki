import {secureDomainUrl} from '../constatns.js';
import {Ajax} from './ajax.js';

/**
 * функция отправки запроса на сервер, чтобы проверить
 * вошел ли пользователь в аккаунт
 * @return {Promise} ответ с сервера
 */
export function isLogged() {
  const res = Ajax.getUsingFetch({
    url: secureDomainUrl + 'users/profile',
    body: null,
  });
  return res;
}
