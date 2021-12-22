import {Ajax} from './ajax';
import {oldPassNum, secureDomainUrl, statusCodes} from '../constatns';
import {clearInput} from './clearInput';
import {validateInfo} from './validation';
import {isLogged} from './isLogged';
import Bus from './EventBus';
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
export function registration(regName : HTMLDivElement, 
  regSurname: HTMLDivElement, regEmail : HTMLDivElement,
    regPass: HTMLDivElement, regPassRep : HTMLDivElement, globalEventBus : Bus) {
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
      isLogged(globalEventBus).catch(()=> console.error('Error checking for log'));
      clearAllRegInputs(regName, regSurname, regEmail, regPass, regPassRep);
      const black = document.querySelector('.blackout') as HTMLDivElement;
      black.click();
      globalEventBus.emit('loggedForCart');
      globalEventBus.emit('loggedForSalesman');
      globalEventBus.emit('loggedForFav');
      globalEventBus.emit('loggedForNewAd');
      return;
    }
    const passInput = regEmail.childNodes[oldPassNum] as HTMLInputElement;
    passInput.innerHTML = <string>window.localizer.getLocaleItem('userExist');
    regEmail.classList.remove('text-input_correct');
    regEmail.classList.add('text-input_wrong');
  }).catch(()=>console.error('Error registration'));
}

/**
 * очищает все input'ы регистрации в модальном окне
 * @param {HTMLDivElement} regName
 * @param {HTMLDivElement} regSurname
 * @param {HTMLDivElement} regEmail
 * @param {HTMLDivElement} regPass
 * @param {HTMLDivElement} regPassRep
 */
function clearAllRegInputs(regName : HTMLDivElement, 
  regSurname: HTMLDivElement, regEmail : HTMLDivElement,
    regPass: HTMLDivElement, regPassRep : HTMLDivElement) {
  clearInput(regName);
  clearInput(regEmail);
  clearInput(regSurname);
  clearInput(regPass);
  clearInput(regPassRep);
}
