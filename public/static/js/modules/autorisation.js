import { Ajax } from './ajax.js';
import { validationErrors, secureDomainUrl, statusCodes } from '../constatns.js';
import { createHeader } from '../content/templates/header/header.js';

/**
 * фунцкия авторизации
 * @param {HTMLFormElement} logEmail инпут логина
 * @param {HTMLFormElement} logPassword инпут пароля
 */
export function autorisation(logEmail, logPassword) {
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
      createHeader();
      document.querySelector('.blackout').click();
      return;
    }
    switch (code) {
      case statusCodes.NOTEXIST: {
        logEmail.classList.add('text-input_wrong');
        break;
      }
      case statusCodes.BADREQUEST: {
        logEmail.classList.add('text-input_wrong');
        break;
      }
      case statusCodes.UNATHORISED: {
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
