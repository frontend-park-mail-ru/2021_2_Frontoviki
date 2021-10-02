import {Ajax} from './ajax.js';
import {validationErrors, secureDomainUrl, statusCodes} from '../constatns.js';
import {createHeader} from '../content/header.js';

/**
 * фунцкия авторизации
 * @param {HTMLFormElement} logForm кнопка отправки формы
 * @param {HTMLFormElement} logEmail инпут логина
 * @param {HTMLFormElement} logPassword инпут пароля
 * @param {HTMLDivElement} validateField div куда приходит информация об ошибках
 */
export function autorisation(logForm, logEmail, logPassword, validateField) {
  logForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = logEmail.value.trim();
    const password = logPassword.value.trim();
    const response = Ajax.asyncPostUsingFetch({
      url: secureDomainUrl + 'signin',
      body: {email, password}});

    response.then(({status, parsedBody}) => {
      if (status != statusCodes.OK) {
        return;
      }
      const {code} = parsedBody;
      if (code === statusCodes.OK) {
        // в случае если мы зашли убрать модальное и обновить хедер
        createHeader();
        document.querySelector('.blackout').click();
        return;
      }
      console.log(parsedBody);
      switch (code) {
        case statusCodes.NOTEXIST: {
          validateField.innerHTML = validationErrors.noSuchUser;
          break;
        }
        case statusCodes.BADREQUEST: {
          validateField.innerHTML = validationErrors.badData;
          break;
        }
        case statusCodes.UNTHORISED: {
          validateField.innerHTML = validationErrors.passwordMissmatch;
          break;
        }
        default: {
          validateField.innerHTML = 'Непредвиденная ошибка';
          break;
        };
      }
      logPassword.className = 'invalid';
    });
  });
}
