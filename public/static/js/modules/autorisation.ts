import {Ajax} from './ajax';
import {secureDomainUrl, statusCodes, regExPatterns} from '../constatns';
import {clearInput} from './clearInput';
import {isLogged} from './isLogged';
import {validate} from './utilsFunctions';
import Bus from './EventBus';


export function autorisation(logEmail : HTMLDivElement, logPassword : HTMLDivElement, globalEventBus:Bus) : void {
  const emailInput = logEmail.children[1] as HTMLInputElement;
  const passwordInput = logPassword.children[1] as HTMLInputElement;
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  const valid = validate(emailInput, regExPatterns['email']) &&
      validate(passwordInput, regExPatterns['password']);

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
      const black = document.querySelector('.blackout') as HTMLDivElement;
      black.click();
      globalEventBus.emit('loggedForCart');
      globalEventBus.emit('loggedForSalesman');
      globalEventBus.emit('loggedForFav');
      globalEventBus.emit('loggedForNewAd');
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
      }
    }
  });
}

/**
 * очищает инпуты формы логина
 */
function clearAllLogInputs(logEmail : HTMLDivElement, logPassword : HTMLDivElement) {
  clearInput(logEmail);
  clearInput(logPassword);
}

