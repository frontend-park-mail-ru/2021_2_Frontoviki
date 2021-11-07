import {Ajax} from './ajax.js';
import {secureDomainUrl, statusCodes} from '../constatns.js';
import {clearInput} from './clearInput.js';
import {validateInfo} from './validation.js';
import {isLogged} from './isLogged.js';
/**
 * функция регистрация нового пользователя
 * @param {HTMLFormElement} regName имя пользователя
 * @param {HTMLFormElement} regSurname фамилия пользователя
 * @param {HTMLFormElement} regEmail почта пользователя для регистрации
 * @param {HTMLFormElement} regPass пароль пользователя
 * @param {HTMLFormElement} regPassRep форма повторного ввода пароля
 * @param {*} globalEventBus глобальный эмитер событий
 * действие submit
 */
export function registration(regName, regSurname, regEmail,
    regPass, regPassRep, globalEventBus) {
  const trimmedData =
    validateInfo(regName, regSurname, regEmail, regPass, regPassRep);
  if (trimmedData === undefined) {
    return;
  }
  const {name, surname, email, password} = trimmedData;
  const response = Ajax.postUsingFetch({
    url: secureDomainUrl + 'signup',
    body: {email, password, name, surname},
  });

  response.then(({status, parsedBody}) => {
    if (status != statusCodes.OK) {
      return;
    }
    const {code} = parsedBody;
    if (code === statusCodes.REGDONE) {
      isLogged(globalEventBus);
      clearAllRegInputs(regName, regSurname, regEmail, regPass, regPassRep);
      document.querySelector('.blackout').click();
      globalEventBus.emit('loggedIn');
      return;
    }
    regEmail.childNodes[5].innerHTML = 'Такой пользователь уже существует';
    regEmail.classList.remove('text-input_correct');
    regEmail.classList.add('text-input_wrong');
  });
}

/**
 * очищает все input'ы регистрации в модальном окне
 * @param {HTMLDivElement} regName
 * @param {HTMLDivElement} regSurname
 * @param {HTMLDivElement} regEmail
 * @param {HTMLDivElement} regPass
 * @param {HTMLDivElement} regPassRep
 */
function clearAllRegInputs(regName, regSurname, regEmail, regPass, regPassRep) {
  clearInput(regName);
  clearInput(regEmail);
  clearInput(regSurname);
  clearInput(regPass);
  clearInput(regPassRep);
}
