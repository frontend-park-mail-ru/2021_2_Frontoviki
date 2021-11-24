import { userInfo } from '../../constatns';
import settingsT from './settings.handlebars';
import './settings.sass';
/**
 * Создание настроек из шаблона
 * @return {HTMLDivElement} правый блок с настройками
 */
export function settings() : HTMLDivElement {
  const settings = document.createElement('div');
  let phone = userInfo.get('phone');
  if (phone == '') {
    phone = '+7';
  } else {
    if (phone != null) {
      phone = '+' + phone[0] + '(' + phone.slice(1, 4) + ')' + phone.slice(4, 7) +
      '-' + phone.slice(7, 9) + '-' + phone.slice(9, 11);
    }
  }
  settings.innerHTML = settingsT({
    userName: userInfo.get('name'),
    userSurname: userInfo.get('surname'),
    userEmail: userInfo.get('email'),
    userPhone: phone,
  });
  return settings;
}
