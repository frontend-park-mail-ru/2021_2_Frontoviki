import {Ajax} from './ajax.js';
import {secureDomainUrl, statusCodes, regExPatterns} from '../constatns.js';
import {clearInput} from './clearInput.js';
import {isLogged} from './isLogged.js';

/**
 * фунцкия авторизации
 * @param {HTMLFormElement} logEmail инпут логина
 * @param {HTMLFormElement} logPassword инпут пароля
 * @param {*} globalEventBus глобальный эмиттер событий
 */
export function autorisation(logEmail, logPassword, globalEventBus) {
  const email = logEmail.childNodes[3].value.trim();
  const password = logPassword.childNodes[3].value.trim();

  const valid = validate(logEmail.childNodes[3], regExPatterns['email']) &&
      validate(logPassword.childNodes[3], regExPatterns['password']);

  if (!valid) {
    return;
  }

  const response = Ajax.postUsingFetch({
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
      isLogged(globalEventBus);
      clearAllLogInputs(logEmail, logPassword);
      document.querySelector('.blackout').click();
      globalEventBus.emit('loggedForCart');
      globalEventBus.emit('loggedForSalesman');
      globalEventBus.emit('loggedForFav');
      return;
    }
    switch (code) {
      case statusCodes.NOTEXIST: {
        logEmail.classList.remove('text-input_correct');
        logEmail.classList.add('text-input_wrong');
        break;
      }
      case statusCodes.BADREQUEST: {
        logEmail.classList.remove('text-input_wrong');
        logEmail.classList.add('text-input_correct');

        logPassword.classList.remove('text-input_correct');
        logPassword.classList.add('text-input_wrong');
        break;
      }
      case statusCodes.UNATHORISED: {
        logEmail.classList.remove('text-input_wrong');
        logEmail.classList.add('text-input_correct');

        logPassword.classList.remove('text-input_correct');
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


const validate = (field, regex) => {
  const valid = regex.test(field.value);
  if (valid) {
    field.parentNode.classList.remove('text-input_wrong');
    field.parentNode.classList.add('text-input_correct');
  } else {
    field.parentNode.classList.add('text-input_wrong');
  }
  return valid;
};
