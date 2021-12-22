import {Ajax} from './ajax';
import {secureDomainUrl, statusCodes} from '../constatns';
import {isLogged} from './isLogged';
import Bus from './EventBus';

/**
 * Функция выхода из авторизации
 * @param {*} globalEventBus глобальный эммитер событий
*/
export function logout(globalEventBus: Bus) {
  const res = Ajax.postUsingFetch({
    url: secureDomainUrl + 'logout',
    body: null,
  });
  res.then(({status})=> {
    if (status != statusCodes.OK) {
      return;
    }
    globalEventBus.emit('logout');
    globalEventBus.emit('disconnectSocket');
    isLogged(globalEventBus).catch(()=> console.error("Checking log error"));
  }).catch(()=> console.error('Logout error'));
}
