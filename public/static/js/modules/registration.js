import {Ajax} from './ajax.js';
import {secureDomainUrl, statusCodes} from '../constatns.js';
import {clearInput} from './clearInput.js';
import {createHeader} from '../templates/header/header.js';
import {validateInfo} from './validation.js';
/**
 * функция регистрация нового пользователя
 * @param {HTMLFormElement} regName имя пользователя
 * @param {HTMLFormElement} regSurname фамилия пользователя
 * @param {HTMLFormElement} regEmail почта пользователя для регистрации
 * @param {HTMLFormElement} regPass пароль пользователя
 * @param {HTMLFormElement} regPassRep форма повторного ввода пароля
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
  const response = Ajax.asyncPostUsingFetch({
    url: secureDomainUrl + 'signup',
    body: {email, password, name, surname},
  });

  response.then(({status, parsedBody}) => {
    if (status != statusCodes.OK) {
      return;
    }
    const {code} = parsedBody;
    if (code === statusCodes.REGDONE) {
      createHeader(globalEventBus);
      clearAllRegInputs(regName, regSurname, regEmail, regPass, regPassRep);
      document.querySelector('.blackout').click();
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
