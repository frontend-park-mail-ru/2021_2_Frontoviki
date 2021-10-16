import {Ajax} from './ajax.js';
import {secureDomainUrl, statusCodes} from '../constatns.js';
import {clearInput} from './clearInput.js';
import {createHeader} from '../templates/header/header.js';

/**
 * фунцкия авторизации
 * @param {HTMLFormElement} logEmail инпут логина
 * @param {HTMLFormElement} logPassword инпут пароля
 */
export function autorisation(logEmail, logPassword, globalEventBus) {
  const email = logEmail.childNodes[3].value.trim();
  const password = logPassword.childNodes[3].value.trim();

  const response = Ajax.asyncPostUsingFetch({
    url: secureDomainUrl + 'signin',
    body: {email, password},
  });

  response.then(({status, parsedBody}) => {
    if (status != statusCodes.OK) {
      return;
    }
    const {code} = parsedBody;
    if (code === statusCodes.OK) {
      // в случае если мы зашли убрать модальное и обновить хедер
      createHeader(globalEventBus);
      clearAllLogInputs(logEmail, logPassword);
      document.querySelector('.blackout').click();
      return;
    }
    switch (code) {
      case statusCodes.NOTEXIST: {
        logEmail.classList.add('text-input_wrong');
        break;
      }
      case statusCodes.BADREQUEST: {
        logEmail.classList.remove('text-input_wrong');
        logEmail.classList.add('text-input_correct');
        logPassword.classList.add('text-input_wrong');
        break;
      }
      case statusCodes.UNATHORISED: {
        logEmail.classList.remove('text-input_wrong');
        logEmail.classList.add('text-input_correct');
        logPassword.classList.add('text-input_wrong');
        break;
      }
      default: {
        logPassword.classList.add('text-input_wrong');
        break;
      };
    }
  });
}

/**
 * очищает инпуты формы логина
 * @param {HTMLDivElement} logEmail
 * @param {HTMLDivElement} logPassword
 */
function clearAllLogInputs(logEmail, logPassword) {
  clearInput(logEmail);
  clearInput(logPassword);
}
