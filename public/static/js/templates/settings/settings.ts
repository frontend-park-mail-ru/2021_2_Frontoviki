import { userInfo } from '../../constatns';
import { templateFunc } from '../../types';
import settingsT from './settings.handlebars';
import './settings.sass';
/**
 * Создание настроек из шаблона
 * @return {HTMLDivElement} правый блок с настройками
 */
export function settings() : HTMLDivElement {
  const settings = document.createElement('div');
  let phone = <string> userInfo.get('phone');
  if (phone == '') {
    phone = '+7';
  } else {
    if (phone != null) {
      phone = '+' + phone[0] + '(' + phone.slice(1, 4) + ')' + phone.slice(4, 7) +
      '-' + phone.slice(7, 9) + '-' + phone.slice(9, 11);
    }
  }
  settings.innerHTML = (<templateFunc>settingsT)({
    Settings: window.localizer.getLocaleItem('settings'),
    avatarUpload: window.localizer.getLocaleItem('avatarUpload'),
    changePassword: window.localizer.getLocaleItem('changePassword'),
    oldPassword: window.localizer.getLocaleItem('oldPassword'),
    incorrectPassword: window.localizer.getLocaleItem('incorrectPassword'),
    newPassword: window.localizer.getLocaleItem('newPassword'),
    newPasswordHint: window.localizer.getLocaleItem('newPasswordHint'),
    changePasswordBtn: window.localizer.getLocaleItem('changePasswordBtn'),
    personalInfo: window.localizer.getLocaleItem('personalInfo'),
    name: window.localizer.getLocaleItem('name'),
    nameSettingsHint: window.localizer.getLocaleItem('nameSettingsHint'),
    surname: window.localizer.getLocaleItem('surname'),
    surnameSettingsHint: window.localizer.getLocaleItem('surnameSettingsHint'),
    fullEmail: window.localizer.getLocaleItem('fullEmail'),
    mobilePhone: window.localizer.getLocaleItem('mobilePhone'),
    mobilePhoneHint: window.localizer.getLocaleItem('mobilePhoneHint'),
    changeInfo: window.localizer.getLocaleItem('changeInfo'),
    userName: <string>userInfo.get('name'),
    userSurname: <string>userInfo.get('surname'),
    userEmail: <string>userInfo.get('email'),
    userPhone: phone,
  });
  return settings;
}
