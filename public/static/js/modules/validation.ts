import {inputNum, regExPatterns, oldPassNum, minValidationLen} from '../constatns';
import {validate} from './utilsFunctions';
/**
 * функция регистрация нового пользователя
 * @param {HTMLFormElement} regName имя пользователя
 * @param {HTMLFormElement} regSurname фамилия пользователя
 * @param {HTMLFormElement} regEmail почта пользователя для регистрации
 * @param {HTMLFormElement} regPass пароль пользователя
 * @param {HTMLFormElement} regPassRep форма повторного ввода пароля
 * @return {*} значения инпутов
 */
export function validateInfo(regName : HTMLDivElement, 
  regSurname: HTMLDivElement, regEmail : HTMLDivElement,
    regPass: HTMLDivElement, regPassRep : HTMLDivElement) {
  let isValid = true;
  const nameInput = regName.childNodes[inputNum] as HTMLInputElement;
  const name = nameInput.value.trim();

  const surnameInput = regSurname.childNodes[inputNum] as HTMLInputElement;
  const surname = surnameInput.value.trim();

  const emailInput = regEmail.childNodes[inputNum] as HTMLInputElement;
  const email = emailInput.value.trim();

  const passwordInput = regPass.childNodes[inputNum] as HTMLInputElement;
  const password = passwordInput.value.trim();

  const passwordRepInput = regPassRep.childNodes[inputNum] as HTMLInputElement;
  const passwordRep = passwordRepInput.value.trim();


  const validEmail = validate(emailInput, regExPatterns['email']);
  validate(passwordInput, regExPatterns['password']);

  if (!validEmail) {
    const emailLabel = regEmail.childNodes[oldPassNum] as HTMLElement;
    emailLabel.innerHTML = <string>window.localizer.getLocaleItem('emailHint');
    isValid = false;
  }
  if (password !== passwordRep) {
    regPassRep.classList.add('text-input_wrong');
    isValid = false;
  } else {
    regPassRep.classList.remove('text-input_wrong');
    regPassRep.classList.add('text-input_correct');
  }

  if (name.length < minValidationLen) {
    regName.classList.add('text-input_wrong');
    isValid = false;
  }
  if (!name.match(regExPatterns.name)) {
    regName.children[2].innerHTML = <string>window.localizer.getLocaleItem('nameNoSignsHint');
    regName.classList.add('text-input_wrong');
    isValid = false;
  } else {
    regName.classList.remove('text-input_wrong');
    regName.classList.add('text-input_correct');
  }

  if (surname.length < minValidationLen) {
    regSurname.classList.add('text-input_wrong');
    isValid = false;
  }
  if (!surname.match(regExPatterns.name)) {
    regSurname.children[2].innerHTML = <string>window.localizer.getLocaleItem('surnameNoSignsHint');
    regSurname.classList.add('text-input_wrong');
    isValid = false;
  } else {
    regSurname.classList.remove('text-input_wrong');
    regSurname.classList.add('text-input_correct');
  }
  if (isValid) {
    return {name, surname, email, password};
  }
}
